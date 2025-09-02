// JavaScript for interactivity
const select = document.getElementById('playlist-select');
const selectedSongDisplay = document.getElementById('selected-song');
const songImage = document.getElementById('song-image');
const audioPlayer = document.getElementById('audio-player');
const firefliesContainer = document.getElementById('fireflies-container');

// Playlist functionality
select.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const songUrl = selectedOption.value;
    const songTitle = selectedOption.getAttribute('data-title');
    const songImageUrl = selectedOption.getAttribute('data-image');

    if (songUrl) {
        // Update the displayed song title
        selectedSongDisplay.textContent = `Now Playing: ${songTitle}`;

        // Update and show the profile image
        songImage.src = songImageUrl;
        songImage.style.display = 'block';

        // Update and play the audio
        audioPlayer.src = songUrl;
        audioPlayer.load();
        audioPlayer.play();
    } else {
        // Reset if no song is selected
        selectedSongDisplay.textContent = 'No song selected';
        songImage.style.display = 'none';
    }
});

// New: Generate dynamic fireflies
function createFireflies(num) {
    for (let i = 0; i < num; i++) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');

        // Random position
        firefly.style.left = `${Math.random() * 100}vw`;
        firefly.style.top = `${Math.random() * 100}vh`;

        // Random size (5-15px)
        const size = Math.random() * 10 + 5;
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;

        // Random animation duration (5-15s)
        const duration = Math.random() * 10 + 5;
        firefly.style.animationDuration = `blink ${duration / 2}s infinite ease-in-out, move ${duration}s infinite linear alternate`;

        // Random movement distance
        const moveX = (Math.random() - 0.5) * 200; // -100 to 100px horizontal
        const moveY = (Math.random() - 0.5) * 200; // -100 to 100px vertical
        firefly.style.setProperty('--move-x', `${moveX}px`);
        firefly.style.setProperty('--move-y', `${moveY}px`);

        // Random delay for staggered start
        firefly.style.animationDelay = `${Math.random() * 5}s`;

        firefliesContainer.appendChild(firefly);
    }
}

// Create 20 fireflies on page load (adjust this number as needed)
createFireflies(20);
