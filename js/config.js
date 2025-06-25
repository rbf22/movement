// Configuration settings
const config = {
    // Team configuration
    teams: {
        team1: {
            name: "EPAM",
            color: "#39C2D7"
        },
        team2: {
            name: "Client",
            color: "#D51875"
        }
    },
    
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