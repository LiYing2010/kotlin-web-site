[//]: # (title: 浏览器与 DOM API)

Kotlin/JS 标准库允许你使用 `kotlinx.browser` 包访问浏览器专有的功能, 包括典型的顶级对象, 比如 `document` 和 `window`.
标准库对这些对象的功能尽可能提供了类型安全的封装. 对于无法支持的情况, 为了与不能正确映射到 Kotlin 类型系统的函数交互, 会使用 `dynamic` 类型.

## 与 DOM 交互

为了与文档对象模型(DOM) 交互, 你可以使用变量 `document`. 比如, 你可以通过这个对象设置网站的背景颜色:

```kotlin
document.bgColor = "FFAA12"
```

`document` 对象还为你提供了一种途径, 可以通过 ID, 名称, class 名, tag 名等等, 来取得特定的元素.
所有返回的元素都是 `Element?` 类型. 要访问它们的属性, 你需要将它们转换为正确的类型.
比如, 假定你有一个 HTML 页面, 其中有一个 email `<input>` 项:

```html
<body>
    <input type="text" name="email" id="email"/>

    <script type="text/javascript" src="tutorial.js"></script>
</body>
```

注意, 你的脚本包含在 ``body`` tag 的底部. 这样可以保证在脚本加载之前 DOM 已经全部完全加载完成.

通过这样的设置, 你可以访问 DOM 元素. 要访问 `input` 项目的属性, 请调用 `getElementById`, 并将它转换为 `HTMLInputElement`.
然后就可以安全的访问属性了, 比如 `value`:

```kotlin
val email = document.getElementById("email") as HTMLInputElement
email.value = "hadi@jetbrains.com"
```

与访问这个 `input` 元素类似, 你也可以访问页面中的其他元素, 并转换为正确的类型.

关于如何使用简洁的方式创建和组织 DOM 中的元素, 请参见 [类型安全的 HTML DSL](typesafe-html-dsl.md).
