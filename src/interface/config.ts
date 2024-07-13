interface IUserConfig {
  reference?: 'pointer' | 'element'
  showDelay?: number
  arrow?: boolean
  hideDelay?: number
  placement?:
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'left'
    | 'left-start'
    | 'left-end'
    | 'right'
    | 'right-start'
    | 'right-end'
  offset?: [number, number]
  info?: Array<string>
  preventOverflow?: boolean
  includesType?: Array<string>
  excludesType?: Array<string>
  theme?: 'light' | 'dark'
  style?:IStyleConfig
}
interface IStyleConfig{
  backgroundColor:"",
  color:"",
  borderRadius:"",
  padding:"",
  fontSize:"",
  fontWeight:"",
  fontFamily:"",
  boxShadow:"",
}
export type { IUserConfig }
