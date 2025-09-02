// JavaScript for interactivity
const select = document.getElementById('playlist-select');
const selectedSongDisplay = document.getElementById('selected-song');
const songImage = document.getElementById('song-image'); // New reference to the image element
const audioPlayer = document.getElementById('audio-player');

select.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const songUrl = selectedOption.value;
    const songTitle = selectedOption.getAttribute('data-title');
    const songImageUrl = selectedOption.getAttribute('data-image'); // New: Get the image URL

    if (songUrl) {
        // Update the displayed song title
        selectedSongDisplay.textContent = `Now Playing: ${songTitle}`;

        // Update and show the profile image
        songImage.src = songImageUrl;
        songImage.style.display = 'block'; // Show the image

        // Update and play the audio
        audioPlayer.src = songUrl;
        audioPlayer.load(); // Reload the audio element with new source
        audioPlayer.play(); // Auto-play the selected song
    } else {
        // Reset if no song is selected
        selectedSongDisplay.textContent = 'No song selected';
        songImage.style.display = 'none'; // Hide the image
    }
});
