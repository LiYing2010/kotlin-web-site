[//]: # (title: 增量处理(Incremental Processing))

KSP 支持增量处理(Incremental Processing): 只有当文件的一个或多个依赖项发生变化时, KSP 才会重新处理这个文件.
这样可以避免不必要的重复处理, 缩短编译时间.

增量处理默认启用. 在排查问题时, 或需要强制执行完整重新构建时, 可以关闭这个功能.
要关闭增量处理, 请在 `gradle.properties` 文件中添加以下内容:

```properties
ksp.incremental=false
```

## 脏文件 {id="dirty-files"}

如果文件直接由开发者修改, 或受到其他脏文件变更的间接影响, 这个文件就被视为 _脏文件(Dirty File)_ (需要重新处理).

为了确定哪些源文件是脏文件, KSP 依赖处理器, 来建立生成的输出与对应的输入源文件之间的关联.
发生变更时, KSP 利用这些关联来确定需要重新处理的源文件.

KSP 只要求最少量的根源文件(Root Source). 处理器使用这些文件作为入口, 浏览代码结构.

如果一个源文件中的符号是通过以下方法之一直接获取的, 这个文件就是根源文件:

* `Resolver.getAllFiles()`
* `Resolver.getSymbolsWithAnnotation()`
* `Resolver.getClassDeclarationByName()`
* `Resolver.getDeclarationsFromPackage()`

处理器可以解析根源文件中的信息, 从其他源文件获取更多符号. KSP 会自动追踪这些依赖关系.

生成输出时, 处理器必须声明对这个输出有贡献的根源文件.
KSP 会根据这些根源文件, 以及它的已追踪的依赖关系, 判断何时需要重新生成输出.

> 请使用 `CodeGenerator` 接口创建输出文件, 并将输入与输出关联起来.
> 详情请参见 [源码中的 `CodeGenerator.kt`](https://github.com/google/ksp/blob/main/api/src/main/kotlin/com/google/devtools/ksp/processing/CodeGenerator.kt).
>
{style="tip"}

### 聚集输出(Aggregating Output)与隔离输出(Isolating Output) {id="aggregating-and-isolating-outputs"}

KSP 将生成的输出分为两类: 聚集输出(Aggregating Output)和隔离输出(Isolating Output).

> 与 Gradle 的注解处理不同, KSP 对每个输出单独分类, 而不是对整个处理器分类.
>
{style="note"}

<deflist collapsible="true">
<def title="聚集输出(Aggregating Output)">

聚集输出可能受到任何源文件中的变更的影响, 但不影响其他文件的删除除外.

任何输入变更都会触发所有聚集输出的重新构建, 并重新处理所有相应的, 已注册的, 新增的, 或修改的源文件.

例如, 收集带有特定注解的所有符号的输出, 属于聚集输出.

</def>
<def title="隔离输出(Isolating Output)">

隔离输出只依赖于指定的源文件.

其他源文件的变更不会影响这个输出. 一个输出可以关联多个源文件.

例如, 专门为某个接口生成的实现类, 属于隔离输出.

</def>
</deflist>

### 脏状态的传播 {id="dirtiness-propagation"}

KSP 通过以下方式传播脏状态:

1. 通过 **解析追踪**:
   类型解析是从一个文件访问另一个文件的唯一方式. 当处理器(明确的或隐含的)解析类型引用时,
   KSP 会认为包含类型引用的文件, 与定义了影响解析结果的符号的所有文件之间存在依赖关系.
   因此, 被解析符号的变更可能使引用它的文件变为脏文件.

2. 通过 **输入与输出的对应关系**:
   如果某个源文件发生变更或受到影响, 与它共用生成的输出的所有其他源文件也会被标记为受影响.
   这样, 根据共用的输出, 相关的文件会被归入同一等价类中.

> 规则 (1) 和 (2) 可能反复的相互触发.
> 例如, 规则 (1) 可以触发规则 (2), 然后规则 (2) 又可以触发规则 (1).
>
{style="tip"}

## 实现方式 {id="implementation"}

依赖关系由输入和输出文件之间的多对多关系决定.

KSP 按以下规则确定需要重新处理的文件:

* 如果输入文件发生变更, 它一定会被重新处理.

   **为什么?** 输入变更可能产生新的信息. 处理器需要使用这个输入文件再次运行.

* 如果输入文件发生变更, 并且关联了某个输出, 那么关联同一个输出的所有其他输入文件也会被重新处理.
  这一过程会反复进行, 直到没有新的脏文件.

   **为什么?** 输出由一组输入生成. 处理器可能需要所有的输入, 才能重新生成这个输出.

* 如果输入文件没有发生变更, 也没有关联到任何聚集输出, 它不会被重新处理.

   **为什么?** 这个文件没有变更, 也没有关联聚集输出, 因此不会影响任何输出.
   除非符合上述的某条规则, 否则它不会被重新处理.

例如, 假设一个项目的结构如下:

```none
.
├── src
│   ├── sourceA.kt
│   └── sourceB.kt
└── generated
    ├── outputA
    └── outputB
```

处理器执行以下步骤:

1. 读取 `sourceA`.

2. 生成 `outputA`.

3. 读取 `sourceB`.

4. 生成 `outputB`.

当 `sourceA` 发生变更时:

* 如果 `outputB` 是聚集输出, KSP 会重新处理 `sourceA` 和 `sourceB`.

* 如果 `outputB` 是隔离输出, KSP 只会重新处理 `sourceA`.

如果新增了 `sourceC`:

* 如果 `outputB` 是聚集输出, KSP 会重新处理 `sourceC` 和 `sourceB`.

* 如果 `outputB` 是隔离输出, KSP 只会重新处理 `sourceC`.

如果 `sourceA` 或 `sourceB` 被删除, KSP 不需要重新处理任何文件.

## 处理器示例 {id="example-processor"}

以下项目包含类 `A` 和 `B`, 其中 `A` 继承 `B`:

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
        // 不需要声明 B.kt, 因为 KSP 可以将它推断为依赖项
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

为了生成 `outputForA`, 处理器会执行以下步骤:

1. 调用 `Resolver.getSymbolsWithAnnotation`, 获取 `A`.

2. 对 `A` 调用 `KSClassDeclaration.superTypes`, 获取 `B`.

KSP 通过解析追踪来记录这一关系, 并自动将 `B` 记录为 `A` 的依赖项.
因此, 不需要明确声明 `B.kt` 是 `outputForA` 的依赖项.

## 报告 Bug {id="reporting-bugs"}

如果遇到只在启用增量处理时才出现的错误, 请在 [GitHub 仓库](https://github.com/google/ksp/issues) 中创建 issue, 并附上相关的日志文件.

1. 在 `gradle.properties` 中添加以下内容, 启用增量处理的日志:

   ```properties
   ksp.incremental.log=true
   ```

2. 执行一次成功完成的干净构建.

3. 将生成的日志文件复制到其他位置保存:

   * `build/kspCaches/<source set>/logs/kspDirtySet.log`
   * `build/kspCaches/<source set>/logs/kspSourceToOutputs.log`

4. 修改会触发问题的源文件, 然后再次运行构建.

5. 在 GitHub issue 中附上成功构建和重现问题的构建所生成的日志文件.

### 可视化符号依赖图 {id="visualizing-the-symbol-dependency-graph"}

为了帮助调试增量处理, KSP 可以生成 Graphviz DOT 文件, 将从指定的符号开始的符号依赖图可视化.

启用增量处理日志, 并指定用做可视化依赖图的起点的符号的 [完全限定名称](packages.md#package-headers):

```properties
ksp.incremental.log=true
ksp.incremental.log.graph.origin=<fully-qualified-name>
```

如果通过命令行使用 KSP, 请添加以下选项:

```bash
-incremental-log=true -incremental-log.graph.origin=<fully-qualified-name>
```

DOT 文件会生成在 `logs` 目录中.
