document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const songImage = document.getElementById('song-image');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const playlistItems = document.querySelectorAll('.message-playlist__item');

    playlistItems.forEach(item => {
        item.addEventListener('click', function() {
            // Get data from the clicked item
            const src = this.getAttribute('data-src');
            const image = this.getAttribute('data-image');
            const title = this.getAttribute('data-title');
            const artist = this.getAttribute('data-artist');

            // Update the player
            audioPlayer.src = src;
            songImage.src = image;
            songTitle.textContent = title;
            songArtist.textContent = artist;

            // Play the new track
            audioPlayer.play();

            // Update active class
            document.querySelector('.message-playlist__item.is-playing').classList.remove('is-playing');
            this.classList.add('is-playing');
        });
    });
});