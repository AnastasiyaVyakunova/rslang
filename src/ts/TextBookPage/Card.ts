import IAuthComponent from '../common/IAuthComponent';
import { Content, WordContent, AuthContext } from '../common/types';
import cardTemplate from '../../html/templates/card.template.html';
import { addFragment } from '../common/utils';
import { baseUrl } from '../common/constants';

export default class Card extends IAuthComponent {
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

  authRender(auth: AuthContext) {
    if (auth.id !== '') {
      this.component.querySelector<HTMLElement>('.add-studied').hidden = false;
      this.component.querySelector<HTMLElement>('.add-difficult').hidden = false;
      this.component.querySelector<HTMLElement>('.game-result').style.display = 'flex';

      fetch(`${baseUrl}users/${auth.id}/words/${this.component.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Accept': 'application/json',
        },
      }).then((response) => {
        switch (response.status) {
          case 200:
            return response.json();
          case 404:
            return Promise.resolve(true);
          default:
            throw new Error('Token invalid');
        }
      }, () => Promise.reject(Error))
        .then((data) => {
          const studied: HTMLElement = this.component.querySelector('.add-studied');
          const difficult: HTMLElement = this.component.querySelector('.add-difficult');
          switch (data.difficulty) {
            case 'hard':
              difficult.classList.add('hard');
              break;
            case 'learned':
              studied.classList.add('studied');
              break;
            default:
              break;
          }
          const resA = this.component.querySelector('.audiocall-result');
          const resS = this.component.querySelector('.sprint-result');
          if (data.optional === undefined) {
            resA.textContent = '0';
            resS.textContent = '0';
          } else {
            if (data.optional.audiocall !== undefined) {
              resA.textContent = data.optional.audiocall.totalRight;
            } else {
              resA.textContent = '0';
            }
            if (data.optional.sprint !== undefined) {
              resS.textContent = data.optional.sprint.totalRight;
            } else {
              resS.textContent = '0';
            }
          }
          return Promise.resolve(true);
        }, () => Promise.reject(Error));
    }
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

  setAuthHandler(auth: AuthContext): void {
    const studied: HTMLElement = this.component.querySelector('.add-studied');
    const difficult: HTMLElement = this.component.querySelector('.add-difficult');

    const updateWord = (method: string, data: Object): Promise<boolean> =>{
      const result = fetch(`${baseUrl}users/${auth.id}/words/${this.component.id}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
      }).then((response) => {
        if (response.status === 401) {
          throw new Error('Token invalid');
        }
        return Promise.resolve(true);
      });
      return result;
    };

    const deleteWord = (): Promise<boolean> => {
      const result = fetch(`${baseUrl}users/${auth.id}/words/${this.component.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Accept': 'application/json',
        },
      }).then((response) => {
        if (response.status === 401) {
          throw new Error('Token invalid');
        }
      }).then(() => {
        const valA = Number(this.component.querySelector('.audiocall-result').textContent);
        const valS = Number(this.component.querySelector('.sprint-result').textContent);
        const data = {
          difficulty: 'default',
          optional: {
            audiocall: { totalRight: valA, rightInRow: 0 },
            sprint: { totalRight: valS, rightInRow: 0 },
          },
        };
        return updateWord('POST', data);
      });
      return result;
    };

    studied.onclick = (event) => {
      if (studied.classList.contains('studied')) {
        studied.classList.remove('studied');
        deleteWord();
      } else {
        studied.classList.add('studied');
        deleteWord().then(() => {
          const valA = Number(this.component.querySelector('.audiocall-result').textContent);
          const valS = Number(this.component.querySelector('.sprint-result').textContent);
          const data = {
            difficulty: 'learned',
            optional: {
              audiocall: { totalRight: valA, rightInRow: 0 },
              sprint: { totalRight: valS, rightInRow: 0 },
            },
          };
          updateWord('PUT', data);
        });
        difficult.classList.remove('hard');
      }
      event.stopImmediatePropagation();
    };

    difficult.onclick = (event) => {
      if (difficult.classList.contains('hard')) {
        difficult.classList.remove('hard');
        deleteWord();
      } else {
        difficult.classList.add('hard');
        deleteWord().then(() => {
          const valA = Number(this.component.querySelector('.audiocall-result').textContent);
          const valS = Number(this.component.querySelector('.sprint-result').textContent);
          const data = {
            difficulty: 'hard',
            optional: {
              audiocall: { totalRight: valA, rightInRow: 0 },
              sprint: { totalRight: valS, rightInRow: 0 },
            },
          };
          updateWord('PUT', data);
        });
        studied.classList.remove('studied');
      }
      event.stopImmediatePropagation();
    };
  }
}
