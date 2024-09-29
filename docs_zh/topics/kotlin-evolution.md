[//]: # (title: Kotlin 的演化)

最终更新: %latestDocDate%

## 务实的演化原则

> _语言设计就象用石头做雕像,_
>
> _但是这块石头还算比较柔软,_
>
> _付出一些努力之后, 我们以后还可以改造它._
>
>_Kotlin 设计组_

Kotlin 被设计为一种为程序员服务的务实的工具. 当语言发生演化时, 我们通过以下原则来保证它的务实性:

* 随着时间的发展, 持续保证语言本身的现代化.
* 与使用者持续不断的反馈循环.
* 语言版本升级对使用者来说应该平滑, 便利.

我们来解释一下这些原则, 因为这是理解 Kotlin 演化的关键.

**保证语言的现代化**.
  我们认识到, 任何系统随着时间的发展都会积累很多历史遗产.
  过去曾经是非常前沿的技术, 到了今天可能无可挽救地变得非常过时.
  我们必须让语言本身不断演进, 让它适应使用者的需求, 象使用者期望的那样, 永远保持最新状态.
  这不仅包括增加新的功能, 也需要淘汰那些不再适合用于生产环境, 已经变成历史包袱的旧功能.

**语言版本升级平滑便利**.
  不兼容的变更, 比如从语言中删除某个特性, 如果不经过适当的注意, 可能会导致语言版本升级时出现非常痛苦的迁移工作.
  _在这类变化发生之前_, 我们总是会提前发布公告, 将未来会被删除的功能标注为已废弃, 还会提供自动迁移工具.
  当语言变化真正发生时, 我们希望大多数代码都已经更新过了, 因此迁移到新版本时不会发生问题.

**来自使用者的反馈循环**.
  需要付出很大的努力, 才能完成语言中某个功能的废弃过程, 因此我们希望尽量减少将来出现的不兼容变化.
  除了依靠我们自己尽力作出最好的判断之外, 我们相信, 对某个设计进行验证的做好办法就是, 在真正的软件开发过程中去试用它.
  在将某个设计雕刻到石头上之前, 我们希望它经过实战考验.
  因此我们会努力在语言的生产版本中发布一些新设计的早期版本, 但会将它设定为某种 _未稳定_ 状态:
  [实验性, Alpha, 或 Beta](components-stability.md).
  这些功能还没有稳定下来, 随时都可能改变, 使用者需要明确地指明自己确定要使用这些未稳定功能, 以及自己愿意面对未来可能发生的迁移问题.
  这些使用者会在使用过程中向我们提供宝贵的反馈信息, 我们收集这些反馈信息后, 会将他们的意见反映到后面的设计中, 并确定最终的功能设计.

## 不兼容的变更

如果由于从一个版本更新到另一个版本, 导致过去曾经正确工作的代码不再正确,
那么成为语言的 _不兼容变更_ (有时也称作 "破坏性变更").
所谓"不再正确工作", 对它的精确定义有时可能会有一些不同意见, 但肯定包括一下情况:

* 过去能够正确编译并正常运行的代码, 现在出现了编译错误 (在编译时, 或者在链接时).
  这种情况包括语言中删除了某些概念, 或者添加了新的限制.
* 过去能过正常运行的代码, 现在抛出了异常.

其他不那么明显的情况(或者叫 "灰色地带")包括, 对某些边界条件的处理发生了变化,
抛出和以前不同类型的异常, 某些只有通过反射才会出现的行为发生了变化,
没有公开文档或者没有明确定义的行为发生了变化, 改变了二进制库文件的名字, 等等.
这样的变更有时会非常重要, 并导致巨大的代码迁移工作, 有时变化只是非常细微的, 并没有什么影响.

不兼容的变更不包括以下情况:

* 增加新的警告.
* 启用一个新的语言概念, 或者放松了过去曾经存在的某个限制.
* 改变私有或内部的 API, 以及其他实现细节.

由于 "保证语言的现代化" 原则和 "语言版本升级平滑便利" 原则的存在,
因此不兼容的变更有时候是必须的, 但需要非常小心地引入这种变更.
我们的目标是, 让使用者能够提前察觉到即将发生的变更, 使他们有机会以比较容易地方式迁移代码.

理想情况下, 每一个不兼容的变更都会在编译时对有问题的代码给出警告(通常是 _功能已废弃警告_),
以这种方式通知用户, 并且还会发布自动迁移工具. 因此, 理想的代码迁移过程如下:

* 升级到版本 A (这里我们会提前宣布不兼容的变更)
  * 看到警告信息, 提示即将发生的变更
  * 在工具的帮助下迁移代码
* 升级到版本 B (不兼容的变更会在这里发生)
  * 完全不发生任何问题

实际引用中, 某些变更在编译期可能无法精确地检测出来, 因此无法提示警告信息,
但至少在版本 A 的发布公告中我们会通知使用者, 在版本 B 中会发生某个变更.

### 处理编译器 bug

编译器是个非常复杂的软件, 尽管开发者们付出了最大的努力, 但是编译器还是会有 bug.
有些 bug 会导致编译器本身崩溃, 或者报告不正确的编译错误, 或者编译产生明显不正确的代码, 这样的 bug 尽管很烦人, 而且很丢脸,
但其实是容易修复的, 因为修复这类 bug 不会造成不兼容的变更.
其他的 bug 可能导致编译器编译产生不争取的代码, 但不会崩溃: 比如, 忽略了源代码中的某些错误, 或者编译产生了不正确的指令.
对这类 bug 的修复技术上来说也属于不兼容的变更 (有些代码过去可以编译, 但修复编译器 bug 之后就不能编译了),
但是我们倾向于尽可能快地修复这些 bug, 以免不好的编程风格在使用者的源代码中扩散开.
我们的意见是, 这也符合 "语言版本升级平滑便利" 原则, 因为可以让更少的使用者遇到这些问题.
当然, 这只适用于正式发布版中出现的 bug 很快被发现的情况.

## 决策方式

Kotlin 的原始创建者, [JetBrains 公司](https://jetbrains.com), 在开发者社区的帮助下,
并通过与 [Kotlin 基金会](https://kotlinfoundation.org/) 的协调, 正在不断推动 Kotlin 的开发.

Kotlin 编程语言的所有变更都在[首席语言设计师](https://kotlinfoundation.org/structure/)
(目前是 Michail Zarečenskij) 的监督之下.
所有与语言演进相关的问题, 首席设计师拥有最终决定权.
此外, 对已经完全稳定的组件的不兼容变更, 必须经过 [Kotlin 基金会](https://kotlinfoundation.org/structure/) 任命的
[语言委员会](https://kotlinfoundation.org/structure/) 的批准.
(语言委员会目前由 Jeffrey van Gogh, Werner Dietl, 和 Michail Zarečenskij 组成).

语言委员会最终决定作出哪些不兼容的变更, 应该采取哪些步骤让使用者平滑地升级.
在作出这些决策时, 语言委员会依靠一组指导原则, 详情请参见 [这里](https://kotlinfoundation.org/language-committee-guidelines/).

## 功能性发布版(Feature Release)与增量发布版(Incremental Release) {id="feature-releases-and-incremental-releases"}

稳定发布版, 比如版本号 1.2, 1.3, 等等. 通常是一次 _功能发布版_, 带来大的语言变更.
通常, 在功能发布版之间我们会发布一些 _增量发布版_, 比如版本号 1.2.20, 1.2.30, 等等.

增量发布版会带来工具更新(通常包含新功能), 性能改进, 以及 bug 修正.
我们会努力让这些版本之间相互兼容, 因此编译器的变更通常只是代码优化, 警告信息的增加/删除.
当然, 未稳定功能可能会在任何时候发生增加, 删除, 或变更.

功能性发布版通常会增加新的功能, 也可能会删除或变更以前废弃掉的功能.
某个功能从未稳定状态升级到稳定状态, 也会发生在功能性发布版中.

### 早期预览版(Early Access Program (EAP))

在发布稳定版本之前, 我们通常会发布许多个预览版, 称为早期预览版 (Early Access Program (EAP)),
我们使用这种方式来更加快速地迭代我们的版本, 并从开发者社区收集使用者的反馈信息.
功能性发布版的 EAP 输出的二进制文件, 通常会被将来的稳定版编译器拒绝, 以保证预览版输出的二进制文件中可能存在的 bug 不会长期存在.
最终的发布候选版(Final Release Candidate)通常不会存在这个限制.

### 未稳定功能

根据我们上面介绍过的 "来自使用者的反馈循环" 原则, 我们会在语言的预览版和发布版中快速迭代和改进我们的设计,
这些版本中某些功能可能会处于某种 _未稳定_ 状态, 并且 _预期会被改变_.
这些功能可能会在任何时候增加, 修改, 或者删除, 而且不会有任何警告.
我们会尽力确保使用者不会意外地使用到未稳定功能. 这些功能通常会需要某种明确的设置才能启用, 要么在源代码中, 要么在项目配置中.

经过一系列的迭代改进后, 未稳定功能通常会升级到稳定状态.

### 各部分组件的稳定性状态

Kotlin 包含很多组件(Kotlin/JVM, JS, Native, 各种库, 等等), 关于各部分组件的稳定性状态, 请参见 [参考文档](components-stability.md).

## 库

离开了它的生态系统, 一个编程语言就毫无用处了, 因此我们付出了很大的努力, 来确保 Kotlin 库的平滑演进.

理想情况下, 库的新版本应该可以直接替代旧版本.
也就是说, 对一个二进制依赖项的版本升级, 应该不造成任何破坏, 即使应用程序没有重新编译 (这是通过动态链接来实现的).

然而, 为了实现这个目标, 编译器就必须在各自独立的不同编译之间, 保证某种程度的二进制接口(Application Binary Interface, ABI) 稳定性.
这就是为什么 每一次语言变更都需要通过二进制兼容性的观点进行审查.

另一方面, 很大程度上我们依赖于库的作者来仔细判断那些变更是安全的.
因此, 库作者需要正确理解源代码的变更会如何影响二进制的兼容性, 并遵循某种好的实践原则, 来确保他们的库在 API 和 ABI 两方面的稳定性.
从库的演进的角度考虑语言的变更, 我们设想了以下原则:

* 库的代码应该明确指定 public/protected 函数和属性的值类型, 因此, 对于 public API 不应该通过类型推断来决定值类型.
  类型推断的细微变化可能会导致返回值类型的变化, 而且这种变化是很难察觉的, 因此会发生二进制兼容性问题.
* 由同一个库提供的重载(overload)的函数和属性, 本质上应该做完全相同的工作.
  类型推断的变更可能导致在函数调用处得到更加精确的静态类型, 因此会导致对重载函数的调用解析为不同的结果.

库的作者可以使用 @Deprecated 和 [@RequiresOptIn](opt-in-requirements.md) 注解来控制他们的 API 接口的演进.
注意, 即使是已经从 API 中删除的声明, 也可以使用 @Deprecated(level=HIDDEN) 注解来保护二进制兼容性.

而且, 按照通常的规约, 命名为 "internal" 的包不应该看作 public API.
命名为 "experimental" 的包内所有的 API 都应该被看作未稳定功能, 随时可以发生变化.

对稳定的平台的 Kotlin 标准库 (kotlin-stdlib), 我们按照上述原则进行维护.
对标准库的 API 的变更, 需要经过与语言变更相同的流程.

## 编译器参数

编译器接受的命令行参数也是一种 public API, 因此对它们也适用同样的原则.
编译器接受的参数(不带 "-X" 前缀或 "-XX" 前缀的那些) 只能在功能发布版中增加, 而且在删除之前, 需要先标记为废弃.
"-X" 和 "-XX" 参数是实验性的, 随时可以添加, 删除.

## 兼容性工具

由于遗留的旧功能被删除, bug 被修复, 因此源代码的语言变更时, 如果旧的源代码没有适当地迁移, 可能会无法正确编译.
通常的废弃流程使得使用者可以有一个平滑的代码迁移期间,
即使这个期间结束后, 语言的不兼容性变更已经随稳定版发布了, 我们仍然有办法可以编译未迁移的旧代码.

### 兼容性标记

我们提供了 `-language-version X.Y` 和 `-api-version X.Y` 标记,
用来让 Kotlin 的新版本模拟旧版本的行为, 以便维持兼容性.
为了给你留下更多的代码迁移时间, 除最新的稳定版之外, 我们还
[支持](compatibility-modes.md) 使用语言和 API 的前 3 个旧版本.

活跃维护中的代码库可以尽快升级到 bug 修复后的版本, 而不必等待整个升级周期完成.
目前, 这样的项目可以启用 `-progressive` 选项, 这样即使在增量发布的版本中, 也可以让这些 bug 修复有效.

所有这些标记都可以在命令行中使用, 也可以在 [Gradle](gradle-compiler-options.md)
和 [Maven](maven.md#specify-compiler-options) 中使用.

### 二进制格式的演化

即使在最糟糕的情况下, 源代码中的问题也可以手工修复, 但二进制文件的迁移就要困难得多了,
因此, 对二进制文件来说, 保证向后兼容是非常重要的.
二进制文件的不兼容变更可能导致版本升级非常痛苦, 因此, 与对语言的变更相比, 进行二进制文件的不兼容变更需要更加慎重.

对于完全稳定版本的编译器, 默认的二进制兼容性原则如下:

* 所有的二进制文件都是向后兼容的, 也就是说, 新版本的编译器可以读取旧版本的二进制文件
  (比如, 1.3 版可以正确理解 1.0 到 1.2 版的二进制文件),
* 旧版本的编译器会拒绝那些依赖新功能的二进制文件(比如, 1.0 版的编译器会拒绝那些使用了协程的二进制文件).
* 更进一步(但我们不能保证一定如此), 大多数二进制文件可以向前兼容下一个功能发布版, 但不兼容再下一个版本(如果没有使用新的功能,
  比如, 1.3 版可以理解 1.4 版产生的大多数二进制文件, 但不能理解 1.5 版产生的二进制文件).

这个原则是为了 "语言版本升级平滑便利" 而设计的, 因为即使项目本身在使用稍微旧一点的编译器, 它仍然可以升级它的依赖项目版本.

请注意, 并不是所有目标平台的稳定性都达到了这个程度(但 Kotlin/JVM 已经达到了).