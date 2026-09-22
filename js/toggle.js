// toggle.js

const lightToDarkMap = {
    'index.html': 'blacklight.html',
    'skills.html': 'sports.html',
    'projects.html': 'cooking.html',
    'resume.html': 'photography.html',
    'finance.html': 'blog.html',
    'contact.html': 'contact.html'
};

const darkToLightMap = {
    'blacklight.html': 'index.html',
    'sports.html': 'skills.html',
    'cooking.html': 'projects.html',
    'photography.html': 'resume.html',
    'blog.html': 'finance.html',
    'doodles.html': 'index.html',
    'contact.html': 'contact.html'
};

document.addEventListener('DOMContentLoaded', () => {
    const avatarContainer = document.getElementById('avatar-container');
    if (!avatarContainer) return;

    // Determine current side
    const isDark = document.body.classList.contains('dark-side');
    
    // Set SVG as an img tag
    const svgPath = isDark ? 'assets/avatar_dark.svg' : 'assets/avatar_light.svg';
    avatarContainer.innerHTML = `<img src="${svgPath}" alt="Avatar Toggle" style="width: 100%; height: 100%; object-fit: contain; pointer-events: none; transition: transform 0.1s ease-out;" id="avatar-img">`;

    // Eye-tracking and head-tilt (Parallax effect)
    document.addEventListener('mousemove', (e) => {
        const rect = avatarContainer.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = e.clientX - centerX;
        const deltaY = e.clientY - centerY;
        
        // Calculate tilt angles based on distance from center
        const maxTilt = 20; // Maximum rotation in degrees
        const tiltX = Math.max(Math.min(-(deltaY / window.innerHeight) * maxTilt * 2, maxTilt), -maxTilt);
        const tiltY = Math.max(Math.min((deltaX / window.innerWidth) * maxTilt * 2, maxTilt), -maxTilt);
        
        const img = document.getElementById('avatar-img');
        if (img) {
            img.style.transform = `perspective(500px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.1)`;
        }
    });

    // Reset tilt on mouse leave window
    document.addEventListener('mouseleave', () => {
        const img = document.getElementById('avatar-img');
        if (img) {
            img.style.transform = `perspective(500px) rotateX(0deg) rotateY(0deg) scale(1)`;
        }
    });

    avatarContainer.addEventListener('click', () => {
        let currentPath = window.location.pathname.split('/').pop();
        if (!currentPath) currentPath = 'index.html'; // Default

        let targetUrl = 'index.html';
        
        if (isDark) {
            targetUrl = darkToLightMap[currentPath] || 'index.html';
        } else {
            targetUrl = lightToDarkMap[currentPath] || 'blacklight.html';
        }

        // Trigger Hyperspace
        if (window.hyperspaceJump) {
            window.hyperspaceJump(targetUrl);
        } else {
            window.location.href = targetUrl;
        }
    });
});
