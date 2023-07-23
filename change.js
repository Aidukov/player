const themes = [
    {
      background: "#5BC0EB",
      background1: "#A6A670",
      text: "white",
      progressBar: "red",
    },
    {
      background: "#6E8894",
      background1: "#D1BE9C",
      text: "#ACE4AA",
      progressBar: "#544343",
    },
    {
        background: "#1F5673",
        background1: "#AA998F",
        text: "darkblue",
        progressBar: "#B486AB",
      },
      {
        background: "#A8B7AB",
        background1: "#E6F8B2",
        text: "#023C40",
        progressBar: "green",
      },
      {
        background: "lightblue",
        background1: "#DE9151",
        text: "#404E4D",
        progressBar: "#FF6B6B",
      },
    // Додайте інші теми за потребою
  ];
 
  
  let currentThemeIndex = 0;

function changeTheme() {
    const currentTheme = themes[currentThemeIndex];
    const container = document.querySelector(".container");
    const progressBar = document.getElementById("progressBar");
    const currentTimeDisplay = document.getElementById("currentTime");
    const durationDisplay = document.getElementById("duration");
    const volumeSlider = document.getElementById("volumeSlider");
    const volumeDisplay = document.getElementById("volumeDisplay");
    const buttons = document.querySelector(".buttons");
    const niz = document.querySelector(".niz")
  
    container.style.background = currentTheme.background;
    container.style.color = currentTheme.text;
    progressBar.style.background = currentTheme.progressBar;
    currentTimeDisplay.style.color = currentTheme.text;
    durationDisplay.style.color = currentTheme.text;
    volumeSlider.style.background = currentTheme.progressBar;
    volumeDisplay.style.color = currentTheme.text;
    buttons.style.background = currentTheme.background1;
    niz.style.background = currentTheme.background1;
  }

  const changeButton = document.getElementById("change");

changeButton.addEventListener("click", () => {
  // Збільшуємо індекс теми або переходимо на початок масиву тем, якщо вже використані всі
  currentThemeIndex = (currentThemeIndex + 1) % themes.length;

  // Викликаємо функцію для зміни теми
  changeTheme();
});

  