# Movement Collaboration Animation

An interactive, modular animation system that visualizes team collaboration using particle networks. This visualization shows how EPAM teams and clients work together through different phases of engagement.

## Features

- Modular animation phase system
- Multiple geometric formations
- Interactive controls
- Team visualization with custom colors
- Responsive design
- Deterministic animation (with configurable seeds)

## Setup

1. Clone the repository:

```
git clone https://github.com/rbf22/movement.git
cd movement

```

2. Open `index.html` in a modern web browser
- For local development, you can use a simple HTTP server:
  ```
  python -m http.server
  ```
  Then visit `http://localhost:8000`

## Customization

The animation is highly customizable through the control panel:

- Team names and colors
- Particle counts and sizes
- Connection distances
- Animation speed
- Mixing intensity
- Random seed for deterministic results

## Animation Phases

The animation is composed of modular phases that can be easily modified or extended:

1. **Initial Formation** - Teams positioned in their starting clusters
2. **Dynamic Team Mixing** - Teams move toward center and mix
3. **Circle & Spiral Formation** - Teams form distinct geometric patterns
4. **Team Convergence** - Teams move toward center and merge
5. **Collaborative Pattern** - Teams form an interconnected star pattern
6. **New Team Formations** - Teams split into new distinct patterns
7. **Return to Starting Positions** - Teams return to original clusters

## Creating Custom Phases

To add a new phase, use the `AnimationPhases.addPhase()` method with a phase definition object:

```javascript
AnimationPhases.addPhase({
 id: "customPhase",
 title: "My Custom Phase",
 description: "Description of what happens in this phase",
 duration: 0.15, // 15% of the cycle
 handler: function(particle, progress, elapsedSeconds, centerX, centerY, formationSize) {
     // Your custom particle positioning logic here
 }
});
```
## Browser Support
 - Chrome (recommended)
 - Firefox
 - Edge
 - Safari

## License
MIT License

## Setting up the GitHub Repository

1. **Create a new repository on GitHub:**
   - Go to github.com and log in
   - Click on "New repository"
   - Name it "epam-client-animation"
   - Add a description
   - Choose public or private
   - Click "Create repository"

2. **Initialize local repository and push your code:**
   ```bash
   # In your local project folder
   git init
   git add .
   git commit -m "Initial commit: Modular animation system"
   git branch -M main
   git remote add origin https://github.com/yourusername/epam-client-animation.git
   git push -u origin main
   ```

## Set up GitHub Pages (optional for easy viewing):
 - Go to your repository settings
 - Scroll down to "GitHub Pages"
 - Set source to "main" branch
 - Save
 - Your animation will be available at: https://rbf22.github.io/movement/

 