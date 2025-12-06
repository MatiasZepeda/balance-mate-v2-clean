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

        // Hide wheel and instruction
        document.querySelector('.wheel-container').style.opacity = '0';
        document.getElementById('instruction').style.opacity = '0';

        // Update summary screen content
        document.getElementById('heading').textContent = 'Tell us more';
        document.getElementById('empatheticMessage').textContent = message;
        document.getElementById('pathText').textContent = emotionPathText;

        // Show notes area
        document.getElementById('notesArea').classList.add('visible');
    }

    // Get empathetic message for emotion path
    getMessage(emotionPath) {
        const key = emotionPath.join(' → ');

        // Exact match
        if (this.messages[key]) {
            return this.messages[key];
        }

        // Fallback: default message
        return 'Thank you for sharing how you feel.';
    }

    // Save entry and reset
    save() {
        const note = document.getElementById('noteInput').value;
        const path = window.state.getState().emotionPath;
        const emotionPathText = path.join(' → ');

        // Show confirmation
        alert(`✅ Recorded:\n\n${emotionPathText}\n\n${note || 'No notes'}`);

        // Reload to reset
        location.reload();
    }
}
