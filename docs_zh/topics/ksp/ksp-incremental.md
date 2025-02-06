[//]: # (title: 增量式处理(Incremental Processing))

增量式处理是一种处理技术, 尽可能的避免重新处理源代码.
增量式处理的主要目的是减少典型的修改-编译-测试循环的处理时间.
请参见 Wikipedia 词条 [增量计算](https://en.wikipedia.org/wiki/Incremental_computing).

为了检测哪个源代码是 _脏的(dirty)_ (也就是需要重新处理), KSP 需要处理器的帮助, 确定哪个输入源代码对应到哪个生成的输出.
为了改善这种经常很累赘, 而且容易出错的处理,
KSP 设计目标是 只需要处理器使用的最少量的 _根源代码_, 作为起点来浏览代码结构.
也就是说, 如果 `KSNode` 从以下方式得到, 那么处理器需要将一个输出关联到对应的 `KSNode` 的源代码:
* `Resolver.getAllFiles`
* `Resolver.getSymbolsWithAnnotation`
* `Resolver.getClassDeclarationByName`
* `Resolver.getDeclarationsFromPackage`

目前增量式处理会默认启用. 要关闭它, 请设置 Gradle 属性 `ksp.incremental=false`.
要为依赖项和输出对应的脏文件集启用 log, 请使用 `ksp.incremental.log=true`.
你可以在 `build` 输出目录中找到这些 log 文件, 扩展名为 `.log`.

在 JVM 平台, 默认会追踪 classpath 中的变更, 以及 Kotlin 和 Java 源代码的变更.
如果要只追踪 Kotlin 和 Java 源代码的变更, 请设置 Gradle 属性 `ksp.incremental.intermodule=false`, 关闭对 classpath 中变更的追踪.

## 聚集(Aggregating) vs 隔离(Isolating) {id="aggregating-vs-isolating"}

与 [Gradle 注解处理](https://docs.gradle.org/current/userguide/java_plugin.html#sec:incremental_annotation_processing) 中的概念类似,
KSP 支持 _聚集(Aggregating)_ 和 _隔离(Isolating)_ 模式. 注意, 与 Gradle 注解处理不同,
KSP 将每个输出分类为聚集或隔离, 而不是对整个处理器分类.

聚集输出潜在的可以被任何输入变更影响, 不影响其他文件的删除文件除外.
意思就是说, 任何输入变更都会导致一次所有聚集输出的重构建,
因此, 会重新处理所有对应的注册过的, 新增的和修改的源代码文件.

例如, 收集带有一个特定注解的所有符号的输出, 会被认为是一个聚集输出.

隔离输出只依赖于特定的源代码. 对其他源代码的变更不会影响隔离输出.
注意, 与 Gradle 注解处理不同, 你可以对一个指定的输出定义多个源代码文件.

例如, 针对一个接口生成的实现类, 会被认为是隔离输出.

总结来说, 如果一个输出 可能依赖于新的或任何变更过的源代码, 那么它被认为是聚集输出.
否则, 是隔离输出.

下面是针对熟悉 Java 注解处理的读者的总结:
* 在一个隔离的 Java 注解处理器中, KSP 中所有的输出都是隔离的.
* 在一个聚集的 Java 注解处理器中, KSP 中有些输出可以是隔离的, 有些可以是聚集的.

### 实现细节 {id="how-it-is-implemented"}

依赖关系通过输入和输出文件的关联来计算, 而不是通过注解.
这是一个多对多的关系.

由输入-输出关联导致的脏文件传递规则是:
1. 如果一个输入文件有变更, 它一定会被重新处理.
2. 如果一个输入文件有变更, 而且它关联到一个输出, 那么关联到同一个输出的所有其他输入文件也会被重新处理.
   这个规则是传递性的, 也就是说, 文件无效会重复发生, 直到没有新的脏文件.
3. 关联到一个或多个聚集输出的所有输入文件都会被重新处理.
   也就是说, 如果一个输入文件没有关联到任何聚集输出, 它不会被重新处理(除非它符合上面讲的规则 1 或 规则2).

原因如下:
1. 如果一个输入有变更, 可能会引入新的信息, 因此处理器需要对这个输入再次运行.
2. 一个输出由一组输入产生. 处理器可能需要所有的输入才能重新产生输出.
3. `aggregating=true` 代表, 一个输出可能潜在的依赖于新的信息, 可能来自新的文件, 或者既有的但被变更的文件.
   `aggregating=false` 代表, 处理器确定它的信息只来自特定的输入文件, 不会来自其它文件或新的文件.

## 示例 1 {id="example-1"}

一个处理器读取 `A.kt` 中的类 `A` 和 `B.kt` 中的类 `B`, 其中 `A` 继承 `B`, 然后生成 `outputForA`.
处理器通过 `Resolver.getSymbolsWithAnnotation` 得到 `A`,
然后从 `A` 使用 `KSClassDeclaration.superTypes` 得到 `B`.
因为 包含 `B` 是由于 `A` 造成的, 在 `outputForA` 的 `dependencies` 中不需要指定 `B.kt`.
这种情况下你仍然可以指定 `B.kt`, 但不是必须的.

```kotlin
// A.kt
@Interesting
class A : B()

// B.kt
open class B

// Example1Processor.kt
class Example1Processor : SymbolProcessor {
    override fun process(resolver: Resolver) {
        val declA = resolver.getSymbolsWithAnnotation("Interesting").first() as KSClassDeclaration
        val declB = declA.superTypes.first().resolve().declaration
        // B.kt 不是必须的, 因为它可以被 KSP 推断为一个依赖项
        val dependencies = Dependencies(aggregating = true, declA.containingFile!!)
        // outputForA.kt
        val outputName = "outputFor${declA.simpleName.asString()}"
        // outputForA 依赖于 A.kt 和 B.kt
        val output = codeGenerator.createNewFile(dependencies, "com.example", outputName, "kt")
        output.write("// $declA : $declB\n".toByteArray())
        output.close()
    }
    // ...
}
```

## 示例 2 {id="example-2"}

一个处理器读取 `sourceB`, 然后读取 `sourceA` 和 `outputB`, 然后生成 `outputA`.

如果修改了 `sourceA`:
* 如果 `outputB` 是聚集的, 那么 `sourceA` 和 `sourceB` 都会被重新处理.
* 如果 `outputB` 是隔离的, 那么只有 `sourceA` 会被重新处理.

如果添加了 `sourceC`:
* 如果 `outputB` 是聚集的, 那么 `sourceC` 和 `sourceB` 都会被重新处理.
* 如果 `outputB` 是隔离的, 那么只有 `sourceC` 会被重新处理.

如果删除了 `sourceA`, 那么没有任何代码需要重新处理.

如果删除了 `sourceB`, 那么没有任何代码需要重新处理.

## 如何判断文件是否为脏 {id="how-file-dirtiness-is-determined"}

一个脏文件 要么直接被用户 _修改_, 或者间接被其他脏文件 _影响_.
KSP 通过 2 个步骤传播文件的变更:
* 通过 _解析追踪(Resolution Tracing)_ 传播:
  (隐含的或明确的)解析一个类型引用, 是从一个文件浏览到另一个文件的唯一方式.
  处理器解析一个类型引用时, 如果在一个被修改或被影响的文件中包含变更, 可能影响到解析结果, 那么这个变更将会影响包含这个引用的文件.
* 通过 _输入-输出对应关系(Input-Output Correspondence)_ 传播:
  一个源代码文件被修改或被影响时, 如果其他源代码文件与这个文件存在共同的输出, 那么其他源代码文件也都会被影响.

注意, 这 2 个步骤都是传递性的, 第 2 种会形成等价类(Equivalence Class).

## 报告 bug {id="reporting-bugs"}

要报告一个 bug, 请设置 Gradle 属性 `ksp.incremental=true` 和 `ksp.incremental.log=true`,
然后执行一次 clean 构建.
这个构建会产生 2 个 log 文件:

* `build/kspCaches/<source set>/logs/kspDirtySet.log`
* `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

然后你可以运行有 bug 的增量构建, 会生成 2 个新的 log 文件:

* `build/kspCaches/<source set>/logs/kspDirtySetByDeps.log`
* `build/kspCaches/<source set>/logs/kspDirtySetByOutputs.log`

这些 log 包含源代码和输出的文件名, 以及这些构建的时间戳.
