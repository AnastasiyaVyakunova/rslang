import {
  AuthContext, resetTextBookContext, WordContent, TextBookContext,
} from '../common/types';
import gameTemplate from '../../html/templates/audiocall-game.template.html';
import {
  baseUrl, maxNumQuestion, maxNumTextBookGroup, maxNumTextBookSubPage,
} from '../common/constants';
import { loadWordsFromPages } from '../common/utils';
import IGame from '../common/IGame';

export default class Game extends IGame {
  component: HTMLElement;

  book: TextBookContext = resetTextBookContext();

  words: WordContent[] = [];

  result: boolean[] = [];

  incorrectWord: WordContent[] = [];

  numOfQuestion: number = 0;

  soundPlaying: boolean = false;

  constructor() {
    super();
    const templateWrapper: HTMLTemplateElement = document.createElement('template');
    templateWrapper.innerHTML = gameTemplate;
    this.component = templateWrapper.content.cloneNode(true) as HTMLElement;
  }

  private setContent() {
    if (this.numOfQuestion >= Math.min(this.words.length, maxNumQuestion)) {
      this.renderResult();
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

  authRender(auth: AuthContext): void {
    let executer: Promise<number>;
    if (auth.id === '') {
      executer = loadWordsFromPages(this.book.groupId, this.book.pageId).then((words) => {
        this.words = words;
        return Promise.resolve(this.book.pageId);
      });
    } else {
      executer = this.aggregator(auth, this.book.pageId, maxNumQuestion);
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
      loadWordsFromPages(groupId, pageId)
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
    this.setHandlerResult();
  }

  setAuthHandler(auth: AuthContext): void {
    const buttons = this.component.querySelector<HTMLElement>('.words-wrapper');

    const rightAnswer = (num: number) => {
      const dataDefualt = {
        difficulty: 'default',
        optional: {
          audiocall: { totalRight: 1, rightInRow: 1 },
          sprint: { totalRight: 0, rightInRow: 0 },
        },
      };

      this.fetchWord(auth, num, dataDefualt).then((data) => {
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
        this.updateWord(auth, num, 'PUT', output);
      });
    };

    const incorrectAnswer = (num: number) => {
      const dataDefualt = {
        difficulty: 'default',
        optional: {
          audiocall: { totalRight: 0, rightInRow: 0 },
          sprint: { totalRight: 0, rightInRow: 0 },
        },
      };
      this.fetchWord(auth, num, dataDefualt).then((data) => {
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
        this.updateWord(auth, num, 'PUT', output);
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
            incorrectAnswer(this.numOfQuestion);
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
