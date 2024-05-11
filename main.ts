import { App, Ellipse, Rect } from 'leafer-ui'

import { PopupPlugin } from './src' // 引入插件代码

const app = new App({ view: window, tree: {} })

const rect1 = new Rect({
  name: 'rect1',
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fill: '#32cd79',
  draggable: true,
})
const rect2 = new Ellipse({
  name: 'ellipse',
  x: 250,
  y: 250,
  width: 100,
  height: 100,
  className: 'classNameString',
  fill: '#12cd79',
  draggable: true,
})

const rect3 = new Rect({
  name: 'rect3',
  x: 500,
  y: 100,
  width: 100,
  height: 100,
  id: 'idString',
  fill: '#32cd79',
  draggable: true,
})

app.tree.add(rect1)
app.tree.add(rect2)
app.tree.add(rect3)

new PopupPlugin(app, {
  info: ['width', 'height', 'innerId'],
  includesType: ['Rect'],
  excludesType: [],
})
console.log(app)
