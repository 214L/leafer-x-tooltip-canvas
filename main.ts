import { Leafer, App, Rect } from 'leafer-ui'

import { PopupPlugin } from './src' // 引入插件代码

const leafer = new Leafer({ view: window })

const rect = new Rect({
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fill: '#32cd79',
  draggable: true,
})
const rect2 = new Rect({
  x: 300,
  y: 100,
  width: 100,
  height: 100,
  className: 'classNameString',
  fill: '#32cd79',
  draggable: true,
})

const rect3 = new Rect({
  x: 500,
  y: 100,
  width: 100,
  height: 100,
  id: 'idString',
  fill: '#32cd79',
  draggable: true,
})

leafer.add(rect)
leafer.add(rect2)
leafer.add(rect3)

new PopupPlugin(leafer, {
  includesType: ['Rect'],
  excludesType: ['Rect'],
})
console.log(leafer)
