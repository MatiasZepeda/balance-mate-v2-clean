// Main App - Bootstrap and orchestration
// Initializes all modules and handles the emotion selection flow

// Global state and modules
let state;
let wheelRenderer;
let voiceRecorder;
let summaryScreen;

// Initialize application
function initApp() {
    console.log('🚀 Initializing Balance Mate V2...');

    // Initialize state manager
    state = new window.StateManager();
    window.state = state; // Make accessible globally for save function

    // Initialize wheel renderer
    const svg = document.getElementById('wheelSvg');
    wheelRenderer = new window.WheelRenderer(svg, handleSegmentClick);

    // Initialize summary screen
    summaryScreen = new window.SummaryScreen(window.empatheticMessages);

    // Initialize voice recorder
    const micButton = document.getElementById('micButton');
    const noteInput = document.getElementById('noteInput');
    voiceRecorder = new window.VoiceRecorder(micButton, noteInput);

    // Setup back button
    setupBackButton();

    // Setup save button
    setupSaveButton();

    // Draw initial wheel (Level 1)
    drawCurrentLevel();

    console.log('✅ App initialized');
}

// Handle segment click
function handleSegmentClick(index, item) {
    const currentState = state.getState();

    if (currentState.isAnimating) return;

    // Set animating lock
    state.setAnimating(true);

    // Rotate wheel to selected segment
    const currentData = getCurrentData();
    const rotation = wheelRenderer.rotateTo(index, currentData.length);

    // After animation completes
    setTimeout(() => {
        // Save current state to history
        state.saveToHistory();

        // Add emotion to path
        state.addToPath(item.name);

        // Advance to next level or show summary
        advance();

        // Release animation lock
        state.setAnimating(false);
    }, 1000);
}

// Get current level data
function getCurrentData() {
    const currentState = state.getState();
    const path = currentState.emotionPath;

    if (currentState.currentLevel === 1) {
        return window.emotions[1];
    } else if (currentState.currentLevel === 2) {
        return window.emotions[2][path[0]] || [];
    } else if (currentState.currentLevel === 3) {
        return window.emotions[3][path[1]] || [];
    }

    return [];
}

// Advance to next level or show summary
function advance() {
    const currentState = state.getState();

    if (currentState.currentLevel === 1) {
        // Move to Level 2
        state.advanceLevel();
        document.getElementById('levelInfo').textContent = 'Level 2: Specify';
        document.getElementById('backBtn').classList.add('visible');

        const data = getCurrentData();
        if (data.length > 0) {
            drawCurrentLevel();
            wheelRenderer.resetRotation();
        } else {
            showSummary();
        }
    } else if (currentState.currentLevel === 2) {
        // Move to Level 3
        state.advanceLevel();
        document.getElementById('levelInfo').textContent = 'Level 3: Nuance';

        const data = getCurrentData();
        if (data.length > 0) {
            drawCurrentLevel();
            wheelRenderer.resetRotation();
        } else {
            showSummary();
        }
    } else {
        // Show summary screen
        showSummary();
    }
}

// Draw wheel for current level
function drawCurrentLevel() {
    const data = getCurrentData();
    wheelRenderer.draw(data);
}

// Show summary screen
function showSummary() {
    const currentState = state.getState();
    summaryScreen.show(currentState.emotionPath);
}

// Setup back button
function setupBackButton() {
    document.getElementById('backBtn').onclick = function() {
        const didGoBack = state.goBack();
        if (!didGoBack) return;

        const currentState = state.getState();

        if (currentState.currentLevel === 1) {
            document.getElementById('levelInfo').textContent = 'Level 1: Primary Emotion';
            document.getElementById('backBtn').classList.remove('visible');
        } else if (currentState.currentLevel === 2) {
            document.getElementById('levelInfo').textContent = 'Level 2: Specify';
        }

        drawCurrentLevel();
        const rotation = currentState.wheelRotation;
        document.getElementById('wheelSvg').style.transform = `rotate(${rotation}deg)`;
    };
}

// Setup save button
function setupSaveButton() {
    document.getElementById('saveBtn').onclick = function() {
        summaryScreen.save();
    };
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}
