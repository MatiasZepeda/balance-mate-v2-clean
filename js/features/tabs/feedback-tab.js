// Feedback Tab - Simple feedback form for user input
// Allows users to submit bug reports, feature requests, improvements, or general feedback

window.FeedbackTab = class FeedbackTab {
    constructor() {
        this.container = null;
    }

    init() {
        console.log('💬 Initializing Feedback tab');
        this.container = document.getElementById('tab-feedback');
        this.render();
        this.setupForm();
    }

    render() {
        this.container.innerHTML = `
            <div class="feedback-view">
                <h2>We'd Love Your Feedback</h2>
                <p class="feedback-subtitle">Help us improve Balance Mate by sharing your thoughts</p>

                <form class="feedback-form" id="feedbackForm">
                    <div class="form-group">
                        <label for="feedbackType">Feedback Type</label>
                        <select id="feedbackType" required>
                            <option value="">Select type...</option>
                            <option value="bug">Bug Report</option>
                            <option value="feature">Feature Request</option>
                            <option value="improvement">Improvement Suggestion</option>
                            <option value="general">General Feedback</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="feedbackMessage">Your Feedback</label>
                        <textarea
                            id="feedbackMessage"
                            rows="8"
                            placeholder="Tell us what's on your mind..."
                            required
                        ></textarea>
                    </div>

                    <div class="form-group">
                        <label for="feedbackEmail">Email (optional)</label>
                        <input
                            type="email"
                            id="feedbackEmail"
                            placeholder="your.email@example.com"
                        />
                        <div class="form-help">We'll only use this to follow up on your feedback</div>
                    </div>

                    <button type="submit" class="submit-button">
                        Send Feedback
                    </button>
                </form>

                <div class="feedback-success" id="feedbackSuccess">
                    <div class="success-icon">✓</div>
                    <h3>Thank You!</h3>
                    <p>Your feedback has been recorded. We appreciate you taking the time to help us improve.</p>
                    <button class="reset-button" id="resetFeedback">Send Another</button>
                </div>
            </div>
        `;
    }

    setupForm() {
        const form = document.getElementById('feedbackForm');
        const successDiv = document.getElementById('feedbackSuccess');
        const resetBtn = document.getElementById('resetFeedback');

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit(form, successDiv);
        });

        resetBtn.addEventListener('click', () => {
            this.resetForm(form, successDiv);
        });
    }

    handleSubmit(form, successDiv) {
        const formData = {
            type: document.getElementById('feedbackType').value,
            message: document.getElementById('feedbackMessage').value,
            email: document.getElementById('feedbackEmail').value,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent
        };

        // Save to localStorage (for demo purposes)
        this.saveFeedback(formData);

        // Show success state
        form.style.display = 'none';
        successDiv.style.display = 'block';

        console.log('📬 Feedback submitted:', formData);
    }

    saveFeedback(data) {
        try {
            const STORAGE_KEY = 'balanceMate_feedback';
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            existing.push(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
        } catch (error) {
            console.warn('Failed to save feedback locally:', error);
        }
    }

    resetForm(form, successDiv) {
        form.reset();
        form.style.display = 'block';
        successDiv.style.display = 'none';
    }
}
