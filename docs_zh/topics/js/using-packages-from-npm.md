[//]: # (title: 使用 npm 中的依赖项)

最终更新: %latestDocDate%

在 Kotlin/JS 项目中, 所有的依赖项都可以通过 Gradle plugin 来管理. 包括 Kotlin/Multiplatform 库,
比如`kotlinx.coroutines`, `kotlinx.serialization`, 或 `ktor-client`.

对于 来自 [npm](https://www.npmjs.com/) 的 JavaScript 包依赖项, Gradle DSL 公开了 `npm` 函数, 你可以用来指定希望从 npm 导入的包.
我们来看看导入 NPM 包 [`is-sorted`](https://www.npmjs.com/package/is-sorted) 的情况.

Gradle 构建脚本文件中对应的部分如下:

```kotlin
dependencies {
    // ...
    implementation(npm("is-sorted", "1.0.5"))
}
```

由于 JavaScript 模块通常使用动态类型, 而 Kotlin 是静态类型语言, 因此你需要提供某种类型的转换.
在 Kotlin 中, 这种转换称为 _外部声明(External Declaration)_.
对于 `is-sorted` 包, 它只提供了一个函数, 它的外部声明很小, 很容易编写.
请在源代码文件夹中, 创建一个新文件, 名为 `is-sorted.kt`, 内容如下:

```kotlin
@JsModule("is-sorted")
@JsNonModule
external fun <T> sorted(a: Array<T>): Boolean
```

请注意, 如果你使用 CommonJS 作为编译对象, 那么 `@JsModule` 和 `@JsNonModule` 注解也需要做相应的调整.

这个 JavaScript 函数现在可以象通常的 Kotlin 函数一样使用了.
由于我们在头文件中提供了类型信息 (而不是简单的将参数和返回值类型定义为 `dynamic`), 因此也可以进行正确的编译器支持和类型检查.

```kotlin
console.log("Hello, Kotlin/JS!")
console.log(sorted(arrayOf(1,2,3)))
console.log(sorted(arrayOf(3,1,2)))
```

在浏览器内或在 Node.js 中运行这 3 行代码, 输出显示, 对 `sorted` 的调用被正确的映射为 `is-sorted` 包导出的函数:

```kotlin
Hello, Kotlin/JS!
true
false
```

由于 JavaScript 生态系统有很多种方式来导出包中的函数 (比如通过命名的导出, 或默认导出),
因此对于其他 npm 包, 它的外部声明可能需要稍微不同的结构.

关于如何编写外部声明, 请参见 [在 Kotlin 中使用 JavaScript 代码](js-interop.md).
