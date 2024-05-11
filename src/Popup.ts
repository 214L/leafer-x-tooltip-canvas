import { IPenInputData, IPenData, IPen, ILeaf } from '@leafer-ui/interface'
import {
  registerUI,
  dataProcessor,
  Pen,
  PenData,
  Text,
  dataType,
} from 'leafer-ui'
import { IPos, IUserConfig } from './interface'
import { handleTextStyle } from './utils'

interface IPopup extends IPen {
  target?: ILeaf
  isShow: boolean
  showTimerId?: number | NodeJS.Timeout | null
  hideTimerId?: number | NodeJS.Timeout | null
  show(): void
  hide(immediate?: boolean): void
  update(pos: IPos): void
}

export interface IPopupInputData extends IPenInputData {
  target?: ILeaf
  config?: IUserConfig
  pointerPos?: IPos
}

export interface IPopupData extends IPenData {
  target?: ILeaf
  pointerPos?: IPos
}

export class PopupData extends PenData implements IPopupData {
  target?: ILeaf
  timerId?: number | NodeJS.Timeout | null
  pointerPos?: IPos
}

@registerUI()
export class Popup extends Pen implements IPopup {
  public get __tag() {
    return 'Popup'
  }
  public className: 'leafer-x-popup'
  @dataProcessor(PopupData)
  public declare __: IPopupData

  @dataType({ x: 0, y: 0 })
  public declare pointerPos?: IPos

  @dataType()
  public declare showTimerId?: number | NodeJS.Timeout | null

  @dataType()
  public declare hideTimerId?: number | NodeJS.Timeout | null

  @dataType(false)
  public declare isShow: boolean
  @dataType()
  public declare config: IUserConfig

  @dataType()
  public declare target?: ILeaf

  constructor(data: IPopupInputData) {
    super(data)
    this.target = data.target
    this.config = data.config
    this.show()
  }

  /**
   * @description 创建popup图形
   * @param pos 位置信息
   */
  private createShapes(pos = this.__.pointerPos): void {
    this.clear() // 清除之前创建的路径
    const { width, height, text } = handleTextStyle(pos, this)
    this.setStyle({
      fill: 'white',
      stroke: 'black',
    })
    this.add(
      new Text({
        className: 'leafer-x-popup',
        x: pos.x,
        y: pos.y,
        text: text,
        padding: 8,
      })
    )
    this.roundRect(pos.x, pos.y, width, height, height / 8)
    this.isShow = true
  }

  public show(pos = this.__.pointerPos) {
    //开始显示流程
    this.showTimerId = setTimeout(() => {
      this.createShapes(pos)
      clearTimeout(this.showTimerId)
      this.showTimerId = null
    }, this.config.showDelay)
  }

  public hide(immediate = false) {
    if (immediate) {
      clearTimeout(this.showTimerId)
      this.showTimerId = null
      clearTimeout(this.hideTimerId)
      this.hideTimerId = null
      this.clear()
      this.isShow = false
    } else {
      this.hideTimerId = setTimeout(() => {
        clearTimeout(this.showTimerId)
        this.showTimerId = null
        clearTimeout(this.hideTimerId)
        this.hideTimerId = null
        this.clear()
        this.isShow = false
      }, this.config.hideDelay)
    }
  }

  public update(pos: IPos) {
    if (this.isShow) {
      this.createShapes(pos)
    } else {
      clearTimeout(this.showTimerId)
      this.showTimerId = null
      this.show(pos)
    }
  }
  public destroy() {
    this.hide(true)
  }
}
