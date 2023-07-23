// Оголошення змінних для елементів DOM
const container = document.querySelector(".container");
const searchButton = document.getElementById("search");
const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const prevButton = document.getElementById("prev");
const backButton = document.getElementById("back");
const nextButton = document.getElementById("next");
const goButton = document.getElementById("go");
const nowPlaying = document.getElementById("nowPlaying");
const currentTimeDisplay = document.getElementById("currentTime");
const durationDisplay = document.getElementById("duration");
const progressBar = document.getElementById("progressBar");
const volumeSlider = document.getElementById("volumeSlider");
const volumeDisplay = document.getElementById("volumeDisplay");

// Масив для збереження плейлиста
const playlist = [];
let currentSongIndex = 0;
let isPaused = false;
let player;
let isChangingProgress = false;

async function getSelectedFiles() {
  return new Promise((resolve, reject) => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;

    input.addEventListener("change", () => {
      if (input.files.length > 0) {
        resolve(Array.from(input.files));
      } else {
        reject(new Error("Файли не були вибрані."));
      }
    });

    // Створення невидимого input-елемента на сторінці
    input.style.display = "none";
    document.body.appendChild(input);

    // Симуляція кліку на невидимий input-елемент
    input.click();
  });
}

function addToPlaylist(url, trackName) {
  const song = { url, trackName };
  playlist.push(song);
}

function displayPlaylist() {
  const container = document.querySelector(".container");

  // Очищаємо контейнер перед виведенням плейлиста
  container.innerHTML = "";

  // Виводимо треки плейлиста
  for (let i = 0; i < playlist.length; i++) {
    const trackElement = document.createElement("div");
    trackElement.textContent = playlist[i].trackName;
    trackElement.classList.add("song-item"); // Додаємо клас "song-item" для стилізації пісень
    trackElement.setAttribute("data-index", i); // Задаємо атрибут "data-index" для відстеження індексу пісні
    container.appendChild(trackElement);
  }
}

function updateNowPlaying(trackName) {
  nowPlaying.textContent = trackName;
}


// Функція для відтворення або паузи пісні
function togglePlayPause() {
    if (!player) {
      return;
    }
  
    if (player.paused) {
      player.play();
      playButton.textContent = "Пауза";
    } else {
      player.pause();
      playButton.textContent = "Відтворити";
    }
  }
  

  function playSong(index) {
    if (!player) {
      // Створюємо аудіо-елемент, якщо його ще немає
      player = new Audio();
      container.appendChild(player);

      player.addEventListener("timeupdate", () => {
        if (!isChangingProgress) {
          const currentTime = player.currentTime;
          const duration = player.duration;
          const progress = (currentTime / duration) * 100;
          progressBar.value = progress;
          currentTimeDisplay.textContent = formatTime(currentTime);
        }
      });
  
      player.addEventListener("ended", () => {
        // Викликаємо функцію для відтворення наступної пісні
        playNextSong();

        updateProgressBar();
      });
    }
  
    const currentTrack = playlist[index];
  
    player.src = currentTrack.url;

    player.load();

  // Оновлюємо тривалість пісні в полі durationDisplay після завантаження метаданих
  player.addEventListener("loadedmetadata", () => {
    durationDisplay.textContent = formatTime(player.duration);
  });

  player.play();
  updateProgressBar();
  updateNowPlaying(currentTrack.trackName);
  
    // Оновлюємо рухому стрічку із назвою поточної пісні
    updateNowPlaying(currentTrack.trackName);
  
    // Видаляємо підсвічення з попередньої пісні, якщо є активна пісня
    const activeSong = document.querySelector(".song-item.active");
    if (activeSong) {
      activeSong.classList.remove("active");
    }
  
    // Відзначаємо поточну пісню як активну
    const newActiveSong = document.querySelector(`[data-index="${index}"]`);
    if (newActiveSong) {
      newActiveSong.classList.add("active");
    }
  }
  function playNextSong() {
    currentSongIndex++;
    if (currentSongIndex >= playlist.length) {
      currentSongIndex = 0;
    }
    playSong(currentSongIndex);
  }
  
  function playPreviousSong() {
    currentSongIndex--;
    if (currentSongIndex < 0) {
      currentSongIndex = playlist.length - 1;
    }
    playSong(currentSongIndex);
  }

// Обробник події пошуку файлів
searchButton.addEventListener("click", async () => {
  try {
    const selectedFiles = await getSelectedFiles();

    for (const file of selectedFiles) {
      const url = URL.createObjectURL(file);
      addToPlaylist(url, file.name);
    }

    displayPlaylist();
  } catch (error) {
    console.error("Помилка під час отримання файлів:", error);
  }
});

playButton.addEventListener("click", () => {
  if (playlist.length === 0) {
    console.log("Плейлист порожній.");
    return;
  }

  // Якщо пісня не відтворюється, відтворюємо поточну пісню
  if (isPaused) {
     player = document.querySelector(".container audio");
    player.play();
  } else {
    // Якщо пісня вже відтворюється, призупиняємо відтворення
    togglePlayPause();
  }

  // Оновлюємо іконку кнопки
  playButton.innerHTML = '<img src="img/knopka-pause.svg" alt="">';
});

pauseButton.addEventListener("click", () => {
  // Призупиняємо відтворення пісні
  togglePlayPause();

  // Оновлюємо іконку кнопки
  playButton.innerHTML = '<img src="img/knopka3.svg" alt="">';
});

prevButton.addEventListener("click", () => {
  // Зменшуємо індекс поточної пісні на 1
  currentSongIndex--;

  // Якщо індекс став менший за 0, переходимо до останньої пісні у плейлисті
  if (currentSongIndex < 0) {
    currentSongIndex = playlist.length - 1;
  }

  // Відтворюємо попередню пісню
  playSong(currentSongIndex);
});

backButton.addEventListener("click", () => {
   player = document.querySelector(".container audio");

  // Зменшуємо час програвання на 10 секунд
  player.currentTime -= 10;
});

nextButton.addEventListener("click", () => {
  playNextSong();
});

goButton.addEventListener("click", () => {
   player = document.querySelector(".container audio");
  if (player) {
    player.currentTime += 10; // Перемотка вперед на 10 секунд
  }
});

container.addEventListener("click", (event) => {
    const target = event.target;

    // Перевіряємо, чи натиснули на елемент з класом "song-item"
    if (target.classList.contains("song-item")) {
        // Отримуємо індекс пісні у плейлисті
        const index = parseInt(target.getAttribute("data-index"));

        // Відтворюємо пісню за вказаним індексом
        playSong(index);
    }
});

// Оновлюємо відображення часу пісні при переміщенні повзунка
progressBar.addEventListener("input", () => {
     player = document.querySelector(".container audio");
    if (player) {
        const duration = player.duration;
        const currentTime = (progressBar.value / 100) * duration;
        currentTimeDisplay.textContent = formatTime(currentTime);
    }
});

progressBar.addEventListener("change", () => {
     player = document.querySelector(".container audio");
    if (player) {
        const duration = player.duration;
        const currentTime = (progressBar.value / 100) * duration;
        player.currentTime = currentTime;
    }
});



function updateProgressBar() {
     player = document.querySelector(".container audio");
    if (player) {
        const currentTime = player.currentTime;
        const duration = player.duration;
        const progress = (currentTime / duration) * 100;
        progressBar.value = progress;
        currentTimeDisplay.textContent = formatTime(currentTime);
        durationDisplay.textContent = formatTime(duration);
    }
}

// Функція для форматування часу у формат "hh:mm:ss"
function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Обробник події, який оновлює повзунок та час при зміні положення повзунка
progressBar.addEventListener("input", () => {
    const duration = player.duration;
    const currentTime = (progressBar.value / 100) * duration;
    currentTimeDisplay.textContent = formatTime(currentTime);
  });
  
  progressBar.addEventListener("change", () => {
    const duration = player.duration;
    const currentTime = (progressBar.value / 100) * duration;
    player.currentTime = currentTime;
  });

  // Обробник події, який встановлює змінну isChangingProgress у true, якщо змінюється положення повзунка
progressBar.addEventListener("mousedown", () => {
    isChangingProgress = true;
  });
  
  // Обробник події, який встановлює змінну isChangingProgress у false після того, як зміна положення повзунка завершиться
  progressBar.addEventListener("mouseup", () => {
    isChangingProgress = false;
  });

  function updateVolume(volume) {
    const player = document.querySelector(".container audio");
    if (player) {
      player.volume = volume;
    }
  }
  
  // Обробник події зміни гучності
  volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value;
    updateVolume(volume);
    const volumePercent = Math.round(volume * 100);
    volumeDisplay.textContent = `${volumePercent}%`;
  });

// Решта вашого JavaScript-коду

const addButton = document.getElementById("add");
const saveButton = document.getElementById("save");
const fileInput = document.getElementById("fileInput");

// Обробник події для кнопки "Додати"
addButton.addEventListener("click", async () => {
  try {
    const selectedFiles = await getSelectedFiles();

    for (const file of selectedFiles) {
      const url = URL.createObjectURL(file);
      addToPlaylist(url, file.name);
    }

    displayPlaylist();
  } catch (error) {
    console.error("Помилка під час отримання файлів:", error);
  }
});

// Обробник події для кнопки "Зберегти плейліст"
saveButton.addEventListener("click", () => {
    const playlistContent = createM3UFile(playlist);
    saveM3UFile(playlistContent, "playlist.m3u");
  });

// Обробник події для кнопки пошуку файлів для додавання до плейлісту
fileInput.addEventListener("change", async () => {
  try {
    const selectedFiles = await getSelectedFiles();

    for (const file of selectedFiles) {
      const url = URL.createObjectURL(file);
      addToPlaylist(url, file.name);
    }

    displayPlaylist();
  } catch (error) {
    console.error("Помилка під час отримання файлів:", error);
  }
});


async function saveAndAddToPlaylist() {
    try {
      const selectedFiles = await getSelectedFiles();
  
      const urls = [];
      const trackNames = [];
  
      for (const file of selectedFiles) {
        const url = URL.createObjectURL(file);
        urls.push(url);
        trackNames.push(file.name);
      }
  

      // Додавання пісень до поточного плейлісту
      addToCurrentPlaylist(urls, trackNames);
    } catch (error) {
      console.error("Помилка під час отримання файлів:", error);
    }
  }
  
// Інші обробники подій та код
