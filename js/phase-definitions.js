// Phase Management System
const AnimationPhases = {
    // Configuration
    cycleDuration: 60, // seconds for full cycle
    currentPhase: null,
    
    // Phase definitions
    phases: [
        {
            id: "initial",
            title: "Initial Team Formation",
            description: "Teams positioned in their starting clusters",
            duration: 0.1, // 10% of the cycle
            handler: function(particle, animationProgress, elapsedSeconds) {
                // Position logic for initial phase
                particle.targetX = particle.originalX;
                particle.targetY = particle.originalY;
            }
        },
        {
            id: "mixing",
            title: "Dynamic Team Mixing",
            description: "Teams move dynamically toward center and mix",
            duration: 0.15,
            handler: function(particle, animationProgress, elapsedSeconds, centerX, centerY) {
                // Enhanced mixing phase logic
                const mixPhase = animationProgress / this.duration;
                
                // Mixing logic for particles
                if (mixPhase < 0.5) {
                    // First half: build momentum toward center
                    particle.vx += (centerX - particle.x) * 0.0001 * config.mixIntensity;
                    particle.vy += (centerY - particle.y) * 0.0001 * config.mixIntensity;
                    particle.vx += (Math.random() - 0.5) * 0.05 * config.mixIntensity;
                    particle.vy += (Math.random() - 0.5) * 0.05 * config.mixIntensity;
                } else {
                    // Second half: swirling motion
                    const dx = particle.x - centerX;
                    const dy = particle.y - centerY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    
                    if (dist > 5) {
                        particle.vx += -dy / dist * 0.02 * config.mixIntensity;
                        particle.vy += dx / dist * 0.02 * config.mixIntensity;
                    }
                    
                    particle.vx += (Math.random() - 0.5) * 0.02 * config.mixIntensity;
                    particle.vy += (Math.random() - 0.5) * 0.02 * config.mixIntensity;
                }
                
                // Velocity limits
                const maxVelocity = 2 * config.mixIntensity;
                const currentVelocity = Math.sqrt(particle.vx * particle.vx + particle.vy * particle.vy);
                if (currentVelocity > maxVelocity) {
                    particle.vx = (particle.vx / currentVelocity) * maxVelocity;
                    particle.vy = (particle.vy / currentVelocity) * maxVelocity;
                }
                
                // Update position
                particle.targetX = particle.x + particle.vx;
                particle.targetY = particle.y + particle.vy;
                
                // Boundary check
                const margin = 50;
                if (particle.targetX < margin) particle.targetX = margin;
                if (particle.targetX > canvas.width - margin) particle.targetX = canvas.width - margin;
                if (particle.targetY < margin) particle.targetY = margin;
                if (particle.targetY > canvas.height - margin) particle.targetY = canvas.height - margin;
                
                // Color blending during mixing
                if (mixPhase > 0.5 && mixPhase < 0.9) {
                    const blendFactor = (mixPhase - 0.5) / 0.4;
                    
                    if (particle.team === 'team1') {
                        const originalColor = hexToRgb(config.teams.team1.color);
                        const targetColor = hexToRgb(config.teams.team2.color);
                        particle.currentColor = blendColors(originalColor, targetColor, blendFactor * 0.4);
                    } else {
                        const originalColor = hexToRgb(config.teams.team2.color);
                        const targetColor = hexToRgb(config.teams.team1.color);
                        particle.currentColor = blendColors(originalColor, targetColor, blendFactor * 0.4);
                    }
                } else {
                    particle.currentColor = particle.team === 'team1' ? 
                        config.teams.team1.color : config.teams.team2.color;
                }
            }
        },
        {
            id: "firstFormation",
            title: "Circle & Spiral Formation",
            description: "Teams form distinct geometric patterns",
            duration: 0.15,
            handler: function(particle, animationProgress, elapsedSeconds, centerX, centerY, formationSize) {
                const halfCount = config.nodeCount;
                
                if (particle.team === 'team1') {
                    // Team 1 forms a circle on the left
                    const circlePoints = getCachedShapePoints(
                        "circle", 
                        halfCount,
                        centerX - formationSize * 0.5, 
                        centerY, 
                        formationSize * 0.25
                    );
                    
                    const pointIdx = particle.index % circlePoints.length;
                    particle.targetX = circlePoints[pointIdx].x;
                    particle.targetY = circlePoints[pointIdx].y;
                } else {
                    // Team 2 forms a spiral on the right
                    const spiralPoints = getCachedShapePoints(
                        "spiral", 
                        halfCount,
                        centerX + formationSize * 0.5, 
                        centerY, 
                        formationSize * 0.25
                    );
                    
                    const pointIdx = (particle.index - halfCount) % spiralPoints.length;
                    particle.targetX = spiralPoints[pointIdx].x;
                    particle.targetY = spiralPoints[pointIdx].y;
                }
                
                // Reset color
                particle.currentColor = particle.team === 'team1' ? 
                    config.teams.team1.color : config.teams.team2.color;
            }
        },
        {
            id: "merging",
            title: "Team Convergence",
            description: "Teams move toward center and merge",
            duration: 0.15,
            handler: function(particle, animationProgress, elapsedSeconds, centerX, centerY, formationSize) {
                const mergeFactor = animationProgress / this.duration;
                const halfCount = config.nodeCount;
                
                // Starting positions (from previous phase)
                let startX, startY;
                
                if (particle.team === 'team1') {
                    const circlePoints = getCachedShapePoints(
                        "circle", 
                        halfCount,
                        centerX - formationSize * 0.5, 
                        centerY, 
                        formationSize * 0.25
                    );
                    
                    const pointIdx = particle.index % circlePoints.length;
                    startX = circlePoints[pointIdx].x;
                    startY = circlePoints[pointIdx].y;
                } else {
                    const spiralPoints = getCachedShapePoints(
                        "spiral", 
                        halfCount,
                        centerX + formationSize * 0.5, 
                        centerY, 
                        formationSize * 0.25
                    );
                    
                    const pointIdx = (particle.index - halfCount) % spiralPoints.length;
                    startX = spiralPoints[pointIdx].x;
                    startY = spiralPoints[pointIdx].y;
                }
                
                // End positions (wave pattern in center)
                const wavePoints = getCachedShapePoints(
                    "wave",
                    particles.length,
                    centerX,
                    centerY,
                    formationSize * 0.4
                );
                
                // Alternate team 1 and team 2 particles in the wave
                let pointIdx;
                if (particle.team === 'team1') {
                    pointIdx = particle.index * 2;
                } else {
                    pointIdx = (particle.index - halfCount) * 2 + 1;
                }
                
                // Ensure index is in bounds
                pointIdx = pointIdx % wavePoints.length;
                
                const endX = wavePoints[pointIdx].x;
                const endY = wavePoints[pointIdx].y;
                
                // Linear interpolation
                particle.targetX = startX + (endX - startX) * mergeFactor;
                particle.targetY = startY + (endY - startY) * mergeFactor;
            }
        },
        {
            id: "collaboration",
            title: "Collaborative Pattern",
            description: "Teams form an interconnected star pattern",
            duration: 0.15,
            handler: function(particle, animationProgress, elapsedSeconds, centerX, centerY, formationSize) {
                const starPoints = getCachedShapePoints(
                    "star", 
                    particles.length,
                    centerX, 
                    centerY, 
                    formationSize * 0.35
                );
                
                // Assign points alternating between teams for better visual mixing
                const halfCount = config.nodeCount;
                let pointIdx;
                
                if (particle.team === 'team1') {
                    pointIdx = particle.index * 2;
                } else {
                    pointIdx = (particle.index - halfCount) * 2 + 1; 
                }
                
                // Ensure index is in bounds
                pointIdx = pointIdx % starPoints.length;
                
                particle.targetX = starPoints[pointIdx].x;
                particle.targetY = starPoints[pointIdx].y;
            }
        },
        {
            id: "splitFormation",
            title: "New Team Formations",
            description: "Teams split into new distinct patterns",
            duration: 0.15,
            handler: function(particle, animationProgress, elapsedSeconds, centerX, centerY, formationSize) {
                const halfCount = config.nodeCount;
                
                if (particle.team === 'team1') {
                    // Team 1 forms a grid on the left
                    const gridPoints = getCachedShapePoints(
                        "grid", 
                        halfCount,
                        centerX - formationSize * 0.5, 
                        centerY, 
                        formationSize * 0.25
                    );
                    
                    const pointIdx = particle.index % gridPoints.length;
                    particle.targetX = gridPoints[pointIdx].x;
                    particle.targetY = gridPoints[pointIdx].y;
                } else {
                    // Team 2 forms a circle on the right
                    const circlePoints = getCachedShapePoints(
                        "circle", 
                        halfCount,
                        centerX + formationSize * 0.5, 
                        centerY, 
                        formationSize * 0.25
                    );
                    
                    const pointIdx = (particle.index - halfCount) % circlePoints.length;
                    particle.targetX = circlePoints[pointIdx].x;
                    particle.targetY = circlePoints[pointIdx].y;
                }
                
                // Reset color
                particle.currentColor = particle.team === 'team1' ? 
                    config.teams.team1.color : config.teams.team2.color;
            }
        },
        {
            id: "returnHome",
            title: "Return to Starting Positions",
            description: "Teams return to their original clusters",
            duration: 0.15,
            handler: function(particle, animationProgress, elapsedSeconds, centerX, centerY, formationSize) {
                const returnPhase = animationProgress / this.duration;
                const halfCount = config.nodeCount;
                
                // Starting positions (from phase 6)
                let startX, startY;
                
                if (particle.team === 'team1') {
                    const gridPoints = getCachedShapePoints(
                        "grid", 
                        halfCount,
                        centerX - formationSize * 0.5, 
                        centerY, 
                        formationSize * 0.25
                    );
                    
                    const pointIdx = particle.index % gridPoints.length;
                    startX = gridPoints[pointIdx].x;
                    startY = gridPoints[pointIdx].y;
                } else {
                    const circlePoints = getCachedShapePoints(
                        "circle", 
                        halfCount,
                        centerX + formationSize * 0.5, 
                        centerY, 
                        formationSize * 0.25
                    );
                    
                    const pointIdx = (particle.index - halfCount) % circlePoints.length;
                    startX = circlePoints[pointIdx].x;
                    startY = circlePoints[pointIdx].y;
                }
                
                // Use bezier path for smooth curved return
                const t = returnPhase;
                const invT = 1 - t;
                
                // Control point (above or below based on position)
                const cpY = (particle.originalY < centerY) ? 
                             centerY + formationSize * 0.7 : 
                             centerY - formationSize * 0.7;
                
                // Quadratic bezier formula
                particle.targetX = invT*invT * startX + 2*invT*t * centerX + t*t * particle.originalX;
                particle.targetY = invT*invT * startY + 2*invT*t * cpY + t*t * particle.originalY;
            }
        }
    ],
    
    // Initialize phase timing
    initialize: function() {
        let cumulativeDuration = 0;
        this.phases.forEach(phase => {
            phase.startPercent = cumulativeDuration;
            cumulativeDuration += phase.duration;
            phase.endPercent = cumulativeDuration;
        });
        
        // Normalize if needed
        if (cumulativeDuration !== 1) {
            const scaleFactor = 1 / cumulativeDuration;
            this.phases.forEach(phase => {
                phase.startPercent *= scaleFactor;
                phase.endPercent *= scaleFactor;
            });
        }
    },
    
    // Get current phase based on animation progress
    getCurrentPhase: function(animationPhase) {
        for (const phase of this.phases) {
            if (animationPhase >= phase.startPercent && animationPhase < phase.endPercent) {
                this.currentPhase = phase;
                // Calculate progress within this phase (0-1)
                const phaseProgress = (animationPhase - phase.startPercent) / 
                                      (phase.endPercent - phase.startPercent);
                return {
                    phase: phase,
                    progress: phaseProgress
                };
            }
        }
        // Default to last phase if none found
        return {
            phase: this.phases[this.phases.length - 1],
            progress: 1
        };
    },
    
    // Add a new phase
    addPhase: function(phaseDefinition, position) {
        if (position !== undefined) {
            this.phases.splice(position, 0, phaseDefinition);
        } else {
            this.phases.push(phaseDefinition);
        }
        this.initialize();
    },
    
    // Remove a phase by ID
    removePhase: function(phaseId) {
        const index = this.phases.findIndex(p => p.id === phaseId);
        if (index !== -1) {
            this.phases.splice(index, 1);
            this.initialize();
        }
    }
};

// Helper function to draw phase information
function drawPhaseInfo(phase, progress) {
    // Display phase title and progress
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.fillText(`${phase.title} (${Math.floor(progress * 100)}%)`, canvas.width / 2, 30);
    
    // Display phase description
    ctx.font = '14px Arial';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText(phase.description, canvas.width / 2, 50);
    
    // Add phase timeline visualization
    const timelineWidth = canvas.width * 0.5;
    const timelineHeight = 6;
    const timelineX = (canvas.width - timelineWidth) / 2;
    const timelineY = 70;
    
    // Background track
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.fillRect(timelineX, timelineY, timelineWidth, timelineHeight);
    
    // Calculate phase positions in timeline
    AnimationPhases.phases.forEach((p) => {
        if (p === phase) {
            // Current phase - highlight with different color
            ctx.fillStyle = 'rgba(255, 200, 100, 0.8)';
        } else {
            // Other phases
            ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        }
        
        // Draw phase segment
        const segmentX = timelineX + (p.startPercent * timelineWidth);
        const segmentWidth = (p.endPercent - p.startPercent) * timelineWidth;
        ctx.fillRect(segmentX, timelineY, segmentWidth, timelineHeight);
    });
    
    // Progress indicator
    const currentTimeX = timelineX + (phase.startPercent * timelineWidth) + 
                        (progress * (phase.endPercent - phase.startPercent) * timelineWidth);
    ctx.beginPath();
    ctx.arc(currentTimeX, timelineY + timelineHeight / 2, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
}