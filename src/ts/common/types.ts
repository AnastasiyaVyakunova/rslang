import { PageName } from './constants';

export type PageContext = {
  pageName: PageName;
  username: string;
  token: string;
};
