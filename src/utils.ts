import { Box } from 'leafer-ui'
import { ILeaf } from '@leafer-ui/interface'
import { IUserConfig } from './interface'
import { ShowType } from './constants'

/**
 * @description 文本尺寸缓存,避免重复计算
 */
const textSizeCache = new Map<string, { width: number; height: number }>()

/**
 * @description 获取uuid 考虑兼容性问题采用此方法
 * @param length id长度
 * @returns
 */
export const getTooltipId = function (target: ILeaf) {
  return target.tag + target.innerId
}

export const handleTextStyle = function (target: ILeaf, config: IUserConfig) {
  // 参数校验
  if (!target || !config) {
    console.error('handleTextStyle: Invalid parameters')
    return { width: 100, height: 30, text: '' }
  }

  const str = handleContent(target, config)
  const { fontSize, fontFamily, fontWeight, padding } = config.style

  // 生成缓存 key,包含所有影响尺寸的因素
  const cacheKey = `${str}:${fontSize}:${fontFamily}:${fontWeight}:${padding}`

  // 检查缓存
  if (textSizeCache.has(cacheKey)) {
    const cached = textSizeCache.get(cacheKey)!
    return { ...cached, text: str }
  }

  try {
    const box = new Box({
      children: [
        {
          tag: 'Text',
          text: str,
          fontSize,
          fontFamily,
          fontWeight,
          padding,
        },
      ],
    })

    const bounds = box.getBounds()
    // 检查 bounds 是否有效
    if (!bounds || bounds.width === undefined || bounds.height === undefined) {
      console.warn('handleTextStyle: Invalid bounds, using default size')
      return { width: 100, height: 30, text: str }
    }

    const { width, height } = bounds

    // 存入缓存
    textSizeCache.set(cacheKey, { width, height })

    return { width, height, text: str }
  } catch (error) {
    console.error('handleTextStyle: Failed to calculate text size', error)
    return { width: 100, height: 30, text: str }
  }
}

function handleContent(target: ILeaf, config: IUserConfig) {
  let str = ''
  // 保持 ILeaf 类型，使用 Record 进行更安全的索引访问
  const data = target as ILeaf & Record<string, unknown>

  // 如果formatter函数存在，则使用formatter函数进行格式化
  if (config.formatter && typeof config.formatter === 'function') {
    try {
      const formatted = config.formatter(data)
      if (formatted !== undefined) {
        str = formatted
      }
    } catch (error) {
      console.error('handleContent: Formatter function error', error)
      // formatter 失败时降级到默认格式化
    }
  }

  // 如果formatter函数不存在或执行失败，则根据showType进行默认格式化
  if (!str) {
    if (config.showType === ShowType.VALUE) {
      str += config.info
        .map((dataName: string) => {
          const value = data[dataName]
          // 检查值是否存在且可转换为字符串
          return value !== null && value !== undefined ? String(value) : ''
        })
        .join('\n')
    } else if (config.showType === ShowType.KEY_VALUE) {
      str += config.info
        .map((dataName: string) => {
          const value = data[dataName]
          // 检查值是否存在且可转换为字符串
          const displayValue = value !== null && value !== undefined ? String(value) : ''
          return `${dataName} : ${displayValue}`
        })
        .join('\n')
    }
  }

  return str
}
