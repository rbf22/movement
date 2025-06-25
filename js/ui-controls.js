// UI Controls

// Set up control elements
const toggleBtn = document.getElementById('toggleBtn');
const controlPanel = document.getElementById('controlPanel');

// Input elements - with safety checks
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

// Set values only if elements exist
if (team1NameInput) team1NameInput.value = config.teams.team1.name;
if (team1ColorInput) team1ColorInput.value = config.teams.team1.color;
if (team2NameInput) team2NameInput.value = config.teams.team2.name;
if (team2ColorInput) team2ColorInput.value = config.teams.team2.color;
if (nodeCountInput) nodeCountInput.value = config.nodeCount;
if (nodeCountValue) nodeCountValue.textContent = config.nodeCount;
if (connectionDistanceInput) connectionDistanceInput.value = config.connectionDistance;
if (connectionValue) connectionValue.textContent = config.connectionDistance;
if (animationSpeedInput) animationSpeedInput.value = config.animationSpeed;
if (speedValue) speedValue.textContent = config.animationSpeed;
if (particleSizeInput) particleSizeInput.value = config.particleSize;
if (sizeValue) sizeValue.textContent = config.particleSize;
if (mixIntensityInput) mixIntensityInput.value = config.mixIntensity;
if (mixValue) mixValue.textContent = config.mixIntensity;
if (seedInput) seedInput.value = config.seed;

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

// Tab functionality
document.addEventListener('DOMContentLoaded', function() {
    // Set up tab navigation
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons and content
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to current button
            this.classList.add('active');
            
            // Show corresponding tab content
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId + '-tab').classList.add('active');
        });
    });
    
    // Trail length slider
    const trailLengthInput = document.getElementById('trailLength');
    const trailLengthValue = document.getElementById('trailLengthValue');
    if (trailLengthInput && trailLengthValue) {
        trailLengthInput.addEventListener('input', () => {
            trailLengthValue.textContent = trailLengthInput.value;
        });
        // Initialize with current config value
        trailLengthInput.value = config.effects.trailLength || 5;
        trailLengthValue.textContent = trailLengthInput.value;
    }
    
    // Effect toggles
    const showTrailsCheckbox = document.getElementById('showTrails');
    const showGlowCheckbox = document.getElementById('showGlow');
    const showLabelsCheckbox = document.getElementById('showLabels');
    const showPhaseInfoCheckbox = document.getElementById('showPhaseInfo');
    
    if (showTrailsCheckbox) {
        showTrailsCheckbox.checked = config.effects.trails !== false;
        showTrailsCheckbox.addEventListener('change', function() {
            config.effects.trails = this.checked;
        });
    }
    
    if (showGlowCheckbox) {
        showGlowCheckbox.checked = config.effects.glow !== false;
        showGlowCheckbox.addEventListener('change', function() {
            config.effects.glow = this.checked;
        });
    }
    
    if (showLabelsCheckbox) {
        showLabelsCheckbox.checked = config.effects.labels !== false;
        showLabelsCheckbox.addEventListener('change', function() {
            config.effects.labels = this.checked;
        });
    }
    
    if (showPhaseInfoCheckbox) {
        showPhaseInfoCheckbox.checked = config.showPhaseInfo !== false;
        showPhaseInfoCheckbox.addEventListener('change', function() {
            config.showPhaseInfo = this.checked;
        });
    }
    
    // Background color
    const backgroundColorInput = document.getElementById('backgroundColor');
    if (backgroundColorInput) {
        backgroundColorInput.value = config.backgroundColor || "#050505";
        backgroundColorInput.addEventListener('input', function() {
            config.backgroundColor = this.value;
        });
    }
    
    // Cycle duration
    const cycleDurationInput = document.getElementById('cycleDuration');
    if (cycleDurationInput) {
        cycleDurationInput.value = AnimationPhases.cycleDuration || 60;
    }

    // Update Apply button to include new settings
    const applyBtn = document.getElementById('applyBtn');
    if (applyBtn) {
        const originalHandler = applyBtn.onclick;
        applyBtn.onclick = function() {
            // Update configuration with new fields
            if (trailLengthInput) config.effects.trailLength = parseInt(trailLengthInput.value);
            if (backgroundColorInput) config.backgroundColor = backgroundColorInput.value;
            if (cycleDurationInput) AnimationPhases.cycleDuration = parseInt(cycleDurationInput.value);
            
            // Call original handler if it exists
            if (typeof originalHandler === 'function') {
                originalHandler.call(this);
            } else {
                // Default implementation if no handler was set
                initAnimation();
            }
        };
    }
});

// Team Management Functions
function updateTeamsList() {
    const teamsList = document.getElementById('teamsList');
    teamsList.innerHTML = '';
    
    config.teams.forEach((team, index) => {
        const teamElem = document.createElement('div');
        teamElem.className = 'team-item';
        
        teamElem.innerHTML = `
            <div class="team-header">
                <input type="text" class="team-name-input" value="${team.name}" data-index="${index}">
                <input type="color" class="team-color-input" value="${team.color}" data-index="${index}">
            </div>
            <div class="team-controls">
                <label>Particles: <span class="team-count-value">${team.particleCount}</span></label>
                <input type="range" class="team-count-input" min="10" max="100" value="${team.particleCount}" data-index="${index}">
                ${config.teams.length > 1 ? `<button class="remove-team-btn" data-index="${index}">Remove</button>` : ''}
            </div>
        `;
        
        teamsList.appendChild(teamElem);
    });
    
    // Add event listeners
    document.querySelectorAll('.team-name-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            config.teams[index].name = this.value;
        });
    });
    
    document.querySelectorAll('.team-color-input').forEach(input => {
        input.addEventListener('change', function() {
            const index = parseInt(this.dataset.index);
            config.teams[index].color = this.value;
        });
    });
    
    document.querySelectorAll('.team-count-input').forEach(input => {
        input.addEventListener('input', function() {
            const index = parseInt(this.dataset.index);
            const value = parseInt(this.value);
            config.teams[index].particleCount = value;
            input.parentElement.querySelector('.team-count-value').textContent = value;
        });
    });
    
    document.querySelectorAll('.remove-team-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            if (confirm(`Remove team "${config.teams[index].name}"?`)) {
                config.teams.splice(index, 1);
                updateTeamsList();
            }
        });
    });
}

// Add team button handler
document.addEventListener('DOMContentLoaded', function() {
    const addTeamBtn = document.getElementById('addTeamBtn');
    if (addTeamBtn) {
        addTeamBtn.addEventListener('click', function() {
            const newTeamId = `team${config.teams.length + 1}`;
            
            // Generate a distinct color for the new team
            const hue = (config.teams.length * 137) % 360; // Golden angle for even distribution
            const newColor = `hsl(${hue}, 70%, 50%)`;
            
            config.teams.push({
                id: newTeamId,
                name: `Team ${config.teams.length + 1}`,
                color: newColor,
                particleCount: 30
            });
            
            updateTeamsList();
        });
    }
    
    // Initialize team list
    updateTeamsList();
});