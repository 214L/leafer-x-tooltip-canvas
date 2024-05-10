import { Leafer, LeaferEvent, PointerEvent } from '@leafer-ui/core'
import type { IEventListenerId, ILeaf } from '@leafer-ui/interface'
import { IUserConfig } from './interface'

export class PopupPlugin {
  /**
   * @param app Leafer 实例
   * @private
   */
  private readonly app: Leafer

  /**
   * @param config 用户配置
   * @private
   */
  private readonly config: IUserConfig

  /**
   * @param currentTarget - 鼠标移动到的节点
   * @private
   */
  private currentTarget: ILeaf
  /**
   * @param bindEventIds - 绑定的事件 id
   * @private
   */
  private readonly bindEventIds: Array<IEventListenerId>

  constructor(app: Leafer, config: IUserConfig) {
    this.app = app
    this.config = config
    this.bindEventIds = []
    this.initEvent()
  }

  /**
   * @description 初始化事件处理
   * @private
   */
  private initEvent() {
    const pointEventId = this.app.on_(
      PointerEvent.MOVE,
      this.handlePointMove,
      this
    )
    const viewReadyId = this.app.on_(
      LeaferEvent.VIEW_READY,
      this.viewReadyEvent,
      this
    )
    this.bindEventIds.push(pointEventId, viewReadyId)
  }

  /**
   * @description leafer 鼠标移动事件
   * @param event
   * @private
   */
  private handlePointMove(event: PointerEvent) {
    const target = event.target

    if (!target || target.isLeafer) {
      this.hidePopup()
      return
    }
    const isAllowed = this.handleAllowed(target)
    if (!isAllowed) {
      this.hidePopup()
      return
    }
    this.currentTarget = target
  }

  /**
   * @description 处理显示许可
   * @param target 目标节点
   * @returns
   */
  private handleAllowed(target: ILeaf) {
    const infoArr = ['#' + target.id, '.' + target.className, target.tag]
    const isInclude = infoArr.some((string) =>
      this.config.includesType.includes(string)
    )
    const isExclude = infoArr.some((string) =>
      this.config.excludesType.includes(string)
    )
    if (isInclude || !isExclude) return true
    return false
  }
  /**
   * @description leafer view 加载完成事件
   * @private
   */
  private viewReadyEvent() {}

  /**
   * @description 隐藏 popups
   */
  private hidePopup() {}
}

export class SelectEvent extends Event {}
