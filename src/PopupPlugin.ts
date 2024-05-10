import { App, LeaferEvent, PointerEvent } from '@leafer-ui/core'
import type { IEventListenerId, ILeaf, ILeafer } from '@leafer-ui/interface'
import { IUserConfig } from './interface'
import { Popup } from './Popup'
import { getPopupId } from './utils'
export class PopupPlugin {
  /**
   * @param instance 实例
   * @private
   */
  private readonly instance: ILeafer | App
  private aimLeafer: ILeafer
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

  constructor(instance: ILeafer | App, config: IUserConfig) {
    this.instance = instance
    this.config = config
    this.bindEventIds = []
    this.initState()
    this.initEvent()
  }

  /**
   * @description 初始化状态
   */
  private initState() {
    if (this.instance.isApp) {
      const app = this.instance as App
      //app模型渲染
      if (app.sky === undefined) {
        app.sky = app.addLeafer({
          type: 'draw',
          usePartRender: false,
        })
      }
      this.aimLeafer = app.sky
    } else if (this.instance.isLeafer) {
      //leafer模式渲染
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
    const viewReadyId = this.instance.on_(
      LeaferEvent.VIEW_READY,
      this.viewReadyEvent,
      this
    )
    this.bindEventIds.push(pointEventId, viewReadyId)
  }

  /**
   * @description 处理鼠标移动事件
   * @param event
   * @private
   */
  private handlePointMove(event: PointerEvent) {
    const target = event.target
    // console.log(event)

    if (target.tag === 'Popup' || target.parent?.tag === 'Popup') {
      return
    }
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
    this.handlePopup(event)
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
   * @description app view加载完成事件
   * @private
   */
  private viewReadyEvent() {}

  /**
   * @description 隐藏 popup
   */
  private hidePopup() {}

  /**
   * @description 获取已经创建的popup
   * @param id string popup id
   */
  private getPopup(id: string) {
    return this.aimLeafer.findOne(`#${id}`)
  }
  /**
   * @description 创建popup
   */
  private handlePopup(event: PointerEvent) {
    const target = event.target
    // console.log(event)

    const id = getPopupId(target)
    const popup = this.aimLeafer.findOne(`#${id}`) as Popup
    if (popup) {
      //该元素已存在
      popup.createShapes({ x: event.x, y: event.y })
    } else {
      this.aimLeafer.add(
        new Popup({ fill: 'blue', id, pointerPos: { x: event.x, y: event.y } })
      )
    }
  }
}

export class SelectEvent extends Event {}
