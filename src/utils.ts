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
  const str = handleContent(target, config)
  const { fontSize, fontFamily, fontWeight, padding } = config.style
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

  const { width, height } = box.getBounds()
  return { width, height, text: str }
}

function handleContent(target: ILeaf, config: IUserConfig) {
  let str = ''
  const data = target as { [key: string]: any }
  
  // 如果formatter函数存在，则使用formatter函数进行格式化
  if (config.formatter(data) !== undefined) {
    str = config.formatter(data)
  } else {
    // 如果formatter函数不存在，则根据showType进行默认格式化
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
