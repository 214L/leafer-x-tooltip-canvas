# Changelog

#### [1.0.2] - 2025-01-05

##### 修复 / [Fixed]
- 修复 destroy 方法内存泄漏问题。/ Fixed memory leak in destroy method.
- 修复定时器竞态条件导致的显示/隐藏异常。/ Fixed timer race conditions causing display/hide issues.
- 修复多实例配置相互干扰问题。/ Fixed config interference between multiple instances.

##### 优化 / [Optimized]
- 缓存 tooltip 实例与文本尺寸计算，提升性能。/ Cache tooltip instances and text size calculations for better performance.

##### 变更 / [Changed]
- 升级 leafer-ui 至 1.12.2。/ Upgrade leafer-ui to 1.12.2.

---

#### [1.0.1] - 2024-09-25

##### 添加 / [Added]
- 添加了`ignoreType`字段，用来配置完全忽略的元素Tag。/ Added the `ignoreType` field to configure the tags of elements to be completely ignored.
- 添加了`throughExcludes`字段，用来配置是否穿越excludesType的元素拾取下层的元素。/ Added the `throughExcludes` field to configure whether to pick up the underlying element through the excludesType element.

##### 修改 / [Changed]
- 修改插件的全局变量名。/ Change the global variable name of the plugin.

##### 修复 / [Fixed]
- 修复`Flow`元素造成遮罩影响内部元素拾取问题。[issue#2](https://github.com/214L/leafer-x-tooltip-canvas/issues/2#issuecomment-2368005437)/ Fixed an issue with `Flow` element causing the mask to affect internal element picking.

