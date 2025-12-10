// Voice Recorder - Web Speech API integration for voice notes
// Handles: speech recognition, mic button states, auto-stop on silence

window.VoiceRecorder = class VoiceRecorder {
    constructor(micButton, noteInput) {
        this.micButton = micButton;
        this.noteInput = noteInput;
        this.recognition = null;
        this.isListening = false;
        this.finalTranscript = '';
        this.startingText = '';
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
        this.recognition.maxAlternatives = 1;

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

        // Process only final transcripts for cleaner, more accurate results
        // Interim results are still captured by the API for better recognition quality
        for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                const transcript = event.results[i][0].transcript.trim();
                if (transcript) {
                    this.finalTranscript += transcript + ' ';

                    // Update display immediately with final text only
                    const displayText = this.startingText + (this.startingText ? ' ' : '') + this.finalTranscript.trim();
                    this.noteInput.value = displayText;
                }
            }
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
            this.startingText = this.noteInput.value.trim();
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

        // Finalize text - ensure clean output with no artifacts
        if (this.finalTranscript.trim()) {
            const finalText = this.startingText + (this.startingText ? ' ' : '') + this.finalTranscript.trim();
            this.noteInput.value = finalText;
        }

        this.finalTranscript = '';
        this.startingText = '';
    }

    // Reset silence timer (auto-stop after 3s of silence)
    resetSilenceTimer() {
        clearTimeout(this.silenceTimer);
        this.silenceTimer = setTimeout(() => {
            if (this.isListening) this.stopListening();
        }, 3000);
    }
}
