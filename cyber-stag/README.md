# FlowLink Cyber Stag

Isolated browser display for the FlowLink cyber-stag interface. The display renders backend-authoritative state over WebSocket. Voice capture, model inference, signing, and payment logic remain outside the avatar layer.

## Run locally

```bash
cd cyber-stag
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open `http://127.0.0.1:8000`.

Display options:

- `?kiosk=1` hides the cursor for kiosk displays.
- `?voice=1` enables browser-native spoken output on that display.
- `?kiosk=1&voice=1` makes one display the speaking kiosk.

Voice intentionally stays opt-in so a multi-monitor setup does not make every screen speak at once. Browsers require a keyboard, touch, or click gesture before speech can begin. After the first gesture, the voice announces `FlowLink online. Ready, friend.`, speaks the listening cue, and reads backend `response` messages aloud. It uses the best available local English voice and requires no API key.

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

Browser speech synthesis is presentation only. Keep microphone capture, speech recognition, inference, routing, and any premium/cloud TTS service in separate modules. Those modules should drive the display through backend state and response events; the avatar should never embed provider-specific model logic, credentials, signing, or payment execution.
