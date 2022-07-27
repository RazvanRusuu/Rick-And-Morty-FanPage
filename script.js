"use strict";

// selected dom elements
const episodesContainer = document.querySelector(".episodes-container");
const charactersContainer = document.querySelector(".characters-container");

// stores the array of charactersURL and accesing them by index when clicking the button
let arrayCharacters = [];

// =======helper function==========
const createEl = (tagName, className, text = "") => {
  const el = document.createElement(tagName);
  el.className = className;
  el.innerText = text;

  return el;
};
// helper function getJson====
const getJSON = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    const data = await response.json();
    return data;
  } catch (err) {
    console.log(err);
  }
};

// getJSON().catch((err) => console.error(err.message));

const getEpisodesData = () => {
  const dataEpisode = getJSON("https://rickandmortyapi.com/api/episode");
  dataEpisode.then((episode) => handleEpisodesData(episode));
};

const handleEpisodesData = ({ results }) => {
  results.forEach((episode) => {
    arrayCharacters.push(episode.characters);
    createAndRenderEpisod(episode);
  });
};

const createAndRenderCharacter = ({ image, name, status, species }) => {
  const characterContentEl = createEl("div", "character-content");
  charactersContainer.append(characterContentEl);

  const characterContentFrontEl = createEl("figure", "character-side front");
  characterContentEl.append(characterContentFrontEl);

  const characterContentBackEl = createEl("figure", "character-side back");
  characterContentEl.append(characterContentBackEl);

  const characterImgEl = createEl("img", "character-img");
  characterImgEl.src = image;
  characterContentFrontEl.append(characterImgEl);

  const characterNameEl = createEl("span", "character-text", `Name: ${name}`);
  characterContentBackEl.append(characterNameEl);

  const characterStatusEl = createEl(
    "span",
    "character-text",
    `Status: ${status}`
  );
  characterContentBackEl.append(characterStatusEl);

  const characterSpecieEl = createEl(
    "span",
    "character-text",
    `Species: ${species}`
  );
  characterContentBackEl.append(characterSpecieEl);
};

const createAndRenderEpisod = ({ name, air_date, episode, characters, id }) => {
  const episodeContainer = createEl("div", "episode-container");
  episodesContainer.append(episodeContainer);

  const nameEl = createEl("h3", "episode-name", name);
  nameEl.insertAdjacentHTML(
    "afterbegin",
    '<i class="fa-solid fa-clapperboard"></i>'
  );
  episodeContainer.append(nameEl);

  const dateEl = createEl("span", "episode-date", air_date);
  dateEl.insertAdjacentHTML(
    "afterbegin",
    '<i class="fa-solid fa-calendar-check"></i>'
  );
  episodeContainer.append(dateEl);

  const numberEl = createEl("span", "episode-number", episode);
  numberEl.insertAdjacentHTML(
    "afterbegin",
    '<i class="fa-solid fa-keyboard"></i>'
  );
  episodeContainer.append(numberEl);

  const linkEl = createEl(
    "a",
    "btn btn__link",
    `View ${characters.length} characters`
  );
  linkEl.setAttribute("data-id", id);
  episodeContainer.append(linkEl);
};

// =========Event listner=====
window.addEventListener("load", getEpisodesData);

episodesContainer.addEventListener("click", (e) => {
  e.preventDefault();

  const clicked = e.target.closest(".btn__link");

  if (!clicked) return;

  let index = clicked.dataset.id - 1;

  charactersContainer.innerHTML = "";

  arrayCharacters[index].forEach((character) => {
    const characterData = getJSON(character);
    characterData.then((character) => createAndRenderCharacter(character));
  });
});
