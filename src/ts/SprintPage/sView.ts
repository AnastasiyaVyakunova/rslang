import domFactory from './domFactory';

import ScoreView from './scoreView';

import { GameAnswer, WordContent } from '../common/types';

export default class SpritGameView {
  domNode: HTMLElement;

  private gameTimer = 60;

  private intervalIdentifer: any;

  private gameScore = 0;

  private curentQuestionIndex = 0;

  private gameAnswers: Array<GameAnswer> = [];

  private currentCorrectAnswer: boolean;

  recivedData: Array<WordContent>;

  constructor(resp: Array<WordContent>) {
    this.recivedData = resp;

    this.domNode = domFactory({
      className: 'sprint-game-container',
      useTemplate: `
      <section class="sprint-game">
  <div class="wrapper sprint-game-wrapper">
    <div class="sprint-game_content">
      <span class="sprint_score">0</span>
      <div class="words-wrapper">
        <p class="eng-word">Capital</p>
        <p class="translation-word">Столица</p>
      </div>
      <div class="timer-wrapper">
        <div class="timer_icon"></div>
        <span id="timer-counter">60</span>
      </div>
    </div>
    <div class="answers-wrapper">
      <button class="btn-correct">Верно</button>
      <button class="btn-wrong">Неверно</button>
    </div>
  </div>
</section>


      `,
    });

    console.log(this.recivedData.length);
    this.startGame();

    this.generateQuestion();

    // attach handlers
    const correctAnswerBtn = this.domNode.querySelector('.btn-correct');
    const wrongAnswerBtn = this.domNode.querySelector('.btn-wrong');

    correctAnswerBtn.addEventListener('click', (evt: Event) => {
      this.correctAnswerHandler(evt);
    });

    wrongAnswerBtn.addEventListener('click', (evt: Event) => {
      this.wrongAnswerHandler(evt);
    });
  }

  correctAnswerHandler(event: Event) {
    console.log('correct answer btn triggereed');

    if (this.currentCorrectAnswer === true) {
      this.recordAnswer(true);
      this.gameScore += 1;
    } else {
      this.recordAnswer(false);
    }

    this.rerenderScore();

    this.generateQuestion();
  }

  wrongAnswerHandler(event: Event) {
    console.log('wrong answer btn triggereed');

    if (this.currentCorrectAnswer === false) {
      this.recordAnswer(true);
      this.gameScore += 1;
    } else {
      this.recordAnswer(false);
    }
    this.rerenderScore();

    this.generateQuestion();
  }

  tickTimer() {
    const timer = this.domNode.querySelector('#timer-counter');
    timer.innerHTML = this.gameTimer.toString();
    this.gameTimer -= 1;

    if (this.gameTimer === -1) {
      this.stopGame();
      console.log('game stopped');
    }
  }

  startGame() {
    const intervalID = setInterval(() => this.tickTimer(), 1000);
    // console.log(intervalID);
    this.intervalIdentifer = intervalID;
  }

  stopGame() {
    clearInterval(this.intervalIdentifer);
    // execute statistics
    this.showFinishScorePage();
  }

  generateQuestion() {
    if (this.curentQuestionIndex >= this.recivedData.length - 1) {
      this.stopGame();
      return;
    }

    const wordToTranslate = this.domNode.querySelector('.eng-word');
    const translationProposal = this.domNode.querySelector('.translation-word');

    const makeCorrectQAPair = () => {
      wordToTranslate.innerHTML =
        this.recivedData[this.curentQuestionIndex].word;
      translationProposal.innerHTML =
        this.recivedData[this.curentQuestionIndex].wordTranslate;

      this.currentCorrectAnswer = true;

      this.curentQuestionIndex += 1;
      console.log('correct pair ggenerated');
    };

    const makeWrongQAPair = () => {
      wordToTranslate.innerHTML =
        this.recivedData[this.curentQuestionIndex].word;
      translationProposal.innerHTML =
        this.recivedData[
          this.getRandomInt(0, this.recivedData.length)
        ].wordTranslate;

      this.currentCorrectAnswer = false;

      this.curentQuestionIndex += 1;
      console.log('wrong pair ggenerated');
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    Math.round(Math.random()) ? makeCorrectQAPair() : makeWrongQAPair();
  }

  // eslint-disable-next-line class-methods-use-this
  getRandomInt(min: number, max: number) {
    const minimum = Math.ceil(min);
    const maximum = Math.floor(max);
    return Math.floor(Math.random() * (maximum - minimum)) + minimum;
  }

  rerenderScore() {
    const scoreCounter = this.domNode.querySelector('.sprint_score');
    scoreCounter.innerHTML = this.gameScore.toString();
  }

  showFinishScorePage() {
    this.domNode.replaceChildren(new ScoreView(this.gameAnswers).domNode);
  }

  recordAnswer(recivedUserAnswer: boolean) {
    const answerRecord: GameAnswer = {
      word: this.recivedData[this.curentQuestionIndex].word,
      correctTranslation:
        this.recivedData[this.curentQuestionIndex].wordTranslate,
      isAnsweredCorectly: recivedUserAnswer,
    };

    this.gameAnswers.push(answerRecord);
  }
}
