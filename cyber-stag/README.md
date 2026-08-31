# FlowLink Cyber Stag

Isolated browser display for the FlowLink cyber-stag interface. The display renders backend-authoritative state over WebSocket; it does not contain microphone, model-inference, signing, payment, or TTS logic.

## Run locally

```bash
cd cyber-stag
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://127.0.0.1:8000`. Add `?kiosk=1` to hide the cursor for kiosk displays.

## State contract

Server to browser:

- `{"type":"status","state":"idle|listening|thinking|speaking|error|offline"}`
- `{"type":"response","text":"..."}`
- `{"type":"error","message":"..."}`
- `{"type":"system","action":"restart"}`

Browser to server:

- `{"action":"start_listening"}`
- `{"action":"cancel"}`
- `{"action":"restart"}`

The server owns canonical state and broadcasts changes to every connected display. Duplicate activation is rejected unless the canonical state is `idle`.

## Architecture boundary

Keep voice capture, inference, routing, and speech synthesis in separate modules or services. Those modules should drive the display by changing backend state; the avatar should never embed provider-specific model logic.
