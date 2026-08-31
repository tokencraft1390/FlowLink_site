from pathlib import Path
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

ROOT = Path(__file__).resolve().parent
VALID_STATES = {'idle', 'listening', 'thinking', 'speaking', 'error', 'offline'}

app = FastAPI(title='FlowLink Cyber Stag')
app.mount('/static', StaticFiles(directory=ROOT), name='static')

clients = set()
current_state = 'idle'

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

@app.get('/')
async def index():
    return FileResponse(ROOT / 'index.html')

@app.get('/health')
async def health():
    return {'ok': True, 'state': current_state, 'clients': len(clients)}

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

# Voice, inference, and TTS remain separate modules. They should call
# set_state() from the backend process rather than putting model logic here.
