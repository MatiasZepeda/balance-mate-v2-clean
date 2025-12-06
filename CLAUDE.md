# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Balance Mate V2 is a client-side emotion tracking application featuring a 3-level interactive emotion wheel (7→41→82 emotions). Users progressively select from primary, secondary, and tertiary emotions, then see an empathetic message and can add voice or text notes about their emotional state.

## Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start
# or
npm run dev

# Access the application
# Open browser to http://localhost:3000
```

## Architecture

### Modular Structure

The project follows a modular architecture extracted from a monolithic HTML prototype:

```
js/
├── config/          # Data configuration
│   ├── emotions.js      # Hierarchical emotion data (130 emotions across 3 levels)
│   └── messages.js      # Empathetic messages mapped to emotion paths
├── core/            # Core application logic
│   ├── state-manager.js # Centralized state management for emotion path, level, rotation
│   └── storage.js       # localStorage wrapper for persisting user data
├── features/        # Feature modules
│   ├── wheel-renderer.js   # SVG-based wheel generation and animations
│   ├── voice-recorder.js   # Web Speech API integration
│   └── summary-screen.js   # Post-selection summary view with notes
└── main.js          # Application bootstrap and initialization
```

### State Management

The application uses a StateManager class that maintains:
- `currentLevel`: Current wheel level (1, 2, or 3)
- `emotionPath`: Array of selected emotions from L1→L2→L3
- `selectionHistory`: Full selection history for back navigation
- `wheelRotation`: Current rotation angle for smooth transitions
- `isAnimating`: Lock to prevent interaction during transitions

### Key Technical Constraints

- **Fully client-side**: No backend - all data stored in browser localStorage
- **Vanilla JavaScript**: No frameworks - uses plain JS modules
- **SVG-based wheel**: Dynamically generated SVG segments with smooth transitions
- **Web Speech API**: Browser-native voice input (requires HTTPS or localhost)
- **GitHub Pages deployment**: Static site hosting

### Emotion Data Structure

Emotions are organized hierarchically in `js/config/emotions.js`:
- Level 1: 7 primary emotions (Joy, Sadness, Fear, Anger, Disgust, Surprise, Trust)
- Level 2: 41 secondary emotions (specific to each primary)
- Level 3: 82 tertiary emotions (specific to each secondary)

Each emotion contains: `name`, `color`, and nested `subcategories` array.

### User Flow

1. User sees Level 1 wheel with 7 primary emotions
2. Selects primary → wheel transitions to Level 2 subcategories
3. Selects secondary → wheel transitions to Level 3 subcategories
4. Selects tertiary → summary screen appears
5. Summary shows: empathetic message + full emotion path + notes input (text/voice)
6. "Done" button saves to localStorage

### Visual Design

- Font: Inter (Google Fonts)
- Colors: Soft, warm palette consistent for each emotion family
- Animations: Smooth transitions with rotation and fade effects
- Style: Hybrid of FeelingsWheel and Anthropic design systems

## Implementation Status

The project structure is set up but requires:
1. JavaScript module implementation (emotions.js, messages.js, state-manager.js, etc.)
2. CSS styles creation
3. Summary screen implementation
4. localStorage integration

Refer to `IMPLEMENTATION_ROADMAP.md` for detailed implementation phases and `PDR_Balance_Mate2.txt` for product requirements.
