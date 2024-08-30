# leafer-x-tooltip-canvas
[English](./README.en.md) | 简体中文

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
import { TooltipPlugin } from 'leafer-x-tooltip-canvas'
const app = new App({ view: window })
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

具体配置项如下，点击字段名可转跳至[详细配置](#详细配置)
 <table class="styled-table jump-table">
  <thead>
    <tr>
      <th>字段</th>
      <th>类型</th>
      <th>默认值</th>
      <th>说明</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><a href="#显示信息">info</a></td>
      <td>Array&lt;string&gt;</td>
      <td>['tag']</td>
      <td>显示的属性字段</td>
    </tr>
  <tr>
      <td><a href="#显示类型">showType</a></td>
      <td>'value'&#124;'key-value'</td>
      <td>'value'</td>
      <td>tooltip信息显示的方式</td>
    </tr>
    <tr>
      <td><a href="#格式化">formatter</a></td>
      <td>() => string</td>
      <td>() => undefined</td>
      <td>格式化tooltip显示内容的函数</td>
    </tr>
    <tr>
      <td><a href="#延迟显示隐藏">showDelay</a></td>
      <td>number</td>
      <td>500</td>
      <td>延迟显示的时间</td>
    </tr>
    <tr>
      <td><a href="#延迟显示隐藏">hideDelay</a></td>
      <td>number</td>
      <td>0</td>
      <td>延迟隐藏的时间</td>
    </tr>
    <tr>
      <td><a href="#包括忽略类型">includesType</a></td>
      <td>Array&lt;string&gt;</td>
      <td>[]</td>
      <td>需要显示 tooltip 的元素，传入元素的 tag</td>
    </tr>
    <tr>
      <td><a href="#包括忽略类型">excludesType</a></td>
      <td>Array&lt;string&gt;</td>
      <td>[]</td>
      <td>不需要显示 tooltip 的元素，传入元素的 tag</td>
    </tr>
    <tr>
      <td><a href="#offset">offset</a></td>
      <td>Array&lt;number&gt;</td>
      <td>[5, 5]</td>
      <td>tooltip 相对于鼠标位置的偏移量</td>
    </tr>
    <tr>
      <td><a href="#黑白主题">theme</a></td>
      <td>string</td>
      <td>'light'</td>
      <td>主题，可选值：'light'、'dark'</td>
    </tr>
    <tr>
      <td><a href="#样式">style</a></td>
      <td>IStyle</td>
      <td>见下表</td>
      <td>tooltip 的样式配置</td>
    </tr>
  </tbody>
</table>



IStyle 属性
<table class="styled-table"">
    <tr>
        <th>字段</th>
        <th>类型</th>
        <th>默认值</th>
        <th>说明</th>
    </tr>
    <tr>
        <td>backgroundColor</td>
        <td>string</td>
        <td>"white"</td>
        <td>tooltip 的背景颜色</td>
    </tr>
    <tr>
        <td>stroke</td>
        <td>string</td>
        <td>"black"</td>
        <td>tooltip 框线颜色</td>
    </tr>
    <tr>
        <td>color</td>
        <td>string</td>
        <td>"black"</td>
        <td>tooltip 文本颜色</td>
    </tr>
    <tr>
        <td>borderRadius</td>
        <td>number</td>
        <td>8</td>
        <td>tooltip 框线圆角</td>
    </tr>
    <tr>
        <td>padding</td>
        <td>number</td>
        <td>8</td>
        <td>tooltip 内边距</td>
    </tr>
    <tr>
        <td>fontSize</td>
        <td>number</td>
        <td>14</td>
        <td>tooltip 文本大小</td>
    </tr>
    <tr>
        <td>fontWeight</td>
        <td>number</td>
        <td>400</td>
        <td>tooltip 文本粗细</td>
    </tr>
    <tr>
        <td>fontFamily</td>
        <td>string</td>
        <td>"Punctuation SC"</td>
        <td>tooltip 文本字体,同 css 多个字体用逗号隔开</td>
    </tr>
</table>

### todo

- 显示/隐藏
  - [x] 基本显示隐藏
  - [x] 延迟显示隐藏
- 样式
  - [ ] 三角箭头
  - [x] 黑白主题
  - [x] 自定义样式
- 位置
  - [x] offset
  - [x] 相对鼠标位置
  - [ ] 相对元素位置
  - [ ] 显示避让逻辑
- 信息
  - [x] 自定义信息
  - [x] formatter
- 交互
  - [x] 包括/忽略类型功能
  - [ ] 触发方式
  - [ ] 虚拟触发

### 详细配置
<a href="#配置项" class="fixed-right">:dizzy:配置项</a>

#### 内容 <a href="#配置项" style="position:relative;right:0">:arrow_up:</a>
##### 显示信息 
通过传入`info`字段，可配置显示的属性字段。
<table class="center-table"> 
    <tr> 
        <td> 
            <span>info : ['tag','width','height']</span>
        </td> 
        <td> 
            <img src="./.github/assets/info.png">
        </td> 
   </tr> 
</table>

##### 显示类型
可配置显示信息的方式，有两种：`value`、`key-value`。
<table class="center-table"> 
    <tr> 
        <td> 
            <span>showType : 'value'</span>
        </td> 
        <td> 
            <img src="./.github/assets/value.png">
        </td> 
   </tr> 
   <tr> 
      <td>
          <span>showType : 'key-value'</span>
      </td>
      <td>
          <img src="./.github/assets/key-value.png">
      </td>
    </tr>
</table>

##### 格式化 
可配置显示信息的格式化函数，参数为被作用的元素属性集合。返回的值作为tooltip的文本。
```js
formatter: (item) => {
    return `${item.tag}(${item.innerId})`
}
```
 <img src="./.github/assets/formatter.png">

#### 显示隐藏
##### 延迟显示隐藏
可配置显示的延迟时间和隐藏的延迟时间。
<table class="center-table"> 
    <tr> 
        <td> 
            <span>showDelay : 500</span>
        </td> 
        <td> 
            <img src="./.github/assets/show-delay.gif">
        </td> 
   </tr> 
   <tr> 
      <td>
          <span>hideDelay : 500</span>
      </td>
      <td>
          <img src="./.github/assets/hide-delay.gif">
      </td>
    </tr>
</table>

#### 交互
##### 包括/忽略类型
通过配置`includesType`和`excludesType`字段，可设置需要展示/隐藏tooltip的元素类型。

- 当只配置`includesType`时，只显示`includesType`中配置的元素。
- 当只配置`excludesType`时，只不显示`excludesType`中配置的元素。
- 可同时配置`includesType`和`excludesType`。
- `includesType`优先级大于`excludesType`。
 <table class="center-table"> 
    <tr> 
        <td> 
            <span>includesType : ['Rect']</span>
        </td> 
        <td> 
            <img src="./.github/assets/includes-type.gif">
        </td> 
   </tr> 
</table>


#### 样式
##### 黑白主题
插件默认提供两种主题，分别为`light`和`dark`，可以通过配置`theme`字段来切换主题。默认主题为`light`
 <table class="center-table"> 
    <tr> 
        <td> 
            <span>theme : 'light'</span>
        </td> 
        <td> 
            <img src="./.github/assets/light-theme.png">
        </td> 
   </tr> 
   <tr> 
      <td>
          <span>theme : 'dark'</span>
      </td>
      <td>
          <img src="./.github/assets/dark-theme.png">
      </td>
    </tr>
</table>

#### 位置
##### offset
可配置tooltip相对于鼠标位置的偏移量,第一个参数为x轴偏移量，第二个参数为y轴偏移量。
<table class="center-table"> 
    <tr> 
        <td> 
            <span>offset : [10,20]</span>
        </td> 
        <td> 
            <img src="./.github/assets/offset-10-20.png">
        </td> 
   </tr> 
</table>

##### 自定义样式
用户通过配置`style`字段来自定义样式。
<table class="center-table"> 
</table>
   <tr> 
      <td>
          <span>

    style: {
        backgroundColor: '#32cd79',
        stroke: '#32cd79',
        color: 'white',
        borderRadius: 16,
        padding: 8,
        fontSize: 16,
        fontWeight: 400,
    }
  </span>
      </td>
      <td>
          <img src="./.github/assets/style.png">
      </td>
    </tr>
</table>


[Github](https://github.com/214L/leafer-x-popup-canvas)


<style> 
.center-table { 
    margin-left: auto; 
    margin-right: auto; 
} 
.center-table td {
    border: 0px; 
} 
.center-table span {
    background-color: rgb(220,220,220); 
    padding: 2px 5px 2px 5px;
}

.styled-table {
    width: 100%;
    border-collapse: collapse;
    text-align: center; /* 文字居中 */
  }
  .styled-table th, .styled-table td {
    border: 1px solid #ddd; /* 边框颜色 */
    padding: 8px; /* 单元格内边距 */
  }
  .styled-table tr:nth-child(even) {
    background-color: #f2f2f2; /* 斑马格效果 */
  }
  .jump-table th:first-child:hover, .styled-table td:first-child:hover {
    cursor: pointer;
  }
  .fixed-right {
    position: fixed;
    bottom: 20%;
    right: 10px;
    transform: translateY(-50%);
}**
</style>
