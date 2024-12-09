[//]: # (title: 一致性)

在 API 设计中, 为了确保易用性, 一致性是非常重要的.
通过维护一致的参数顺序, 命名规约, 以及错误处理机制, 你的库对于使用者会更加直观, 更加可靠.
遵循这些最佳实践, 有助于避免混乱和错误使用, 带来更好的开发者体验, 使应用程序更加健壮.

## 保持参数顺序, 命名, 以及使用的一致性

在设计一个库时, 要保持参数顺序, 命名方式, 以及重载的使用的一致性.
例如, 如果你的某个既有方法具有 `offset` 和 `length` 参数,
那么对于新的方法, 除非存在重要原因, 否则你不应该改为使用其它参数风格, 例如 `startIndex` 和 `endIndex`.

库提供的重载函数的行为应该相同.
当使用者改变传递给你的库的参数值类型时, 他们会期望函数行为保持一致的.
例如, 下面这些调用都会创建相同的实例, 因为输入在语义上是相同的:

```kotlin
BigDecimal(200)
BigDecimal(200L)
BigDecimal("200")
```

不要将 `startIndex` 和 `stopIndex` 这样的参数名称与同义词混合使用, 例如 `beginIndex` 和 `endIndex`.
类似的, 要对集合中的值选择一个用语, 例如 `element`, `item`, `entry`, 或 `entity`, 并且在所有地方使用相同的用语.

对相关的方法的命名要一致的, 并且易于预测.
例如, Kotlin 标准库包含一些成对的函数, 例如 `first` 和 `firstOrNull`, `single` 和 `singleOrNull`.
这些成对的函数清楚的表示, 有些函数可能返回 `null` 值, 另一些函数则可能抛出异常.
参数声明的顺序应该从一般到具体, 因此必须的输入应该最先出现, 可选的输入在最后.
例如, 在 [`CharSequence.findAnyOf`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/find-any-of.html) 中, `strings` 集合是最前面的参数, 之后是 `startIndex`, 最后是 `ignoreCase` 选项.

考虑一个库, 它管理雇员记录, 提供下面的 API 来检索雇员:

```kotlin
fun findStaffBySeniority(
    startIndex: Int, 
    minYearsServiceExclusive: Int
): List<Employee>

fun findStaffByAge(
    minAgeInclusive: Int, 
    startIndex: Int
): List<Employee>
```

要正确使用这个 API 会非常困难.
有多个相同类型的参数出现, 顺序不一致, 而且使用方式也不一致.
你的库的使用者很可能会根据他们对旧函数的经验, 对于新函数作出错误的假设.

## 对数据和状态使用面向对象的设计

Kotlin 同时支持面向对象式和函数式两种编程风格.
在你的 API 中, 应该使用类来表达数据和状态.
当数据和状态是层级结构时, 应该考虑使用继承.

如果需要的所有状态都可以作为参数传递, 应该优先使用顶层(top-level) 函数.
如果会对这些函数进行链式调用, 应该考虑将函数写成扩展函数, 以增加可读性.

## 选择适当的错误处理机制 {id="choose-the-appropriate-error-handling-mechanism"}

Kotlin 提供了几种错误处理的机制.
你的 API 可以抛出异常, 返回 `null` 值, 使用一个自定义的结果类型, 或者使用内建的 [`Result`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-result/) 类型.
要确保你的库一致并且正确的使用这些选项.

当不能获取或计算数据时, 要使用可为 null 的返回类型, 并返回 `null` 来表示数据缺失.
其它情况下, 请抛出一个异常, 或者返回一个 `Result` 类型.

可以考虑提供函数重载, 其中一个函数抛出异常, 另一个函数则将异常封装在结果类型中.
这种情况下, 可以使用 `Catching` 后缀表示异常会在函数内捕获.
例如, 标准库的 [`run`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run.html) 和 [`runCatching`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/run-catching.html) 函数就使用了这样的规约,
协程库则有对 channel 的 [`receive`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive.html) 和 [`receiveCatching`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.channels/-receive-channel/receive-catching.html) 方法.

不要对正常的控制流使用异常. 应该设计你的 API, 允许在进行操作之前进行条件检查,
以避免不必要的错误处理.
[命令 / 查询 分离](https://martinfowler.com/bliki/CommandQuerySeparation.html)
是一种有用的模式, 可以应用于这种情况.

## 保持规约和质量 {id="maintain-conventions-and-quality"}

一致性的最后一个方面, 不是关于库本身的设计, 而是要保持高水准的质量.

你应该使用自动化工具 (校验检查器 linter) 进行静态分析, 确保你的代码遵循 Kotlin 的一般规约, 以及你的项目专用的规约.

一个 Kotlin 库还应该提供一组单元测试和集成测试, 涵盖所有的 API 入口点的有文档说明的行为.
测试应该包含广泛的输入, 尤其是已知的边界情况和边缘情况.
任何未测试的行为都应该被认为 (最好情况下) 是不可靠的.

在开发过程中要使用这组测试来验证修改没有破坏原有的行为.
要对每一个发布版运行这些测试, 作为构建和发布的标准化流程的一部分.
在你的构建过程中可以集成 [Kover](https://github.com/Kotlin/kotlinx-kover) 之类的工具, 用来测量覆盖率, 并生成报告.

## 下一步

在本向导的下一部分, 你将学习可预测性.

[进入下一部分](api-guidelines-predictability.md)
