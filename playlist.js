// JavaScript for interactivity
const select = document.getElementById('playlist-select');
const selectedSongDisplay = document.getElementById('selected-song');
const audioPlayer = document.getElementById('audio-player');

select.addEventListener('change', function() {
    const selectedOption = this.options[this.selectedIndex];
    const songUrl = selectedOption.value;
    const songTitle = selectedOption.getAttribute('data-title');

    if (songUrl) {
        // Update the displayed song title
        selectedSongDisplay.textContent = `Now Playing: ${songTitle}`;

        // Update and play the audio
        audioPlayer.src = songUrl;
        audioPlayer.load(); // Reload the audio element with new source
        audioPlayer.play(); // Auto-play the selected song
    }
});
