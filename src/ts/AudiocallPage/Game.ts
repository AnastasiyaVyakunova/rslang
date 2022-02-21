import IAuthComponent from '../common/IAuthComponent';
import {
  Content, AuthContext, AudiocallContent, resetTextBookContext, WordContent, TextBookContext,
} from '../common/types';
import gameTemplate from '../../html/templates/audiocall-game.template.html';
import {
  baseUrl, maxNumQuestion, maxNumTextBookGroup, maxNumTextBookSubPage,
} from '../common/constants';
import { addElement } from '../common/utils';
import PageLoader from '../PageLoader';

export default class Game extends IAuthComponent {
  component: HTMLElement;

  book: TextBookContext = resetTextBookContext();

  words: WordContent[] = [];

  result: boolean[] = [];

  incorrectWord: WordContent[] = [];

  numOfQuestion: number = 0;

  static soundPlaying = false;

  constructor() {
    super();
    const templateWrapper: HTMLTemplateElement = document.createElement('template');
    templateWrapper.innerHTML = gameTemplate;
    this.component = templateWrapper.content.cloneNode(true) as HTMLElement;
  }

  render(dataIn: Content): void {
    const data: AudiocallContent = dataIn as AudiocallContent;
    data.parent.replaceChild(this.component, data.replacement);
    this.book = data.book;
    this.component = data.parent.querySelector('section');
  }

  private drawResult() {
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
        if (!Game.soundPlaying) {
          Game.soundPlaying = true;
          sound.play();
        }
      };
      sound.onended = () => {
        Game.soundPlaying = false;
      };
    }
    const wrong = this.component.querySelector<HTMLElement>('.wrong-answer');
    const correct = this.component.querySelector<HTMLElement>('.overlay').querySelector<HTMLElement>('.correct-answer');
    correct.textContent = `${rightAnswer}`;
    wrong.textContent = `${this.result.length - rightAnswer}`;
  }

  private setContent() {
    if (this.numOfQuestion >= this.words.length) {
      this.drawResult();
      return;
    }
    const word = this.words[this.numOfQuestion];
    this.component.querySelector<HTMLElement>('.correct-answer').style.display = 'none';
    this.component.querySelector<HTMLElement>('.correct-image').style.backgroundImage = `url(${baseUrl}${word.image})`;
    this.component.querySelector<HTMLElement>('.audio_sound').classList.remove('mini');
    const buttons = this.component.querySelectorAll<HTMLButtonElement>('.audio-translate');
    const rightIxd = Math.round(Math.random() * (buttons.length - 1));
    buttons[rightIxd].textContent = word.wordTranslate;
    for (let i = 0; i < buttons.length; i += 1) {
      if (i !== rightIxd) {
        const incorrectIdx = Math.round(Math.random() * (maxNumQuestion - 1));
        buttons[i].textContent = this.incorrectWord[incorrectIdx].wordTranslate;
      }
      buttons[i].style.color = '#ffffff';
    }

    const audio = this.component.querySelector<HTMLAudioElement>('#audioWord');
    audio.oncanplay = () => {
      audio.play();
    };
    audio.src = `${baseUrl}${word.audio}`;
  }

  private static loadWordsFromPages(groupId: number, pageId: number): Promise<Array<WordContent>> {
    return fetch(`${baseUrl}words?group=${groupId}&page=${pageId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then((response) => response.json(), () => Promise.reject(Error))
      .then((data) => Promise.resolve(data), () => Promise.reject(Error));
  }

  authRender(auth: AuthContext): void {
    let executer: Promise<void>;
    if (auth.id === '') {
      executer = Game.loadWordsFromPages(this.book.groupId, this.book.pageId).then((words) => {
        this.words = words;
      });
    } else {
      const aggregator = async () => {
        for (
          let { groupId, pageId } = this.book;
          this.words.length < maxNumQuestion && pageId >= 0;
          pageId -= 1
        ) {
          const words = await Game.loadWordsFromPages(groupId, pageId);
          for (let i = 0; i < words.length; i += 1) {
            fetch(`${baseUrl}users/${auth.id}/words/${words[i].id}`, {
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
              });
          }
        }
      };
      executer = aggregator();
    }
    executer.then(() => {
      let groupId = 0;
      let pageId = 0;
      do {
        groupId = Math.round(Math.random() * (maxNumTextBookGroup - 1));
      } while (groupId === this.book.groupId);
      do {
        pageId = Math.round(Math.random() * (maxNumTextBookSubPage - 1));
      } while (pageId === this.book.pageId);
      Game.loadWordsFromPages(groupId, pageId)
        .then((words) => {
          this.incorrectWord = words;
        })
        .then(() => this.setContent());
    });
  }

  setHandler(): void {
    const buttonAudio = this.component.querySelector<HTMLElement>('.audio_sound');
    const sound = this.component.querySelector<HTMLAudioElement>('#audioWord');
    buttonAudio.onclick = () => {
      if (sound.ended) {
        sound.play();
      }
    };

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

  setAuthHandler(auth: AuthContext): void {
    const buttons = this.component.querySelector<HTMLElement>('.words-wrapper');

    const updateWord = (num: number, method: string, data: Object) => {
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

    const rightAnswer = (num: number) => {
      fetch(`${baseUrl}users/${auth.id}/words/${this.words[num].id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Accept': 'application/json',
        },
      }).then((response) => {
        const dataDefualt = {
          difficulty: 'default',
          optional: {
            audiocall: { totalRight: 1, rightInRow: 1 },
            sprint: { totalRight: 1, rightInRow: 1 },
          },
        };
        switch (response.status) {
          case 200:
            return response.json();
          case 404:
            updateWord(num, 'POST', dataDefualt);
            return Promise.resolve(true);
          default:
            throw new Error('Token invalid');
        }
      }, () => Promise.reject(Error))
        .then((data) => {
          const output = { difficulty: data.difficulty, optional: data.optional };
          if (output.optional === undefined) {
            output.optional = {
              audiocall: { totalRight: 1, rightInRow: 1 },
              sprint: { totalRight: 0, rightInRow: 0 },
            };
          } else if (output.optional.audiocall !== undefined) {
            output.optional.audiocall.totalRight += 1;
            output.optional.audiocall.rightInRow += 1;
          } else {
            output.optional.audiocall = { totalRight: 1, rightInRow: 1 };
          }
          switch (data.difficulty) {
            case 'hard':
              if (output.optional.audiocall.rightInRow >= 5) {
                output.difficulty = 'learned';
              }
              break;
            case 'learned':
              break;
            case 'default':
              if (output.optional.audiocall.rightInRow >= 3) {
                output.difficulty = 'learned';
              }
              break;
            default:
              break;
          }
          updateWord(num, 'PUT', output);
        });
    };

    const incorectAnswer = (num: number) => {
      fetch(`${baseUrl}users/${auth.id}/words/${this.words[num].id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Accept': 'application/json',
        },
      }).then((response) => {
        const dataDefualt = {
          difficulty: 'default',
          optional: {
            audiocall: { totalRight: 0, rightInRow: 0 },
            sprint: { totalRight: 0, rightInRow: 0 },
          },
        };
        switch (response.status) {
          case 200:
            return response.json();
          case 404:
            updateWord(num, 'POST', dataDefualt);
            return Promise.resolve(true);
          default:
            throw new Error('Token invalid');
        }
      }, () => Promise.reject(Error))
        .then((data) => {
          const output = { difficulty: data.difficulty, optional: data.optional };
          if (output.optional === undefined) {
            output.optional = {
              audiocall: { totalRight: 0, rightInRow: 0 },
              sprint: { totalRight: 0, rightInRow: 0 },
            };
          } else if (output.optional.audiocall !== undefined) {
            output.optional.audiocall.rightInRow = 0;
          } else {
            output.optional.audiocall = { totalRight: 0, rightInRow: 0 };
          }
          switch (data.difficulty) {
            case 'hard':
              break;
            case 'learned':
              output.difficulty = 'default';
              break;
            case 'default':
              break;
            default:
              break;
          }
          updateWord(num, 'PUT', output);
        });
    };

    buttons.onclick = (event) => {
      const target = event.target as HTMLElement;
      if (target.id !== '') {
        if (target.textContent === this.words[this.numOfQuestion].wordTranslate) {
          target.style.color = '#b7f54d';
          this.result.push(true);
          if (auth.id !== '') {
            rightAnswer(this.numOfQuestion);
          }
        } else {
          target.style.color = '#f58b4d';
          this.result.push(false);
          if (auth.id !== '') {
            incorectAnswer(this.numOfQuestion);
          }
        }
        this.component.querySelector<HTMLElement>('.correct-word').textContent = `${this.words[this.numOfQuestion].word}`;
        this.component.querySelector<HTMLElement>('.audio_sound').classList.add('mini');
        this.component.querySelector<HTMLElement>('.correct-answer').style.display = 'flex';
        this.numOfQuestion += 1;
        setTimeout(() => this.setContent(), 3000);
      }
    };
  }
}
