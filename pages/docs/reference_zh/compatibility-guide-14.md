---
type: doc
layout: reference
title: "Kotlin 1.4 兼容性指南"
---

# Kotlin 1.4 兼容性指南

[*保证语言的现代化* 以及 *语言版本升级平滑便利*](evolution/kotlin-evolution.html) 是 Kotlin 语言设计时的基本原则之一.
第一条原则认为, 阻碍语言演进的那些元素应该删除, 后一条原则则认为, 这些删除必须事先与使用者良好沟通, 以便让源代码的迁移尽量平滑.

尽管语言的大多数变化都通过其他途径进行了通知, 比如每次更新时的变更日志, 以及编译器的警告信息,
但我们还是在本文档中对这些变化进行一个总结, 提供一个 Kotlin 1.3 从迁移到 Kotlin 1.4 时的完整的参考列表.

## 基本术语

在本文档中, 我们介绍几种类型的兼容性:

- _源代码级兼容性_: 源代码级别的不兼容会导致过去能够正确编译(没有错误和警告)的代码变得不再能够编译
- _二进制级兼容性_: 如果交换两个二进制库文件, 不会导致程序的装载错误, 或链接错误, 那么我们称这两个文件为二进制兼容
- _行为级兼容性_: 如果在某个变更发生之前和之后, 程序表现出不同的行为, 那么这个变更称为行为不兼容

请记住, 这些兼容性定义只针对纯 Kotlin 程序.
从其他语言(比如, Java)的观点来看 Kotlin 代码的兼容性如何, 本文档不予讨论.


## 语言与标准库

### `ConcurrentHashMap` 的 `in` 中缀操作符的不正常行为

> **Issue**: [KT-18053](https://youtrack.jetbrains.com/issue/KT-18053)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: Kotlin 1.4 将会禁止使用 Java 编写的 `java.util.Map` 的实现中的 `contains` 操作符
>
> **废弃周期**:
>
> - < 1.4: 对问题的操作符, 在调用处产生编译警告
> - \>= 1.4: 将这个警告提升为错误,
> 可以暂时使用 `-XXLanguage:-ProhibitConcurrentHashMapContains` 回退到 1.4 以前的行为

### 禁止访问 public inline 成员之内的 protected 成员

> **Issue**: [KT-21178](https://youtrack.jetbrains.com/issue/KT-21178)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: Kotlin 1.4 将会禁止通过 public inline 成员来访问 protected 成员.
>
> **废弃周期**:
>
> - < 1.4: 对有问题的访问, 在调用处产生编译警告
> - 1.4: 将这个警告提升为错误,
>  可以暂时使用 `-XXLanguage:-ProhibitProtectedCallFromInline` 回退到 1.4 以前的行为

### 带隐含接受者的调用的契约(Contract)

> **Issue**: [KT-28672](https://youtrack.jetbrains.com/issue/KT-28672)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 行为级
>
> **概述**: 在 1.4 中, 对于带隐含接受者的调用, 可以根据契约(Contract)信息进行智能类型转换
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
>  可以暂时使用 `-XXLanguage:-ContractsOnCallsWithImplicitReceiver` 回退到 1.4 以前的行为

### 浮点数比较的行为不一致

> **Issues**: [KT-22723](https://youtrack.jetbrains.com/issue/KT-22723)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, Kotlin 编译器将会使用 IEEE 754 标准来比较浮点数
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
>  可以暂时使用 `-XXLanguage:-ProperIeee754Comparisons` 回退到 1.4 以前的行为

### 在泛型 Lambda 表达式中, 最后一条表达式没有智能类型转换

> **Issue**: [KT-15020](https://youtrack.jetbrains.com/issue/KT-15020)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 1.4 开始, Lambda 表达式中对最后一条表达式的智能类型转换将会正确执行
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 不再根据 Lambda 表达式参数的顺序将类型强制解释为 `Unit`

> **Issue**: [KT-36045](https://youtrack.jetbrains.com/issue/KT-36045)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, Lambda 表达式参数将会分别独立解析, 不再隐含的强制解释为 `Unit`
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### raw 和 integer 字面类型的共通超类型错误, 导致代码错误

> **Issue**: [KT-35681](https://youtrack.jetbrains.com/issue/KT-35681)
>
> **Components**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, raw `Comparable` 类型和 integer 字面类型的共通超类型将会更加明确
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 类型安全性问题: 几个相等类型的变量被初始化为不同的类型

> **Issue**: [KT-35679](https://youtrack.jetbrains.com/issue/KT-35679)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, Kotlin 编译器将会禁止将相等类型的变量初始化为不同的类型
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 类型安全性问题: 对于类型交集, 子类型不正确

> **Issues**: [KT-22474](https://youtrack.jetbrains.com/issue/KT-22474)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 在 Kotlin 1.4 中, 将会改进类型交集的子类型, 使其动作更正确
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 在 Lambda 表达式之内的空 `when` 表达式没有类型不匹配

> **Issue**: [KT-17995](https://youtrack.jetbrains.com/issue/KT-17995)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 对于空 `when` 表达式, 如果用作 Lambda 表达式之内的最后一条表达式, 将会出现类型不匹配
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 如果 Lambda 表达式可能的返回值之一是使用 integer 字面类型的快速返回, 推断的 Lambda 表达式返回类型为 `Any`

> **Issue**: [KT-20226](https://youtrack.jetbrains.com/issue/KT-20226)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 如果 Lambda 表达式存在快速返回, 返回类型将会更加正确的推断为 integer
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 正确的捕捉带递归类型的星号投射(star projection)

> **Issue**: [KT-33012](https://youtrack.jetbrains.com/issue/KT-33012)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 可以使用更多类型选项, 因为递归类型的捕捉将会更加正确
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 不完整类型(non-proper type)与灵活类型(flexible type)的共通超类型计算导致错误的结果

> **Issue**: [KT-37054](https://youtrack.jetbrains.com/issue/KT-37054)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, 灵活类型(flexible type)的共通超类型将会更加正确, 防止运行时错误
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 类型安全性问题: 可 null 的类型参数未能正确转换为捕获的类型

> **Issue**: [KT-35487](https://youtrack.jetbrains.com/issue/KT-35487)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 捕获类型与可 null 类型的子类型将会更加正确, 防止运行时错误
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 对协变(covariant)类型, 在未检测的类型转换之后, 保留交叉类型(intersection type)

> **Issue**: [KT-37280](https://youtrack.jetbrains.com/issue/KT-37280)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 对协变(covariant)类型的未检测的类型转换, 会产生用于智能类型转换的交叉类型(intersection type),
>  而不是未检测的类型转换的类型.
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 使用 `this` 表达式导致构造器推断中缺少类型变量

> **Issue**: [KT-32126](https://youtrack.jetbrains.com/issue/KT-32126)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 如果不存在其他适当的约束, 在 `sequence {}` 之类的构造器函数内使用 `this` 会被禁止
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 对带有可 null 类型参数的反向类型变异(contravariant)类型的 overload 解析结果错误

> **Issue**: [KT-31670](https://youtrack.jetbrains.com/issue/KT-31670)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 如果一个函数的 2 个 overload, 接受反向类型变异(contravariant)类型参数,
>  区别只有类型可否为 null (比如 `In<T>` 和 `In<T?>`), 这时将认为可 null 类型是更明确的 overload 解析结果.
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 带有非嵌套的递归约束的构造器推断

> **Issue**: [KT-34975](https://youtrack.jetbrains.com/issue/KT-34975)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, `sequence {}` 之类的构造器函数,
>   如果其类型依赖于一个在传入的Lambda 表达式之内的递归约束, 会导致编译器错误.
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 类型变量的固定在及早计算(eager)模式下会导致矛盾的约束系统

> **Issue**: [KT-25175](https://youtrack.jetbrains.com/issue/KT-25175)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 某些场景的类型推断不再使用及早计算(eager)模式,
>   以便寻找没有矛盾的约束系统.
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NewInference` 回退到 1.4 以前的行为.
> 注意, 这个标记还会同时关闭其他几个新语言特性.

### 对 `open` 函数禁止使用 `tailrec` 标识符

> **Issue**: [KT-18541](https://youtrack.jetbrains.com/issue/KT-18541)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 函数不能同时存在 `open` 和 `tailrec` 标识符.
>
> **废弃周期**:
>
> - < 1.4: 对同时存在 `open` 和 `tailrec` 标识符的函数报告警告 (渐进模式(progressive mode) 下会报告错误).
> - \>= 1.4: 将这个警告提升为错误.

### 同伴对象的 `INSTANCE` 域可见度超过同伴对象的类本身

> **Issue**: [KT-11567](https://youtrack.jetbrains.com/issue/KT-11567)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 如果同伴对象可见度为 private, 那么它的域 `INSTANCE` 可见度也将是 private
>
> **废弃周期**:
>
> - < 1.4: 编译器生成对象的 `INSTANCE` 带有废弃标记
> - \>= 1.4: 同伴对象的 `INSTANCE` 域带有正确的可见度

### 插入在 `return` 之前的外层 `finally` 代码段, 没有从不带 `finally` 的内层 `try` 代码段的 `catch` 分支中排除

> **Issue**: [KT-31923](https://youtrack.jetbrains.com/issue/KT-31923)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, 对嵌套的 `try/catch` 代码段, catch 分支将被正确计算
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-ProperFinally` 回退到 1.4 以前的行为

### 对协变(covariant)和泛型专用的(generic-specialized)覆盖, 在返回类型位置的内联类(inline class)会使用装箱(box)版本

> **Issues**: [KT-30419](https://youtrack.jetbrains.com/issue/KT-30419)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, 使用协变(covariant)和泛型专用的(generic-specialized)覆盖的函数,
>   将会返回内联类(inline class)的装箱(box)的值
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化

### 委托到 Kotlin 接口时, 在 JVM 字节码中不声明受控异常(Checked Exception)

> **Issue**: [KT-35834](https://youtrack.jetbrains.com/issue/KT-35834)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 源代码级
>
> **概述**: Kotlin 1.4 中, 当接口委托给 Kotlin 接口时, 将不会生成受控异常(Checked Exception)
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-DoNotGenerateThrowsForDelegatedKotlinMembers` 回退到 1.4 以前的行为

### 对于带有单个不定数量参数(vararg parameter)的方法, 签名多态(signature-polymorphic)调用的行为有变化, 以避免将参数包装入另一个数组

> **Issue**: [KT-35469](https://youtrack.jetbrains.com/issue/KT-35469)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 源代码级
>
> **概述**: Kotlin 1.4 中, 对签名多态(signature-polymorphic)的方法调用, 不会将参数包装入另一个数组
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化

### 当 KClass 用作泛型参数时, 注解中的泛型签名错误

> **Issue**: [KT-35207](https://youtrack.jetbrains.com/issue/KT-35207)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 源代码级
>
> **概述**: Kotlin 1.4 中, 当 KClass 用作泛型参数时, 会修正注解中的错误的类型映射
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化

### 在签名多态(signature-polymorphic) 调用中禁止展开(spread)

> **Issue**: [KT-35226](https://youtrack.jetbrains.com/issue/KT-35226)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 源代码级
>
> **概述**: Kotlin 1.4 将在签名多态(signature-polymorphic)调用中禁止使用展开(spread)操作符(*)
>
> **废弃周期**:
>
> - < 1.4: 对于在签名多态(signature-polymorphic)调用中使用展开(spread)操作符, 会报告警告
> - \>= 1.5: 将这个警告提升为错误,
> 可以暂时使用 `-XXLanguage:-ProhibitSpreadOnSignaturePolymorphicCall` 回退到 1.4 以前的行为

### 对尾递归(tail-recursive)优化函数, 默认值的初始化顺序变更  

> **Issue**: [KT-31540](https://youtrack.jetbrains.com/issue/KT-31540)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, 对尾递归(tail-recursive)函数的初始化顺序, 将与通常的函数相同
>
> **废弃周期**:
>
> - < 1.4: 对于有问题的函数, 在声明处报告警告
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-ProperComputationOrderOfTailrecDefaultParameters` 回退到 1.4 以前的行为

### 对非 `const` 的 `val`, 不生成 `ConstantValue` 属性

> **Issue**: [KT-16615](https://youtrack.jetbrains.com/issue/KT-16615)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, 对非 `const` 的 `val`, 编译器不会生成 `ConstantValue` 属性
>
> **废弃周期**:
>
> - < 1.4: 通过 IntelliJ IDEA 的代码审查报告警告
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-NoConstantValueAttributeForNonConstVals` 回退到 1.4 以前的行为

### 对 `open` 方法上的 `@JvmOverloads` 生成的 overload 应该是 `final`

> **Issue**: [KT-33240](https://youtrack.jetbrains.com/issue/KT-33240)
>
> **Components**: Kotlin/JVM
>
> **不兼容性类型**: 源代码级
>
> **概述**: 对带有 `@JvmOverloads` 注解的函数, 生成的 overload 将是 `final`
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化,
> 可以暂时使用 `-XXLanguage:-GenerateJvmOverloadsAsFinal` 回退到 1.4 以前的行为

### 返回 `kotlin.Result` 的 Lambda 表达式, 现在会返回装箱(box)的值, 而不是未装箱(unbox)的值

> **Issue**: [KT-39198](https://youtrack.jetbrains.com/issue/KT-39198)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, 返回值为 `kotlin.Result` 类型的 Lambda 表达式, 将会返回装箱(box)的值, 而不是未装箱(unbox)的值
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化

### 统一 null 检查的相关异常

> **Issue**: [KT-22275](https://youtrack.jetbrains.com/issue/KT-22275)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, 所有的运行时 null 检查将会抛出 `java.lang.NullPointerException` 异常
>
> **废弃周期**:
>
> - < 1.4: 运行时 null 检查抛出不同的异常, 比如 `KotlinNullPointerException`, `IllegalStateException`,
> `IllegalArgumentException`, 和 `TypeCastException`
> - \>= 1.4: all 运行时 null 检查抛出 `java.lang.NullPointerException` 异常.
> 可以暂时使用 `-Xno-unified-null-checks` 回退到 1.4 以前的行为

### 在 array/list 的 `contains`, `indexOf`, `lastIndexOf` 操作中的浮点值比较: 使用 IEEE 754 标准还是全顺序(total order)标准

> **Issue**: [KT-28753](https://youtrack.jetbrains.com/issue/KT-28753)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 `Double/FloatArray.asList()` 返回的 `List` 实现, 将会实现 `contains`, `indexOf`, 和 `lastIndexOf`,
>      因此他们会使用全顺序相等性(total order equality)
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化

### 将集合的 `min` 和 `max` 函数返回类型逐渐改变为非 null

> **Issue**: [KT-38854](https://youtrack.jetbrains.com/issue/KT-38854)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 源代码级
>
> **概述**: 在 1.6 中, 集合的 `min` 和 `max` 函数返回类型将会变为非 null
>
> **废弃周期**:
>
> - 1.4: 引入 `...OrNull` 函数作为同义函数, 并废弃受影响的 API (详情请参见 issue)
> - 1.5.x: 将受影响的 API 的废弃级别提升为错误
> - \>=1.6: 重新引入受影响的 API, 但返回类型为非 null

### 废弃 `appendln`, 改为使用 `appendLine`

> **Issue**: [KT-38754](https://youtrack.jetbrains.com/issue/KT-38754)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 源代码级
>
> **概述**: `StringBuilder.appendln()` 将被废弃, 改为使用 `StringBuilder.appendLine()`
>
> **废弃周期**:
>
> - 1.4: 引入 `appendLine` 函数, 替代 `appendln`, 并废弃 `appendln`
> - \>=1.5: 将废弃级别提升为错误

### 废弃浮点类型向 `Short` 和 `Byte` 的转换

> **Issue**: [KT-30360](https://youtrack.jetbrains.com/issue/KT-30360)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 浮点类型转换为 `Short` 和 `Byte` 将被废弃
>
> **废弃周期**:
>
> - 1.4: 废弃 `Double.toShort()/toByte()` 和 `Float.toShort()/toByte()`, 并提供替代函数
> - \>=1.5: 将废弃级别提升为错误

### 在 `Regex.findAll` 中使用不正确的 `startIndex` 时快速失败

> **Issue**: [KT-28356](https://youtrack.jetbrains.com/issue/KT-28356)
>
> **组件**: kotlin-stdlib
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.4 开始, `findAll` 函数将会改进, 会在进入 `findAll` 时,
>    立即检查 `startIndex` 是否在输入的字符序列的正确下标范围之内, 如果不是则抛出 `IndexOutOfBoundsException` 异常
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化

### 删除废弃的 `kotlin.coroutines.experimental`

> **Issue**: [KT-36083](https://youtrack.jetbrains.com/issue/KT-36083)
>
> **组件**: kotlin-stdlib
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 废弃的 `kotlin.coroutines.experimental` API 将从标准库中删除
>
> **废弃周期**:
>
> - < 1.4: `kotlin.coroutines.experimental` 被废弃, 级别为 `ERROR`
> - \>= 1.4: `kotlin.coroutines.experimental` 被从标准库删除.
>     在 JVM 平台, 提供了一个单独的兼容库(详情请参见 issue).

### 删除废弃的 `mod` 操作符

> **Issue**: [KT-26654](https://youtrack.jetbrains.com/issue/KT-26654)
>
> **组件**: kotlin-stdlib
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.4 开始, 数值类型上的 `mod` 操作符被从标准库删除
>
> **废弃周期**:
>
> - < 1.4: `mod` 被废弃, 级别为 `ERROR`
> - \>= 1.4: `mod` 被从标准库删除

### 隐藏 `Throwable.addSuppressed` 成员函数, 改为使用扩展函数

> **Issue**: [KT-38777](https://youtrack.jetbrains.com/issue/KT-38777)
>
> **组件**: kotlin-stdlib
>
> **不兼容性类型**: 行为级
>
> **概述**: 建议使用 `Throwable.addSuppressed()` 扩展函数, 而不是 `Throwable.addSuppressed()` 成员函数
>
> **废弃周期**:
>
> - < 1.4: 旧行为 (详情请参见 issue)
> - \>= 1.4: 行为有变化

### `capitalize` 应该将二合字母(Digraph)转换为标题格式(title case)

> **Issue**: [KT-38817](https://youtrack.jetbrains.com/issue/KT-38817)
>
> **组件**: kotlin-stdlib
>
> **不兼容性类型**: 行为级
>
> **概述**: `String.capitalize()` 函数现在能够将 [Serbo-Croatian Gaj 式拉丁字母表](https://en.wikipedia.org/wiki/Gaj%27s_Latin_alphabet) 中的二合字母(Digraph)
>   转换为标题格式(title case) (`ǅ` 而不是 `Ǆ`)
>
> **废弃周期**:
>
> - < 1.4: 二合字母的首字母大写转换结果为: 大写格式(upper case) (`Ǆ`)
> - \>= 1.4: 二二合字母的首字母大写转换结果为: 标题格式(title case) (`ǅ`)

## 工具

### 在 Windows 上, 带分隔字符的编译器参数必须使用双引号括起

> **Issue**: [KT-30211](https://youtrack.jetbrains.com/issue/KT-30211)
>
> **组件**: CLI
>
> **不兼容性类型**: 行为级
>
> **概述**: 在 Windows 上, `kotlinc.bat` 包含分隔字符的参数 (空格, `=`, `;`, `,`)
>   现在必须使用双引号(`"`)括起
>
> **废弃周期**:
>
> - < 1.4: 所有的编译器参数都不使用引号
> - \>= 1.4: 包含分隔字符的编译器参数 (空格, `=`, `;`, `,`) 需要双引号(`"`)括起


### KAPT: 属性的合成 `$annotations()` 方法名称有变化

> **Issue**: [KT-36926](https://youtrack.jetbrains.com/issue/KT-36926)
>
> **组件**: KAPT
>
> **不兼容性类型**: 行为级
>
> **概述**: 在 1.4 中, KAPT 为属性生成的合成 `$annotations()` 方法的名称有变化
>
> **废弃周期**:
>
> - < 1.4:  属性的合成 `$annotations()` 方法的名称模式是 `<propertyName>@annotations()`
> - \>= 1.4: 属性的合成 `$annotations()` 方法的名称包含 `get` 前缀: `get<PropertyName>@annotations()`
