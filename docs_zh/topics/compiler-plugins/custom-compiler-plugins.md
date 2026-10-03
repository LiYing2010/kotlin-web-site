[//]: # (title: 自定义编译器插件)

> Kotlin 编译器插件 API 目前还不稳定, 在每个发布版中都会引入破坏性变更.
>
{style="warning"}

<include from="compiler-plugins-overview.md" element-id="compiler-plugin-description"/>

在创建你自己的自定义编译器插件之前, 请先查看 [可用编译器插件列表](compiler-plugins-overview.md), 看看是否已有适合你使用场景的插件.

你也可以查看能否使用 [Kotlin 符号处理 (KSP) API](ksp-overview.md),
或外部代码检查工具, 例如 [Android lint](https://developer.android.com/studio/write/lint), 来实现你的目标.

如果你 _仍然_ 找不到需要的工具, 你可以创建一个自定义编译器插件.
请注意, Kotlin 编译器插件 API **目前还不稳定**. 你需要持续投入大量精力来维护它, 因为每个新的编译器版本都会引入破坏性变更.

### Kotlin 编译器与编译器插件 {id="the-kotlin-compiler-and-compiler-plugins"}

<p></p> <!-- workaround for MRK057: Paragraph can only contain inline elements-->
<list columns="2">
    <li>
        <p></p>
        <br/>
        <img src="compiler-stages.svg" width="400" alt="Kotlin 编译器的各个阶段"/>
    </li>
    <li>
        <p>Kotlin 编译器:</p>
        <ol>
            <li>解析源代码, 将其转换为结构化的语法树.</li>
            <li>通过确定代码的含义, 解析名称, 检查类型, 以及强制执行可见度规则, 分析和解析代码.</li>
            <li>生成中间表达 (Intermediate Representation, IR), 这是一种充当源代码和机器码之间桥梁的数据结构.</li>
            <li>逐步将 IR 降级为更简单的形式.</li>
            <li>将降级后的 IR 转换为目标平台特定的输出, 例如 JVM 字节码, JavaScript, 或原生机器码.</li>
        </ol>
    </li>
</list>

插件可以通过前端 API 影响编译器的初始阶段, 改变编译器解析代码的方式.
例如, 插件可以添加注解, 引入没有函数体的新方法, 或修改可见度修饰符.
这些变更在 IDE 中是可见的.

插件也可以通过后端 API 影响后续阶段, 修改声明的行为.
这些变更出现在编译完成后生成的二进制文件中.

在实际使用中, 编译器插件影响从分析和解析到代码生成的各个阶段, 涵盖前端和后端两部分.
例如, 前端部分生成声明, 后端部分为这些声明添加函数体.

![带有插件的 Kotlin 编译器各阶段](compiler-stages-with-plugins.svg){width=650}

[Kotlin 序列化插件](https://github.com/Kotlin/kotlinx.serialization) 是一个很好的例子.
这个插件的前端部分添加一个同伴对象和一个序列化器函数, 以及防止名称冲突的检查.
后端部分通过 `KSerializer` 对象实现需要的序列化行为.

### Kotlin 编译器插件模板 {id="kotlin-compiler-plugin-template"}

要开始编写自定义编译器插件, 你可以使用 [Kotlin 编译器插件模板](https://github.com/Kotlin/compiler-plugin-template).
然后从前端和后端插件 API 注册扩展点.

> 目前, 你只能使用 [Gradle](gradle.md) 开发自定义编译器插件.
>
{style="note"}

### 前端插件 API {id="frontend-plugin-api"}

前端插件 API, 也称为前端中间表达 (Frontend Intermediate Representation, FIR),
具有以下专门的扩展点来自定义解析:

| 扩展名称                                                                                                                                                                                     | 描述                                                    |
|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------------------|
| [`FirAdditionalCheckersExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/checkers/src/org/jetbrains/kotlin/fir/analysis/extensions/FirAdditionalCheckersExtension.kt) | 添加自定义编译器检查器.                                 |
| [`FirDeclarationGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/providers/src/org/jetbrains/kotlin/fir/extensions/FirDeclarationGenerationExtension.kt)   | 生成新的声明.                                           |
| [`FirExtensionSessionComponent`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirExtensionSessionComponent.kt)                  | 在 `FirSession` 中注册自定义组件, 供插件的其他部分使用. |
| [`FirFunctionTypeKindExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirFunctionTypeKindExtension.kt)                  | 定义新的函数类型族.                                     |
| [`FirMetadataSerializerPlugin`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/fir-serialization/src/org/jetbrains/kotlin/fir/serialization/FirMetadataSerializerPlugin.kt)    | 读写声明元数据中的信息.                                 |
| [`FirStatusTransformerExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirStatusTransformerExtension.kt)             | 修改声明的状态属性, 例如可见度或模态.                   |
| [`FirSupertypeGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/fir/resolve/src/org/jetbrains/kotlin/fir/extensions/FirSupertypeGenerationExtension.kt)         | 向现有的类添加新的父类型.                               |
| [`FirTypeAttributeExtension`]( https://github.com/JetBrains/kotlin/blob/master/compiler/fir/tree/src/org/jetbrains/kotlin/fir/extensions/FirTypeAttributeExtension.kt)                       | 根据类型注解, 为某些类型添加特殊的属性.                 |

#### IDE 集成 {id="ide-integration"}

解析的变更会影响 IDE 的行为, 例如代码高亮和建议, 因此你的插件与 IDE 兼容非常重要.
每个版本的 IntelliJ IDEA 和 Android Studio 都包含一个开发版的 Kotlin 编译器.
这个版本是特定于 IDE 的, 与已发布的 Kotlin 编译器不具有二进制兼容性.
因此, 当你更新 IDE 时, 也需要更新你的编译器插件, 以确保它正常工作.
由于这个原因, 社区插件默认不会被加载.

要确保你的自定义编译器插件能够在不同的 IDE 版本中正常工作, 请针对每个 IDE 版本进行测试, 并修复发现的任何问题.

如果有可用于 Kotlin 编译器插件的开发工具包 (devkit), 支持多个 IDE 版本可能会变得更容易.
如果你对这个功能感兴趣, 请在我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-82617) 中报告你的反馈意见.

### 后端插件 API {id="backend-plugin-api"}

> 后端插件开发如果处理不当, 很容易降低 IDE 或调试器的性能,
> 因此请谨慎保守的进行变更.
>
{style="warning"}

后端插件 API, 也称为 IR, 有一个单一的扩展点: [`IrGenerationExtension`](https://github.com/JetBrains/kotlin/blob/master/compiler/ir/backend.common/src/org/jetbrains/kotlin/backend/common/extensions/IrGenerationExtension.kt).
使用这个扩展点, 并覆盖 `generate()` 函数, 可以为前端生成的声明添加函数体, 或修改现有的声明函数体.

通过这个扩展点所做的变更 **不会被** 编译器检查. 你必须确保你的变更不会破坏编译器在这个阶段的预期.
例如, 你可能会意外引入一个无效类型, 一个不正确的函数引用, 或一个超出正确作用域的引用.

#### 探索后端插件代码 {id="explore-backend-plugin-code"}

你可以探索 Kotlin 序列化插件的代码, 了解后端插件编译器代码在实际中的样子.
例如, [`SerializableCompanionIrGenerator.kt`](https://github.com/JetBrains/kotlin/blob/master/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt)
为关键的序列化器成员填写缺失的函数体.
其中一个例子是 [`generateChildSerializersGetter()`](https://github.com/JetBrains/kotlin/blob/9cfa558902abc13d245c825717026af63ef82dd2/plugins/kotlinx-serialization/kotlinx-serialization.backend/src/org/jetbrains/kotlinx/serialization/compiler/backend/ir/SerializerIrGenerator.kt#L242)
函数, 它收集 `KSerializer` 表达式列表, 并以数组形式返回.

#### 检查后端插件代码中的问题 {id="check-your-backend-plugin-code-for-problems"}

你可以通过三种方式, 检查后端插件代码中的问题:

1. **验证 IR**

    构建 IR 树, 并启用 `Xverify-ir` 编译器选项. 这个选项会对编译速度产生性能影响, 因此请只在测试中使用.

2. **转储并比较 IR 输出**

    使用 `-Xphases-to-dump-before=ExternalPackageParentPatcherLowering` 编译器选项, 在 IR 降级编译阶段之后创建转储文件.
    对于 JVM 后端, 使用 `-Xdump-directory=<your-file-directory>` 编译器选项, 配置转储目录.
    手动编写预期代码, 生成另一个转储文件, 然后比较这两个转储文件, 查看是否存在差异.

3. **调试编译器代码**

    在 `convertToIr.kt` 文件中, 在 `convertToIrAndActualize()` 函数中添加断点,
    并以调试模式运行编译器, 在编译期间获取更详细的信息.

### 测试你的插件 {id="test-your-plugin"}

实现插件之后, 请彻底测试它. [Kotlin 编译器插件模板](https://github.com/Kotlin/compiler-plugin-template)
已配置好使用 [Kotlin 编译器测试框架](https://github.com/JetBrains/kotlin/blob/master/compiler/test-infrastructure/ReadMe.md).
你可以在以下目录中添加测试:

* `compiler-plugin/testData`
* `compiler-plugin/testData/box`, 用于代码生成测试
* `compiler-plugin/testData/diagnostics`, 用于诊断测试

当测试运行时, 框架会:

1. 解析测试源代码文件.
   例如, [`anotherBoxTest.kt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.kt)
2. 为每个文件构建 FIR 和 IR.
3. 将这些内容写入文本格式的转储文件.
   例如, [`anotherBoxTest.fir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.txt)
   和 [`anotherBoxTest.fir.ir.txt`](https://github.com/Kotlin/compiler-plugin-template/blob/master/compiler-plugin/testData/box/anotherBoxTest.fir.ir.txt).
4. 将这些文件与之前创建的文件进行比较 (如果存在的话).

你可以使用这些文件, 检查生成的差异中是否存在意外的变更.
如果没有问题, 这些新的转储文件将成为你最新的 _黄金_ 文件: 一个经过批准和信任的来源, 你可以将未来的变更与它进行比较.

### 获取帮助 {id="get-help"}

如果你在开发自定义编译器插件时遇到问题, 请在 [Kotlin Slack](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)
的 [#compiler](https://slack-chats.kotlinlang.org/c/compiler) 频道中联系我们.
我们不能承诺提供解决方案, 但会尽力提供帮助.
