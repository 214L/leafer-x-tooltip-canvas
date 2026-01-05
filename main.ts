import { App, Ellipse, Rect } from 'leafer-ui'

import { TooltipPlugin } from './src' // 引入插件代码
import { Flow } from '@leafer-in/flow'
const app = new App({ view: window, tree: {} })

const rect1 = new Rect({
  name: 'rect1',
  x: 100,
  y: 100,
  width: 100,
  height: 100,
  fill: '#32cd79',
  draggable: true,
  stroke: 'black',
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
  stroke: 'black',
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
  stroke: 'black',
})

app.tree.add(rect1)
app.tree.add(rect2)
app.tree.add(rect3)

const red = new Rect({ fill: '#FF4B4B', width: 20, height: 20 })
const yellow = new Rect({ fill: '#FEB027', width: 20, height: 40 })
const green = new Rect({ fill: '#79CB4D', width: 20, height: 30 })

const flow = new Flow({
  children: [red, yellow, green],
  fill: '#676',
  width: 100,
  height: 100,
})

app.tree.add(flow)
new TooltipPlugin(app, { excludesType: ['Ellipse'], throughExcludes: true })
console.log(app)
