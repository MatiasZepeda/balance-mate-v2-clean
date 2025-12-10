// Summary Screen - Displays empathetic message and handles note saving
// Shows after Level 3 selection, includes emotion path display and save functionality

window.SummaryScreen = class SummaryScreen {
    constructor(empatheticMessages) {
        this.messages = empatheticMessages;
    }

    // Show summary screen with emotion path
    show(emotionPath) {
        const emotionPathText = emotionPath.join(' → ');
        const message = this.getMessage(emotionPath);

        console.log('📝 Final path:', emotionPathText);
        console.log('💬 Empathetic message:', message);

        // Hide wheel and instruction (use display none so they don't take up space)
        document.querySelector('.wheel-container').style.display = 'none';
        document.getElementById('instruction').style.display = 'none';

        // Update summary screen content
        document.getElementById('heading').textContent = 'Tell us more';
        document.getElementById('empatheticMessage').textContent = message;
        document.getElementById('pathText').textContent = emotionPathText;

        // Show notes area
        document.getElementById('notesArea').classList.add('visible');

        // Focus textarea for keyboard users
        setTimeout(() => {
            document.getElementById('noteInput').focus();
        }, 100);
    }

    // Get empathetic message for emotion path
    getMessage(emotionPath) {
        const key = emotionPath.join(' → ');

        // Check if messages object exists
        if (!this.messages) {
            console.warn('⚠️ Empathetic messages not loaded');
            return 'Thank you for sharing how you feel.';
        }

        // Exact match
        if (this.messages[key]) {
            return this.messages[key];
        }

        // Fallback: default message
        console.warn(`⚠️ No message found for: ${key}`);
        return 'Thank you for sharing how you feel.';
    }

    // Save entry and reset
    save() {
        const noteInput = document.getElementById('noteInput');
        const note = noteInput.value;
        const path = window.state.getState().emotionPath;
        const emotionPathText = path.join(' → ');

        // Check if voice recorder was used (has finalTranscript)
        const voiceTranscript = window.voiceRecorder && window.voiceRecorder.finalTranscript
            ? window.voiceRecorder.finalTranscript.trim()
            : null;

        try {
            // Initialize storage if not exists
            if (!window.emotionStorage) {
                window.emotionStorage = new window.EmotionStorage();
            }

            // Save to localStorage
            const entry = window.emotionStorage.saveEntry(path, note, voiceTranscript);

            // Show success message
            this.showSuccessMessage(emotionPathText);

            // Reset app after brief delay
            setTimeout(() => {
                this.resetApp();
            }, 1500);

        } catch (error) {
            console.error('Failed to save entry:', error);
            alert('Failed to save entry. Please try again.');
        }
    }

    // Show success message
    showSuccessMessage(emotionPathText) {
        const heading = document.getElementById('heading');
        const originalText = heading.textContent;

        heading.textContent = '✓ Entry saved';
        heading.style.color = '#22c55e';

        console.log(`✅ Saved: ${emotionPathText}`);
    }

    // Reset app to initial state
    resetApp() {
        // Hide notes area
        document.getElementById('notesArea').classList.remove('visible');

        // Clear notes
        document.getElementById('noteInput').value = '';

        // Reset voice recorder if exists
        if (window.voiceRecorder) {
            window.voiceRecorder.finalTranscript = '';
        }

        // Reset state
        window.state.reset();

        // Reset UI
        document.getElementById('heading').textContent = 'How are you feeling right now?';
        document.getElementById('heading').style.color = '';
        document.getElementById('levelInfo').textContent = 'Level 1: Primary Emotion';
        document.getElementById('backBtn').classList.remove('visible');
        document.getElementById('instruction').style.display = 'block';
        document.querySelector('.wheel-container').style.display = 'block';

        // Redraw Level 1 wheel
        if (window.wheelRenderer && window.emotions) {
            window.wheelRenderer.draw(window.emotions[1]);
            window.wheelRenderer.resetRotation();
        }

        console.log('🔄 App reset to Level 1');
    }
}
