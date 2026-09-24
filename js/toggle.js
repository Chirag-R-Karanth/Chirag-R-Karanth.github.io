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
    avatarContainer.innerHTML = `<img src="${svgPath}" alt="Avatar Toggle" style="width: 100%; height: 100%; object-fit: contain;">`;

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
