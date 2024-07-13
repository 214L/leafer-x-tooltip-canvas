import { App, PointerEvent } from '@leafer-ui/core'
import type {
  IEventListenerId,
  ILeaf,
  ILeafer,
} from '@leafer-ui/interface'
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
    this.pointEventId = this.initEvent()
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
    return this.instance.on_(PointerEvent.MOVE, this.handlePointMove, this)
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

    const target = this.filterTarget(result.throughPath.list)
    if (!target) {
      this.hideTooltip()
      return
    }

    if (!this.handleAllowed(target)) {
      this.hideTooltip()
      return
    }

    this.handleTooltip(event, target)
  }

  private filterTarget(list: ILeaf[]): ILeaf | null {
    const ignoreTag = ['Leafer', 'App']
    const pureResult = list.filter((item) => {
      if (
        ignoreTag.includes(item?.tag) ||
        item?.parent?.tag === 'Tooltip' ||
        item?.className === 'leafer-x-tooltip'
      ) {
        return false
      }
      return true
    })

    return pureResult[pureResult.length - 1] || null
  }

  /**
   * @description 处理显示许可
   * @param target 目标节点
   * @returns
   */
  private handleAllowed(target: ILeaf) {
    const infoArr = ['#' + target.id, '.' + target.className, target.tag]
    const { includesType, excludesType } = this.config

    if (includesType.length === 0 && excludesType.length === 0) return true

    const isInclude = infoArr.some((string) => includesType.includes(string))
    const isExclude = infoArr.some((string) => excludesType.includes(string))

    if (!isExclude && includesType.length === 0) return true
    if (!isInclude && excludesType.length === 0) return false
    return isInclude || !isExclude
  }

  /**
   * @description 隐藏 tooltip
   */
  private hideTooltip() {
    const tooltipList = this.aimLeafer.find('Tooltip') as Tooltip[]
    tooltipList.forEach((tooltip: Tooltip) => {
      tooltip.hide()
    })
  }

  /**
   * @description 创建或更新 tooltip
   */
  private handleTooltip(event: PointerEvent, target: ILeaf) {
    const id = getTooltipId(target)
    const tooltipList = this.aimLeafer.find('Tooltip') as Tooltip[]

    let processed = false
    for (const tooltip of tooltipList) {
      if (tooltip.id === id) {
        tooltip.update({ x: event.x, y: event.y })
        processed = true
      } else {
        tooltip.hide()
      }
    }

    if (!processed) {
      this.aimLeafer.add(
        new Tooltip({
          id,
          pointerPos: { x: event.x, y: event.y },
          target,
          config: this.config,
        })
      )
    }
  }

  /**
   * @description 销毁
   */
  public destroy() {
    const tooltipList = this.aimLeafer.find('Tooltip') as Tooltip[]
    if (tooltipList) {
      tooltipList.forEach((tooltip) => {
        tooltip.destroyTooltip()
        tooltip.parent.remove(tooltip)
      })
    }
    this.instance.off_(this.pointEventId)
    this.instance = null
    this.aimLeafer = null
  }
}
