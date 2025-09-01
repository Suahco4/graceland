// Provide your own tracks here (title, artist, src, cover)
const tracks = [
  {
    title: "SoundHelix Song 1",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://picsum.photos/seed/helix1/300/300"
  },
  {
    title: "SoundHelix Song 2",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://picsum.photos/seed/helix2/300/300"
  },
  {
    title: "SoundHelix Song 3",
    artist: "SoundHelix",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://picsum.photos/seed/helix3/300/300"
  }
];

// DOM
const audio = document.getElementById("audio");
const cover = document.getElementById("cover");
const titleEl = document.getElementById("title");
const artistEl = document.getElementById("artist");
const nowPlayingEl = document.getElementById("nowPlaying");

const btnPlay = document.getElementById("btnPlay");
const iconPlay = document.getElementById("iconPlay");
const btnPrev = document.getElementById("btnPrev");
const btnNext = document.getElementById("btnNext");
const btnShuffle = document.getElementById("btnShuffle");
const btnRepeat = document.getElementById("btnRepeat");
const iconRepeat = document.getElementById("iconRepeat");

const seek = document.getElementById("seek");
const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const btnMute = document.getElementById("btnMute");
const iconMute = document.getElementById("iconMute");
const vol = document.getElementById("volume");

const playlistEl = document.getElementById("playlist");

// State
let currentIndex = 0;
let isSeeking = false;
let isShuffle = false;         // false | true
let repeatMode = "off";        // "off" | "all" | "one"

// Build playlist UI
function buildPlaylist(){
  playlistEl.innerHTML = "";
  tracks.forEach((t, i) => {
    const li = document.createElement("li");
    li.dataset.index = i;

    const btn = document.createElement("button");
    btn.className = "track";
    btn.setAttribute("aria-label", `Play ${t.title} by ${t.artist}`);

    btn.innerHTML = `
      <span class="index">${String(i+1).padStart(2,"0")}</span>
      <div class="row grow">
        <div class="t-title">${t.title}</div>
        <div class="t-artist">${t.artist}</div>
      </div>
      <span class="badge">Play</span>
    `;
    btn.addEventListener("click", () => loadTrack(i, true));
    li.appendChild(btn);
    playlistEl.appendChild(li);
  });
  highlightActive();
}

function highlightActive(){
  [...playlistEl.children].forEach((li, i) => {
    li.classList.toggle("active", i === currentIndex);
  });
}

function loadTrack(index, autoplay=false){
  currentIndex = index;
  const t = tracks[currentIndex];
  audio.src = t.src;
  cover.src = t.cover;
  cover.alt = `${t.title} cover art`;
  titleEl.textContent = t.title;
  artistEl.textContent = t.artist;
  nowPlayingEl.textContent = `${currentIndex+1} of ${tracks.length}`;

  // Reset UI
  seek.value = 0;
  currentTimeEl.textContent = "0:00";
  durationEl.textContent = "0:00";

  highlightActive();

  if (autoplay) {
    audio.play().catch(()=>{ /* ignore autoplay block */ });
  }
}

function togglePlay(){
  if (audio.paused) {
    audio.play();
  } else {
    audio.pause();
  }
}

function nextTrack(autoPlay = true){
  if (isShuffle) {
    let next = currentIndex;
    if (tracks.length > 1) {
      while (next === currentIndex) next = Math.floor(Math.random() * tracks.length);
    }
    loadTrack(next, autoPlay);
    return;
  }

  if (currentIndex < tracks.length - 1) {
    loadTrack(currentIndex + 1, autoPlay);
  } else if (repeatMode === "all") {
    loadTrack(0, autoPlay);
  } else {
    audio.pause();
    audio.currentTime = 0;
    iconPlay.textContent = "▶️";
  }
}

function prevTrack(autoPlay = true){
  if (audio.currentTime > 3) {
    audio.currentTime = 0;
    return;
  }
  if (currentIndex > 0) {
    loadTrack(currentIndex - 1, autoPlay);
  } else if (repeatMode === "all") {
    loadTrack(tracks.length - 1, autoPlay);
  } else {
    audio.currentTime = 0;
  }
}

function formatTime(sec){
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return m + ":" + String(s).padStart(2, "0");
}

// Events
btnPlay.addEventListener("click", togglePlay);
btnPrev.addEventListener("click", () => prevTrack(true));
btnNext.addEventListener("click", () => nextTrack(true));

btnShuffle.addEventListener("click", () => {
  isShuffle = !isShuffle;
  btnShuffle.setAttribute("aria-pressed", String(isShuffle));
});

btnRepeat.addEventListener("click", () => {
  // off -> all -> one -> off
  repeatMode = repeatMode === "off" ? "all" : repeatMode === "all" ? "one" : "off";
  btnRepeat.setAttribute("aria-pressed", repeatMode !== "off");
  iconRepeat.textContent = repeatMode === "one" ? "🔂" : "🔁";
  btnRepeat.title = repeatMode === "off" ? "Repeat off" : repeatMode === "one" ? "Repeat one" : "Repeat all";
});

seek.addEventListener("input", () => {
  isSeeking = true;
  const pct = Number(seek.value) / 100;
  currentTimeEl.textContent = formatTime(audio.duration * pct);
});
seek.addEventListener("change", () => {
  const pct = Number(seek.value) / 100;
  if (isFinite(audio.duration)) audio.currentTime = audio.duration * pct;
  isSeeking = false;
});

vol.addEventListener("input", () => {
  audio.volume = Number(vol.value);
  audio.muted = audio.volume === 0;
  iconMute.textContent = audio.muted ? "🔇" : "🔊";
});

btnMute.addEventListener("click", () => {
  audio.muted = !audio.muted;
  iconMute.textContent = audio.muted ? "🔇" : "🔊";
});

audio.addEventListener("play", () => {
  iconPlay.textContent = "⏸️";
  btnPlay.title = "Pause";
});
audio.addEventListener("pause", () => {
  iconPlay.textContent = "▶️";
  btnPlay.title = "Play";
});
audio.addEventListener("loadedmetadata", () => {
  durationEl.textContent = formatTime(audio.duration);
});
audio.addEventListener("timeupdate", () => {
  if (!isSeeking && isFinite(audio.duration)) {
    const pct = (audio.currentTime / audio.duration) * 100;
    seek.value = pct;
    currentTimeEl.textContent = formatTime(audio.currentTime);
    durationEl.textContent = formatTime(audio.duration);
  }
});
audio.addEventListener("ended", () => {
  if (repeatMode === "one") {
    audio.currentTime = 0;
    audio.play();
  } else {
    nextTrack(true);
  }
});

// Keyboard shortcuts
document.addEventListener("keydown", (e) => {
  if (e.code === "Space") {
    e.preventDefault();
    togglePlay();
  } else if (e.code === "ArrowRight" && e.shiftKey) {
    nextTrack(true);
  } else if (e.code === "ArrowLeft" && e.shiftKey) {
    prevTrack(true);
  }
});

// Init
buildPlaylist();
loadTrack(0, false);
