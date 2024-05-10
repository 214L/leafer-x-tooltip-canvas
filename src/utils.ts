import { ILeaf } from '@leafer-ui/interface'
/**
 * @description 获取uuid 考虑兼容性问题采用此方法
 * @param length id长度
 * @returns
 */
export const getPopupId = function (target: ILeaf) {
  return target.tag + target.innerId
}
