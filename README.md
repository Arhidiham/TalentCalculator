# Talent Calculator

A React-based application to calculate and manage talent profiles.

## Project Overview

This project is built with React, TypeScript, and Vite to provide a modern, fast development experience. The Talent Calculator aims to provide an intuitive interface for evaluating talent metrics.

## Features (Planned)

- User-friendly interface
- Talent metrics evaluation
- Profile management
- Data visualization
- Export capabilities

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/Arhidiham/TalentCalculator.git
   ```

2. Navigate to the project directory:
   ```
   cd TalentCalculator
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open your browser and visit:
   ```
   http://localhost:5173/
   ```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build locally

## Technologies

- React
- TypeScript
- Vite
- CSS

## Adding a New Class

To add a new class with talents and spells, follow these steps:

### 1. Create the Class Directory Structure

Create a new directory for your class under `src/data/classes/`:

```
src/data/classes/your-new-class/
```

### 2. Create Required JSON Files

Each class requires three JSON files:

#### metadata.json
```json
{
  "id": "your-new-class",
  "name": "Your New Class",
  "description": "Description of your class",
  "icon": "path/to/class-icon.png"
}
```

#### talents.json
```json
[
  {
    "id": "talent1",
    "name": "Sample Talent",
    "description": "This talent does something amazing",
    "icon": "path/to/talent-icon.png",
    "maxRank": 5,
    "position": { "row": 0, "col": 0 },
    "requirements": {
      "pointsRequired": 0
    }
  },
  {
    "id": "talent2",
    "name": "Advanced Talent",
    "description": "This talent does something even more amazing",
    "icon": "path/to/talent-icon.png",
    "maxRank": 3,
    "position": { "row": 1, "col": 1 },
    "requirements": {
      "pointsRequired": 5,
      "prerequisites": ["talent1"]
    }
  }
]
```

#### spells.json
```json
[
  {
    "id": "spell1",
    "name": "Sample Spell",
    "description": "Casts a powerful spell",
    "icon": "path/to/spell-icon.png",
    "requiredLevel": 1
  },
  {
    "id": "spell2",
    "name": "Advanced Spell",
    "description": "Casts an even more powerful spell",
    "icon": "path/to/spell-icon.png",
    "requiredLevel": 10,
    "requiredTalent": "talent1",
    "requiredTalentRank": 3
  }
]
```

### 3. Add Icons

Place your icon images in the appropriate directory:

- Class icons: `public/icons/classes/`
- Talent icons: `public/icons/talents/your-new-class/`
- Spell icons: `public/icons/spells/your-new-class/`

### 4. Update Class Loader

The ClassLoader utility will automatically detect and load your new class when the application starts.

## License

This project is licensed under the MIT License.
