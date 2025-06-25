// Animation presets
const presets = {
    default: {
        nodeCount: 40,
        connectionDistance: 150,
        animationSpeed: 1.0,
        particleSize: 1.0,
        mixIntensity: 2.5,
        seed: 12345,
        backgroundColor: "#050505",
        effects: {
            trails: true,
            trailLength: 5,
            glow: true,
            labels: true
        }
    },
    energetic: {
        nodeCount: 60,
        connectionDistance: 180,
        animationSpeed: 1.6,
        particleSize: 0.8,
        mixIntensity: 4.0,
        seed: 23456,
        backgroundColor: "#0a0a24",
        effects: {
            trails: true,
            trailLength: 8,
            glow: true,
            labels: true
        }
    },
    calm: {
        nodeCount: 30,
        connectionDistance: 200,
        animationSpeed: 0.7,
        particleSize: 1.5,
        mixIntensity: 1.5,
        seed: 34567,
        backgroundColor: "#0a1a1a",
        effects: {
            trails: true,
            trailLength: 4,
            glow: true,
            labels: true
        }
    },
    creative: {
        nodeCount: 50,
        connectionDistance: 160,
        animationSpeed: 1.2,
        particleSize: 1.2,
        mixIntensity: 3.0,
        seed: 45678,
        backgroundColor: "#150a15",
        effects: {
            trails: true,
            trailLength: 7,
            glow: true,
            labels: true
        }
    },
    technical: {
        nodeCount: 70,
        connectionDistance: 130,
        animationSpeed: 0.9,
        particleSize: 0.7,
        mixIntensity: 2.0,
        seed: 56789,
        backgroundColor: "#0a0a0a",
        effects: {
            trails: true,
            trailLength: 3,
            glow: true,
            labels: true
        }
    }
};

// Add preset selection handler
document.addEventListener('DOMContentLoaded', function() {
    const presetSelect = document.getElementById('presetSelect');
    if (presetSelect) {
        presetSelect.addEventListener('change', function() {
            const preset = presets[this.value];
            if (preset) {
                // Update form controls
                document.getElementById('nodeCount').value = preset.nodeCount;
                document.getElementById('nodeCountValue').textContent = preset.nodeCount;
                document.getElementById('connectionDistance').value = preset.connectionDistance;
                document.getElementById('connectionValue').textContent = preset.connectionDistance;
                document.getElementById('animationSpeed').value = preset.animationSpeed;
                document.getElementById('speedValue').textContent = preset.animationSpeed;
                document.getElementById('particleSize').value = preset.particleSize;
                document.getElementById('sizeValue').textContent = preset.particleSize;
                document.getElementById('mixIntensity').value = preset.mixIntensity;
                document.getElementById('mixValue').textContent = preset.mixIntensity;
                document.getElementById('seedInput').value = preset.seed;
                document.getElementById('backgroundColor').value = preset.backgroundColor;
                document.getElementById('showTrails').checked = preset.effects.trails;
                document.getElementById('trailLength').value = preset.effects.trailLength;
                document.getElementById('trailLengthValue').textContent = preset.effects.trailLength;
                document.getElementById('showGlow').checked = preset.effects.glow;
                document.getElementById('showLabels').checked = preset.effects.labels;
                
                // Apply settings immediately
                applyBtn.click();
            }
        });
    }
});

// Configuration settings
// Updated config structure
const config = {
    teams: [
        {
            id: "team1", 
            name: "EPAM",
            color: "#39C2D7",
            particleCount: 40
        },
        {
            id: "team2",
            name: "Client",
            color: "#D51875", 
            particleCount: 40
        }
        // More teams can be added dynamically
    ],
    
    // Node parameters
    nodeCount: 40,
    connectionDistance: 150,
    particleSize: 1.0,
    
    // Animation behavior
    animationSpeed: 1.0,
    mixIntensity: 2.5,
    cycleDuration: 60,
    
    // Deterministic control
    seed: 12345,
    
    // Visual settings
    backgroundColor: "#050505",
    showPhaseInfo: true,
    
    // Visual effects
    effects: {
        trails: true,
        trailLength: 5,
        glow: true,
        labels: true
    }
};

// Seeded random number generator
class SeededRandom {
    constructor(seed) {
        this._seed = seed % 2147483647;
        if (this._seed <= 0) this._seed += 2147483646;
    }

    next() {
        this._seed = (this._seed * 16807) % 2147483647;
        return (this._seed - 1) / 2147483646;
    }
    
    range(min, max) {
        return min + this.next() * (max - min);
    }
}

// Color helper functions
function colorWithOpacity(color, opacity) {
    let r, g, b;
    if (color.startsWith('#')) {
        r = parseInt(color.slice(1, 3), 16);
        g = parseInt(color.slice(3, 5), 16);
        b = parseInt(color.slice(5, 7), 16);
    } else {
        r = g = b = 200;
    }
    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : {r: 0, g: 0, b: 0};
}

function blendColors(color1, color2, percentage) {
    const r = Math.round(color1.r + (color2.r - color1.r) * percentage);
    const g = Math.round(color1.g + (color2.g - color1.g) * percentage);
    const b = Math.round(color1.b + (color2.b - color1.b) * percentage);
    return `rgb(${r}, ${g}, ${b})`;
}

// Initialize canvas and global variables
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const debug = document.getElementById('debug');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Global variables
let rng = new SeededRandom(config.seed);
let particles = [];
let shapeCache = {};
let startTime = Date.now();
let frameCount = 0;
let lastPhaseId = null;