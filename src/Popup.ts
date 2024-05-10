import { IPenInputData, IPenData, IPen } from '@leafer-ui/interface'
import {
  registerUI,
  dataProcessor,
  Pen,
  PenData,
  boundsType,
  dataType,
} from 'leafer-ui'

interface IPopup extends IPen {
  createShapes(): void
}

export interface IPopupInputData extends IPenInputData {
  pointerPos?: { x: number; y: number }
}

export interface IPopupData extends IPenData {
  pointerPos?: { x: number; y: number }
}

export class PopupData extends PenData implements IPopupData {
  protected _size: number

  protected setSize(value: number): void {
    this._size = value
    ;(this.__leaf as Popup).createShapes()
  }
}

@registerUI()
export class Popup extends Pen implements IPopup {
  public get __tag() {
    return 'Popup'
  }

  @dataProcessor(PopupData)
  public declare __: IPopupData

  @dataType({ x: 0, y: 0 })
  public declare pointerPos?: { x: number; y: number }

  constructor(data: IPopupInputData) {
    super(data)
    this.createShapes()
  }

  public createShapes(pos = this.__.pointerPos): void {
    this.clear() // 清除之前创建的路径
    this.setStyle({
      fill: 'white',
      windingRule: 'evenodd',
      stroke: 'black',
    })
    this.roundRect(pos.x, pos.y, 80, 40, 10)
  }
}
