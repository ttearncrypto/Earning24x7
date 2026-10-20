/**
 * F9XRAudioPlayer — Custom podcast audio player
 * Vanilla JS, no dependencies. Attaches to [data-f9xr-audio] containers.
 *
 * Usage in Liquid:
 *   <div data-f9xr-audio data-src="{{ page.audio }}" data-type="audio/mpeg"
 *        data-vtt="{{ page.audio_vtt }}" data-duration="{{ page.audio_duration }}"></div>
 *   <script defer src="/articles/assets/js/audio-player.js"></script>
 */
(function () {
  'use strict';

  function fmt(s) {
    if (!s || !isFinite(s)) return '0:00';
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ':' + (sec < 10 ? '0' : '') + sec;
  }

  function createPlayer(el) {
    var src = el.dataset.src;
    var type = el.dataset.type || 'audio/mpeg';
    var vtt = el.dataset.vtt || '';
    var dur = el.dataset.duration || '';

    // Build DOM
    el.innerHTML =
      '<div class="f9xr-ap">' +
        '<div class="f9xr-ap-header">' +
          '<span class="f9xr-ap-icon"><i class="fa-solid fa-headphones"></i></span>' +
          '<span class="f9xr-ap-label">Listen to this episode</span>' +
          (dur ? '<span class="f9xr-ap-dur"><i class="fa-regular fa-clock"></i> ' + dur + '</span>' : '') +
        '</div>' +

        '<div class="f9xr-ap-controls">' +
          '<button class="f9xr-ap-btn f9xr-ap-skip" data-skip="-15" aria-label="Skip back 15 seconds">' +
            '<i class="fa-solid fa-rotate-left"></i><span class="f9xr-ap-skip-label">15</span>' +
          '</button>' +
          '<button class="f9xr-ap-btn f9xr-ap-play" aria-label="Play">' +
            '<i class="fa-solid fa-play"></i>' +
          '</button>' +
          '<button class="f9xr-ap-btn f9xr-ap-skip" data-skip="15" aria-label="Skip forward 15 seconds">' +
            '<i class="fa-solid fa-rotate-right"></i><span class="f9xr-ap-skip-label">15</span>' +
          '</button>' +
        '</div>' +

        '<div class="f9xr-ap-row">' +
          '<span class="f9xr-ap-time f9xr-ap-current">0:00</span>' +
          '<div class="f9xr-ap-bar-wrap">' +
            '<div class="f9xr-ap-bar">' +
              '<div class="f9xr-ap-bar-fill"></div>' +
              '<div class="f9xr-ap-bar-knob"></div>' +
            '</div>' +
          '</div>' +
          '<span class="f9xr-ap-time f9xr-ap-total">' + (dur || '0:00') + '</span>' +
        '</div>' +

        '<div class="f9xr-ap-row f9xr-ap-bottom">' +
          '<button class="f9xr-ap-btn f9xr-ap-volume" aria-label="Mute">' +
            '<i class="fa-solid fa-volume-high"></i>' +
          '</button>' +
          '<div class="f9xr-ap-vol-wrap">' +
            '<div class="f9xr-ap-vol-bar">' +
              '<div class="f9xr-ap-vol-fill"></div>' +
            '</div>' +
          '</div>' +
          '<button class="f9xr-ap-btn f9xr-ap-speed" aria-label="Playback speed">1x</button>' +
        '</div>' +
      '</div>' +
      (vtt ? '<a class="f9xr-ap-vtt" href="' + vtt + '" download><i class="fa-solid fa-download"></i> Download transcript (.vtt)</a>' : '');

    // Audio element
    var audio = document.createElement('audio');
    audio.preload = 'metadata';
    audio.src = src;
    audio.innerHTML = '<source src="' + src + '" type="' + type + '">';
    el.appendChild(audio);

    // References
    var ap = el.querySelector('.f9xr-ap');
    var playBtn = el.querySelector('.f9xr-ap-play');
    var playIcon = playBtn.querySelector('i');
    var barWrap = el.querySelector('.f9xr-ap-bar-wrap');
    var bar = el.querySelector('.f9xr-ap-bar');
    var fill = el.querySelector('.f9xr-ap-bar-fill');
    var knob = el.querySelector('.f9xr-ap-bar-knob');
    var curTime = el.querySelector('.f9xr-ap-current');
    var totTime = el.querySelector('.f9xr-ap-total');
    var speedBtn = el.querySelector('.f9xr-ap-speed');
    var volBtn = el.querySelector('.f9xr-ap-volume');
    var volIcon = volBtn.querySelector('i');
    var volWrap = el.querySelector('.f9xr-ap-vol-wrap');
    var volBar = el.querySelector('.f9xr-ap-vol-bar');
    var volFill = el.querySelector('.f9xr-ap-vol-fill');
    var skipBtns = el.querySelectorAll('.f9xr-ap-skip');

    var speeds = [1, 1.25, 1.5, 2, 0.75, 0.5];
    var speedIdx = 0;
    var savedSpeed = parseFloat(localStorage.getItem('f9xr-playback-speed'));
    if (savedSpeed && speeds.indexOf(savedSpeed) !== -1) {
      speedIdx = speeds.indexOf(savedSpeed);
    }

    function applySpeed() {
      audio.playbackRate = speeds[speedIdx];
      speedBtn.textContent = speeds[speedIdx] + 'x';
      localStorage.setItem('f9xr-playback-speed', speeds[speedIdx]);
    }
    applySpeed();

    // Play / Pause
    function togglePlay() {
      if (audio.paused) { audio.play(); } else { audio.pause(); }
    }
    playBtn.addEventListener('click', togglePlay);
    audio.addEventListener('play', function () {
      playIcon.className = 'fa-solid fa-pause';
      playBtn.setAttribute('aria-label', 'Pause');
      ap.classList.add('f9xr-ap-playing');
    });
    audio.addEventListener('pause', function () {
      playIcon.className = 'fa-solid fa-play';
      playBtn.setAttribute('aria-label', 'Play');
      ap.classList.remove('f9xr-ap-playing');
    });

    // Time update
    audio.addEventListener('timeupdate', function () {
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      fill.style.width = pct + '%';
      knob.style.left = pct + '%';
      curTime.textContent = fmt(audio.currentTime);
    });
    audio.addEventListener('loadedmetadata', function () {
      totTime.textContent = fmt(audio.duration);
    });

    // Seek
    function seekFromEvent(e) {
      var rect = bar.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = pct * audio.duration;
    }
    var dragging = false;
    barWrap.addEventListener('mousedown', function (e) { dragging = true; seekFromEvent(e); });
    document.addEventListener('mousemove', function (e) { if (dragging) seekFromEvent(e); });
    document.addEventListener('mouseup', function () { dragging = false; });
    barWrap.addEventListener('touchstart', function (e) { dragging = true; seekFromEvent(e.touches[0]); }, { passive: true });
    barWrap.addEventListener('touchmove', function (e) { if (dragging) seekFromEvent(e.touches[0]); }, { passive: true });
    barWrap.addEventListener('touchend', function () { dragging = false; });

    // Skip
    skipBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + parseInt(btn.dataset.skip)));
      });
    });

    // Speed
    speedBtn.addEventListener('click', function () {
      speedIdx = (speedIdx + 1) % speeds.length;
      applySpeed();
    });

    // Volume
    var prevVol = 1;
    function setVolIcon() {
      if (audio.muted || audio.volume === 0) {
        volIcon.className = 'fa-solid fa-volume-xmark';
      } else if (audio.volume < 0.5) {
        volIcon.className = 'fa-solid fa-volume-low';
      } else {
        volIcon.className = 'fa-solid fa-volume-high';
      }
    }
    volBtn.addEventListener('click', function () {
      if (audio.muted || audio.volume === 0) {
        audio.muted = false;
        audio.volume = prevVol || 0.5;
      } else {
        prevVol = audio.volume;
        audio.muted = true;
      }
      volFill.style.width = (audio.muted ? 0 : audio.volume * 100) + '%';
      setVolIcon();
    });
    // Volume bar click
    volWrap.addEventListener('mousedown', function (e) {
      var rect = volBar.getBoundingClientRect();
      var pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.volume = pct;
      audio.muted = false;
      volFill.style.width = (pct * 100) + '%';
      setVolIcon();
    });

    // Keyboard
    el.setAttribute('tabindex', '0');
    el.addEventListener('keydown', function (e) {
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
      else if (e.code === 'ArrowLeft') { audio.currentTime = Math.max(0, audio.currentTime - 15); }
      else if (e.code === 'ArrowRight') { audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 15); }
      else if (e.code === 'ArrowUp') { audio.volume = Math.min(1, audio.volume + 0.1); audio.muted = false; volFill.style.width = (audio.volume * 100) + '%'; setVolIcon(); }
      else if (e.code === 'ArrowDown') { audio.volume = Math.max(0, audio.volume - 0.1); volFill.style.width = (audio.volume * 100) + '%'; setVolIcon(); }
    });
  }

  function init() {
    document.querySelectorAll('[data-f9xr-audio]').forEach(createPlayer);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
