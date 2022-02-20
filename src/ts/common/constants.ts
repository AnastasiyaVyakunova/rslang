export enum PageName {
  undefined,
  main,
  textbook,
  sprint,
  audiocall,
  statistics,
}

export const maxNumTextBookSubPage = 30;
export const numSubPageButton = 5;
export const baseUrl = 'https://rslang-heroku.herokuapp.com/';
export const filterHardWord = '{"userWord.difficulty":"hard"}';
export const filterLearnedWord = '{"userWord.difficulty":"learned"}';
