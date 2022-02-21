import PageLoader from '../PageLoader';
import { baseUrl } from './constants';
import IAuthComponent from './IAuthComponent';
import {
  AuthContext,
  Content, GameContent, TextBookContext, WordContent,
} from './types';
import { addElement, loadWordsFromPages } from './utils';

export default abstract class IGame extends IAuthComponent {
  abstract component: HTMLElement;

  abstract book: TextBookContext;

  abstract words: WordContent[];

  abstract result: boolean[];

  abstract soundPlaying: boolean;

  render(dataIn: Content): void {
    const data: GameContent = dataIn as GameContent;
    data.parent.replaceChild(this.component, data.replacement);
    this.book = data.book;
    this.component = data.parent.querySelector('section');
  }

  aggregator = (auth: AuthContext, pageId: number, size: number): Promise<number> => {
    const { groupId } = this.book;
    return loadWordsFromPages(groupId, pageId).then((words) => {
      let result: Promise<number>;
      for (let i = 0; i < words.length; i += 1) {
        result = fetch(`${baseUrl}users/${auth.id}/words/${words[i].id}`, {
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
              this.words.push(words[i]);
              return Promise.resolve(true);
            default:
              throw new Error('Token invalid');
          }
        }, () => Promise.reject(Error))
          .then((data) => {
            switch (data.difficulty) {
              case 'hard':
                this.words.push(words[i]);
                break;
              case 'learned':
                break;
              case 'default':
                this.words.push(words[i]);
                break;
              default:
                break;
            }
          })
          .then(() => {
            if (this.words.length < size && (pageId - 1) >= 0) {
              return this.aggregator(auth, pageId - 1, size);
            }
            return Promise.resolve(pageId);
          });
      }
      return result;
    });
  };

  updateWord = (auth: AuthContext, num: number, method: string, data: Object) => {
    fetch(`${baseUrl}users/${auth.id}/words/${this.words[num].id}`, {
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
    });
  };

  fetchWord = (auth: AuthContext, num: number, dataDefualt: Object) => {
    const result = fetch(`${baseUrl}users/${auth.id}/words/${this.words[num].id}`, {
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
          this.updateWord(auth, num, 'POST', dataDefualt);
          return Promise.resolve(true);
        default:
          throw new Error('Token invalid');
      }
    }, () => Promise.reject(Error));
    return result;
  };

  renderResult() {
    this.component.querySelector<HTMLElement>('.overlay').style.display = 'flex';
    const base = this.component.querySelector<HTMLElement>('.result-words');
    let rightAnswer = 0;
    for (let i = 0; i < this.result.length; i += 1) {
      const wordWrapper = addElement(base, 'div', 'word-wrapper');
      const wordSound = addElement(wordWrapper, 'div', 'word-audio');
      const sound = addElement(wordSound, 'audio') as HTMLAudioElement;
      sound.src = `${baseUrl}${this.words[i].audio}`;
      const wordEnglish = addElement(wordWrapper, 'p', 'word');
      const wordSeparator = addElement(wordWrapper, 'pre', 'word');
      const wordTranslate = addElement(wordWrapper, 'p', 'word');
      wordEnglish.textContent = `${this.words[i].word}`;
      wordSeparator.textContent = ' - ';
      wordTranslate.textContent = `${this.words[i].wordTranslate}`;
      if (this.result[i]) {
        wordEnglish.classList.add('correct');
        rightAnswer += 1;
      } else {
        wordEnglish.classList.add('wrong');
      }
      wordSound.onclick = () => {
        if (!this.soundPlaying) {
          this.soundPlaying = true;
          sound.play();
        }
      };
      sound.onended = () => {
        this.soundPlaying = false;
      };
    }
    const wrong = this.component.querySelector<HTMLElement>('.wrong-answer');
    const correct = this.component.querySelector<HTMLElement>('.overlay').querySelector<HTMLElement>('.correct-answer');
    correct.textContent = `${rightAnswer}`;
    wrong.textContent = `${this.result.length - rightAnswer}`;
  }

  setHandlerResult() {
    const buttonAgain = this.component.querySelector<HTMLButtonElement>('.again');
    const buttonMain = this.component.querySelector<HTMLButtonElement>('.main-page');

    buttonAgain.onclick = () => {
      PageLoader.exit();
      window.location.href = `${window.location.href}`;
    };

    buttonMain.onclick = () => {
      PageLoader.exit();
      window.location.href = `${window.location.origin}/`;
    };
  }
}
