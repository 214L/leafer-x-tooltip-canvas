# leafer-x-tooltip-canvas

## 插件简介

leafer-x-tooltip-canvas 是 [Leafer-ui](https://leaferjs.com/ui/) 的第三方 tooltip 插件，用于向用户展示信息。

<!-- - [在线体验（尚未完成）]() -->

## 快速上手

### 安装

```node
npm i leafer-x-tooltip-canvas --save
```

### 使用方法

使用插件时，创建一个插件实例，并传入 `App` 或者 `Leafer` 实例。（推荐使用`App`）

如果传入的是 `App`,会在`sky`层中绘制弹窗，如果传入的是 `Leafer`，会在传入的`Leafer`层中绘制弹窗。

> 请注意：如果传入`App`时尚未创建`sky`层，会自动创建`sky`层

```js
import { TooltipPlugin } from 'leafer-x-'
const app = new App({ view: window })
//new TooltipPlugin时可传入第二个参数用作用户配置
const plugin = new TooltipPlugin(app)
```

### 配置项

配置项可在创建 tooltipPlugin 实例时作为第二个参数传入

```js
new TooltipPlugin(app, {
  info: ['width', 'height', 'innerId'],
  includesType: ['Rect'],
  excludesType: [],
  ...
})
```

具体配置项如下
|字段|类型|默认值|说明|
|:-:|:-:|:-:|:-:|
|info|Array\<string>|['tag']|展示的属性字段|
|showDelay|number|500|延迟显示的时间|
|hideDelay|number|0|延迟隐藏的时间|
|includesType|Array\<string>|[]|需要显示 tooltip 的元素，传入元素的 tag|
|excludesType|Array\<string>|[]|不需要显示 tooltip 的元素，传入元素的 tag|
|offset|Array\<number>|[5, 5]|tooltip 相对于鼠标位置的偏移量|
|theme|string|'light'|主题，可选值：'light'、'dark'|
|style|IStyle|见下表|tooltip 的样式配置|

IStyle 属性
|字段|类型|默认值|说明|
|:-:|:-:|:-:|:-:|
|backgroundColor|string|"white"|tooltip 的背景颜色|
|stroke|string|"black"|tooltip 框线颜色|
|color|string|"black"|tooltip 文本颜色|
|borderRadius|number|8|tooltip 框线圆角|
|padding|number|8|tooltip 内边距|
|fontSize|number|14|tooltip 文本大小|
|fontWeight|number|400|tooltip 文本粗细|
|fontFamily|string|"Punctuation SC"|tooltip 文本字体,同 css 多个字体用逗号隔开|

### todo

- 显示/隐藏
  - [x] 基本显示隐藏
  - [x] 延迟显示隐藏
- 样式
  - [ ] 三角箭头
  - [x] 黑白主题
  - [x] 自定义主题
- 位置
  - [x] offset
  - [x] 相对鼠标位置
  - [ ] 相对元素位置
  - [ ] 显示避让逻辑
- 信息
  - [x] 自定义信息
- 交互
  - [x] 包括/忽略类型功能
  - [ ] 触发方式
  - [ ] 虚拟触发


  [Github](https://github.com/214L/leafer-x-popup-canvas)

<style>
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th, td {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
  }
  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
</style>
