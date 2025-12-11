# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Balance Mate V2 is a client-side emotion tracking application featuring a 3-level interactive emotion wheel (7→41→82 emotions). Users progressively select from primary, secondary, and tertiary emotions, then see an empathetic message and can add voice or text notes. The app includes a full navigation system with 6 tabs: Main (emotion wheel), Calendar (heatmap), Streak (tracking), Story (AI insights), Feedback, and Export. All data is persisted in localStorage.

## Commands

```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:3000)
npm start
# or
npm run dev
```

## Architecture

### Modular Structure

The project follows a modular architecture with vanilla JavaScript:

```
js/
├── config/          # Data configuration
│   ├── emotions.js      # Hierarchical emotion data (130 emotions across 3 levels)
│   └── messages.js      # Empathetic messages mapped to emotion paths
├── core/            # Core application logic
│   ├── state-manager.js       # Centralized state for emotion path, level, rotation
│   ├── storage.js             # localStorage wrapper for persisting entries
│   ├── navigation-manager.js  # Tab switching, sidebar collapse, mobile menu
│   └── router.js              # Hash-based URL routing (#/main, #/calendar, etc.)
├── features/        # Feature modules
│   ├── wheel-renderer.js      # SVG-based wheel generation and animations
│   ├── voice-recorder.js      # Web Speech API integration
│   ├── summary-screen.js      # Post-selection summary view with notes
│   └── tabs/                  # Tab modules (6 tabs)
│       ├── main-tab.js        # Wrapper for emotion wheel
│       ├── calendar-tab.js    # GitHub-style heatmap visualization
│       ├── streak-tab.js      # Streak tracking with milestones
│       ├── story-tab.js       # AI-powered pattern analysis & insights
│       ├── feedback-tab.js    # User feedback form
│       └── export-tab.js      # JSON/CSV export, data management
└── main.js          # Application bootstrap and initialization
```

### Navigation System (NavigationManager + Router)

The navigation system handles all tab switching, sidebar behavior, and URL routing:

**NavigationManager** (`js/core/navigation-manager.js`):
- Tab switching with active state management
- Sidebar collapse/expand (desktop ≥768px)
- Mobile overlay menu system (≤768px)
- localStorage state persistence for sidebar
- Lazy initialization of tab modules (modules only `init()` when first accessed)
- Event-driven architecture

**Router** (`js/core/router.js`):
- Hash-based URL routing (`#/main`, `#/calendar`, etc.)
- Browser back/forward button support
- Valid routes: main, calendar, streak, story, feedback, export

**Mobile vs Desktop Behavior**:
- Desktop (≥768px): Sidebar can collapse/expand, persists state
- Mobile (≤768px): Sidebar hidden, accessible via hamburger menu overlay

### State Management (StateManager)

The `StateManager` class (`js/core/state-manager.js`) maintains emotion wheel session state:
- `currentLevel`: Current wheel level (1, 2, or 3)
- `emotionPath`: Array of selected emotions from L1→L2→L3
- `selectionHistory`: Full selection history for back button navigation
- `wheelRotation`: Current rotation angle for smooth transitions
- `isAnimating`: Lock to prevent interaction during CSS transitions

**Key methods:**
- `addToPath(emotion)`: Add emotion to current path
- `saveToHistory()`: Save state snapshot for back navigation
- `goBack()`: Restore previous state
- `reset()`: Clear all state and return to Level 1

### Data Persistence (EmotionStorage)

The `EmotionStorage` class (`js/core/storage.js`) handles all localStorage operations:

**Key methods:**
- `saveEntry(emotionPath, notes, voiceTranscript)`: Save emotion entry
  - Returns entry object with `id`, `timestamp`, `path`, `notes`, `voiceTranscript`, `metadata`
  - Auto-prunes to max 100 entries
  - Handles quota exceeded errors gracefully
- `getAllEntries()`: Get all entries (most recent first)
- `getEntryCount()`: Get total entry count
- `exportData()`: Download JSON file with all entries
- `clearAll()`: Delete all entries (with confirmation)
- `getEntriesByDateRange(start, end)`: Filter by date range
- `getEntriesByEmotion(emotionName)`: Filter by emotion (any level)
- `getStats()`: Get storage statistics (total, oldest, newest, size)

**Storage format:**
```javascript
{
  id: 1234567890,
  timestamp: "2024-12-10T12:00:00.000Z",
  path: ["Happy", "Playful", "Cheeky"],
  notes: "User notes here",
  voiceTranscript: "Voice input here" | null,
  metadata: { userAgent: "...", timezone: "America/New_York" }
}
```

### Tab Modules

All 6 tabs are fully implemented:

1. **MainTab** - Emotion wheel wrapper (always initialized)
2. **CalendarTab** - GitHub-style heatmap showing 12 weeks of activity, stats (total entries, streak, most frequent emotion)
3. **StreakTab** - Current/longest streak, unique days, milestone achievements (1, 3, 7, 14, 30, 100 days)
4. **StoryTab** - AI-powered insights using local pattern analysis (no API needed):
   - Narrative generation based on emotion frequency, trends, diversity
   - Pattern detection (most common emotions, time of day, note-taking behavior)
   - 7-day timeline visualization
5. **FeedbackTab** - Feedback form (bug reports, features, improvements) saved to localStorage
6. **ExportTab** - JSON/CSV export, storage stats, clear all data option

**Tab Module Interface:**
```javascript
class MyTab {
    constructor(dependencies) {
        // Store dependencies (e.g., emotionStorage)
    }

    init() {
        // Called when tab is first accessed (lazy initialization)
        // Setup UI, event listeners, render content
    }
}
```

### Initialization Sequence

The app initializes in this order (see `js/main.js`):
1. StateManager
2. WheelRenderer
3. SummaryScreen
4. VoiceRecorder
5. EmotionStorage
6. NavigationManager
7. Router
8. Tab modules registration (MainTab, CalendarTab, StreakTab, StoryTab, FeedbackTab, ExportTab)

All modules are attached to `window` object (e.g., `window.StateManager`, `window.NavigationManager`). Global instances are created in `main.js`: `window.state`, `window.wheelRenderer`, `window.emotionStorage`, `window.navigationManager`, `window.router`.

### Performance Optimizations

The app has been optimized for snappy interactions:
- Wheel rotation: 1s → 0.4s (60% faster)
- Event-driven animations using `transitionend` instead of `setTimeout`
- `requestAnimationFrame()` for DOM updates instead of arbitrary delays
- Material Design easing curves: `cubic-bezier(0.4, 0, 0.2, 1)`
- Lazy loading of tab modules (only initialize when first accessed)

### Key Technical Constraints

- **Fully client-side**: No backend - all data stored in browser localStorage
- **Vanilla JavaScript**: No frameworks - uses plain JS modules loaded via `<script>` tags
- **SVG-based wheel**: Dynamically generated SVG segments with smooth transitions
- **Web Speech API**: Browser-native voice input (requires HTTPS or localhost, not supported in Firefox)
- **Static hosting**: Designed for Vercel/Netlify/GitHub Pages deployment

### Emotion Data Structure

Emotions are organized hierarchically in `window.emotions`:
- **Level 1**: 7 primary emotions (Happy, Sad, Angry, Disgusted, Fearful, Bad, Surprised)
- **Level 2**: 41 secondary emotions (specific to each primary)
- **Level 3**: 82 tertiary emotions (specific to each secondary)

Each emotion has: `name` (string) and `color` (hex code).

**Data access patterns:**
```javascript
window.emotions[1]           // Array of 7 Level 1 emotions
window.emotions[2]['Happy']  // Array of Level 2 emotions under "Happy"
window.emotions[3]['Playful'] // Array of Level 3 emotions under "Playful"
```

### User Flow

1. User sees Level 1 wheel with 7 primary emotions
2. Clicks primary emotion → wheel rotates and advances to Level 2
3. Clicks secondary emotion → wheel rotates and advances to Level 3
4. Clicks tertiary emotion → summary screen appears
5. Summary shows: empathetic message + emotion path badge + optional notes (text/voice)
6. "Done" button saves entry to localStorage and resets to Level 1
7. User can navigate to other tabs (Calendar, Streak, Story, Feedback, Export) via sidebar
8. URL updates with hash routing (e.g., `#/calendar`) for browser history support

### Visual Design

- **Font**: Inter (Google Fonts)
- **Colors**: Soft, warm palette with emotion-specific colors
- **Animations**: Smooth CSS transitions (0.4s wheel rotation, 0.15-0.25s UI fades)
- **Responsive**: Mobile-first design with 768px breakpoint
- **Accessibility**: ARIA labels, role attributes, keyboard navigation

### Adding a New Tab

To add a new tab:

1. **Create tab module** at `js/features/tabs/your-tab.js`:
   ```javascript
   window.YourTab = class YourTab {
       constructor(emotionStorage) {
           this.storage = emotionStorage;
           this.container = null;
       }

       init() {
           console.log('🎯 Initializing Your tab');
           this.container = document.getElementById('tab-your');
           if (this.container) {
               this.render();
           }
       }

       render() {
           this.container.innerHTML = `<div>Your content</div>`;
       }
   }
   ```

2. **Add HTML container** in `index.html`:
   ```html
   <div class="tab-content" id="tab-your" role="tabpanel"></div>
   ```

3. **Add sidebar button** in `index.html`:
   ```html
   <li>
       <button class="sidebar-item" data-tab="your" role="tab">
           <span class="sidebar-label">Your Tab</span>
       </button>
   </li>
   ```

4. **Add script tag** in `index.html` (before `main.js`):
   ```html
   <script src="js/features/tabs/your-tab.js"></script>
   ```

5. **Register in `main.js`**:
   ```javascript
   // Add to global variables
   let yourTab;

   // Add to initApp() function
   yourTab = new window.YourTab(emotionStorage);
   navigationManager.registerTabModule('your', yourTab);
   ```

6. **Update Router** valid routes in `js/core/router.js` if needed

### localStorage Schema

**`balanceMate_emotions`** - Emotion entries array
**`balanceMate_sidebarState`** - Sidebar collapsed state: `{collapsed: true/false}`
**`balanceMate_feedback`** - Feedback submissions array

### Known Issues

Check `Bugs/` directory for known issues with screenshots.

### Implementation Notes

- The app is fully implemented and functional with all 6 tabs complete
- Tab modules use lazy initialization (only `init()` when first accessed)
- Navigation system handles mobile/desktop responsive behavior automatically
- Story tab uses local pattern analysis (no external AI API required)
- All data operations are synchronous localStorage calls (no async/await needed)
