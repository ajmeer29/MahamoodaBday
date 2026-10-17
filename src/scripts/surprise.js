(function () {
  var audio = document.getElementById("birthday-song");
  var musicToggle = document.getElementById("music-toggle");
  var musicLabel = document.getElementById("music-label");
  var musicStatus = document.getElementById("music-status");
  var canvas = document.getElementById("fireflies");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function updateMusicControl(isPlaying) {
    musicToggle.setAttribute("aria-pressed", String(isPlaying));
    musicLabel.textContent = isPlaying ? "Pause birthday song" : "Play birthday song";
    musicStatus.textContent = isPlaying ? "Birthday song is playing." : "";
  }

  musicToggle.addEventListener("click", function () {
    if (!audio.paused) {
      audio.pause();
      updateMusicControl(false);
      return;
    }

    musicStatus.textContent = "";
    audio.play().then(function () {
      updateMusicControl(true);
    }).catch(function () {
      musicStatus.textContent = "The birthday song couldn't be played. Please try again.";
    });
  });

  audio.addEventListener("pause", function () {
    updateMusicControl(false);
  });

  audio.addEventListener("ended", function () {
    updateMusicControl(false);
  });

  function startFireflies() {
    if (reducedMotion.matches || !canvas.getContext) {
      return;
    }

    var context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    var width = 0;
    var height = 0;
    var particles = [];
    var frame = null;
    var lastFrame = 0;

    function resizeCanvas() {
      var ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      var count = Math.min(90, Math.max(24, Math.round((width * height) / 18000)));
      particles = Array.from({ length: count }, function () {
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          radius: 1 + Math.random() * 1.5,
          speed: 4 + Math.random() * 10,
          phase: Math.random() * Math.PI * 2,
          color: ["#ffe7a4", "#f6c8ce", "#c9e6cf"][Math.floor(Math.random() * 3)]
        };
      });
    }

    function draw(timestamp) {
      var delta = lastFrame ? Math.min((timestamp - lastFrame) / 1000, 0.04) : 0;
      lastFrame = timestamp;
      context.clearRect(0, 0, width, height);

      particles.forEach(function (particle) {
        particle.y -= particle.speed * delta;
        particle.phase += delta * 1.7;
        if (particle.y < -4) {
          particle.y = height + 4;
          particle.x = Math.random() * width;
        }

        context.globalAlpha = 0.25 + (Math.sin(particle.phase) + 1) * 0.24;
        context.fillStyle = particle.color;
        context.shadowColor = particle.color;
        context.shadowBlur = 14;
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      context.globalAlpha = 1;
      context.shadowBlur = 0;
      frame = window.requestAnimationFrame(draw);
    }

    function stop() {
      if (frame !== null) {
        window.cancelAnimationFrame(frame);
        frame = null;
      }
    }

    function syncAnimation() {
      if (document.hidden || reducedMotion.matches) {
        stop();
        return;
      }
      if (frame === null) {
        lastFrame = 0;
        frame = window.requestAnimationFrame(draw);
      }
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", syncAnimation);
    reducedMotion.addEventListener("change", syncAnimation);
    syncAnimation();
  }

  startFireflies();
}());
