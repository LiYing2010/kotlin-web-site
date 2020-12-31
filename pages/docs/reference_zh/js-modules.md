---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript 模块"
---

# JavaScript 模块(Module)

你可以将你的 Kotlin 工程编译为 JavaScript 模块(module), 支持几种常见的 JavaScript 模块系统.
我们目前支持以下几种 JavaScript 模块设置:

- [统一模块定义(Unified Module Definitions (UMD))](https://github.com/umdjs/umd), 这种方式同时兼容于 *AMD* 和 *CommonJS*,
  没有导入, 或者不存在模块系统时, UMD 模块也可以执行.
  对于 `browser` 和 `nodejs` 编译目标, UMD 是默认选项 .
- [异步模块定义 (Asynchronous Module Definition (AMD))](https://github.com/amdjs/amdjs-api/wiki/AMD),
  [RequireJS](https://requirejs.org/) 库使用的就是这个模块系统.
- [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1),
  广泛使用于 Node.js/npm (`require` 函数和 `module.exports` 对象)
- Plain 方式. 不针对任何模块系统进行编译. 你仍然可以在全局命名空间内通过模块的名称来访问这个模块.

## 针对浏览器平台

如果你的开发目标平台是浏览器, 并且希望使用 UMD 之外的模块系统,
那么可以在 `webpackTask` 配置代码段内指定希望的模块类型:

<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy

kotlin {
    js {
        browser {
            webpackTask {
                output.libraryTarget = "commonjs2"
            }
        }
        binaries.executable()
    }
}

```

</div>

Webpack 提供了 CommonJS 的两种不同的 "风格(flavor)": `commonjs` 和 `commonjs2`,
这个设置会影响你的声明导出的方式.
大多数情况下, 你可能希望使用 `commonjs2`, 它会在生成的 JavaScript 库中添加 `module.exports` 语法,
也可以选择 "纯(pure)" 的 `commonjs` 选项, 它的实现完全遵照 CommonJS 规则.
关于 `commonjs` 和 `commonjs2` 的区别, 更多详情请参见 [这里](https://github.com/webpack/webpack/issues/1114).

## 创建 JavaScript 库文件和 Node.js 文件

如果你在创建供 JavaScript 使用的库, 或者 Node.js 文件,
并且希望使用不同的模块系统, 那么编译指令略有不同.

### 选择编译目标的模块系统

要选择模块类型, 请在 Gradle 构建脚本中设置编译器选项 `moduleKind`.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
compileKotlinJs.kotlinOptions.moduleKind = "commonjs"

```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.named<KotlinJsCompile>("compileKotlinJs").configure {
    kotlinOptions.moduleKind = "commonjs"
}
```

</div>
</div>

这里可以设置的值是: `umd` (默认设定), `commonjs`, `amd`, `plain`.

> 这种方法与修改 `webpackTask.output.libraryTarget` 不同.
库的输出目标设定, 改变的是 _webpack 库文件生成_ 的输出(在你的代码经过 Kotlin 编译之后).
`kotlinOptions.moduleKind` 改变的则是 _Kotlin 编译器_ 的输出.
{:.note}  

在 Kotlin Gradle DSL 中, 设置 CommonJS 模块类型可以简写为:

<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    js {
         useCommonJs()
         // . . .
    }
}
```
</div>

## `@JsModule` 注解

你可以使用 `@JsModule` 注解, 告诉 Kotlin 一个 `external` 类, 包, 函数, 或属性, 是一个 JavaScript 模块.
假设你有以下 CommonJS 模块, 名为 "hello":

<div class="sample" markdown="1" theme="idea" mode="js">

``` javascript
module.exports.sayHello = function(name) { alert("Hello, " + name); }
```

</div>

在 Kotlin 中你应该这样声明:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

``` kotlin
@JsModule("hello")
external fun sayHello(name: String)
```

</div>


### 对包使用 `@JsModule` 注解

某些 JavaScript 库会向外导出包 (名称空间), 而不是导出函数和类.
用 JavaScript 的术语来讲, 它是一个 *对象*, 这个对象的 *成员* 是类, 函数, 以及属性.
将这些包作为 Kotlin 对象导入, 通常很不自然.
编译器可以将导入的 JavaScript 包映射为 Kotlin 包, 语法如下:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

external class C
```

</div>

对应的 JavaScript 模块声明如下:

<div class="sample" markdown="1" theme="idea" mode="js">

``` javascript
module.exports = {
    foo:  { /* 某些实现代码 */ },
    C:  { /* 某些实现代码 */ }
}
```

</div>

> 使用 `@file:JsModule` 注解标注的源代码文件中, 不能声明非 external 的成员.
  下面的示例会发生编译期错误:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // 此处发生错误
```

</div>

### 导入更深的包层次结构

在前面的示例中, JavaScript 模块导出了一个单独的包.
但是, 某些 JavaScript 库会从一个模块中导出多个包.
Kotlin 也支持这样的情况, 但是你必须为导入的每一个包声明一个新的 `.kt` 文件.

比如, 让我们把示例修改得稍微复杂一点:

<div class="sample" markdown="1" theme="idea" mode="js">

``` javascript
module.exports = {
    mylib: {
        pkg1: {
            foo: function() { /* 某些实现代码 */ },
            bar: function() { /* 某些实现代码 */ }
        },
        pkg2: {
            baz: function() { /* 某些实现代码 */ }
        }
    }
}
```

</div>

要在 Kotlin 中导入这个模块, 你必须编写两个 Kotlin 源代码文件:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")
package extlib.pkg1

external fun foo()

external fun bar()
```
</div>

以及

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")
package extlib.pkg2

external fun baz()
```

</div>

### `@JsNonModule` 注解

假如一个声明标注了 `@JsModule` 注解, 如果你的代码不编译为 JavaScript 模块, 你就不能在 Kotlin 代码中使用它.
通常, 开发者发布他们的库时, 会同时使用 JavaScript 模块形式, 以及可下载的 `.js` 文件形式
(使用者可以复制到项目的静态资源中, 然后通过 `<script>` tag 来引用).
为了告诉 Kotlin, 一个标注了 `@JsModule` 注解的声明可以在非 JavaScript 模块的环境中使用, 你应该加上 `@JsNonModule` 声明.
比如, 对于下面的 JavaScript 代码:

<div class="sample" markdown="1" theme="idea" mode="js">

``` javascript
function topLevelSayHello(name) { alert("Hello, " + name); }
if (module && module.exports) {
    module.exports = topLevelSayHello;
}
```

</div>

在 Kotlin 中可以这样声明:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```

</div>


### Kotlin 标准库使用的模块系统

Kotlin 将 Kotlin/JS 标准库作为一个单个的文件发布, 这个库本身编译为一个 UMD 模块,
因此你可以在上面讲到的任何一种模块系统中使用这个库.
对于 Kotlin/JS 的大多数使用场景, 推荐通过 Gradle 依赖项 `kotlin-stdlib-js` 来使用它,
另外, 在 NPM 中也可以通过 [`kotlin`](https://www.npmjs.com/package/kotlin) 包来使用.
