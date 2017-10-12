---
type: doc
layout: reference
category: "JavaScript"
title: "JavaScript Modules"
---

# JavaScript 模块(Module)

Kotlin 允许你将 Kotlin 工程编译为 JavaScript 模块(module), 支持各种常见的 JavaScript 模块系统. 以下是编译 JavaScript 模块的各种方式:

1. Plain 方式. 不针对任何模块系统进行编译. 你仍然可以在全局命名空间内通过模块的名称来访问这个模块.
   默认会使用这种方式.
2. [异步模块定义 (Asynchronous Module Definition (AMD))](https://github.com/amdjs/amdjs-api/wiki/AMD), require.js 库使用的就是这个模块系统.
3. [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) 规约, 广泛使用于 node.js/npm
   (`require` 函数和 `module.exports` 对象)
4. 统一模块定义(Unified Module Definitions (UMD)), 这种方式同时兼容于 *AMD* 和 *CommonJS*, 而且在运行时, 如果 *AMD* 和 *CommonJS* 都不可用, 则会以 "plain" 模式工作.

在各种编译环境中, 可以分别通过以下方法来选择编译目标的模块系统:

### 使用 IDEA 时

对各个模块进行设置:
打开菜单 File -> Project Structure..., 找到你的模块, 然后在这个模块中选择 "Kotlin" facet. 在 "Module kind" 项中选择适当的模块系统.

对整个工程进行设置:
打开菜单 File -> Settings, 选择 "Build, Execution, Deployment" -> "Compiler" -> "Kotlin compiler". 在 "Module kind" 项中选择适当的模块系统.


### 使用 Maven 时

使用 Maven 编译时, 要选择模块系统, 你应该设置 `moduleKind` 配置属性, 也就是说, 你的 `pom.xml` 文件应该类似如下:

```xml
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

```groovy
compileKotlin2Js.kotlinOptions.moduleKind = "commonjs"
```

这个属性可以设置的值与 Maven 中类似


### `@JsModule` 注解

To tell Kotlin that an `external` class, package, function or property is a JavaScript module, you can use `@JsModule`
annotation. Consider you have following CommonJS module called "hello":

```javascript
module.exports.sayHello = function(name) { alert("Hello, " + name); }
```

You should declare it like this in Kotlin:

```kotlin
@JsModule("hello")
external fun sayHello(name: String)
```


### Applying `@JsModule` to packages

Some JavaScript libraries export packages (namespaces) instead of functions and classes.
In terms of JavaScript is's an object that has members that *are* classes, functions and properties.
Importing these packages as Kotlin objects often looks unnatural.
Compiler allows to map imported JavaScript packages to Kotlin packages, you can use following notation:

```kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

external class C
```

where corresponding JavaScript module declared like this:

```javascript
module.exports = {
    foo:  { /* some code here */ },
    C:  { /* some code here */ }
}
```

Important: files marked with `@file:JsModule` annotation can't declare non-external members.
Example below produces compile-time error:

```kotlin
@file:JsModule("extModule")
package ext.jspackage.name

external fun foo()

fun bar() = "!" + foo() + "!" // error here
```


### Importing deeper package hierarchies

In the previous example JavaScript module exports single package.
However, some JavaScript libraries export multiple packages from within a module.
This case is also supported by Kotlin, though you have to declare a new `.kt` file for each package you import.

For example, let's make our example a bit more complicated:

```javascript
module.exports = {
    mylib: {
        pkg1: {
            foo: function() { /* some code here */ },
            bar: function() { /* some code here */ }
        },
        pkg2: {
            baz: function() { /* some code here */ }
        }
    }
}
```

To import this module in Kotlin, you have two write two Kotlin source files:

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg1")
package extlib.pkg1

external fun foo()

external fun bar()
```

and

```kotlin
@file:JsModule("extModule")
@file:JsQualifier("mylib.pkg2")
package extlib.pkg2

external fun baz()
```

### `@JsNonModule` annotation

When a declaration has `@JsModule`, you can't use it from Kotlin code when you don't compile it to JavaScript module.
Usually, developers distribute their libraries both as JavaScript modules and downloadable `.js` files that user
can copy to project's static resources and include via `<script>` element. To tell Kotlin that it's ok
to use `@JsModule` declaration from non-module environment, you should put `@JsNonModule` declaration. For example,
given JavaScript code:

```javascript
function topLevelSayHello(name) { alert("Hello, " + name); }
if (module && module.exports) {
    module.exports = topLevelSayHello;
}
```

can be described like this:

```kotlin
@JsModule("hello")
@JsNonModule
@JsName("topLevelSayHello")
external fun sayHello(name: String)
```


### 注意

Kotlin 将 `kotlin.js` 标准库作为一个单个的文件发布, 这个库本身作为 UMD 模块编译, 因此你可以在上面讲到的任何一种模块系统中使用这个库.
而且, 在 NPM 中可以通过 [`kotlin` 包](https://www.npmjs.com/package/kotlin) 使用这个库.
