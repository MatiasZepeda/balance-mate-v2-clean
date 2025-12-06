// Voice Recorder - Web Speech API integration for voice notes
// Handles: speech recognition, mic button states, auto-stop on silence

window.VoiceRecorder = class VoiceRecorder {
    constructor(micButton, noteInput) {
        this.micButton = micButton;
        this.noteInput = noteInput;
        this.recognition = null;
        this.isListening = false;
        this.finalTranscript = '';
        this.silenceTimer = null;

        this.initialize();
    }

    // Initialize Web Speech API
    initialize() {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            console.warn('⚠️ Speech Recognition not supported');
            this.micButton.style.display = 'none';
            return;
        }

        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.lang = 'en-US';

        this.setupEventHandlers();
        this.setupMicButton();

        console.log('✅ Speech-to-text ready');
    }

    // Setup recognition event handlers
    setupEventHandlers() {
        this.recognition.onresult = (event) => this.handleResult(event);
        this.recognition.onerror = (event) => this.handleError(event);
        this.recognition.onend = () => this.handleEnd();
    }

    // Setup mic button click handler
    setupMicButton() {
        this.micButton.addEventListener('click', () => {
            if (this.isListening) {
                this.stopListening();
            } else {
                this.startListening();
            }
        });
    }

    // Handle speech recognition results
    handleResult(event) {
        this.resetSilenceTimer();
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                this.finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
            }
        }

        // Update textarea with interim results in brackets
        const existingText = this.noteInput.value.replace(/\[.*?\]$/, '').trim();
        if (interimTranscript) {
            this.noteInput.value = existingText + (existingText ? ' ' : '') + this.finalTranscript + '[' + interimTranscript + ']';
        } else {
            this.noteInput.value = existingText + (existingText ? ' ' : '') + this.finalTranscript;
        }
    }

    // Handle recognition errors
    handleError(event) {
        console.error('❌ Speech error:', event.error);
        this.micButton.classList.remove('listening');
        this.micButton.classList.add('error');
        setTimeout(() => this.micButton.classList.remove('error'), 500);

        if (event.error === 'not-allowed') {
            alert('Microphone access denied. Please enable permissions.');
        }

        this.isListening = false;
    }

    // Handle recognition end
    handleEnd() {
        if (this.isListening) {
            setTimeout(() => {
                if (this.isListening) {
                    try {
                        this.recognition.start();
                        this.resetSilenceTimer();
                    } catch (err) {
                        this.stopListening();
                    }
                }
            }, 100);
        }
    }

    // Start listening
    startListening() {
        try {
            this.isListening = true;
            this.finalTranscript = '';
            this.micButton.classList.add('listening');
            this.recognition.start();
            this.resetSilenceTimer();
        } catch (err) {
            console.error('Start failed:', err);
        }
    }

    // Stop listening
    stopListening() {
        this.isListening = false;
        this.micButton.classList.remove('listening');
        clearTimeout(this.silenceTimer);

        try {
            this.recognition.stop();
        } catch (err) {}

        // Clean up interim results and finalize text
        const existingText = this.noteInput.value.replace(/\[.*?\]$/, '').trim();
        this.noteInput.value = existingText + (existingText && this.finalTranscript ? ' ' : '') + this.finalTranscript.trim();
        this.finalTranscript = '';
    }

    // Reset silence timer (auto-stop after 3s of silence)
    resetSilenceTimer() {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
            if (this.isListening) this.stopListening();
        }, 3000);
    }
}
