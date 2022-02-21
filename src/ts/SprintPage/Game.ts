import {
  Content, AuthContext, GameContent, resetTextBookContext, WordContent, TextBookContext,
} from '../common/types';
import gameTemplate from '../../html/templates/sprint-game.template.html';
import {
  increaseValueOfCorrect,
  initialValueOfCorrect, maxCorrectInRow, maxNumQuestion, maxNumTextBookSubPage, timeDurationSec,
} from '../common/constants';
import { loadWordsFromPages } from '../common/utils';
import IGame from '../common/IGame';

export default class Game extends IGame {
  component: HTMLElement;

  book: TextBookContext = resetTextBookContext();

  words: WordContent[] = [];

  result: boolean[] = [];

  numOfQuestion: number = 0;

  soundPlaying: boolean = false;

  gameEnded: boolean = false;

  timeLeft: number = timeDurationSec;

  score: number = 0;

  rightInRow: number = 0;

  valueOfCorrect: number = initialValueOfCorrect;

  constructor() {
    super();
    const templateWrapper: HTMLTemplateElement = document.createElement('template');
    templateWrapper.innerHTML = gameTemplate;
    this.component = templateWrapper.content.cloneNode(true) as HTMLElement;
  }

  render(dataIn: Content): void {
    const data: GameContent = dataIn as GameContent;
    data.parent.replaceChild(this.component, data.replacement);
    this.book = data.book;
    this.component = data.parent.querySelector('section');
  }

  private setContent() {
    this.component.querySelector<HTMLElement>('.sprint_score').textContent = `${this.score}`;
    const englishWord = this.component.querySelector<HTMLElement>('.eng-word');
    const translateWord = this.component.querySelector<HTMLElement>('.translation-word');
    englishWord.style.color = '#ffffff';
    englishWord.textContent = `${this.words[this.numOfQuestion].word}`;
    const isRight = Math.round(Math.random());
    if (isRight === 0) {
      let wordId = 0;
      do {
        wordId = Math.round(Math.random() * (this.words.length - 1));
      } while (wordId === this.numOfQuestion);
      translateWord.textContent = `${this.words[wordId].wordTranslate}`;
    } else {
      translateWord.textContent = `${this.words[this.numOfQuestion].wordTranslate}`;
    }
  }

  private gameStart() {
    if (this.timeLeft > 0 && this.numOfQuestion < this.words.length) {
      this.timeLeft -= 1;
      this.component.querySelector<HTMLElement>('#timer-sec-left').textContent = `${this.timeLeft}`;
      setTimeout(() => this.gameStart(), 1000);
    } else {
      this.gameEnded = true;
      this.renderResult();
    }
  }

  authRender(auth: AuthContext): void {
    const execution = (pageIdOld: number): Promise<number> => {
      let result: Promise<number>;
      let pageId = pageIdOld;
      if (auth.id === '') {
        if (pageId < 0) {
          pageId = maxNumTextBookSubPage - 1;
        }
        result = loadWordsFromPages(this.book.groupId, pageId).then((words) => {
          words.forEach((word) => this.words.push(word));
          return Promise.resolve(pageId);
        });
      } else {
        result = this.aggregator(auth, pageId, this.words.length + maxNumQuestion);
      }
      return result.then((pageIdLast) => Promise.resolve(pageIdLast - 1));
    };

    const executer: Promise<number> = execution(this.book.pageId);
    executer.then((pageIdNew) => {
      this.setContent();
      this.gameStart();
      const additionalWord = (pageId: number) => {
        if (this.words.length - this.numOfQuestion < maxNumQuestion) {
          execution(pageId).then((pageIdNext) => {
            setTimeout(additionalWord, 1000, pageIdNext);
          });
        } else {
          setTimeout(additionalWord, 500, pageId);
        }
      };
      additionalWord(pageIdNew);
    });
  }

  setAuthHandler(auth: AuthContext): void {
    const buttons = this.component.querySelector<HTMLElement>('.answers-wrapper');

    const rightAnswer = (num: number) => {
      const dataDefualt = {
        difficulty: 'default',
        optional: {
          audiocall: { totalRight: 0, rightInRow: 0 },
          sprint: { totalRight: 1, rightInRow: 1 },
        },
      };

      this.fetchWord(auth, num, dataDefualt).then((data) => {
        const output = { difficulty: data.difficulty, optional: data.optional };
        if (output.optional === undefined) {
          output.optional = {
            audiocall: { totalRight: 0, rightInRow: 0 },
            sprint: { totalRight: 1, rightInRow: 1 },
          };
        } else if (output.optional.sprint !== undefined) {
          output.optional.sprint.totalRight += 1;
          output.optional.sprint.rightInRow += 1;
        } else {
          output.optional.sprint = { totalRight: 1, rightInRow: 1 };
        }
        switch (data.difficulty) {
          case 'hard':
            if (output.optional.sprint.rightInRow >= 5) {
              output.difficulty = 'learned';
            }
            break;
          case 'learned':
            break;
          case 'default':
            if (output.optional.sprint.rightInRow >= 3) {
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
        } else if (output.optional.sprint !== undefined) {
          output.optional.sprint.rightInRow = 0;
        } else {
          output.optional.sprint = { totalRight: 0, rightInRow: 0 };
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
      const englishWord = this.component.querySelector<HTMLElement>('.eng-word');
      const translateWord = this.component.querySelector<HTMLElement>('.translation-word');

      const isRight: boolean = (
        translateWord.textContent === this.words[this.numOfQuestion].wordTranslate);

      let answer = 0;
      switch (target.id) {
        case 'correct':
          answer = 1;
          break;
        case 'wrong':
          answer = 2;
          break;
        default:
          break;
      }
      if (answer > 0) {
        if ((answer === 1 && isRight) || (answer === 2 && !isRight)) {
          this.result.push(true);
          englishWord.style.color = '#b7f54d';
          this.rightInRow += 1;
          if (this.rightInRow === maxCorrectInRow) {
            this.rightInRow = 0;
            this.valueOfCorrect += increaseValueOfCorrect;
          }
          this.score += this.valueOfCorrect;
          if (auth.id !== '') {
            rightAnswer(this.numOfQuestion);
          }
        } else if ((answer === 1 && !isRight) || (answer === 2 && isRight)) {
          this.result.push(false);
          englishWord.style.color = '#f58b4d';
          this.valueOfCorrect = initialValueOfCorrect;
          this.rightInRow = 0;
          if (auth.id !== '') {
            incorrectAnswer(this.numOfQuestion);
          }
        }
        this.numOfQuestion += 1;
        setTimeout(() => this.setContent(), 200);
      }
    };
  }

  setHandler(): void {
    this.setHandlerResult();
  }
}
