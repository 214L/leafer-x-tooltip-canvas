import { IPenInputData, IPenData, IPen, ILeaf } from '@leafer-ui/interface'
import {
  registerUI,
  dataProcessor,
  Pen,
  PenData,
  Text,
  dataType,
} from 'leafer-ui'

interface IPopup extends IPen {
  target?: ILeaf
  isShow: boolean
  showTimerId?: number | NodeJS.Timeout | null
  hideTimerId?: number | NodeJS.Timeout | null
  showDelay?: number
  hideDelay?: number
  createShapes(): void
  show(): void
  hide(immediate?: boolean): void
  update(pos: { x: number; y: number }): void
}

export interface IPopupInputData extends IPenInputData {
  target?: ILeaf
  showDelay?: number
  hideDelay?: number
  pointerPos?: { x: number; y: number }
}

export interface IPopupData extends IPenData {
  target?: ILeaf
  pointerPos?: { x: number; y: number }
}

export class PopupData extends PenData implements IPopupData {
  target?: ILeaf
  timerId?: number | NodeJS.Timeout | null
  pointerPos?: { x: number; y: number }
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
  public declare pointerPos?: { x: number; y: number }

  @dataType()
  public declare showTimerId?: number | NodeJS.Timeout | null

  @dataType()
  public declare hideTimerId?: number | NodeJS.Timeout | null

  @dataType(0)
  public declare hideDelay?: number

  @dataType(500)
  public declare showDelay?: number

  @dataType(false)
  public declare isShow: boolean

  @dataType()
  public declare target?: ILeaf

  constructor(data: IPopupInputData) {
    super(data)
    this.target = data.target
    this.show()
  }

  public createShapes(pos = this.__.pointerPos): void {
    this.clear() // 清除之前创建的路径
    this.setStyle({
      fill: 'white',
      windingRule: 'evenodd',
      stroke: 'black',
    })
    this.roundRect(pos.x, pos.y, 80, 40, 10)
    this.add(
      new Text({
        className: 'leafer-x-popup',
        x: pos.x + 25,
        y: pos.y + 10,
        fill: 'black',
        text: this.target.name,
      })
    )
    this.isShow = true
  }

  public show(pos = this.__.pointerPos) {
    //开始显示流程
    this.showTimerId = setTimeout(() => {
      this.createShapes(pos)
      clearTimeout(this.showTimerId)
      this.showTimerId = null
    }, this.showDelay)
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
      }, this.hideDelay)
    }
  }

  public update(pos: { x: number; y: number }) {
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
