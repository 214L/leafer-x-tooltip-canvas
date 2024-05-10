# leafer-x-popup

## 插件简介

leafer-x-popup 是 [Leafer-ui](https://leaferjs.com/ui/) 的第三方弹窗插件，用于 tooltip 功能或其他场景。

<!-- - [在线体验（尚未完成）]() -->

## 快速上手

### 安装

```node
npm i leafer-x-popup --save
```

### 使用方法

使用插件时，创建一个插件实例，并传入 App 或者 Leafer 实例。（推荐使用 App）

如果传入的是 App,会在 sky 层中绘制弹窗，如果传入的是 Leafer，会在 leafer 层中绘制弹窗。

> 请注意：如果传入 App 时尚未创建 sky 层，会自动创建 sky 层

```
import { PopupPlugin } from 'leafer-x-popup';
const app = new App({ view: window })
//new PopupPlugin时可传入第二个参数用作用户配置
const plugin =new PopupPlugin(app)
```

### 配置项

[Github](https://github.com/214L)

<!-- [更新日志]() -->
<!-- [掘金]() -->
