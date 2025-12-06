# Balance Mate V2 - Emotion Wheel

Interactive 3-level emotion wheel for tracking emotional states with empathetic messaging and voice notes.

## Features

- **3-Level Emotion Wheel**: 7 → 41 → 82 emotions
- **Empathetic Messaging**: Personalized responses for each emotion path
- **Voice Notes**: Web Speech API integration for voice input
- **Smooth Animations**: Beautiful SVG-based wheel with transitions
- **Mobile Responsive**: Works on all devices

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript (modular architecture)
- Web Speech API
- Express.js (local development server)

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm start

# Open browser to http://localhost:3000
```

## Project Structure

```
Balance_Mate2/
├── index.html              # Main HTML shell
├── css/
│   └── styles.css         # All styles
├── js/
│   ├── config/
│   │   ├── emotions.js    # 130 emotions data
│   │   └── messages.js    # Empathetic messages
│   ├── core/
│   │   └── state-manager.js  # State management
│   ├── features/
│   │   ├── wheel-renderer.js  # SVG wheel generation
│   │   ├── voice-recorder.js  # Voice input
│   │   └── summary-screen.js  # Summary view
│   └── main.js            # App bootstrap
├── server.js              # Development server
└── package.json
```

## Deployment

This app is designed to be deployed on Vercel, Netlify, or GitHub Pages.

## Browser Support

- Chrome (recommended for voice input)
- Safari (voice input supported)
- Edge (voice input supported)
- Firefox (voice input not supported, gracefully degrades)

## License

MIT
