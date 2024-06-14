import { App, PointerEvent } from '@leafer-ui/core'
import type { IEventListenerId, ILeaf, ILeafer } from '@leafer-ui/interface'
import { IUserConfig } from './interface'
import { Tooltip } from './Tooltip'
import { getTooltipId } from './utils'
import { defaultConfig } from './defaultConfig'
export class TooltipPlugin {
  /**
   * @param instance 实例
   * @private
   */
  private instance: ILeafer | App
  private aimLeafer: ILeafer
  /**
   * @param config 用户配置
   * @private
   */
  private readonly config: IUserConfig

  /**
   * @param bindEventIds - 绑定的事件 id
   * @private
   */
  private readonly pointEventId: IEventListenerId

  constructor(instance: ILeafer | App, config?: IUserConfig) {
    this.instance = instance
    this.config = Object.assign({}, defaultConfig, config)
    this.initState()
    const pointEventId = this.initEvent()
    this.pointEventId = pointEventId
  }

  /**
   * @description 初始化状态
   */
  private initState() {
    if (this.instance.isApp) {
      const app = this.instance as App
      if (app.sky === undefined) {
        app.sky = app.addLeafer({
          type: 'draw',
          usePartRender: false,
        })
      }
      this.aimLeafer = app.sky
    } else if (this.instance.isLeafer) {
      this.aimLeafer = this.instance
    }
  }
  /**
   * @description 初始化事件处理
   * @private
   */
  private initEvent() {
    const pointEventId = this.instance.on_(
      PointerEvent.MOVE,
      this.handlePointMove,
      this
    )
    return pointEventId
  }

  /**
   * @description 处理鼠标移动事件
   * @param event
   * @private
   */
  private handlePointMove(event: PointerEvent) {
    const result = this.instance.pick(
      { x: event.x, y: event.y },
      {
        ignoreHittable: true,
        through: true,
      }
    )

    const ignoreTag = ['Leafer', 'App']
    const pureResult = result.throughPath.list.filter((item) => {
      if (
        ignoreTag.includes(item?.tag) ||
        item?.parent?.tag === 'Tooltip' ||
        item?.className === 'leafer-x-tooltip'
      ) {
        return false
      }
      return true
    })
    let target = pureResult[0]

    if (!target) {
      this.hideTooltip()
      return
    }
    const isAllowed = this.handleAllowed(target)
    if (!isAllowed) {
      this.hideTooltip()
      return
    }
    this.handleTooltip(event, target)
  }

  /**
   * @description 处理显示许可
   * @param target 目标节点
   * @returns
   */
  private handleAllowed(target: ILeaf) {
    const infoArr = ['#' + target.id, '.' + target.className, target.tag]
    if (
      this.config.includesType.length === 0 &&
      this.config.excludesType.length === 0
    )
      return true
    const isInclude = infoArr.some((string) =>
      this.config.includesType.includes(string)
    )
    const isExclude = infoArr.some((string) =>
      this.config.excludesType.includes(string)
    )
    if (!isExclude && this.config.includesType.length === 0) return true
    if (!isInclude && this.config.excludesType.length === 0) return false
    if (isInclude || !isExclude) return true
    return false
  }

  /**
   * @description 隐藏 popup
   */
  private hideTooltip() {
    let list = this.aimLeafer.find('Tooltip') as Tooltip[]
    if (list) {
      list.forEach((item) => {
        item.hide()
        item.parent.remove(item)
        item = null
      })
    }
    list = null
  }

  /**
   * @description 创建tooltip
   */
  private handleTooltip(event: PointerEvent, target: ILeaf) {
    const id = getTooltipId(target)
    let tooltip = this.aimLeafer.findOne(`#${id}`) as Tooltip
    if (tooltip) {
      tooltip.update({ x: event.x, y: event.y })
    } else {
      this.aimLeafer.add(
        new Tooltip({
          id,
          pointerPos: { x: event.x, y: event.y },
          target,
          config: this.config,
        })
      )
    }
    tooltip = null
  }

  /**
   * @description 销毁
   */
  public destroy() {
    const list = this.aimLeafer.find('Tooltip') as Tooltip[]
    if (list) {
      list.forEach((item) => {
        item.destroy()
        item.parent.remove(item)
      })
    }
    this.instance = null
    this.aimLeafer = null
    this.instance.off_(this.pointEventId)
  }
}
