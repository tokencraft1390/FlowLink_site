# FlowLink Cyber Stag

Isolated browser interface for the FlowLink cyber-stag assistant. The backend remains authoritative for shared state; one designated browser can act as the microphone and one designated browser can provide speech output.

## Run locally

```bash
cd cyber-stag
python -m venv .venv
. .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY='your-key-here'
uvicorn main:app --reload
```

Optional model override:

```bash
export OPENAI_MODEL='gpt-5.6-luna'
```

Open `http://127.0.0.1:8000`.

Display options:

- `?kiosk=1` hides the cursor for kiosk displays.
- `?voice=1` enables browser-native spoken output on that display.
- `?mic=1` makes that browser the speech-recognition input device.
- `?kiosk=1&voice=1&mic=1` makes one device the complete conversational kiosk.

Voice and microphone are intentionally opt-in so multiple connected displays do not all speak or listen at once. Chrome-compatible browsers can use `SpeechRecognition` / `webkitSpeechRecognition`; unsupported browsers remain display-only. Browser permission and a user gesture are required before microphone or speech features can operate.

The API key stays server-side. The browser sends only the recognized transcript over the existing WebSocket. The backend changes shared state to `thinking`, creates a Responses API request, broadcasts the returned text, then holds `speaking` long enough for the local speech synthesizer to read the answer.

Without `OPENAI_API_KEY`, microphone transcription and synchronized state still work; the server echoes what it heard and reports that inference is not configured.

## State contract

Server to browser:

- `{"type":"status","state":"idle|listening|thinking|speaking|error|offline"}`
- `{"type":"transcript","text":"..."}`
- `{"type":"response","text":"..."}`
- `{"type":"error","message":"..."}`
- `{"type":"system","action":"restart"}`

Browser to server:

- `{"action":"start_listening"}`
- `{"action":"transcript","text":"..."}`
- `{"action":"cancel"}`
- `{"action":"restart"}`

The server owns canonical state and broadcasts changes to every connected display. Duplicate listen activation is rejected unless the canonical state is `idle`.

## Architecture boundary

The browser owns presentation, local speech recognition, and browser speech synthesis. The backend owns inference and shared state. API credentials, signing, payment execution, wallets, and privileged tools must never be embedded in the avatar client.
