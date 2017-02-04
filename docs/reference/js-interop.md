---
type: doc
layout: reference
category: "JavaScript"
title: "与 JavaScript 的互操作性"
---

# 与 JavaScript 的互操作性

## JavaScript 模块(Module)

从 Kotlin 1.0.4 版开始, 你可以将 Kotlin 工程编译 JS 模块(module), 支持各种常见的 JavaScript 模块系统. 以下是编译 JavaScript 模块的各种方式:

1. Plain 方式. 不针对任何模块系统进行编译. As usual, 你仍然可以通过 `kotlin.modules.moduleName` 来访问模块的 `moduleName`, 或者直接访问全局命名空间内的 `moduleName` 标识符.
   默认会使用这种方式.
2. [异步模块定义 (Asynchronous Module Definition (AMD))](https://github.com/amdjs/amdjs-api/wiki/AMD), require.js 库使用的就是这个模块系统.
3. [CommonJS](http://wiki.commonjs.org/wiki/Modules/1.1) 规约, 广泛使用于 node.js/npm
   (`require` 函数和 `module.exports` 对象)
4. 统一模块定义(Unified Module Definitions (UMD)), 这种方式同时兼容于 *AMD* 和 *CommonJS*, 而且当 *AMD* 和 *CommonJS* 都不可用时, 会以 "plain" 模式工作.

在各种编译环境中, 可以分别通过以下方法来选择编译目标的模块系统:

### 使用 IDEA 时

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

    compileKotlin2Js.kotlinOptions.moduleKind = "commonjs"

这个属性可以设置的值与 Maven 中类似


### 注意

我们将 `kotlin.js` 标准库作为一个单个的文件发布, 这个库本身作为 UMD 模块编译, 因此你可以在上面讲到的任何一种模块系统中使用这个库.

虽然目前我们还不直接支持 WebPack 和 Browserify, 但我们在  WebPack 和 Browserify 环境中, 对 Kotlin 编译器编译产生的 `.js` 文件进行过测试, 因此 Kotlin 应该能在这些环境中正常工作.


## @JsName 注解

某些情况下 (比如, 为了支持重载(overload)), Kotlin 编译器会破坏 JavaScript 代码中生成的函数和属性的名称. 为了控制编译器生成的函数和属性名称, 你可以使用 `@JsName` 注解:

``` kotlin
// Module 'kjs'

class Person(val name: String) {
    fun hello() {
        println("Hello $name!")
    }

    @JsName("helloWithGreeting")
    fun hello(greeting: String) {
        println("$greeting $name!")
    }
}
```

然后, 你可以在 JavaScript 中通过以下方式来使用这个类:

``` javascript
var person = new kjs.Person("Dmitry");   // 参照到 'kjs' 模块
person.hello();                          // 打印结果为 "Hello Dmitry!"
person.helloWithGreeting("Servus");      // 打印结果为 "Servus Dmitry!"
```

如果我们不指定 `@JsName` 注解, 那么编译器将会根据函数签名计算得到一个后缀字符串, 添加到生成的函数名末尾, 比如 `hello_61zpoe$`.
