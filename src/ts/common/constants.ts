export enum PageName {
  undefined,
  main,
  textbook,
  sprint,
  audiocall,
  statistics,
}

export const maxNumTextBookSubPage = 30;
export const maxNumTextBookGroup = 6;
export const numSubPageButton = 5;
export const baseUrl = 'https://rslang-heroku.herokuapp.com/';
export const filterHardWord = '{"userWord.difficulty":"hard"}';
export const filterLearnedWord = '{"userWord.difficulty":"learned"}';
export const maxNumQuestion = 20;
export const timeDurationSec = 60;
export const initialValueOfCorrect = 10;
export const increaseValueOfCorrect = 10;
export const maxCorrectInRow = 4;
