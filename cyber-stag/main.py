import os
from pathlib import Path

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from openai import AsyncOpenAI

ROOT = Path(__file__).resolve().parent
VALID_STATES = {'idle', 'listening', 'thinking', 'speaking', 'error', 'offline'}
MODEL = os.getenv('OPENAI_MODEL', 'gpt-5.6-luna')
SYSTEM_INSTRUCTIONS = os.getenv(
    'FLOWLINK_STAG_INSTRUCTIONS',
    'You are the FlowLink Cyber Stag, a concise voice assistant. '
    'Answer naturally for speech. Prefer short, useful responses. '
    'Do not claim actions, access, or results you do not actually have.'
)

app = FastAPI(title='FlowLink Cyber Stag')
app.mount('/static', StaticFiles(directory=ROOT), name='static')

clients = set()
current_state = 'idle'


def ai_client():
    if not os.getenv('OPENAI_API_KEY'):
        return None
    return AsyncOpenAI()


async def broadcast(payload):
    stale = []
    for client in tuple(clients):
        try:
            await client.send_json(payload)
        except Exception:
            stale.append(client)
    for client in stale:
        clients.discard(client)


async def set_state(state):
    global current_state
    if state not in VALID_STATES:
        return False
    current_state = state
    await broadcast({'type': 'status', 'state': state})
    return True


async def answer_transcript(text):
    text = str(text or '').strip()
    if not text:
        await broadcast({'type': 'error', 'message': 'I did not catch that.'})
        await set_state('idle')
        return

    client = ai_client()
    if client is None:
        await broadcast({
            'type': 'response',
            'text': f'I heard: {text}. Add OPENAI_API_KEY to enable intelligent replies.'
        })
        await set_state('idle')
        return

    await set_state('thinking')
    try:
        response = await client.responses.create(
            model=MODEL,
            instructions=SYSTEM_INSTRUCTIONS,
            input=text,
            max_output_tokens=220,
        )
        reply = (response.output_text or '').strip()
        if not reply:
            reply = 'I could not form a response to that.'
        await set_state('speaking')
        await broadcast({'type': 'response', 'text': reply})
    except Exception as exc:
        print(f'Inference error: {type(exc).__name__}: {exc}')
        await broadcast({'type': 'error', 'message': 'The intelligence service is unavailable.'})
    finally:
        await set_state('idle')


@app.get('/')
async def index():
    return FileResponse(ROOT / 'index.html')


@app.get('/health')
async def health():
    return {
        'ok': True,
        'state': current_state,
        'clients': len(clients),
        'model': MODEL,
        'inference_ready': bool(os.getenv('OPENAI_API_KEY')),
    }


@app.websocket('/ws')
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    clients.add(ws)
    await ws.send_json({'type': 'status', 'state': current_state})
    try:
        while True:
            message = await ws.receive_json()
            action = message.get('action')
            if action == 'start_listening' and current_state == 'idle':
                await set_state('listening')
            elif action == 'transcript' and current_state == 'listening':
                await broadcast({'type': 'transcript', 'text': str(message.get('text') or '').strip()})
                await answer_transcript(message.get('text'))
            elif action == 'cancel':
                await set_state('idle')
            elif action == 'restart':
                await broadcast({'type': 'system', 'action': 'restart'})
                await set_state('idle')
            else:
                await ws.send_json({'type': 'error', 'message': 'Action rejected for current state'})
    except WebSocketDisconnect:
        clients.discard(ws)
    except Exception:
        clients.discard(ws)
        try:
            await ws.close(code=1011)
        except Exception:
            pass
