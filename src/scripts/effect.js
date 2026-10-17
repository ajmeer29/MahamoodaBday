(function () {
  var birthdaySong = document.getElementById("birthday-song");
  var partySong = document.getElementById("party-song");
  var musicButton = document.getElementById("play");
  var musicStatus = document.getElementById("music-status");
  var balloons = Array.prototype.slice.call(document.querySelectorAll(".balloons"));
  var balloonBorder = document.querySelector(".balloon-border");
  var cake = document.getElementById("cake_pink");
  var banner = document.getElementById("banner");
  var card = document.getElementById("card");
  var currentSong = birthdaySong;
  var currentSongName = "birthday";
  var startedBirthdayMusic = false;
  var playbackAttempt = 0;
  var colors = ["yellow", "red", "blue", "green", "pink", "orange"];

  function byId(id) {
    return document.getElementById(id);
  }

  function setCelebrationStep(step, message) {
    byId("celebration-step").textContent = message;
    byId("progress-fill").style.width = ((step / 9) * 100) + "%";
  }

  function schedule(callback, delay) {
    window.setTimeout(callback, delay);
  }

  function show(element) {
    element.disabled = false;
    element.style.display = "block";
    element.classList.remove("is-hiding");
    window.requestAnimationFrame(function () {
      element.classList.add("is-visible");
    });
  }

  function hide(element) {
    element.disabled = true;
    element.classList.remove("is-visible");
    element.classList.add("is-hiding");
    window.setTimeout(function () {
      element.style.display = "none";
      element.classList.remove("is-hiding");
    }, 300);
  }

  function addLightEffect(suffix) {
    colors.forEach(function (color) {
      byId("bulb_" + color).classList.add("bulb-glow-" + color + suffix);
    });
  }

  function updateMusicControl(isPlaying) {
    musicButton.setAttribute("aria-pressed", String(isPlaying));
    musicButton.textContent = isPlaying
      ? "Pause " + (currentSongName === "party" ? "party music" : "birthday music")
      : (currentSongName === "party" ? "Play party music" : "Play birthday music");
  }

  function reportMusicError() {
    musicStatus.textContent = "Music couldn't be played. Please check the audio file and try again.";
    updateMusicControl(false);
  }

  function startSong(song, name) {
    playbackAttempt += 1;
    var attempt = playbackAttempt;
    birthdaySong.pause();
    partySong.pause();
    currentSong = song;
    currentSongName = name;
    musicStatus.textContent = "";
    updateMusicControl(false);

    var playback;
    try {
      playback = song.play();
    } catch (error) {
      reportMusicError();
      return;
    }

    if (playback && typeof playback.catch === "function") {
      playback.catch(function () {
        if (attempt === playbackAttempt && song === currentSong) {
          reportMusicError();
        }
      });
    }
  }

  [birthdaySong, partySong].forEach(function (song) {
    song.addEventListener("play", function () {
      if (song === currentSong) {
        musicStatus.textContent = "";
        updateMusicControl(true);
      }
    });
    song.addEventListener("pause", function () {
      if (song === currentSong) {
        updateMusicControl(false);
      }
    });
    song.addEventListener("error", function () {
      if (song === currentSong && musicButton.getAttribute("aria-pressed") === "true") {
        reportMusicError();
      }
    });
  });

  musicButton.addEventListener("click", function () {
    if (!currentSong.paused) {
      playbackAttempt += 1;
      currentSong.pause();
      return;
    }

    startSong(currentSong, currentSongName);
    if (!startedBirthdayMusic) {
      startedBirthdayMusic = true;
      setCelebrationStep(3, "A little music makes it feel like a party.");
      addLightEffect("-after");
      document.body.classList.add("peach-after");
      schedule(function () {
        show(byId("bannar_coming"));
      }, 5000);
    }
  });

  byId("initial").addEventListener("click", function () {
    setCelebrationStep(1, "Let's get the celebration started.");
    hide(this);
    schedule(function () {
      show(byId("turn_on"));
    }, 50);
  });

  byId("turn_on").addEventListener("click", function () {
    setCelebrationStep(2, "Let there be light.");
    addLightEffect("");
    document.body.classList.add("peach");
    var dance = byId("welcome_dance");
    dance.classList.add("is-fading");
    window.setTimeout(function () {
      dance.remove();
    }, 400);
    byId("welcome-title").closest(".welcome-copy").classList.add("is-fading");
    hide(this);
    schedule(function () {
      show(musicButton);
    }, 5000);
  });

  byId("bannar_coming").addEventListener("click", function () {
    setCelebrationStep(4, "Making the room a little more festive.");
    banner.style.display = "block";
    banner.classList.add("center", "bannar-come");
    hide(this);
    schedule(function () {
      show(byId("balloons_flying"));
    }, 5000);
  });

  function startBalloons() {
    if (balloonBorder) {
      balloonBorder.classList.add("is-rising");
    }

    balloons.forEach(function (balloon, index) {
      var horizontalPosition = 7 + Math.random() * 86;
      balloon.style.left = horizontalPosition + "%";
      balloon.style.setProperty("--balloon-duration", (10 + Math.random() * 4) + "s");
      balloon.style.setProperty("--balloon-delay", (index * 0.28) + "s");
      balloon.style.setProperty("--balloon-drift-mid", (Math.round((Math.random() - 0.5) * 90)) + "px");
      balloon.style.setProperty("--balloon-drift-end", (Math.round((Math.random() - 0.5) * 120)) + "px");
      balloon.style.setProperty("--balloon-still-top", (6 + Math.random() * 18) + "vh");
      balloon.classList.add("is-flying");
    });
  }

  byId("balloons_flying").addEventListener("click", function () {
    setCelebrationStep(5, "Sending birthday wishes up with the balloons.");
    startBalloons();
    hide(this);
    schedule(function () {
      show(byId("cake_fadein"));
    }, 5000);
  });

  byId("cake_fadein").addEventListener("click", function () {
    setCelebrationStep(6, "Time for something sweet.");
    cake.style.display = "block";
    window.requestAnimationFrame(function () {
      cake.classList.add("is-revealed");
    });
    hide(this);
    schedule(function () {
      show(byId("dj_time"));
    }, 3000);
  });

  function gatherBalloonsForParty() {
    var positions = [8, 22, 36, 50, 64, 78, 92];
    balloons.forEach(function (balloon, index) {
      balloon.classList.remove("is-flying");
      balloon.style.left = positions[index] + "%";
      balloon.classList.add("is-party-banner");
    });
  }

  byId("dj_time").addEventListener("click", function () {
    setCelebrationStep(7, "Let's celebrate!");
    startSong(partySong, "party");
    document.body.classList.add("peach-disco");
    addLightEffect("-disco");
    gatherBalloonsForParty();
    hide(this);
    schedule(function () {
      show(byId("story"));
    }, 3000);
  });

  byId("story").addEventListener("click", function () {
    setCelebrationStep(8, "A birthday message, just for you.");
    hide(this);
    card.style.display = "block";
    card.style.position = "fixed";
    card.style.zIndex = "10060";
    card.setAttribute("aria-hidden", "false");
    byId("open").focus();
    schedule(function () {
      show(byId("picture_time"));
    }, 3000);
  });

  byId("picture_time").addEventListener("click", function () {
    setCelebrationStep(9, "A few special moments to finish.");
    window.location.assign("src/html/surprise.html");
  });

  window.addEventListener("load", function () {
    var loading = document.querySelector(".loading");
    loading.classList.add("is-hidden");
  });

}());
