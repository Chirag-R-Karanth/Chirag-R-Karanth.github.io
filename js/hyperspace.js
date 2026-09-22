// hyperspace.js

window.hyperspaceJump = function(targetUrl) {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.id = 'hyperspace-canvas';
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Fade in canvas
    setTimeout(() => {
        canvas.style.opacity = '1';
        canvas.style.backgroundColor = '#000';
    }, 10);

    const stars = [];
    const numStars = 400;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width - centerX,
            y: Math.random() * canvas.height - centerY,
            z: Math.random() * canvas.width,
            pz: Math.random() * canvas.width
        });
    }

    let animationId;
    let speed = 2;
    let warp = false;
    let startTime = performance.now();
    const duration = 1000; // 1 second

    function animate(time) {
        // Create trailing effect by drawing semi-transparent black
        ctx.fillStyle = warp ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const elapsed = time - startTime;

        if (elapsed > 400) {
            warp = true;
            speed += 1.5;
        }

        if (elapsed > duration) {
            cancelAnimationFrame(animationId);
            window.location.href = targetUrl;
            return;
        }

        for (let i = 0; i < numStars; i++) {
            let star = stars[i];
            
            star.z -= speed;
            if (star.z <= 0) {
                star.z = canvas.width;
                star.x = Math.random() * canvas.width - centerX;
                star.y = Math.random() * canvas.height - centerY;
                star.pz = canvas.width; // Reset pz to prevent drawing lines across the screen when wrapping
            }

            const sx = star.x / star.z * canvas.width + centerX;
            const sy = star.y / star.z * canvas.height + centerY;

            const px = star.x / star.pz * canvas.width + centerX;
            const py = star.y / star.pz * canvas.height + centerY;

            star.pz = star.z;

            // Draw streak
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            
            // Add gradient/glow based on warp speed
            ctx.lineWidth = warp ? 4 : 2;
            ctx.lineCap = "round";
            
            const intensity = Math.min(255, 255 - (star.z / canvas.width) * 255);
            // Alternate colors slightly for visual richness (blueish to whitish)
            const r = i % 3 === 0 ? 255 : intensity;
            const g = i % 2 === 0 ? 255 : intensity;
            
            ctx.strokeStyle = `rgba(${r}, ${g}, 255, ${intensity / 255})`;
            ctx.stroke();
        }
        
        // Final flash effect right before transition
        if (elapsed > duration - 200) {
            const flashAlpha = Math.min(1, (elapsed - (duration - 200)) / 200);
            ctx.fillStyle = `rgba(255, 255, 255, ${flashAlpha})`;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        animationId = requestAnimationFrame(animate);
    }

    animationId = requestAnimationFrame(animate);
};
