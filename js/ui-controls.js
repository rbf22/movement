// UI Controls

// Set up control elements
const toggleBtn = document.getElementById('toggleBtn');
const controlPanel = document.getElementById('controlPanel');

// Input elements
const team1NameInput = document.getElementById('team1Name');
const team1ColorInput = document.getElementById('team1Color');
const team2NameInput = document.getElementById('team2Name');
const team2ColorInput = document.getElementById('team2Color');
const nodeCountInput = document.getElementById('nodeCount');
const nodeCountValue = document.getElementById('nodeCountValue');
const connectionDistanceInput = document.getElementById('connectionDistance');
const connectionValue = document.getElementById('connectionValue');
const animationSpeedInput = document.getElementById('animationSpeed');
const speedValue = document.getElementById('speedValue');
const particleSizeInput = document.getElementById('particleSize');
const sizeValue = document.getElementById('sizeValue');
const mixIntensityInput = document.getElementById('mixIntensity');
const mixValue = document.getElementById('mixValue');
const seedInput = document.getElementById('seedInput');
const applyBtn = document.getElementById('applyBtn');

// Set initial values in form
team1NameInput.value = config.teams.team1.name;
team1ColorInput.value = config.teams.team1.color;
team2NameInput.value = config.teams.team2.name;
team2ColorInput.value = config.teams.team2.color;
nodeCountInput.value = config.nodeCount;
nodeCountValue.textContent = config.nodeCount;
connectionDistanceInput.value = config.connectionDistance;
connectionValue.textContent = config.connectionDistance;
animationSpeedInput.value = config.animationSpeed;
speedValue.textContent = config.animationSpeed;
particleSizeInput.value = config.particleSize;
sizeValue.textContent = config.particleSize;
mixIntensityInput.value = config.mixIntensity;
mixValue.textContent = config.mixIntensity;
seedInput.value = config.seed;

// Update display values when sliders change
nodeCountInput.addEventListener('input', () => {
    nodeCountValue.textContent = nodeCountInput.value;
});

connectionDistanceInput.addEventListener('input', () => {
    connectionValue.textContent = connectionDistanceInput.value;
});

animationSpeedInput.addEventListener('input', () => {
    speedValue.textContent = animationSpeedInput.value;
});

particleSizeInput.addEventListener('input', () => {
    sizeValue.textContent = particleSizeInput.value;
});

mixIntensityInput.addEventListener('input', () => {
    mixValue.textContent = mixIntensityInput.value;
});

// Toggle controls visibility
toggleBtn.addEventListener('click', () => {
    if (controlPanel.style.display === 'none') {
        controlPanel.style.display = 'block';
        toggleBtn.textContent = 'Hide Controls';
    } else {
        controlPanel.style.display = 'none';
        toggleBtn.textContent = 'Show Controls';
    }
});

// Apply settings button
applyBtn.addEventListener('click', () => {
    // Update configuration
    config.teams.team1.name = team1NameInput.value;
    config.teams.team1.color = team1ColorInput.value;
    config.teams.team2.name = team2NameInput.value;
    config.teams.team2.color = team2ColorInput.value;
    config.nodeCount = parseInt(nodeCountInput.value);
    config.connectionDistance = parseInt(connectionDistanceInput.value);
    config.animationSpeed = parseFloat(animationSpeedInput.value);
    config.particleSize = parseFloat(particleSizeInput.value);
    config.mixIntensity = parseFloat(mixIntensityInput.value);
    config.seed = parseInt(seedInput.value) || 12345;
    
    // Reset animation
    initAnimation();
    
    debug.textContent = "Settings applied. New seed: " + config.seed;
});

// Function to update phases list in control panel
function updatePhasesList() {
    const phasesList = document.getElementById('phasesList');
    if (!phasesList) return;
    
    phasesList.innerHTML = '';
    
    AnimationPhases.phases.forEach((phase, index) => {
        const phaseElem = document.createElement('div');
        phaseElem.className = 'phase-item';
        
        phaseElem.innerHTML = `
            <div class="phase-header">
                <span class="phase-title">${phase.title}</span>
                <span class="phase-duration">${Math.round(phase.duration * 100)}%</span>
            </div>
            <div class="phase-controls">
                <button class="edit-phase-btn" data-index="${index}">Edit</button>
                <button class="remove-phase-btn" data-index="${index}" 
                    ${AnimationPhases.phases.length <= 2 ? 'disabled' : ''}>Remove</button>
                ${index > 0 ? `<button class="move-up-btn" data-index="${index}">↑</button>` : ''}
                ${index < AnimationPhases.phases.length - 1 ? `<button class="move-down-btn" data-index="${index}">↓</button>` : ''}
            </div>
        `;
        
        phasesList.appendChild(phaseElem);
    });
    
    // Add event listeners for phase controls
    document.querySelectorAll('.edit-phase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            openPhaseEditor(parseInt(this.dataset.index));
        });
    });
    
    document.querySelectorAll('.remove-phase-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to remove this phase?')) {
                AnimationPhases.phases.splice(parseInt(this.dataset.index), 1);
                AnimationPhases.initialize();
                updatePhasesList();
            }
        });
    });
    
    // Add move up/down functionality
    document.querySelectorAll('.move-up-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (index > 0) {
                const temp = AnimationPhases.phases[index];
                AnimationPhases.phases[index] = AnimationPhases.phases[index - 1];
                AnimationPhases.phases[index - 1] = temp;
                AnimationPhases.initialize();
                updatePhasesList();
            }
        });
    });
    
    document.querySelectorAll('.move-down-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (index < AnimationPhases.phases.length - 1) {
                const temp = AnimationPhases.phases[index];
                AnimationPhases.phases[index] = AnimationPhases.phases[index + 1];
                AnimationPhases.phases[index + 1] = temp;
                AnimationPhases.initialize();
                updatePhasesList();
            }
        });
    });
}

// Phase editor modal function (simplified)
function openPhaseEditor(index) {
    // This would be a more complex modal dialog
    // For now, just a basic implementation
    alert("Phase editor would open here - add full implementation as needed");
}

// Start the animation
document.addEventListener('DOMContentLoaded', function() {
    // Initialize animation
    initAnimation();
    
    // Update phase list
    updatePhasesList();
    
    // Start animation loop
    animate();
});