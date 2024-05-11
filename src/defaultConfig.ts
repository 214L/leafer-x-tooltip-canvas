import { IUserConfig } from './interface'
export const defaultConfig: IUserConfig = {
  reference: 'pointer',
  effect: 'light',
  info: ['tag'],
  showDelay: 500,
  hideDelay: 0,
  arrow: false,
  placement: 'right-end',
  offset: [5, 5],
  preventOverflow: false,
  includesType: [],
  excludesType: [],
}
