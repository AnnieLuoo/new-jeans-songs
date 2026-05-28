// Robust player script: initialize after DOM is ready
function initPlayer() {
  const tracks = [
    {src: 'assets/SpoMp3 ASAP NewJeans.mp3', label: 'ASAP', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #e2d2ff 0%, #FFD1EF 100%)'},
    {src: 'assets/SpoMp3 Bubble Gum NewJeans.mp3', label: 'Bubble Gum', cover: 're/how sweet.png', bg: 'linear-gradient(180deg, #fff1d8 0%, #ffe8f0 100%)'},
    {src: 'assets/SpoMp3 Cool With You NewJeans.mp3', label: 'Cool With You', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #dbe9ff 0%, #f7f0ff 100%)'},
    {src: 'assets/SpoMp3 Ditto NewJeans.mp3', label: 'Ditto', cover: 're/bunny red.png', bg: 'linear-gradient(180deg, #f7e5ff 0%, #ffe6f2 100%)'},
    {src: 'assets/SpoMp3 ETA NewJeans.mp3', label: 'ETA', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #BDF2FF 0%, #F2BDFF 100%)'},
    {src: 'assets/SpoMp3 Get Up NewJeans.mp3', label: 'Get Up', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #FCB1E9 0%, #FFD4EA 100%)'},
    {src: 'assets/SpoMp3 Hype Boy NewJeans.mp3', label: 'Hype Boy', cover: 're/bunny blue.png', bg: 'linear-gradient(180deg, #68A1ED 0%, #96BEF3 100%)'},
    {src: 'assets/SpoMp3 New Jeans NewJeans.mp3', label: 'New Jeans', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #f0d9ff 0%, #fff5ff 100%)'},
    {src: 'assets/SpoMp3 OMG NewJeans.mp3', label: 'OMG', cover: 're/bunny black.png', bg: 'linear-gradient(180deg, #f4edff 0%, #e7f0ff 100%)'},
    {src: 'assets/SpoMp3 Rewind Wonder Girls.mp3', label: 'Rewind', cover: 're/random.png', bg: 'linear-gradient(180deg, #ffe6ea 0%, #FFF0D2 100%)'},
    {src: 'assets/SpoMp3 Right Now NewJeans.mp3', label: 'Right Now', cover: 're/supernatural.png', bg: 'linear-gradient(180deg, #dff2ef 0%, #F0FAF8 100%)'},
    {src: 'assets/SpoMp3 Super Shy NewJeans.mp3', label: 'Super Shy', cover: 're/super shy.png', bg: 'linear-gradient(180deg, #D1E6FF 0%, #F6D1FF 100%)'},
    {src: 'assets/SpoMp3 Supernatural NewJeans.mp3', label: 'Supernatural', cover: 're/supernatural.png', bg: 'linear-gradient(180deg, #B493ED 0%, #81AAF7 100%)'},
    {src: 'assets/how sweet.mp3', label: 'How Sweet', cover: 're/how sweet.png', bg: 'linear-gradient(180deg, #FFB269 0%, #FFE18F 100%)'},
    {src: 'assets/hurt.mp3', label: 'Hurt', cover: 're/bunny green.png', bg: 'linear-gradient(180deg, #A5D9B7 0%, #CDEAD7 100%)'},
    {src: 'assets/cookie.mp3', label: 'Cookie', cover: 're/bunny blue.png', bg: 'linear-gradient(180deg, #fff3d6 0%, #fff9ec 100%)'},
    {src: 'assets/attention.mp3', label: 'Attention', cover: 're/bunny blue.png', bg: 'linear-gradient(180deg, #d6f0ff 0%, #eef8ff 100%)'},
  ];

  let currentSongIndex = null;
  const audio = document.getElementById('myAudio');
  const playBtn = document.getElementById('playBtn');
  const randomBtn = document.getElementById('randomBtn');
  const statusEl = document.getElementById('status');
  const trackName = document.getElementById('trackName');
  const trackCover = document.getElementById('trackCover');

  function chooseRandomSong() {
    return Math.floor(Math.random() * tracks.length);
  }

  function setTrack(index) {
    currentSongIndex = index;
    const track = tracks[index];
    if (!track) return;
    audio.src = encodeURI(track.src);
    if (trackCover) {
      trackCover.src = track.cover;
      trackCover.alt = track.label + ' cover';
    }
    if (statusEl) statusEl.textContent = 'Loading ' + track.label;
    if (track.bg) {
      document.body.style.background = track.bg;
    }
    try { audio.load(); } catch (e) { /* ignore */ }
    trackName.textContent = track.label;
  }

  // Attach error/debug listeners
  audio.addEventListener('error', (e) => {
    const err = audio.error;
    console.error('Audio element error', err);
    if (statusEl) statusEl.textContent = 'Audio error: code=' + (err && err.code) + ' readyState=' + audio.readyState;
  });
  audio.addEventListener('stalled', () => { if (statusEl) statusEl.textContent = 'Stalled while loading'; });
  audio.addEventListener('suspend', () => { if (statusEl) statusEl.textContent = 'Playing'; });
  audio.addEventListener('canplaythrough', () => { if (statusEl) statusEl.textContent = 'Playing'; });

  function tryPlay() {
    return audio.play().then(() => {
      if (statusEl) statusEl.textContent = 'Playing';
      return true;
    }).catch((err) => {
      console.warn('Playback blocked:', err);
      if (statusEl) statusEl.textContent = 'Playback blocked. Use http server or allow media playback.';
      return false;
    });
  }

  async function playTrack(index) {
    setTrack(index);
    const ok = await tryPlay();
    playBtn.textContent = ok ? '⏸ Pause Music' : '▶ Play';
  }

  async function randomizeSong() {
    const idx = chooseRandomSong();
    currentSongIndex = idx;
    await playTrack(idx);
  }

  async function toggleMusic() {
    if (!audio.src) {
      const idx = chooseRandomSong();
      currentSongIndex = idx;
      await playTrack(idx);
      return;
    }
    if (audio.paused) {
      const ok = await tryPlay();
      if (ok) {
        playBtn.textContent = '⏸ Pause Music';
      }
    } else {
      audio.pause();
      playBtn.textContent = '▶ Play';
    }
  }

  playBtn.addEventListener('click', toggleMusic);
  randomBtn.addEventListener('click', randomizeSong);

  // show a preview name (random) without loading the file
  const pre = chooseRandomSong();
  const preview = tracks[pre];
  if (preview) {
    trackName.textContent = preview.label;
    if (trackCover) {
      trackCover.src = preview.cover;
      trackCover.alt = preview.label + ' cover';
    }
    if (preview.bg) {
      document.body.style.background = preview.bg;
    }
  }
}

if (document.readyState === 'loading') {
  window.addEventListener('DOMContentLoaded', initPlayer);
} else {
  // DOM already ready
  initPlayer();
}
// ===== SIDEBAR & CLICKABLE COVER =====

function initSidebar() {
  const tracks = [
    'Attention', 'Hype Boy', 'Cookie', 'Hurt', 'Ditto',
    'OMG', 'Super Shy', 'New Jeans', 'Get Up', 'Cool With You',
    'ETA', 'ASAP', 'How Sweet', 'Bubble Gum', 'Supernatural', 'Right Now','Rewind'
  ];

  const sidebar      = document.getElementById('sidebar');
  const toggle       = document.getElementById('sidebarToggle');
  const overlay      = document.getElementById('sidebarOverlay');
  const list         = document.getElementById('sidebarList');
  const trackCover   = document.getElementById('trackCover');

  // Build the song list
  tracks.forEach((name, i) => {
    const item = document.createElement('div');
    item.className = 'sidebar-track';
    item.dataset.index = i;
    item.innerHTML = `<span class="sidebar-track-num">${i + 1}</span>${name}`;
    item.addEventListener('click', () => {
      // Play the selected track using the existing playTrack global
      if (typeof playTrack === 'function') {
        playTrack(i);
      }
      // Mark active
      document.querySelectorAll('.sidebar-track').forEach(el => el.classList.remove('active'));
      item.classList.add('active');
      // Close sidebar on mobile
      if (window.innerWidth < 700) closeSidebar();
    });
    list.appendChild(item);
  });

  // Sync active state when track changes via other buttons
  const audio = document.getElementById('myAudio');
  if (audio) {
    audio.addEventListener('play', () => {
      const trackName = document.getElementById('trackName')?.textContent;
      document.querySelectorAll('.sidebar-track').forEach(el => {
        el.classList.toggle('active', el.textContent.trim().replace(/^\d+/, '').trim() === trackName);
      });
    });
  }

  // Toggle open/close
  function openSidebar()  { sidebar.classList.add('open');  overlay.classList.add('visible'); }
  function closeSidebar() { sidebar.classList.remove('open'); overlay.classList.remove('visible'); }

  toggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  overlay.addEventListener('click', closeSidebar);

  // Clickable album cover → Wikipedia
  if (trackCover) {
    trackCover.addEventListener('click', () => {
      window.open('https://en.wikipedia.org/wiki/NewJeans', '_blank', 'noopener');
    });
    trackCover.title = 'Learn more about NewJeans on Wikipedia';
  }
}

// Run after DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initSidebar);
} else {
  initSidebar();
}
