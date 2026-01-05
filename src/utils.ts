import { Box } from 'leafer-ui'
import { ILeaf } from '@leafer-ui/interface'
import { IUserConfig } from './interface'
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
    return { width, height, text: str }
  } catch (error) {
    console.error('handleTextStyle: Failed to calculate text size', error)
    return { width: 100, height: 30, text: str }
  }
}

function handleContent(target: ILeaf, config: IUserConfig) {
  let str = ''
  const data = target as { [key: string]: any }

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
    if (config.showType == 'value') {
      str += config.info
        .map((dataName: string) => `${data[dataName]}`)
        .join('\n')
    } else if (config.showType == 'key-value') {
      str += config.info
        .map((dataName: string) => `${dataName} : ${data[dataName]}`)
        .join('\n')
    }
  }

  return str
}
