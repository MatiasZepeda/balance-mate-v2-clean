// State Manager - Centralized state management for the emotion wheel
// Manages: current level, emotion path, selection history, wheel rotation, animation state

window.StateManager = class StateManager {
    constructor() {
        this.state = {
            currentLevel: 1,
            emotionPath: [],
            selectionHistory: [],
            wheelRotation: 0,
            isAnimating: false
        };
        this.listeners = [];
    }

    // Get current state (immutable copy)
    getState() {
        return Object.freeze({ ...this.state });
    }

    // Update state and notify listeners
    setState(updates) {
        this.state = { ...this.state, ...updates };
        this.notifyListeners();
    }

    // Subscribe to state changes
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    // Notify all listeners of state change
    notifyListeners() {
        this.listeners.forEach(listener => listener(this.getState()));
    }

    // Add emotion to path
    addToPath(emotionName) {
        this.setState({
            emotionPath: [...this.state.emotionPath, emotionName]
        });
    }

    // Save current state to history (for back button)
    saveToHistory() {
        this.state.selectionHistory.push({
            level: this.state.currentLevel,
            path: [...this.state.emotionPath],
            rotation: this.state.wheelRotation
        });
    }

    // Go back to previous state
    goBack() {
        if (this.state.selectionHistory.length === 0) return false;

        const previous = this.state.selectionHistory.pop();
        this.setState({
            currentLevel: previous.level,
            emotionPath: previous.path,
            wheelRotation: previous.rotation
        });

        return true;
    }

    // Reset to initial state
    reset() {
        this.setState({
            currentLevel: 1,
            emotionPath: [],
            selectionHistory: [],
            wheelRotation: 0,
            isAnimating: false
        });
    }

    // Advance to next level
    advanceLevel() {
        this.setState({
            currentLevel: this.state.currentLevel + 1
        });
    }

    // Set animation lock
    setAnimating(isAnimating) {
        this.setState({ isAnimating });
    }

    // Set wheel rotation
    setRotation(degrees) {
        this.setState({ wheelRotation: degrees });
    }
}
