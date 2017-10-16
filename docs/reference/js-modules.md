---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript 模块"
---

# JavaScript 模块(Module)

Kotlin 允许你将 Kotlin 工程编译为 JavaScript 模块(module), 支持各种常见的 JavaScript 模块系统. 以下是编译 JavaScript 模块的各种方式:

1. Plain 方式. 不针对任何模块系统进行编译. 你仍然可以在全局命名空间内通过模块的名称来访问这个模块.
   默认会使用这种方式.
2. [异步模块定义 (Asynchronous Module Definition (AMD))](https://github.com/amdjs/amdjs-api/wiki/AMD), require.js 库使用的就是这个模块系统.
3. [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) 规约, 广泛使用于 node.js/npm
   (`require` 函数和 `module.exports` 对象)
4. 统一模块定义(Unified Module Definitions (UMD)), 这种方式同时兼容于 *AMD* 和 *CommonJS*, 而且在运行时, 如果 *AMD* 和 *CommonJS* 都不可用, 则会以 "plain" 模式工作.


## 选择编译目标的模块系统

在各种编译环境中, 可以分别通过以下方法来选择编译目标的模块系统:

### 使用 IDEA 时

对各个模块进行设置:
打开菜单 File -> Project Structure..., 找到你的模块, 然后在这个模块中选择 "Kotlin" facet. 在 "Module kind" 项中选择适当的模块系统.

对整个工程进行设置:
打开菜单 File -> Settings, 选择 "Build, Execution, Deployment" -> "Compiler" -> "Kotlin compiler". 在 "Module kind" 项中选择适当的模块系统.


### 使用 Maven 时

使用 Maven 编译时, 要选择模块系统, 你应该设置 `moduleKind` 配置属性, 也就是说, 你的 `pom.xml` 文件应该类似如下:

``` xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>
    <executions>
        <execution>
            <id>compile</id>
            <goals>
                <goal>js</goal>
            </goals>
        </execution>
    </executions>
    <!-- 插入以下内容 -->
    <configuration>
        <moduleKind>commonjs</moduleKind>
    </configuration>
    <!-- 插入内容到此结束 -->
</plugin>
```

`moduleKind` 配置属性可以设置的值是: `plain`, `amd`, `commonjs`, `umd`.


### 使用 Gradle 时

使用 Gradle 编译时, 要选择模块系统, 你应该设置 `moduleKind` 属性, 也就是:

``` groovy
compileKotlin2Js.kotlinOptions.moduleKind = "commonjs"
```

这个属性可以设置的值与 Maven 中类似.


## `@JsModule` 注解

你可以使用 `@JsModule` 注解, 告诉 Kotlin 一个 `external` 类, 包, 函数, 或属性, 是一个 JavaScript 模块.
假设你有以下 CommonJS 模块, 名为 "hello":

``` javascript
module.exports.sayHello = function(name) { alert("Hello, " + name); }
```

在 Kotlin 中你应该这样声明:

``` kotlin
@JsModule("hello")
external fun sayHello(name: String)
```


### 对包使用 `@JsModule` 注解

某些 JavaScript 库会向外导出包 (名称空间), 而不是导出函数和类.
用 JavaScript 的术语来讲, 它是一个对象, 这个对象的成员 *是* 类, 函数, 以及属性.
将这些包作为 Kotlin 对象导入, 通常很不自然.
编译器允许将导入的 JavaScript 包映射为 Kotlin 包, 语法如下:

``` kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

external class C
```

对应的 JavaScript 模块声明如下:

``` javascript
module.exports = {
    foo:  { /* 某些实现代码 */ },
    C:  { /* 某些实现代码 */ }
}
```

注意: 使用 `@file:JsModule` 注解标注的源代码文件中, 不能声明非 external 的成员.
下面的示例会发生编译期错误:

``` kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // 此处发生错误
```

### 导入更深的包层次结构

在前面的示例中, JavaScript 模块导出了一个单独的包.
但是, 某些 JavaScript 库会从一个模块中导出多个包.
Kotlin 也支持这样的情况, 但是你必须为导入的每一个包声明一个新的 `.kt` 文件.

比如, 让我们把示例修改得稍微复杂一点:

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

要在 Kotlin 中导入这个模块, 你必须编写两个 Kotlin 源代码文件:

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")
package extlib.pkg1

external fun foo()

external fun bar()
```

以及

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")
package extlib.pkg2

external fun baz()
```

### `@JsNonModule` 注解

假如一个声明使用了 `@JsModule` 注解, 如果你的代码不编译为 JavaScript 模块, 你就不能在 Kotlin 代码中使用它.
通常, 开发者发布他们的库时, 会同时使用 JavaScript 模块形式, 以及可下载的 `.js` 文件形式(使用者可以复制到项目的静态资源中, 以可以使用 `<script>` 元素来引用).
为了告诉 Kotlin, 一个标注了 `@JsModule` 注解的声明可以在非 JavaScript 模块的环境中使用, 你应该再加上 `@JsNonModule` 声明.
比如, JavaScript 代码如下:

``` javascript
function topLevelSayHello(name) { alert("Hello, " + name); }
if (module && module.exports) {
    module.exports = topLevelSayHello;
}
```

在 Kotlin 中可以这样声明:

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```


### 注意

Kotlin 将 `kotlin.js` 标准库作为一个单个的文件发布, 这个库本身作为 UMD 模块编译, 因此你可以在上面讲到的任何一种模块系统中使用这个库.
而且, 在 NPM 中可以通过 [`kotlin` 包](https://www.npmjs.com/package/kotlin) 使用这个库.
