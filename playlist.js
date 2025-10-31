document.addEventListener('DOMContentLoaded', function() {
    const audioPlayer = document.getElementById('audio-player');
    const songImage = document.getElementById('song-image');
    const artworkContainer = document.querySelector('.audio-player__artwork');
    const songTitle = document.getElementById('song-title');
    const songArtist = document.getElementById('song-artist');
    const playPauseIcon = document.getElementById('play-pause-icon');
    const progressContainer = document.querySelector('.audio-player__progress-container');
    const progressBar = document.querySelector('.audio-player__progress');
    const currentTimeEl = document.getElementById('current-time');
    const totalDurationEl = document.getElementById('total-duration');
    const volumeControlContainer = document.getElementById('volume-control');
    const playlistItems = document.querySelectorAll('.message-playlist__item');
    const prevTrackBtn = document.getElementById('prev-track');
    const nextTrackBtn = document.getElementById('next-track');
    let volumeIcon, volumeSlider;

    function playTrack(item) {
        // Get data from the item
        const src = item.getAttribute('data-src');
        const image = item.getAttribute('data-image');
        const title = item.getAttribute('data-title');
        const artist = item.getAttribute('data-artist');

        // Update the player
        audioPlayer.src = src;
        songImage.src = image;
        songTitle.textContent = title;
        songArtist.textContent = artist;

        // Play the new track
        audioPlayer.play();

        // Update active class
        const currentPlaying = document.querySelector('.message-playlist__item.is-playing');
        if (currentPlaying) {
            currentPlaying.classList.remove('is-playing');
        }
        item.classList.add('is-playing');
    }

    playlistItems.forEach(item => {
        item.addEventListener('click', function() {
            playTrack(this);
        });
    });

    function playNextTrack() {
        const currentPlaying = document.querySelector('.message-playlist__item.is-playing');
        let nextItem = currentPlaying.nextElementSibling;
        if (!nextItem) {
            // If it's the last song, loop back to the first
            nextItem = playlistItems[0];
        }
        playTrack(nextItem);
    }

    function playPrevTrack() {
        const currentPlaying = document.querySelector('.message-playlist__item.is-playing');
        let prevItem = currentPlaying.previousElementSibling;
        if (!prevItem) {
            // If it's the first song, loop to the last
            prevItem = playlistItems[playlistItems.length - 1];
        }
        playTrack(prevItem);
    }

    // Autoplay next song
    audioPlayer.addEventListener('ended', function() {
        playNextTrack();
    });

    // Update play/pause icon
    audioPlayer.addEventListener('play', () => {
        playPauseIcon.classList.remove('play');
        playPauseIcon.classList.add('pause');
    });

    audioPlayer.addEventListener('pause', () => {
        playPauseIcon.classList.remove('pause');
        playPauseIcon.classList.add('play');
    });

    // Toggle play/pause on artwork click
    artworkContainer.addEventListener('click', () => {
        if (audioPlayer.paused) {
            audioPlayer.play();
        } else {
            audioPlayer.pause();
        }
    });

    // Previous and Next track button listeners
    prevTrackBtn.addEventListener('click', playPrevTrack);
    nextTrackBtn.addEventListener('click', playNextTrack);

    // Format time helper
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // Update progress bar and time
    audioPlayer.addEventListener('timeupdate', () => {
        const { currentTime, duration } = audioPlayer;
        const progressPercent = (currentTime / duration) * 100;
        progressBar.style.width = `${progressPercent}%`;

        currentTimeEl.textContent = formatTime(currentTime);
    });

    // Update total duration when metadata loads
    audioPlayer.addEventListener('loadedmetadata', () => {
        totalDurationEl.textContent = formatTime(audioPlayer.duration);
    });

    // Seek on progress bar click
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audioPlayer.duration;

        audioPlayer.currentTime = (clickX / width) * duration;
    });

    // Create and manage volume controls
    function createVolumeControls() {
        volumeControlContainer.innerHTML = `
            <i id="volume-icon" class="icon-volume-up"></i>
            <input type="range" id="volume-slider" class="volume-slider" min="0" max="1" step="0.01" value="1">
        `;
        volumeIcon = document.getElementById('volume-icon');
        volumeSlider = document.getElementById('volume-slider');

        // Volume slider functionality
        volumeSlider.addEventListener('input', (e) => {
            audioPlayer.volume = e.target.value;
            audioPlayer.muted = e.target.value == 0;
        });

        // Mute/unmute on icon click
        volumeIcon.addEventListener('click', () => {
            audioPlayer.muted = !audioPlayer.muted;
        });

        // Update icon based on volume/muted state
        audioPlayer.addEventListener('volumechange', () => {
            if (audioPlayer.muted || audioPlayer.volume === 0) {
                volumeIcon.classList.remove('icon-volume-up');
                volumeIcon.classList.add('icon-volume-off');
                if (volumeSlider) volumeSlider.value = 0;
            } else {
                volumeIcon.classList.remove('icon-volume-off');
                volumeIcon.classList.add('icon-volume-up');
                if (volumeSlider) volumeSlider.value = audioPlayer.volume;
            }
        });
    }

    createVolumeControls();
});