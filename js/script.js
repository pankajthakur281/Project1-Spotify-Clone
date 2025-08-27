let currentSong = new Audio();
let play;
let songs;
let currFolder;
function secondsToMinutesSeconds(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${minutes.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:5500/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  //show all the songs in the playlist
  let songUL = document.querySelector(".songList ul");
  songUL.innerHTML = ""; // clear old list if any
  for (const song of songs) {
    let clean = cleanName(song);
    let title = clean;
    let artist = "Unknown";
    // Check exceptions first
    if (exceptions[clean]) {
      title = exceptions[clean].title;
      artist = exceptions[clean].artist;
    } else if (clean.includes(" - ")) {
      [artist, title] = clean.split(" - ", 2);
    }
    songUL.innerHTML += `<li data-file="${song}">
                          <img class="invert" src="img/music.svg" alt="">
                          <div class="info">
                            <div>${title}</div>
                            <div>${artist}</div>
                          </div>
                          <div class="playnow">
                           <span>Play Now</span>
                            <img class="invert" src="img/play.svg" alt="">
                          </div></li>`;
  }

  // Attach an event listner to each song
  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", () => {
      let track = e.getAttribute("data-file"); //Original filename
      let title = e.querySelector(".info div:first-child").innerText;
      let artist = e.querySelector(".info div:last-child").innerText;
      playMusic(track, title, artist, true);
    });
  });
  return songs;
}

function cleanName(raw) {
  let name = decodeURIComponent(raw)
    .replace(/\.(mp3|wav)$/i, "") // remove extension
    .replace(/[_]+/g, " ") // underscores → space
    .replace(/CeeNaija\.com|FeelMP3\.com|PagalWorld|pagalall\.com|Afusic/gi, "")
    .replace(/\(\s*\)/g, "") // remove empty ()
    .replace(/\(.*?\)/g, "") // remove ( ... )
    .replace(/\b\d+\s*Kbps\b/gi, "") // remove "320 Kbps"
    .replace(/\b\d{3}\b/g, "") // remove standalone 320, 128 etc
    .trim();

  // Special rule for Sasha Sloan track
  if (/sasha\s*sloan/i.test(name) && /dancing with your ghost/i.test(name)) {
    return "Sasha Sloan - Dancing With Your Ghost";
  }
  return name;
}

const exceptions = {
  "AP Dhillon - Thodi Si Daaru": {
    title: "Thodi Si Daaru",
    artist: "AP Dhillon",
  },
  "Guzaara Baaghi 4": { title: "Guzaara", artist: "Josh Brar" },
  "Naam Chale": { title: "Naam Chale", artist: "Vikram Sarkar" },
  "Pal Pal": { title: "Pal Pal", artist: "Afusic" },
  AZUL: { title: "AZUL", artist: "Guru Randhaba" },
  "Die With A Smile-": {
    title: "Die With A Smile",
    artist: "Lady Gaga, Bruno Mars",
  },
  "Espresso-": { title: "Espresso", artist: "Sabrina Carpenter" },
  "Past Lives-": { title: "Past Lives", artist: "Sapientdream, Slushii" },
  "Sapphire -": { title: "Sapphire", artist: "Ed Sheeran" },
  "Teya-Dora-Dzanum": { title: "Dzanum", artist: "Teya Dora" },
  "Thousand-Years": { title: "Thousand-Years", artist: "Christina Perri" },
  "5 Taara": { title: "5 Taara", artist: "Diljit Dosanjh" },
  "Bad Habits Ghost": { title: "Bad Habits", artist: "Diljit Dosanjh" },
  "Chill Mardi": { title: "Chill Mardi", artist: "Diljit Dosanjh" },
  "Daaru Mukgi": { title: "Daaru Mukgi", artist: "Diljit Dosanjh" },
  "Ghost Diljit Dosanjh": { title: "Ghost", artist: "Diljit Dosanjh" },
  Lalkara: { title: "Lalkara", artist: "Diljit Dosanjh" },
  Ruthless: { title: "Ruthless", artist: "Diljit Dosanjh" },
  Water: { title: "Water", artist: "Diljit Dosanjh" },
  Million: { title: "Million", artist: "Karan Aujla" },
  "52 Bars": { title: "52 Bars", artist: "Karan Aujla" },
  "At Peace": { title: "At Peace", artist: "Karan Aujla" },
  Gabhru: { title: "Gabhru", artist: "Karan Aujla" },
  "On Top": { title: "On Top", artist: "Karan Aujla" },
  "White Brown Black": { title: "White Brown Black", artist: "Karan Aujla" },
  "Winning Speech": { title: "Winning Speech", artist: "Karan Aujla" },
  "Aa Jaana Darshan Raval": { title: "Aa Jaana", artist: "Darshan Raval" },
  "Baarish Lete Aana 2.0 Unwind": {
    title: "Barish Lete Aana 2.0",
    artist: "Darshan Raval",
  },
  "Baarishon Mein Darshan Raval": {
    title: "Baarishon Mein",
    artist: "Darshan Raval",
  },
  "Bhula Dunga Darshan Raval": {
    title: "Bhula Dunga",
    artist: "Darshan Raval",
  },
  "Dhun Saiyaara": { title: "Dhun", artist: "Arijit Sing" },
  "Aaja Baija Tu Brand Bollywood Downunder": {
    title: "Aaja Baija Tu",
    artist: "Arijit Sing",
  },
  "Aaj Bhi Vishal Mishra": { title: "Aaj Bhi", artist: "Vishal Mishra" },
  "Arjan Vaily Animal": { title: "Arjan Vaily", artist: "Sandeep Vanga" },
  "Jee Karda Badlapur": { title: "Jee Karda", artist: "Varun Dhaman" },
  "Get Ready To Fight Again Baaghi 2": {
    title: "Get Ready To Fight Again",
    artist: "Ahmed Khan",
  },
};

const playMusic = (track, title = null, artist = null, autoplay = true) => {
  currentSong.src = `/${currFolder}/` + track;

  // Only autoplay if specified
  if (autoplay) {
    currentSong.play();
    play.src = "img/pause.svg";
  } else {
    currentSong.pause();
    play.src = "img/play.svg";
  }

  // If no title/artist provided (like autoplay), clean filename
  if (!title || !artist) {
    let clean = cleanName(track);

    // Check exceptions first
    if (exceptions[clean]) {
      title = exceptions[clean].title;
      artist = exceptions[clean].artist;
    }
    // Format "Artist - Title"
    else if (clean.includes(" - ")) {
      [artist, title] = clean.split(" - ", 2);
    }
    // Fallback
    else {
      title = clean;
      artist = "Unknown";
    }
  }

  document.querySelector(".songinfo").innerHTML =
    (title ? title : track) + (artist ? " - " + artist : "");
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

async function displayAlbums() {
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];

      //get the metadata of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.insertAdjacentHTML(
        "beforeend",
        `<div data-folder= "${folder}" class="card" >
            <div class="play">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 6V18L18 12L9 6Z" fill="#000" stroke-width="1.5" stroke-linejoin="round" />
              </svg>
            </div>
            <img src="/songs/${folder}/cover.jpg" alt="">
            <h3>${response.title}</h3>
            <p>${response.description}</p>
          </div>`
      );
    }
  }

  //Load the playlists whenevercard is clicked
  Array.from(document.getElementsByClassName("card")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
    });
  });
}

async function main() {
  //get the list of all the songs
  await getSongs("songs/trend");
  play = document.querySelector("#play");
  playMusic(songs[0], null, null, false);

  //Display all the albums on the page
  displayAlbums();

  //Attach an event listner to play, next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });

  // Listen for timeupdate event
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(
      currentSong.currentTime
    )} / ${secondsToMinutesSeconds(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  //Add an event listener to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  //Add an event listner for hammburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  //Add an event listner for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-150%";
  });

  //Add an event listner to previous
  document.querySelector("#previous").addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //Add an event listner to next
  document.querySelector("#next").addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //Add an event to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
      if (currentSong.volume > 0) {
        document.querySelector(".volume>img").src = document
          .querySelector(".volume>img")
          .src.replace("mute.svg", "volume.svg");
      }
    });

  //Add event listner to mute the track
  document.querySelector(".volume>img").addEventListener("click", (e) => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = e.target.src.replace("volume.svg", "mute.svg");
      currentSong.volume = 0;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 0;
    } else {
      e.target.src = e.target.src.replace("mute.svg", "volume.svg");
      currentSong.volume = 0.1;
      document
        .querySelector(".range")
        .getElementsByTagName("input")[0].value = 10;
    }
  });
}
main();
