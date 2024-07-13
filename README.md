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
import { TooltipPlugin } from 'leafer-x-';
const app = new App({ view: window })
//new TooltipPlugin时可传入第二个参数用作用户配置
const plugin =new TooltipPlugin(app)
```

### todo

- 显示/隐藏
  - [x] 基本显示隐藏
  - [x] 延迟显示隐藏
- 样式
  - [ ] 三角箭头
  - [ ] 黑白主题
  - [ ] 自定义主题
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

### 配置项

[Github](https://github.com/214L)

<!-- [更新日志]() -->
<!-- [掘金]() -->
