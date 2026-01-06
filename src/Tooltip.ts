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
import { TOOLTIP_TAG, TOOLTIP_CLASS_NAME } from './constants'

interface ITooltip extends IPen {
  target?: ILeaf
  isShow: boolean
  showTimerId?: number | NodeJS.Timeout | null
  hideTimerId?: number | NodeJS.Timeout | null
  show(): void
  hide(immediate?: boolean): void
  update(pos: IPos): void
}

export interface ITooltipInputData extends IPenInputData {
  target?: ILeaf
  config?: IUserConfig
  pointerPos?: IPos
}

export interface ITooltipData extends IPenData {
  target?: ILeaf
  pointerPos?: IPos
}

export class TooltipData extends PenData implements ITooltipData {
  target?: ILeaf
  timerId?: number | NodeJS.Timeout | null
  pointerPos?: IPos
}

@registerUI()
export class Tooltip extends Pen implements ITooltip {
  public get __tag() {
    return TOOLTIP_TAG
  }
  public className: typeof TOOLTIP_CLASS_NAME
  @dataProcessor(TooltipData)
  public declare __: ITooltipData

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
  constructor(data: ITooltipInputData) {
    super(data)
    this.target = data.target
    this.config = data.config
    this.show()
  }

  /**
   * @description Debug 日志输出
   * @private
   */
  private log(...args: unknown[]) {
    if (this.config?.debug) {
      console.log('[Tooltip]', ...args)
    }
  }

  /**
   * @description tooltip
   * @param pos 位置信息
   */
  private createShapes(pos = this.__.pointerPos): void {
    this.clear() // 清除之前创建的路径
    const { width, height, text } = handleTextStyle(this.target, this.config)
    const {
      backgroundColor,
      stroke,
      color,
      padding,
      borderRadius,
      fontSize,
      fontWeight,
      fontFamily,
    } = this.config.style
    let offset = this.config.offset

    this.log('createShapes', {
      target: {
        tag: this.target?.tag,
        id: this.target?.id,
        className: this.target?.className,
        parent: {
          tag: this.target?.parent?.tag,
          id: this.target?.parent?.id,
        },
      },
      pointer: pos,
      offset,
      renderPos: { x: pos.x + offset[0], y: pos.y + offset[1] },
      size: { width, height },
      style: { backgroundColor, stroke, color, padding, borderRadius, fontSize },
      text,
    })

    this.setStyle({
      fill: backgroundColor,
      stroke,
    })
    this.add(
      new Text({
        className: TOOLTIP_CLASS_NAME,
        fill: color,
        fontSize,
        fontWeight,
        fontFamily,
        x: pos.x + offset[0],
        y: pos.y + offset[1],
        text: text,
        padding,
      })
    )
    this.roundRect(
      pos.x + offset[0],
      pos.y + offset[1],
      width,
      height,
      borderRadius
    )
    this.isShow = true
  }

  private clearShowHideTimers() {
    if (this.showTimerId) {
      clearTimeout(this.showTimerId)
      this.showTimerId = null
    }

    if (this.hideTimerId) {
      clearTimeout(this.hideTimerId)
      this.hideTimerId = null
    }
  }

  public show(pos = this.__.pointerPos) {
    this.clearShowHideTimers()
    this.log('show', { pos, delay: this.config.showDelay, isShow: this.isShow })
    this.showTimerId = setTimeout(() => {
      this.createShapes(pos)
      this.showTimerId = null  // 定时器执行完毕,清空引用
    }, this.config.showDelay)
  }

  public hide(immediate = false) {
    this.clearShowHideTimers()
    this.log('hide', { immediate, delay: this.config.hideDelay, isShow: this.isShow })
    if (immediate) {
      this.destroy()
    } else {
      // 移除 if 判断,确保每次 hide() 都能正确设置定时器
      this.hideTimerId = setTimeout(() => {
        this.destroy()
        this.hideTimerId = null
      }, this.config.hideDelay)
    }
  }

  public update(pos: IPos) {
    this.clearShowHideTimers()
    this.log('update', { pos, isShow: this.isShow })
    if (this.isShow) {
      // 已显示,立即更新位置
      this.createShapes(pos)
    } else {
      // 未显示,启动 show 定时器
      this.show(pos)
    }
  }

  public destroyTooltip() {
    this.clearShowHideTimers()
    this.destroy()
    this.isShow = false
    this.target = undefined
  }
}
