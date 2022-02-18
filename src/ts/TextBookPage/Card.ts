import IComponent from '../common/IComponent';
import { Content, WordContent } from '../common/types';
import cardTemplate from '../../html/templates/card.template.html';
import { addFragment } from '../common/utils';
import { baseUrl } from '../common/constants';

export default class Card extends IComponent {
  component: HTMLElement;

  static isPlayed: boolean = false;

  constructor() {
    super();
    const cardWrapper = document.querySelector('#cardsWrapper');
    addFragment(cardWrapper, '#card', cardTemplate);
    this.component = cardWrapper.lastChild as HTMLElement;
  }

  render(dataIn: Content): void {
    const data: WordContent = dataIn as WordContent;
    this.component.id = data.id;
    this.component.querySelector('#word').textContent = data.word;
    this.component.querySelector('#wordTranslate').textContent = data.wordTranslate;
    this.component.querySelector('#transcription').textContent = data.transcription;
    this.component.querySelector('#textMeaning').innerHTML = data.textMeaning;
    this.component.querySelector('#textMeaningTranslate').textContent = data.textMeaningTranslate;
    this.component.querySelector('#textExample').innerHTML = data.textExample;
    this.component.querySelector('#textExampleTranslate').textContent = data.textExampleTranslate;
    const audioWord: HTMLAudioElement = this.component.querySelector('#audioWord');
    audioWord.src = `${baseUrl}${data.audio}`;
    const audioMeaning: HTMLAudioElement = this.component.querySelector('#audioMeaning');
    audioMeaning.src = `${baseUrl}${data.audioMeaning}`;
    const audioExample: HTMLAudioElement = this.component.querySelector('#audioExample');
    audioExample.src = `${baseUrl}${data.audioExample}`;
    const cardFront: HTMLElement = this.component.querySelector('#wordImage');
    cardFront.style.backgroundImage = `url(${baseUrl}${data.image})`;
  }

  playAudio() {
    const audioWord: HTMLAudioElement = this.component.querySelector('#audioWord');
    const audioMeaning: HTMLAudioElement = this.component.querySelector('#audioMeaning');
    const audioExample: HTMLAudioElement = this.component.querySelector('#audioExample');
    audioWord.play();
    window.setTimeout(() => {
      audioMeaning.play();
    }, audioWord.duration * 1000);
    window.setTimeout(() => {
      audioExample.play();
    }, (audioWord.duration + audioMeaning.duration) * 1000);
    window.setTimeout(() => {
      Card.isPlayed = false;
    }, (audioWord.duration + audioMeaning.duration + audioExample.duration) * 1000);
  }

  setHandler(): void {
    this.component.onclick = () => {
      this.component.classList.toggle('card_rotator');
    };

    const sound: HTMLElement = this.component.querySelector('.card_sound');
    sound.onclick = (event) => {
      if (!Card.isPlayed) {
        Card.isPlayed = true;
        this.playAudio();
      }
      event.stopImmediatePropagation();
    };
  }
}
