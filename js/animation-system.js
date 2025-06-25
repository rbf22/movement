// Main animation system

// Modified animate function to use the modular phase system
function animate() {
    try {
        // Timing
        const now = Date.now();
        const elapsedTime = now - startTime;
        const cycleMs = AnimationPhases.cycleDuration * 1000;
        const animationPhase = (elapsedTime % cycleMs) / cycleMs;
        const elapsedSeconds = elapsedTime / 1000;
        
        // Get current phase and progress within that phase
        const { phase, progress } = AnimationPhases.getCurrentPhase(animationPhase);
        
        // Update phase display if changed
        if (frameCount % 10 === 0 || phase.id !== lastPhaseId) {
            debug.textContent = `Phase: ${phase.title} (${Math.floor(progress * 100)}%)`;
            lastPhaseId = phase.id;
        }
        
        // Clear canvas
        ctx.fillStyle = config.backgroundColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Center point for formations
        const centerX = canvas.width * 0.5;
        const centerY = canvas.height * 0.5;
        const minDimension = Math.min(canvas.width, canvas.height);
        const formationSize = minDimension * 0.3;
        
        // Update particles based on current phase
        particles.forEach((particle) => {
            // Pulse size effect
            particle.radius = particle.baseRadius + Math.sin(elapsedSeconds * 2 + particle.pulsePhase) * particle.baseRadius * 0.15;
            
            // Apply current phase handler
            phase.handler(
                particle, 
                progress, 
                elapsedSeconds, 
                centerX, 
                centerY, 
                formationSize
            );
            
            // Move toward target position
            if (particle.targetX !== undefined) {
                const moveSpeed = 0.08 * config.animationSpeed;
                particle.x += (particle.targetX - particle.x) * moveSpeed;
                particle.y += (particle.targetY - particle.y) * moveSpeed;
            }
            
            // Add subtle movement variation in non-mixing phases
            if (phase.id !== "mixing") {
                particle.x += particle.vx * 0.2 * config.animationSpeed;
                particle.y += particle.vy * 0.2 * config.animationSpeed;
                
                // Dampen movement
                particle.vx *= 0.95;
                particle.vy *= 0.95;
                
                // Occasionally change direction slightly
                if (Math.random() < 0.02) {
                    particle.vx += (Math.random() - 0.5) * 0.1 * config.animationSpeed;
                    particle.vy += (Math.random() - 0.5) * 0.1 * config.animationSpeed;
                }
            }
            
            // Safety check for NaN values
            if (isNaN(particle.x) || isNaN(particle.y)) {
                particle.x = particle.originalX;
                particle.y = particle.originalY;
                particle.vx = 0;
                particle.vy = 0;
            }
        });
        
        // Draw connections between particles
        drawParticleConnections();
        
        // Draw particles with glow effects
        drawParticles();
        
        // Draw current phase title
        if (config.showPhaseInfo) {
            drawPhaseInfo(phase, progress);
        }
        
        // Update frame count
        frameCount++;
        
    } catch (e) {
        debug.textContent = "Error: " + e.message;
        console.error(e);
    }
    
    requestAnimationFrame(animate);
}

// Initialize the animation
function initAnimation() {
    // Reset the canvas size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Create particles
    createParticles();
    
    // Initialize phase system
    AnimationPhases.initialize();
    
    // Reset timing
    startTime = Date.now();
    frameCount = 0;
    
    // Log info
    debug.textContent = "Animation initialized with " + AnimationPhases.phases.length + " phases";
}

// Handle window resize
window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    createParticles();
    shapeCache = {}; // Clear shape cache
    debug.textContent = "Canvas resized: " + canvas.width + "x" + canvas.height;
});