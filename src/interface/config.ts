interface IUserConfig {
  reference?: 'pointer' | 'element'
  effect?: 'dark' | 'light'
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
}
export type { IUserConfig }
