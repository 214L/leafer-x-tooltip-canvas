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
  createShapes(): void
}

export interface IPopupInputData extends IPenInputData {
  target?: ILeaf
  pointerPos?: { x: number; y: number }
}

export interface IPopupData extends IPenData {
  target?: ILeaf
  pointerPos?: { x: number; y: number }
}

export class PopupData extends PenData implements IPopupData {
  target?: ILeaf
  pointerPos?: { x: number; y: number }
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

  @dataType()
  public declare target?: ILeaf
  constructor(data: IPopupInputData) {
    super(data)
    this.target = data.target
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
    this.add(
      new Text({
        x: pos.x + 25,
        y: pos.y + 10,
        fill: 'black',
        text: this.target.name,
      })
    )
  }
}
