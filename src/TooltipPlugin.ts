import { App, PointerEvent } from '@leafer-ui/core'
import type { IEventListenerId, ILeaf, ILeafer } from '@leafer-ui/interface'
import { IUserConfig } from './interface'
import { Tooltip } from './Tooltip'
import { getTooltipId } from './utils'
import { defaultConfig } from './defaultConfig'
import { TOOLTIP_TAG, TOOLTIP_CLASS_NAME } from './constants'

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

  /**
   * @param tooltipCache - Tooltip 实例缓存,避免重复 DOM 查询
   * @private
   */
  private tooltipCache: Map<string, Tooltip> = new Map()

  /**
   * @param 类型过滤 Set 缓存,将数组转为 Set 提升查询性能 O(n) -> O(1)
   * @private
   */
  private includesTypeSet: Set<string> = new Set()
  private excludesTypeSet: Set<string> = new Set()
  private ignoreTypeSet: Set<string> = new Set()

  /**
   * @description Debug 日志输出
   * @private
   */
  private log(...args: unknown[]) {
    if (this.config.debug) {
      console.log('[TooltipPlugin]', ...args)
    }
  }

  constructor(instance: ILeafer | App, config?: IUserConfig) {
    this.instance = instance
    this.config = this.mergeConfig(defaultConfig, config)
    this.handleConfig()
    this.initState()
    this.pointEventId = this.initEvent()
  }

  /**
   * @description 深度合并配置,避免实例间相互影响
   * @private
   */
  private mergeConfig(base: IUserConfig, override?: IUserConfig): IUserConfig {
    if (!override) {
      // 深拷贝默认配置
      return {
        ...base,
        style: { ...base.style },
        includesType: [...(base.includesType || [])],
        excludesType: [...(base.excludesType || [])],
        ignoreType: [...(base.ignoreType || [])],
        info: [...(base.info || [])],
      }
    }

    // 深度合并用户配置
    return {
      ...base,
      ...override,
      style: {
        ...base.style,
        ...override.style,
      },
      includesType: override.includesType || base.includesType,
      excludesType: override.excludesType || base.excludesType,
      ignoreType: override.ignoreType || base.ignoreType,
      info: override.info || base.info,
    }
  }

  /**
   * @description 类型守卫: 判断实例是否为 App
   * @private
   */
  private isAppInstance(instance: ILeafer | App): instance is App {
    return instance.isApp === true
  }

  /**
   * @description 初始化状态
   */
  private initState() {
    if (this.isAppInstance(this.instance)) {
      // TypeScript 自动推断 this.instance 为 App 类型
      if (this.instance.sky === undefined) {
        this.instance.sky = this.instance.addLeafer({
          type: 'draw',
          usePartRender: false,
        })
      }
      this.aimLeafer = this.instance.sky
    } else if (this.instance.isLeafer) {
      this.aimLeafer = this.instance
    } else {
      throw new Error('TooltipPlugin: Instance must be either App or Leafer')
    }
  }

  private handleConfig() {
    if (this.config.theme === 'dark') {
      this.config.style.backgroundColor = 'black'
      this.config.style.color = 'white'
    }

    // 初始化类型过滤 Set,提升查询性能
    this.includesTypeSet = new Set(this.config.includesType || [])
    this.excludesTypeSet = new Set(this.config.excludesType || [])
    this.ignoreTypeSet = new Set(this.config.ignoreType || [])
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

    const allowed = this.handleAllowed(target)
    if (!allowed) {
      this.hideTooltip()
      return
    }
    this.handleTooltip(event, target)
  }
  private filterTarget(list: ILeaf[]): ILeaf | null {
    const { throughExcludes } = this.config

    const pureResult = list.filter((item) => {
      // 使用 Set.has() 代替 Array.includes(),性能提升
      const shouldIgnore = this.ignoreTypeSet.has(item?.tag)
      const shouldExclude = throughExcludes && this.excludesTypeSet.has(item?.tag)

      if (
        shouldIgnore ||
        shouldExclude ||
        item?.parent?.tag === TOOLTIP_TAG ||
        item?.className === TOOLTIP_CLASS_NAME
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
  private handleAllowed(target: ILeaf): boolean {
    const targetIdentifiers = ['#' + target.id, '.' + target.className, target.tag]

    const hasIncludesRule = this.includesTypeSet.size > 0
    const hasExcludesRule = this.excludesTypeSet.size > 0

    // 如果没有配置任何过滤规则,默认允许
    if (!hasIncludesRule && !hasExcludesRule) {
      this.log('allowed', { target: target.tag, result: true, reason: 'no rules' })
      return true
    }

    const matchesInclude = targetIdentifiers.some((id) => this.includesTypeSet.has(id))
    const matchesExclude = targetIdentifiers.some((id) => this.excludesTypeSet.has(id))

    // includes 优先级高于 excludes
    if (matchesInclude) {
      this.log('allowed', { target: target.tag, result: true, reason: 'matches include' })
      return true  // 匹配白名单,直接允许(即使也在黑名单中)
    }
    if (matchesExclude) {
      this.log('allowed', { target: target.tag, result: false, reason: 'matches exclude' })
      return false  // 不在白名单但在黑名单,拒绝
    }

    // 两者都不匹配的情况
    if (hasIncludesRule) {
      this.log('allowed', { target: target.tag, result: false, reason: 'has include rule but not matched' })
      return false  // 有白名单规则但不匹配 → 拒绝
    }
    this.log('allowed', { target: target.tag, result: true, reason: 'only exclude rule, not matched' })
    return true  // 只有黑名单规则且不匹配 → 允许
  }

  /**
   * @description 隐藏 tooltip
   */
  private hideTooltip() {
    // 使用缓存而不是 DOM 查询,提升性能
    // 同时清理已销毁的实例
    const invalidIds: string[] = []

    this.tooltipCache.forEach((tooltip, id) => {
      if (tooltip.parent) {
        tooltip.hide()
      } else {
        // 标记无效的缓存条目
        invalidIds.push(id)
      }
    })

    // 清理无效缓存
    invalidIds.forEach(id => this.tooltipCache.delete(id))
  }

  /**
   * @description 创建或更新 tooltip
   */
  private handleTooltip(event: PointerEvent, target: ILeaf) {
    const id = getTooltipId(target)

    // 隐藏其他 tooltip
    this.tooltipCache.forEach((tooltip, cacheId) => {
      if (cacheId !== id) {
        tooltip.hide()
      }
    })

    // 检查缓存中的实例是否仍然有效(未被销毁)
    const cachedTooltip = this.tooltipCache.get(id)
    if (cachedTooltip && cachedTooltip.parent) {
      // 实例有效,直接更新
      this.log('tooltip update', { id, x: event.x, y: event.y })
      cachedTooltip.update({ x: event.x, y: event.y })
    } else {
      // 实例已被销毁或不存在,移除无效缓存并创建新实例
      if (cachedTooltip) {
        this.tooltipCache.delete(id)
      }

      this.log('tooltip create', { id, x: event.x, y: event.y, target: target.tag })
      const tooltip = new Tooltip({
        id,
        pointerPos: { x: event.x, y: event.y },
        target,
        config: this.config,
      })
      this.aimLeafer.add(tooltip)
      this.tooltipCache.set(id, tooltip)
    }
  }

  /**
   * @description 销毁
   */
  public destroy() {
    // 防止重复销毁
    if (!this.instance) return

    // 清理缓存中的所有 tooltip
    if (this.tooltipCache) {
      this.tooltipCache.forEach((tooltip) => {
        tooltip.destroyTooltip()
        // 使用可选链,防止 parent 为 null/undefined
        tooltip.parent?.remove(tooltip)
      })
      this.tooltipCache.clear()
    }

    // 确保事件被正确清理
    if (this.pointEventId) {
      this.instance.off_(this.pointEventId)
    }

    this.instance = null
    this.aimLeafer = null
  }
}
