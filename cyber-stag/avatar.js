class FlowLinkStag {
  constructor() {
    const params = new URLSearchParams(location.search);
    this.ws = null;
    this.state = 'offline';
    this.responseTimer = null;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 8;
    this.baseReconnectDelay = 1000;
    this.touchGuardUntil = 0;
    this.voiceEnabled = params.has('voice');
    this.micEnabled = params.has('mic');
    this.voiceUnlocked = false;
    this.voice = null;
    this.hasAnnouncedReady = false;
    this.recognition = null;
    this.recognitionActive = false;
    this.recognitionProducedResult = false;
    this.stage = document.getElementById('stage');
    this.response = document.getElementById('response');
    this.statusText = document.querySelector('.status-text');
    this.statusIndicator = document.querySelector('.status-indicator');
    this.stagContainer = document.querySelector('.stag-container');
    document.body.classList.toggle('kiosk', params.has('kiosk'));
    this.bindEvents();
    this.createAmbientParticles();
    this.prepareVoice();
    this.prepareRecognition();
    this.connect();
  }

  prepareVoice() {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    const chooseVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) return;
      this.voice = voices.find(v => /en-US/i.test(v.lang) && /male|daniel|david|alex|aaron|fred/i.test(v.name))
        || voices.find(v => /en-US/i.test(v.lang))
        || voices[0];
    };
    chooseVoice();
    window.speechSynthesis.addEventListener?.('voiceschanged', chooseVoice, { once: true });
  }

  prepareRecognition() {
    if (!this.micEnabled) return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) {
      this.micEnabled = false;
      this.showResponse('Speech recognition is not supported in this browser.', '#FFAA00');
      return;
    }

    this.recognition = new Recognition();
    this.recognition.lang = 'en-US';
    this.recognition.interimResults = true;
    this.recognition.continuous = false;

    this.recognition.onstart = () => {
      this.recognitionActive = true;
      this.recognitionProducedResult = false;
    };

    this.recognition.onresult = event => {
      let interim = '';
      let finalText = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const text = event.results[i][0]?.transcript || '';
        if (event.results[i].isFinal) finalText += text;
        else interim += text;
      }
      if (interim) this.showResponse(interim.trim(), '#9DEEFF');
      if (finalText.trim()) {
        this.recognitionProducedResult = true;
        this.showResponse(finalText.trim(), '#FFFFFF');
        this.sendTranscript(finalText.trim());
      }
    };

    this.recognition.onerror = event => {
      this.recognitionActive = false;
      if (event.error === 'aborted' || event.error === 'no-speech') {
        if (this.state === 'listening') this.sendAction('cancel');
        return;
      }
      this.showResponse(`Microphone error: ${event.error}`, '#FF4444');
      if (this.state === 'listening') this.sendAction('cancel');
    };

    this.recognition.onend = () => {
      this.recognitionActive = false;
      if (!this.recognitionProducedResult && this.state === 'listening') this.sendAction('cancel');
    };
  }

  startRecognition() {
    if (!this.micEnabled || !this.recognition || this.recognitionActive) return;
    try {
      window.speechSynthesis?.cancel?.();
      this.recognition.start();
    } catch (error) {
      if (error?.name !== 'InvalidStateError') {
        this.showResponse('Microphone could not start.', '#FF4444');
        this.sendAction('cancel');
      }
    }
  }

  stopRecognition() {
    if (!this.recognition || !this.recognitionActive) return;
    try { this.recognition.abort(); } catch {}
    this.recognitionActive = false;
  }

  unlockVoice() {
    if (!this.voiceEnabled || !('speechSynthesis' in window)) return;
    this.voiceUnlocked = true;
    window.speechSynthesis.resume();
    if (!this.hasAnnouncedReady && this.state === 'idle') {
      this.hasAnnouncedReady = true;
      this.speak('FlowLink online. Ready, friend.');
    }
  }

  speak(text, { interrupt = true } = {}) {
    if (!this.voiceEnabled || !this.voiceUnlocked || !('speechSynthesis' in window)) return;
    const clean = String(text ?? '').trim();
    if (!clean) return;
    this.stopRecognition();
    if (interrupt) window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(clean);
    if (this.voice) utterance.voice = this.voice;
    utterance.rate = 0.92;
    utterance.pitch = 0.82;
    utterance.volume = 0.9;
    utterance.onstart = () => this.stage.classList.add('speaking');
    utterance.onend = () => {
      if (this.state !== 'speaking') this.stage.classList.remove('speaking');
    };
    utterance.onerror = () => this.stage.classList.remove('speaking');
    window.speechSynthesis.speak(utterance);
  }

  connect() {
    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) return;
    clearTimeout(this.reconnectTimer);
    const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:';
    this.ws = new WebSocket(`${protocol}//${location.host}/ws`);

    this.ws.addEventListener('open', () => {
      this.reconnectAttempts = 0;
      this.setLocalStatus('CONNECTED', '#00E5FF');
    });

    this.ws.addEventListener('message', event => this.handleMessage(event));
    this.ws.addEventListener('error', () => this.setLocalStatus('CONNECTION ERROR', '#FF4444'));
    this.ws.addEventListener('close', () => {
      this.ws = null;
      this.stopRecognition();
      this.applyState('offline');
      this.scheduleReconnect();
    });
  }

  scheduleReconnect() {
    if (this.reconnectTimer || this.reconnectAttempts >= this.maxReconnectAttempts) {
      if (this.reconnectAttempts >= this.maxReconnectAttempts) this.setLocalStatus('OFFLINE', '#FF4444');
      return;
    }
    this.reconnectAttempts += 1;
    const delay = Math.min(30000, this.baseReconnectDelay * (2 ** (this.reconnectAttempts - 1)));
    this.setLocalStatus(`RECONNECTING ${this.reconnectAttempts}/${this.maxReconnectAttempts}`, '#FFAA00');
    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect();
    }, delay);
  }

  handleMessage(event) {
    let data;
    try { data = JSON.parse(event.data); } catch { return; }
    if (data.type === 'status') this.applyState(data.state);
    else if (data.type === 'transcript') this.showResponse(data.text, '#9DEEFF');
    else if (data.type === 'response') {
      this.showResponse(data.text, data.color || '#FFFFFF');
      this.speak(data.text);
    } else if (data.type === 'error') {
      this.showResponse(data.message || 'System error', '#FF4444');
      this.speak(data.message || 'System error');
      this.applyState('error');
    } else if (data.type === 'system' && data.action === 'shutdown') {
      this.showResponse('System offline', '#FF4444');
      this.speak('System offline.');
      this.applyState('offline');
    }
  }

  applyState(state) {
    const allowed = new Set(['idle', 'listening', 'thinking', 'speaking', 'error', 'offline']);
    if (!allowed.has(state)) return;
    this.state = state;
    this.stage.classList.remove('idle', 'listening', 'thinking', 'speaking', 'error', 'offline');
    this.stage.classList.add(state);
    const map = {
      idle: ['FLOWLINK ONLINE', '#00E5FF'],
      listening: ['LISTENING…', '#00E5FF'],
      thinking: ['PROCESSING…', '#7B2FFC'],
      speaking: ['SPEAKING', '#00E5FF'],
      error: ['ERROR', '#FF4444'],
      offline: ['OFFLINE', '#FF4444']
    };
    this.setLocalStatus(...map[state]);

    if (state === 'listening') {
      this.showResponse('Listening…', '#00E5FF');
      if (this.micEnabled) this.startRecognition();
      else this.speak('I am listening.');
    } else {
      this.stopRecognition();
    }

    if (state === 'thinking') this.showResponse('Processing…', '#7B2FFC');
    if (state === 'idle') {
      this.responseTimer = setTimeout(() => this.hideResponse(), 1800);
      if (this.voiceUnlocked && !this.hasAnnouncedReady) {
        this.hasAnnouncedReady = true;
        this.speak('FlowLink online. Ready, friend.');
      }
    }
  }

  setLocalStatus(text, color) {
    this.statusText.textContent = text;
    this.statusText.style.color = color;
    this.statusText.style.textShadow = `0 0 10px ${color}`;
    this.statusIndicator.style.background = color;
    this.statusIndicator.style.boxShadow = `0 0 10px ${color}`;
  }

  showResponse(text, color = '#FFFFFF') {
    clearTimeout(this.responseTimer);
    this.response.textContent = String(text ?? '');
    this.response.style.color = color;
    this.response.style.borderColor = `${color}44`;
    this.response.style.boxShadow = `0 0 20px ${color}22`;
    this.response.hidden = false;
  }

  hideResponse() { this.response.hidden = true; }

  sendAction(action) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      this.showResponse('System offline', '#FF4444');
      return false;
    }
    this.ws.send(JSON.stringify({ action }));
    return true;
  }

  sendTranscript(text) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return false;
    this.ws.send(JSON.stringify({ action: 'transcript', text }));
    return true;
  }

  requestListening() {
    if (this.state !== 'idle') return;
    this.sendAction('start_listening');
  }

  bindEvents() {
    document.addEventListener('keydown', e => {
      this.unlockVoice();
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.requestListening();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this.stopRecognition();
        window.speechSynthesis?.cancel?.();
        if (this.ws?.readyState === WebSocket.OPEN) this.sendAction('cancel');
        else this.hideResponse();
      } else if (e.key.toLowerCase() === 'r' && e.ctrlKey) {
        e.preventDefault();
        if (this.ws?.readyState === WebSocket.OPEN) this.sendAction('restart');
      }
    });

    document.addEventListener('touchstart', () => {
      this.unlockVoice();
      this.touchGuardUntil = performance.now() + 700;
      this.requestListening();
    }, { passive: true });

    document.addEventListener('click', () => {
      this.unlockVoice();
      if (performance.now() < this.touchGuardUntil) return;
      this.requestListening();
    });

    window.addEventListener('resize', () => this.adjustLayout());
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) this.adjustLayout();
      else this.stopRecognition();
    });
    this.adjustLayout();
    this.startEyeMotion();
  }

  adjustLayout() {
    const size = Math.min(innerHeight * 0.8, innerWidth * 0.8);
    this.stagContainer.style.width = `${size}px`;
    this.stagContainer.style.height = `${size}px`;
  }

  startEyeMotion() {
    setInterval(() => {
      if (this.state !== 'idle') return;
      const offset = (Math.random() - 0.5) * 4;
      document.querySelectorAll('.eye[data-base-cy]').forEach(eye => {
        eye.setAttribute('cy', String(Number(eye.dataset.baseCy) + offset));
      });
    }, 3000);
  }

  createAmbientParticles() {
    const container = document.createElement('div');
    container.className = 'ambient-particles';
    this.stage.appendChild(container);
    for (let i = 0; i < 24; i++) {
      const particle = document.createElement('div');
      particle.className = 'ambient-particle';
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      const size = Math.random() * 3 + 1;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background = Math.random() > 0.5 ? '#00E5FF' : '#7B2FFC';
      particle.style.animationDuration = `${Math.random() * 8 + 4}s`;
      particle.style.animationDelay = `${Math.random() * 10}s`;
      container.appendChild(particle);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.flowLinkStag = new FlowLinkStag();
});
