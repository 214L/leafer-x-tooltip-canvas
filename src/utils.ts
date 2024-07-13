import { Box } from 'leafer-ui'
import { ILeaf } from '@leafer-ui/interface'
import { IUserConfig } from './interface'
import { Tooltip } from './Tooltip'
/**
 * @description 获取uuid 考虑兼容性问题采用此方法
 * @param length id长度
 * @returns
 */
export const getTooltipId = function (target: ILeaf) {
  return target.tag + target.innerId
}
export const handleTextStyle = function (tooltip?: Tooltip) {
  let target = tooltip.target
  let config = tooltip.config
  const str = handleContent(target, config)
  const {fontSize,fontFamily,fontWeight,padding} = config.style
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
  const infoLength = config.info.length
  if (infoLength === 0) {
    str = data['tag']
  } else if (infoLength === 1 && config.info[0] === 'tag') {
    const dataName = config.info[0]
    str = `${data[dataName]}`
  } else {
    str += config.info
      .map((dataName: string) => `${dataName} : ${data[dataName]}`)
      .join('\n')
  }
  return str
}
