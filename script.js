// Video configuration
const scenes = [
    { id: 'scene1', duration: 5000 },  // Meet Riya
    { id: 'scene2', duration: 4000 },  // TaskNest Steps In
    { id: 'scene3', duration: 5000 },  // Features
    { id: 'scene4', duration: 6000 },  // AI Intelligence
    { id: 'scene5', duration: 5000 },  // No More Juggling
    { id: 'scene6', duration: 5000 },  // Benefits
    { id: 'scene7', duration: 5000 }   // CTA
];

let currentSceneIndex = 0;
let isPlaying = true;
let sceneTimer = null;
let startTime = null;
let pausedTime = 0;
let totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);

// Initialize video
function init() {
    showScene(0);
    startTime = Date.now();
    playScene();
    updateProgress();
}

// Show specific scene
function showScene(index) {
    // Hide all scenes
    document.querySelectorAll('.scene').forEach(scene => {
        scene.classList.remove('active');
    });
    
    // Show current scene
    if (index < scenes.length) {
        const sceneElement = document.getElementById(scenes[index].id);
        if (sceneElement) {
            sceneElement.classList.add('active');
        }
        currentSceneIndex = index;
    }
}

// Play current scene
function playScene() {
    if (!isPlaying) return;
    
    if (currentSceneIndex < scenes.length) {
        const currentScene = scenes[currentSceneIndex];
        
        sceneTimer = setTimeout(() => {
            currentSceneIndex++;
            if (currentSceneIndex < scenes.length) {
                showScene(currentSceneIndex);
                playScene();
            } else {
                // Video ended
                isPlaying = false;
                document.getElementById('playPauseBtn').textContent = '▶ Play';
            }
        }, currentScene.duration);
    }
}

// Toggle play/pause
function togglePlayPause() {
    isPlaying = !isPlaying;
    const btn = document.getElementById('playPauseBtn');
    
    if (isPlaying) {
        btn.textContent = '⏸ Pause';
        if (currentSceneIndex >= scenes.length) {
            // Restart if ended
            restartVideo();
        } else {
            playScene();
        }
    } else {
        btn.textContent = '▶ Play';
        if (sceneTimer) {
            clearTimeout(sceneTimer);
            sceneTimer = null;
        }
    }
}

// Restart video
function restartVideo() {
    if (sceneTimer) {
        clearTimeout(sceneTimer);
        sceneTimer = null;
    }
    
    currentSceneIndex = 0;
    isPlaying = true;
    startTime = Date.now();
    pausedTime = 0;
    
    document.getElementById('playPauseBtn').textContent = '⏸ Pause';
    showScene(0);
    playScene();
}

// Update progress bar
function updateProgress() {
    setInterval(() => {
        if (isPlaying && currentSceneIndex < scenes.length) {
            // Calculate elapsed time
            let elapsed = 0;
            for (let i = 0; i < currentSceneIndex; i++) {
                elapsed += scenes[i].duration;
            }
            
            // Add current scene progress
            const currentSceneStart = Date.now() - (Date.now() - startTime - elapsed);
            const currentSceneElapsed = Math.min(
                Date.now() - startTime - elapsed,
                scenes[currentSceneIndex].duration
            );
            elapsed += currentSceneElapsed;
            
            // Update progress bar
            const progress = (elapsed / totalDuration) * 100;
            document.getElementById('progressFill').style.width = progress + '%';
            
            // Update time display
            const currentTime = Math.floor(elapsed / 1000);
            const totalTime = Math.floor(totalDuration / 1000);
            document.getElementById('timeDisplay').textContent = 
                formatTime(currentTime) + ' / ' + formatTime(totalTime);
        }
    }, 100);
}

// Format time as MM:SS
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins + ':' + (secs < 10 ? '0' : '') + secs;
}

// Start video on page load
window.addEventListener('load', init);
