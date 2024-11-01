[//]: # (title: Kotlin 符号处理(Kotlin Symbol Processing) API)

Kotlin 符号处理(Kotlin Symbol Processing, _KSP_) 是一组 API, 你可以使用它开发轻量的编译器插件.
KSP 提供一组简化的编译器插件 API, 利用 Kotlin 的能力, 同时保持最小的学习曲线.
与 [kapt](kapt.md) 相比, 使用 KSP 的注解处理器运行速度可以快 2 倍.

* 关于 KSP 与 kapt 与比较, 详情请参见 [为什么需要 KSP](ksp-why-ksp.md).
* 要开始编写 KSP 处理器, 请参见 [KSP 快速入门](ksp-quickstart.md).

## 概述

KSP API 按照语言习惯来处理 Kotlin 程序. KSP 理解 Kotlin 专有的功能特性,
比如扩展函数, 声明处类型变异(declaration-site variance), 以及局部函数.
它还明确的对类型建立模型, 并提供基本类型检查, 比如相等性, 以及赋值兼容性.

API 根据 [Kotlin 语法](https://kotlinlang.org/docs/reference/grammar.html), 在符号层面对 Kotlin 程序结构建立模型.
当基于 KSP 的插件处理源程序时, 处理器可以访问各种结构, 比如类, 类成员, 函数, 以及关联的参数, 而 `if` 代码段和 `for` 循环之类则不可以访问.

概念上来讲, KSP 类似于 Kotlin 反射中的 [KType](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/).
API 允许处理器从类的声明查找到相应的带特定类型参数的类型, 或者反过来.
你也可以替换类型参数, 特定的变体, 应用星号投射(Star Projection), 以及标注类型可否为空.

看待 KSP 的另一种方式是当作 Kotlin 程序的一个预处理器框架.
将基于 KSP 的插件看作 _符号处理器_, 或者简称 _处理器_, 编译过程中的数据流可以描述为以下步骤:

1. 处理器读取并分析源程序和资源.
2. 处理器生成代码或其他形式的输出.
3. Kotlin 编译器将源程序和生成的代码一起编译.

与功能完全的编译器插件不同, 处理器不能修改代码.
修改程序语义的编译器插件有时可能会非常令人困惑.
KSP 将源程序当作只读, 避免这种情况.

你也可以观看这个视频, 大致了解 KSP:

<video src="https://www.youtube.com/v/bv-VyGM3HCY" title="Kotlin 符号处理 (KSP)"/>


## KSP 如何看待源代码文件

大多数处理器会浏览输入的源代码的各种程序结构.
在介绍 API 的使用方法之前, 我们来看一下从 KSP 的观点如何看待文件:

```text
KSFile
  packageName: KSName
  fileName: String
  annotations: List<KSAnnotation>  // 源代码文件注解
  declarations: List<KSDeclaration>
    KSClassDeclaration // 类, 接口, 对象
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      classKind: ClassKind
      primaryConstructor: KSFunctionDeclaration
      superTypes: List<KSTypeReference>
      // 包含内部类, 成员函数, 属性, 等等.
      declarations: List<KSDeclaration>
    KSFunctionDeclaration // 顶层函数
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      functionKind: FunctionKind
      extensionReceiver: KSTypeReference?
      returnType: KSTypeReference
      parameters: List<KSValueParameter>
      // 包含局部类, 局部函数, 局部变量, 等等.
      declarations: List<KSDeclaration>
    KSPropertyDeclaration // 全局变量
      simpleName: KSName
      qualifiedName: KSName
      containingFile: String
      typeParameters: KSTypeParameter
      parentDeclaration: KSDeclaration
      extensionReceiver: KSTypeReference?
      type: KSTypeReference
      getter: KSPropertyGetter
        returnType: KSTypeReference
      setter: KSPropertySetter
        parameter: KSValueParameter
```

这个图列出了在源代码文件中声明的大多数东西: 类, 函数, 属性, 等等.

## SymbolProcessorProvider: 入口点

KSP 要求实现 `SymbolProcessorProvider` 接口, 使用它来创建 `SymbolProcessor` 实例:

```kotlin
interface SymbolProcessorProvider {
    fun create(environment: SymbolProcessorEnvironment): SymbolProcessor
}
```

其中 `SymbolProcessor` 定义如下:

```kotlin
interface SymbolProcessor {
    fun process(resolver: Resolver): List<KSAnnotated> // 我们集中看这里
    fun finish() {}
    fun onError() {}
}
```

`SymbolProcessor` 使用 `Resolver` 来访问编译器细节, 比如符号.
如果一个处理器要查找所有的顶层函数和顶层类中的非局部函数, 大概实现如下:

```kotlin
class HelloFunctionFinderProcessor : SymbolProcessor() {
    // ...
    val functions = mutableListOf<KSClassDeclaration>()
    val visitor = FindFunctionsVisitor()

    override fun process(resolver: Resolver) {
        resolver.getAllFiles().forEach { it.accept(visitor, Unit) }
    }

    inner class FindFunctionsVisitor : KSVisitorVoid() {
        override fun visitClassDeclaration(classDeclaration: KSClassDeclaration, data: Unit) {
            classDeclaration.getDeclaredFunctions().forEach { it.accept(this, Unit) }
        }

        override fun visitFunctionDeclaration(function: KSFunctionDeclaration, data: Unit) {
            functions.add(function)
        }

        override fun visitFile(file: KSFile, data: Unit) {
            file.declarations.forEach { it.accept(this, Unit) }
        }
    }
    // ...

    class Provider : SymbolProcessorProvider {
        override fun create(environment: SymbolProcessorEnvironment): SymbolProcessor = TODO()
    }
}
```

## 资源

* [KSP 快速入门](ksp-quickstart.md)
* [为什么使用 KSP?](ksp-why-ksp.md)
* [示例](ksp-examples.md)
* [KSP 如何将 Kotlin 代码组织为模型](ksp-additional-details.md)
* [针对 Java 注解处理器开发者的参考文档](ksp-reference.md)
* [增量式处理](ksp-incremental.md)
* [多轮处理](ksp-multi-round.md)
* [在跨平台项目中使用 KSP](ksp-multiplatform.md)
* [在命令行运行 KSP](ksp-command-line.md)
* [FAQ](ksp-faq.md)

## 支持的库 {id="supported-libraries"}

下面是 Android 上的流行的库, 以及它们对 KSP 的支持情况:

| 库                | 状态                                                                                       |
|------------------|------------------------------------------------------------------------------------------|
| Room             | [官方支持](https://developer.android.com/jetpack/androidx/releases/room#2.3.0-beta02)        |
| Moshi            | [官方支持](https://github.com/square/moshi/)                                                 |
| RxHttp           | [官方支持](https://github.com/liujingxing/rxhttp)                                            |
| Kotshi           | [官方支持](https://github.com/ansman/kotshi)                                                 |
| Lyricist         | [官方支持](https://github.com/adrielcafe/lyricist)                                           |
| Lich SavedState  | [官方支持](https://github.com/line/lich/tree/master/savedstate)                              |
| gRPC Dekorator   | [官方支持](https://github.com/mottljan/grpc-dekorator)                                       |
| EasyAdapter      | [官方支持](https://github.com/AmrDeveloper/EasyAdapter)                                      |
| Koin Annotations | [官方支持](https://github.com/InsertKoinIO/koin-annotations)                                 |
| Glide            | [官方支持](https://github.com/bumptech/glide)                                                |
| Micronaut        | [官方支持](https://micronaut.io/2023/07/14/micronaut-framework-4-0-0-released/)              |
| Epoxy            | [官方支持](https://github.com/airbnb/epoxy)                                                  |
| Paris            | [官方支持](https://github.com/airbnb/paris)                                                  |
| Auto Dagger      | [官方支持](https://github.com/ansman/auto-dagger)                                            |
| SealedX          | [官方支持](https://github.com/skydoves/sealedx)                                              |
| DeeplinkDispatch | [通过 airbnb/DeepLinkDispatch#323 支持](https://github.com/airbnb/DeepLinkDispatch/pull/323) |
| Dagger           | [Alpha](https://dagger.dev/dev-guide/ksp)                                                |
| Motif            | [Alpha](https://github.com/uber/motif)                                                   |
| Hilt             | [开发中](https://dagger.dev/dev-guide/ksp)                                                  |
| Auto Factory     | [目前不支持](https://github.com/google/auto/issues/982)                                       |
