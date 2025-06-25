// Shape Library

// Simplified shape generation function
function getShapePoints(shapeName, count, centerX, centerY, size, options = {}) {
    const points = [];
    
    // Generate points based on shape type
    try {
        if (shapeName === "circle") {
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                points.push({
                    x: centerX + Math.cos(angle) * size,
                    y: centerY + Math.sin(angle) * size
                });
            }
        }
        else if (shapeName === "spiral") {
            const turns = options.turns || 3;
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2 * turns;
                const distance = (i / count) * size;
                points.push({
                    x: centerX + Math.cos(angle) * distance,
                    y: centerY + Math.sin(angle) * distance
                });
            }
        }
        else if (shapeName === "grid") {
            const cols = Math.ceil(Math.sqrt(count));
            const rows = Math.ceil(count / cols);
            const stepX = (size * 2) / Math.max(1, cols - 1);
            const stepY = (size * 2) / Math.max(1, rows - 1);
            
            let index = 0;
            for (let y = 0; y < rows && index < count; y++) {
                for (let x = 0; x < cols && index < count; x++) {
                    points.push({
                        x: centerX - size + x * stepX,
                        y: centerY - size + y * stepY
                    });
                    index++;
                }
            }
        }
        else if (shapeName === "star") {
            const points1 = Math.min(10, Math.ceil(count / 2));
            const points2 = count - points1;
            const innerRadius = options.innerRadius || size * 0.4;
            
            // Outer points
            for (let i = 0; i < points1; i++) {
                const angle = (i / points1) * Math.PI * 2;
                points.push({
                    x: centerX + Math.cos(angle) * size,
                    y: centerY + Math.sin(angle) * size
                });
            }
            
            // Inner points
            for (let i = 0; i < points2; i++) {
                const angle = ((i + 0.5) / points2) * Math.PI * 2;
                points.push({
                    x: centerX + Math.cos(angle) * innerRadius,
                    y: centerY + Math.sin(angle) * innerRadius
                });
            }
        }
        else if (shapeName === "wave") {
            const amplitude = options.amplitude || size * 0.5;
            const frequency = options.frequency || 4;
            for (let i = 0; i < count; i++) {
                const x = centerX - size + (i / (count-1)) * size * 2;
                const y = centerY + Math.sin((i / count) * Math.PI * frequency) * amplitude;
                points.push({ x, y });
            }
        }
        else if (shapeName === "doubleHelix") {
            const radius = size * 0.5;
            const turns = options.turns || 2;
            const height = options.height || size * 1.5;
            
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2 * turns;
                const y = centerY + ((i / count) - 0.5) * height;
                
                // Alternating points on the two helices
                if (i % 2 === 0) {
                    points.push({
                        x: centerX + Math.cos(angle) * radius,
                        y: y
                    });
                } else {
                    points.push({
                        x: centerX + Math.cos(angle + Math.PI) * radius,
                        y: y
                    });
                }
            }
        }
        else {
            // Default: just place in a circle if shape isn't recognized
            for (let i = 0; i < count; i++) {
                const angle = (i / count) * Math.PI * 2;
                points.push({
                    x: centerX + Math.cos(angle) * size,
                    y: centerY + Math.sin(angle) * size
                });
            }
        }
    } catch (e) {
        console.error("Error generating shape:", e);
        // Fallback: simple circle
        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            points.push({
                x: centerX + Math.cos(angle) * size * 0.8,
                y: centerY + Math.sin(angle) * size * 0.8
            });
        }
    }
    
    return points;
}

// Get shape points with caching
function getCachedShapePoints(name, count, centerX, centerY, size, options = {}) {
    const cacheKey = `${name}_${count}_${centerX}_${centerY}_${size}_${JSON.stringify(options)}`;
    
    if (!shapeCache[cacheKey]) {
        shapeCache[cacheKey] = getShapePoints(name, count, centerX, centerY, size, options);
    }
    
    return shapeCache[cacheKey];
}

// Shape Library Documentation
const ShapeLibrary = {
    /* Available shapes for use in phases:
    
    1. "circle" - Evenly distributed points in a circle
       Parameters: centerX, centerY, radius
       
    2. "spiral" - Points forming a spiral pattern from center outward
       Parameters: centerX, centerY, radius, turns (optional)
       
    3. "grid" - Points arranged in a regular grid pattern
       Parameters: centerX, centerY, width, height, rows, cols
       
    4. "star" - Points arranged in a star pattern with inner and outer points
       Parameters: centerX, centerY, outerRadius, innerRadius, points
       
    5. "wave" - Points forming a sine wave pattern horizontally
       Parameters: centerX, centerY, width, amplitude, frequency
       
    6. "doubleHelix" - Points arranged in a double helix pattern
       Parameters: centerX, centerY, radius, height, turns
    */
    
    // Add custom shapes here as needed
};