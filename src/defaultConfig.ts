import { IUserConfig } from './interface'
export const defaultConfig: IUserConfig = {
  reference: 'pointer',
  info: ['tag'],
  showDelay: 500,
  hideDelay: 0,
  arrow: false,
  placement: 'right-end',
  offset: [5, 5],
  preventOverflow: false,
  includesType: [],
  excludesType: [],
  theme: 'light',
  style:{
    backgroundColor:"white",
    stroke:"black",
    color:"black",
    borderRadius:8,
    padding:8,
    fontSize:14,
    fontWeight:400,
    fontFamily:`"Punctuation SC","Inter",ui-sans-serif,system-ui,"PingFang SC","Noto Sans CJK SC", "Noto Sans SC", "Heiti SC", "Microsoft YaHei", "DengXian", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"`,    
  }
}
