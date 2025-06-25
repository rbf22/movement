// Particles Management

function createParticles() {
    // Reset random number generator for consistent results
    rng = new SeededRandom(config.seed);
    
    // Clear existing particles and shape cache
    particles = [];
    shapeCache = {};
    
    // Calculate positions based on team count
    const teamCount = config.teams.length;
    const angleStep = (2 * Math.PI) / teamCount;
    
    // Create particles for each team
    let particleIndexOffset = 0;
    
    config.teams.forEach((team, teamIndex) => {
        // Calculate position for this team's cluster
        const angle = angleStep * teamIndex;
        const clusterX = canvas.width/2 + Math.cos(angle) * canvas.width * 0.25;
        const clusterY = canvas.height/2 + Math.sin(angle) * canvas.height * 0.25;
        
        // Create particles for this team
        for (let i = 0; i < team.particleCount; i++) {
            particles.push({
                x: clusterX + (rng.next() - 0.5) * canvas.width * 0.15,
                y: clusterY + (rng.next() - 0.5) * canvas.height * 0.15,
                radius: (3 + rng.next() * 5) * config.particleSize,
                baseRadius: (3 + rng.next() * 5) * config.particleSize,
                color: team.color,
                teamId: team.id,
                teamIndex: teamIndex,
                index: particleIndexOffset + i,
                vx: (rng.next() - 0.5) * 0.5,
                vy: (rng.next() - 0.5) * 0.5,
                pulsePhase: rng.next() * Math.PI * 2,
                trail: [],
                originalX: 0,
                originalY: 0,
                targetX: 0,
                targetY: 0
            });
        }
        
        particleIndexOffset += team.particleCount;
    });
    
    // Store original positions
    particles.forEach(particle => {
        particle.originalX = particle.x;
        particle.originalY = particle.y;
        particle.targetX = particle.x;
        particle.targetY = particle.y;
    });
}

// Helper function to draw particle connections
function drawParticleConnections() {
    ctx.globalAlpha = 0.2;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const p1 = particles[i];
            const p2 = particles[j];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Connect if within range
            if (distance < config.connectionDistance) {
                // Calculate opacity based on distance
                const opacity = 1 - (distance / config.connectionDistance);
                
                // Special color for cross-team connections
                const isInterTeamConnection = p1.team !== p2.team;
                let connectionColor;
                
                // Get current phase information
                const { phase } = AnimationPhases.getCurrentPhase(
                    (Date.now() - startTime) / (AnimationPhases.cycleDuration * 1000)
                );
                
                if (isInterTeamConnection && phase.id !== "initial" && phase.id !== "returnHome") {
                    // Bright color for cross-team connections during collaboration
                    connectionColor = `rgba(200, 220, 255, ${opacity * 0.8})`;
                } else {
                    // Use node's own color
                    connectionColor = colorWithOpacity(p1.color, opacity * 0.7);
                }
                
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = connectionColor;
                ctx.lineWidth = isInterTeamConnection ? 1.2 : 0.8;
                ctx.stroke();
            }
        }
    }
}

// Helper function to draw particles
function drawParticles() {
    ctx.globalAlpha = 1;
    particles.forEach(particle => {
        // Update trail if enabled
        if (config.effects.trails) {
            particle.trail.push({x: particle.x, y: particle.y});
            if (particle.trail.length > config.effects.trailLength) {
                particle.trail.shift();
            }
        }

        // Draw trails if enabled
        if (config.effects.trails && particle.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(particle.trail[0].x, particle.trail[0].y);
            
            for (let i = 1; i < particle.trail.length; i++) {
                ctx.lineTo(particle.trail[i].x, particle.trail[i].y);
            }
            
            ctx.strokeStyle = colorWithOpacity(particle.color, 0.3);
            ctx.lineWidth = particle.radius * 0.7;
            ctx.stroke();
        }

        // Draw glow if enabled
        if (config.effects.glow) {
            const glowSize = particle.radius * 2.5;
            const gradient = ctx.createRadialGradient(
                particle.x, particle.y, 0,
                particle.x, particle.y, glowSize
            );
            gradient.addColorStop(0, colorWithOpacity(particle.color, 0.3));
            gradient.addColorStop(1, colorWithOpacity(particle.color, 0));
            
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();
        }
        
        // Draw the particle itself
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.currentColor || particle.color;
        ctx.fill();
    });

    // Draw team labels if enabled
    if (config.effects.labels) {
        drawTeamLabels();
    }
}

// Helper function to draw team labels
function drawTeamLabels() {
    // Calculate average position for each team
    let team1X = 0, team1Y = 0, team2X = 0, team2Y = 0;
    let team1Count = 0, team2Count = 0;

    particles.forEach(p => {
        if (p.team === 'team1') {
            team1X += p.x;
            team1Y += p.y;
            team1Count++;
        } else {
            team2X += p.x;
            team2Y += p.y;
            team2Count++;
        }
    });

    // Get current animation phase
    const animationPhase = (Date.now() - startTime) / (AnimationPhases.cycleDuration * 1000);
    
    // Only draw labels if teams are somewhat separated
    if (animationPhase < 0.2 || animationPhase > 0.8) {
        // Draw team labels with glow effect
        team1X /= team1Count;
        team1Y /= team1Count;
        team2X /= team2Count;
        team2Y /= team2Count;
        
        // Draw glow/shadow for better visibility
        ctx.font = '22px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 6;
        
        // Draw team names
        ctx.fillStyle = config.teams.team1.color;
        ctx.fillText(config.teams.team1.name, team1X, team1Y - 30);
        
        ctx.fillStyle = config.teams.team2.color;
        ctx.fillText(config.teams.team2.name, team2X, team2Y - 30);
        
        ctx.shadowBlur = 0;
    }
}