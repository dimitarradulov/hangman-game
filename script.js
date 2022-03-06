'use strict';

// ***************** ELEMENTS AND VARIABLES *****************
const categoryButtonsContainer = document.querySelector('.categoty-buttons');
const guessWordBoxesContainer = document.querySelector('.guess-word-boxes');
const statsContainer = document.querySelector('.stats');
const modal = document.querySelector('.modal');
const alphabetContainer = document.querySelector('.alphabet');
const hangamanFigureContainer = document.querySelector('.hangman');
const gameOverContainer = document.querySelector('.game-over');

let livesCounter;
let wordsCounter;
let randomWord;
let currCategory;
let state;

const categories = {
  // prettier-ignore
  animals: ['alligator', 'baboon', 'ermine', 'gazelle', 'iguana', 'coyote', 'buffalo', 'wolf', 'zebra', 'weasel'],
  // prettier-ignore
  countries: ['bolivia', 'canada', 'jamaica', 'kenya', 'angola', 'austria', 'colombia', 'togo', 'norway', 'mexico'],
  // prettier-ignore
  sports: ['soccer', 'basketball', 'golf', 'badminton', 'volleyball', 'darts', 'karate', 'archery', 'kickboxing', 'gymnastics'],
  // prettier-ignore
  cars: ['bmw', 'bugatti', 'opel', 'volkswagen', 'renault', 'venturi', 'toyota', 'jeep', 'subaru', 'lexus'],
};

// ***************** FUNCTIONS *****************
const insertHTMLIntoElement = (el, htmlMarkup) => {
  el.insertAdjacentHTML('beforeend', htmlMarkup);
};

(function () {
  const alphabetContainer = document.querySelector('.alphabet');

  for (let i = 65; i <= 90; i++) {
    const markup = `
      <button class="btn--alphabet" disabled>${String.fromCharCode(i)}</button>
    `;

    insertHTMLIntoElement(alphabetContainer, markup);
  }
})();

const setLivesCounter = (operation = 'initial') => {
  const livesText = document.querySelector('.lives-num');

  if (operation !== 'initial' && operation !== 'decrement') return;

  if (operation === 'decrement') {
    livesCounter--;
  }

  if (operation === 'initial') {
    livesCounter = 10;
  }

  livesText.innerText = `${livesCounter}`;
};

const setWordsCounter = (operation = 'initial') => {
  const wordsText = document.querySelector('.words-num');

  if (operation !== 'initial' && operation !== 'decrement') return;

  if (operation === 'decrement') {
    wordsCounter--;
  }

  if (operation === 'initial') {
    wordsCounter = 10;
  }

  wordsText.innerText = `${wordsCounter}`;
};

setLivesCounter();
setWordsCounter();

const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);

const toggleAlphabetButtons = function () {
  document
    .querySelectorAll('.btn--alphabet')
    .forEach((btn) => (btn.disabled = this));
};

const enableAlphabetButtons = toggleAlphabetButtons.bind(false);
const disableAlphabetButtons = toggleAlphabetButtons.bind(true);

const isAllBoxesFilled = () => {
  const boxes = [...document.querySelectorAll('.box')];

  return boxes.every((el) => el.innerText.trim());
};

const createWordBoxes = () => {
  for (let i = 0; i < randomWord.length; i++) {
    const markup = `<div class="box" data-index="${i}">&nbsp;</div>`;
    insertHTMLIntoElement(guessWordBoxesContainer, markup);
  }
};

const getWordFromCategory = (oldState) => {
  const randomNum = randomInt(0, oldState[currCategory].length - 1);

  randomWord = oldState[currCategory][randomNum].toUpperCase();

  guessWordBoxesContainer.textContent = '';

  createWordBoxes();
};

const removeWordFromCategory = (oldState) => {
  const newState = { ...oldState };

  const index = newState[currCategory].indexOf(randomWord.toLowerCase());

  newState[currCategory].splice(index, 1);

  return newState;
};

const getCategory = () => {
  setLivesCounter();

  statsContainer.classList.remove('hidden');

  state = { ...categories };

  getWordFromCategory(state);

  enableAlphabetButtons();

  hangmanFigureReset();
};

const hangmanFigureReset = () => {
  [...hangamanFigureContainer.children].forEach((figure) =>
    figure.classList.add('hidden')
  );
};

const noLivesLeft = () => {
  if (livesCounter !== 0) return;

  disableAlphabetButtons();
  statsContainer.classList.add('hidden');
  gameOverContainer.classList.remove('hidden');
};

const modalReveal = () => {
  modal.classList.remove('hidden');
};

const modalHide = () => {
  modal.classList.add('hidden');
};

// ***************** EVENT LISTENERS *****************
categoryButtonsContainer.addEventListener('click', (e) => {
  // prettier-ignore
  if (e.target.tagName !== 'BUTTON' && !e.target.classList.contains('ion')) return;

  const button = e.target.closest('.btn--category');

  if (button.classList.contains('selected')) return;

  document
    .querySelectorAll('.btn--category')
    .forEach((btn) => btn.classList.remove('selected'));
  button.classList.add('selected');

  if (this.innerWidth <= 576) {
    guessWordBoxesContainer.scrollIntoView({
      behavior: 'smooth',
    });
  }

  currCategory = button.dataset.category;

  getCategory();

  if (!gameOverContainer.classList.contains('hidden'))
    gameOverContainer.classList.add('hidden');
});

alphabetContainer.addEventListener('click', (e) => {
  if (e.target.tagName !== 'BUTTON') return;

  const button = e.target;
  button.disabled = true;

  const letter = button.innerText;

  if (randomWord.includes(letter)) {
    randomWord.split('').forEach((x, i) => {
      if (x === letter) {
        const box = document.querySelector(`.box[data-index="${i}"]`);

        box.textContent = letter;

        box.style.border = 'none';
      }
    });

    if (isAllBoxesFilled()) {
      disableAlphabetButtons();

      setWordsCounter('decrement');
      if (wordsCounter === 0) return modalReveal();

      setTimeout(() => {
        state = removeWordFromCategory(state);
        getWordFromCategory(state);
        enableAlphabetButtons();
        setLivesCounter();
      }, 1500);
    }
  }

  if (!randomWord.includes(letter)) {
    setLivesCounter('decrement');

    const hangmanFigureParts = [...hangamanFigureContainer.children];
    const index = 10 - livesCounter - 1;
    hangmanFigureParts[index].classList.remove('hidden');

    noLivesLeft();
  }
});

gameOverContainer.addEventListener('click', (e) => {
  if (!e.target.classList.contains('btn--game-over')) return;

  e.currentTarget.classList.add('hidden');

  getCategory();
});

modal.addEventListener('click', (e) => {
  if (
    !e.target.classList.contains('modal__close') &&
    !e.target.classList.contains('btn--modal')
  )
    return;

  window.location.reload();
});
