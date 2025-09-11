# ThermaCore Monitor

A React application built with Vite for monitoring ThermaCore units in real-time.

## Features

### Audio Settings
- **Volume Control**: Adjustable volume slider (0-100%) in Settings → Audio Settings
- **Smart Mute Functionality**: Mute button that preserves and restores previous volume levels
- **Persistent Settings**: Audio preferences are saved and restored across browser sessions
- **Accessibility**: Full keyboard navigation and screen reader support with proper ARIA labels

### Other Features
- Real-time unit monitoring and analytics
- User authentication with role-based access control
- Customizable alerts and notifications
- Comprehensive reporting system
- Responsive design with dark/light theme support

## Audio System

The application includes a sophisticated audio system with:
- **Dynamic Volume Control**: Users can set volume from 0% (mute) to 100%
- **Synchronized Controls**: Volume slider and mute button work together seamlessly
- **Audio Normalization**: UI volume (0-100) is properly normalized to Web Audio API (0.0-1.0)
- **Settings Persistence**: Volume preferences persist across browser sessions

### Audio Settings Location
Navigate to **Settings** → **Audio Settings** to access:
- Volume slider with real-time percentage display
- Mute/unmute toggle that preserves volume levels
- Sound effects enable/disable control

## Technical Stack

- **Frontend**: React 19 + Vite
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: React Context API
- **Audio**: Web Audio API with gain control
- **Testing**: Vitest + React Testing Library
- **Build Tool**: Vite with optimized chunks

## Development

### Prerequisites
- Node.js 18+ or compatible package manager
- Modern browser with Web Audio API support

### Installation
```bash
npm install --legacy-peer-deps
```

### Development Server
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Testing
```bash
npm test
```

### Linting
```bash
npm run lint
npm run lint:fix
```

## `update_units.py`

This Python script is used for updating unit data. Further details on its usage and functionality will be provided here as the project develops.
