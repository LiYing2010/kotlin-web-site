[//]: # (title: Kotlin 1.3 兼容性指南)

最终更新: %latestDocDate%

_[保证语言的现代化](kotlin-evolution.html)_ 以及 _[语言版本升级平滑便利](kotlin-evolution.html)_
是 Kotlin 语言设计时的基本原则之一.
第一条原则认为, 阻碍语言演进的那些元素应该删除,
后一条原则则认为, 这些删除必须事先与使用者良好沟通, 以便让源代码的迁移尽量平滑.

尽管语言的大多数变化都通过其他途径进行了通知, 比如每次更新时的变更日志, 以及编译器的警告信息,
但我们还是在本文档中对这些变化进行一个总结, 提供一个 Kotlin 1.2 从迁移到 Kotlin 1.3 时的完整的参考列表.

## 基本术语

在本文档中, 我们介绍几种类型的兼容性:

- *源代码级兼容性*: 源代码级别的不兼容会导致过去能够正确编译(没有错误和警告)的代码变得不再能够编译
- *二进制级兼容性*: 如果交换两个二进制库文件, 不会导致程序的装载错误, 或链接错误, 那么我们称这两个文件为二进制兼容
- *行为级兼容性*: 如果在某个变更发生之前和之后, 程序表现出不同的行为, 那么这个变更称为行为不兼容

请记住, 这些兼容性定义只针对纯 Kotlin 程序.
从其他语言(比如, Java)的观点来看 Kotlin 代码的兼容性如何, 本文档不予讨论.

## 不兼容的变化

### 调用 `<clinit>` 时的构造器参数计算顺序

> **Issue**: [KT-19532](https://youtrack.jetbrains.com/issue/KT-19532)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 在 1.3 版中, 类初始化时的计算顺序有变化
>
> **废弃周期**:
>
> - <1.3: 旧行为 (详情请参见 Issue)
> - &gt;=1.3: 行为有变化,
>  可以使用 `-Xnormalize-constructor-calls=disable` 参数临时退回到 1.3 以前的行为. 到下一个主版本发布时, 将会删除这个参数.

### 注解的构造器参数的属性取值方法的注解丢失问题

> **Issue**: [KT-25287](https://youtrack.jetbrains.com/issue/KT-25287)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 1.3 版开始, 针对注解的构造器参数的属性取值方法的注解会被正确地写入到 class 文件中
>
> **废弃周期**:
>
> - <1.3: 针对注解的构造器参数的属性取值方法的注解不会正确标注
> - &gt;=1.3: 针对注解的构造器参数的属性取值方法的注解会正确地标注, 并写入到编译生成的代码中

### 类构造器的 `@get:` 注解的错误丢失问题

> **Issue**: [KT-19628](https://youtrack.jetbrains.com/issue/KT-19628)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 在 1.3 中, 取值方法的注解会正确地报告编译错误
>
> **废弃周期**:
>
> - <1.2: 取值方法的注解有错误时, 不会报告编译错误, 导致错误的代码可以被编译.
> - 1.2.x: 只会通过工具报告错误, 编译器本身仍然会编译这些代码, 没有任何警告
> - &gt;=1.3: 编译器也会报告错误, 不正确的代码会被编译器拒绝

### 访问 `@NotNull` 注解标注的 Java 类型时的可空性断言

> **Issue**: [KT-20830](https://youtrack.jetbrains.com/issue/KT-20830)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 行为级
>
> **概述**: 对非空注解标注的 Java 类型, 会生成更加严格的可空性断言, 因此如果传递 `null`, 会更快地失败.
>
> **废弃周期**:
>
> - <1.3: 出现类型推断时, 编译器可能会丢失这些断言, 使得编译二进制文件时可能出现 `null` 值 (详情请参见 Issue).
> - &gt;=1.3: 编译器会生成这些断言. 这会使得那些传递了 `null` 值的错误代码更快地失败.
 可以使用 `-XXLanguage:-StrictJavaNullabilityAssertions` 参数临时退回到 1.3 以前的行为. 到下一个主版本发布时, 将会删除这个参数.

### 对枚举类成员的智能类型转换不正确

> **Issue**: [KT-20772](https://youtrack.jetbrains.com/issue/KT-20772)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 对一个枚举值的成员的智能类型转换, 将会只适用于这个枚举值
>
> **废弃周期**:
>
> - <1.3: 对枚举值的成员的智能类型转换, 可能导致对其他枚举值的同一个成员的不正确的智能类型转换.
> - &gt;=1.3: 智能类型转换将会正确地, 只适用于这个枚举值的成员.
可以使用 `-XXLanguage:-Sound智能类型转换ForEnumEntries` 参数临时退回到 1.3 以前的行为. 到下一个主版本发布时, 将会删除这个参数.

### 在取值方法中对`val` 型属性的后端域变量再次赋值

> **Issue**: [KT-16681](https://youtrack.jetbrains.com/issue/KT-16681)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 对于 `val` 型属性, 禁止在取值方法中对后端域变量再次赋值
>
> **废弃周期**:
>
> - <1.2: Kotlin 编译器允许在 `val` 型属性的取值方法中修改后端域变量. 这不仅违反了 Kotlin 的语法, 而且还会生成不正常的 JVM 字节码, 试图对 `final` 域变量赋值.
> - 1.2.X: 对 `val` 型属性的后端域变量赋值的代码, 会产生废弃警告
> - &gt;=1.3: 废弃警告升级为编译错误

### 在对数组的 `for` 循环之前捕获数组

> **Issue**: [KT-21354](https://youtrack.jetbrains.com/issue/KT-21354)
>
> **组件**: Kotlin/JVM
>
> **不兼容性类型**: 源代码级
>
> **概述**: 如果 for 循环的范围表达式是一个局部变量, 并且它的值在循环体内部被修改, 那么这个修改会影响循环的执行. 这样的行为与其他容器上的循环不一致, 比如值范围(Range), 字符串序列, 集合(Collection).
>
> **废弃周期**:
>
> - <1.2: 上面讲到的这类代码能够被正常编译, 但对局部变量值的修改会影响到循环的执行
> - 1.2.X: 如果 for 循环的范围表达式是一个基于数组的局部变量, 而且在循环体内被重新赋值, 那么编译器会产生废弃警告
> - 1.3: 对这里情况改变行为, 以便与其他容器上的循环行为保持一致

### 枚举值内的嵌套类型

> **Issue**: [KT-16310](https://youtrack.jetbrains.com/issue/KT-16310)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 枚举值内部禁止使用嵌套类型 (类, 对象, 接口, 注解类, 枚举类)
>
> **废弃周期**:
>
> - <1.2: 枚举值内部的嵌套类型可以正常编译, 但在运行期可能发生例外, 运行失败
> - 1.2.X: 对嵌套类型会产生废弃警告
> - &gt;=1.3: 废弃警告升级为编译错误

### 数据类覆盖 `copy` 方法

> **Issue**: [KT-19618](https://youtrack.jetbrains.com/issue/KT-19618)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 数据类禁止覆盖 `copy()` 方法
>
> **废弃周期**:
>
> - <1.2: 覆盖 `copy()` 方法的数据类, 可以正常编译, 但在运行期可能运行失败, 或者产生怪异的行为
> - 1.2.X: 对于覆盖 `copy()` 方法的数据类, 产生废弃警告
> - &gt;=1.3: 废弃警告升级为编译错误

### 继承 `Throwable` 的内部类从外部类中捕获泛型参数

> **Issue**: [KT-17981](https://youtrack.jetbrains.com/issue/KT-17981)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 内部类禁止继承 `Throwable`
>
> **废弃周期**:
>
> - <1.2: 继承 `Throwable` 的内部类可以正常编译. 如果这样的内部类捕获了泛型参数, 可能会导致奇怪的代码, 运行期会失败.
> - 1.2.X: 对继承 `Throwable` 的内部类, 产生废弃警告
> - &gt;=1.3: 废弃警告升级为编译错误

### 对于带有同伴对象的复杂的类继承的可见度规则

> **Issues**: [KT-21515](https://youtrack.jetbrains.com/issue/KT-21515), [KT-25333](https://youtrack.jetbrains.com/issue/KT-25333)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 涉及同伴对象和内嵌类型的复杂的类继承, 使用短名称(short name)的可见度规则变得更加严格了.
>
> **废弃周期**:
>
> - <1.2: 使用旧的可见度规则 (详情请参见 Issue)
> - 1.2.X: 对于未来将会变得不再可用的短名称, 产生废弃警告. 工具可以添加完整名称, 帮助你自动迁移代码.
> - &gt;=1.3: 废弃警告升级为编译错误. 违反规则的代码需要添加完整名称, 或者明确地 import

### 常数以外的 vararg 注解参数

> **Issue**: [KT-23153](https://youtrack.jetbrains.com/issue/KT-23153)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 禁止对 vararg 注解参数设置常数以外的值
>
> **废弃周期**:
>
> - <1.2: 编译器允许对 vararg 注解参数设置常数以外的值, 但在生成时字节码其实会抛弃这些值, 因此会导致难以理解的行为
> - 1.2.X: 对这类代码产生废弃警告
> - &gt;=1.3: 废弃警告升级为编译错误

### 局部的注解类

> **Issue**: [KT-23277](https://youtrack.jetbrains.com/issue/KT-23277)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 不再支持局部的注解类
>
> **废弃周期**:
>
> - <1.2: 编译器能够正常编译局部的注解类
> - 1.2.X: 对局部的注解类, 产生废弃警告
> - &gt;=1.3: 废弃警告升级为编译错误

### 对局部的委托属性的智能类型转换

> **Issue**: [KT-22517](https://youtrack.jetbrains.com/issue/KT-22517)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始， 不再允许局部的委托属性的智能类型转换
>
> **废弃周期**:
>
> - <1.2: 编译器允许对局部的委托属性的智能类型转换, 如果委托本身的行为不正确, 可能会导致不正确的智能类型转换
> - 1.2.X: 对局部的委托属性的智能类型转换, 将会被警告为已废弃 (编译器产生警告信息)
> - &gt;=1.3: 废弃警告升级为编译错误

### `mod` 运算符规约

> **Issues**: [KT-24197](https://youtrack.jetbrains.com/issue/KT-24197)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 禁止声明 `mod` 运算符, 也禁止调用这类运算符
>
> **废弃周期**:
>
> - 1.1.X, 1.2.X: 对于 `operator mod` 声明产生警告, 也对这类运算符的调用产生警告
> - 1.3.X: 警告升级为编译错误, 但还是允许对 % 运算符的调用解析到 `operator mod` 声明
> - 1.4.X: 对 % 运算符的调用不再解析到 `operator mod` 声明

### 以命名参数的形式向 vararg 传递单个值

> **Issues**: [KT-20588](https://youtrack.jetbrains.com/issue/KT-20588), [KT-20589](https://youtrack.jetbrains.com/issue/KT-20589). See also [KT-20171](https://youtrack.jetbrains.com/issue/KT-20171)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 在 Kotlin 1.3 中, 将单个元素赋值给 vararg 已被废弃, 应该改用连续展开(consecutive spread)操作和数组构造函数.
>
> **废弃周期**:
>
> - <1.2: 以命名参数的形式将单个元素赋值给 vararg, 可以正常编译, 而且会被认为是将 *单个* 元素赋值给一个数组, 在将数组赋值给 vararg 时会预料之外的行为
> - 1.2.X: 对这样的赋值会产生废弃警告, 建议使用者改用连续展开和数组构造函数.
> - 1.3.X: 警告升级为编译错误
> - &gt;=1.4: 将会改变将单个元素赋值给 vararg 的语法含义, 使得以数组赋值等价于以数组的展开赋值

### 目标为 `EXPRESSION` 的注解的 retention 设置

> **Issue**: [KT-13762](https://youtrack.jetbrains.com/issue/KT-13762)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 对于目标为 `EXPRESSION` 的注解, 它的 retention 允许设置为 `SOURCE`
>
> **废弃周期**:
>
> - <1.2: 目标为 `EXPRESSION` 的注解, 如果 retention 设置为 `SOURCE` 以外的值, 是允许的, 但是使用时会被忽略, 并且不提示任何警告信息
> - 1.2.X: 对这样的注解声明会产生废弃警告
> - &gt;=1.3: 警告升级为编译错误

### 目标为 `PARAMETER` 的注解不应该用在参数的类型上

> **Issue**: [KT-9580](https://youtrack.jetbrains.com/issue/KT-9580)
>
> **组件**: 核心语言
>
> **不兼容性类型**: 源代码级
>
> **概述**: 从 Kotlin 1.3 开始, 如果注解的目标为 `PARAMETER`, 但被用在参数的类型上, 会正确地产生警告
>
> **废弃周期**:
>
> - <1.2: 上述不正确的代码可以正常编译; 注解会被忽略, 没有任何警告信息, 并且不会出现在编译产生的字节码中
> - 1.2.X: 对注解的这种错误使用会产生废弃警告
> - &gt;=1.3: 警告升级为编译错误

###  当下标越界时 `Array.copyOfRange` 抛出异常, 而不是扩大返回的数组大小

> **Issue**: [KT-19489](https://youtrack.jetbrains.com/issue/KT-19489)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 行为级
>
> **概述**: `Array.copyOfRange` 函数的 `toIndex` 参数表示数组复制范围的结束位置下标(不包含在复制范围内), 从 Kotlin 1.3 开始, 会确保它不能大于数组大小, 否则会抛出 `IllegalArgumentException` 异常.
>
> **废弃周期**:
>
> - <1.3: 如果调用 `Array.copyOfRange` 时的 `toIndex` 参数大于数组大小, 那么指定的复制范围内缺少的数组元素会被填充为 `null` 值, 这会违反 Kotlin 的类型系统规则.
> - &gt;=1.3: 检查 `toIndex` 是否在数组边界内, 否则会抛出异常

### 步长(step)为 `Int.MIN_VALUE` 和 `Long.MIN_VALUE` 的整数和长整数的数列(progression)会被判定为非法, 并禁止创建

> **Issue**: [KT-17176](https://youtrack.jetbrains.com/issue/KT-17176)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.3 开始, 禁止整数数列的步长(step)值设置为对应的整数类型(`Long` or `Int`)的最小值, 因此如果调用 `IntProgression.fromClosedRange(0, 1, step = Int.MIN_VALUE)` 将会抛出 `IllegalArgumentException` 异常
>
> **废弃周期**:
>
> - <1.3: 可以创建步长为 `Int.MIN_VALUE` 的 `IntProgression`, 这个数列将会产生两个值: `[0, -2147483648]`, 这是一种预期之外的行为
> - &gt;=1.3: 如果步长值是整数类型的最小值, 将会抛出 `IllegalArgumentException` 异常

### 对非常长的序列的操作中, 检查下标溢出

> **Issue**: [KT-16097](https://youtrack.jetbrains.com/issue/KT-16097)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.3 开始, 在对非常长的序列的操作中, 会确保 `index`, `count` 以及其他类似方法不会发生整数溢出. 关于受影响的所有方法, 请参见 Issue.
>
> **废弃周期**:
>
> - <1.3: 对非常长的序列, 调用这些方法可能发生整数溢出, 得到负数结果
> - &gt;=1.3: 对这些方法检查整数溢出, 并立即抛出异常

### 使用没有匹配结果的正规表达式来切分字符串时, 在各个平台上得到一致的结果

> **Issue**: [KT-21049](https://youtrack.jetbrains.com/issue/KT-21049)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 行为级
>
> **概述**: 从 Kotlin 1.3 开始, 使用没有匹配结果的正规表达式来调用 `split` 方法时, 在各个平台上会得到一致的结果
>
> **废弃周期**:
>
> - <1.3: 这样的调用在 JS, JRE 6, JRE 7 以及 JRE 8+ 平台会得到不同的结果
> - &gt;=1.3: 统一各个平台的结果

### 在编译器的发布中不再带有已废弃的库文件

> **Issue**: [KT-23799](https://youtrack.jetbrains.com/issue/KT-23799)
>
> **组件**: 其它
>
> **不兼容性类型**: 二进制级
>
> **概述**: Kotlin 1.3 不再带有以下已废弃的二进制库文件:
> - `kotlin-runtime`: 请改用 `kotlin-stdlib`
> - `kotlin-stdlib-jre7/8`: 请改用 `kotlin-stdlib-jdk7/8`
> - `kotlin-jslib`: 请改用 `kotlin-stdlib-js`
>
> **废弃周期**:
>
> - 1.2.X: 这些库文件被标记为已废弃, 使用这些库时编译器会产生警告
> - &gt;=1.3: 这些库文件不再随编译器一起发布

### stdlib 中的注解

> **Issue**: [KT-21784](https://youtrack.jetbrains.com/issue/KT-21784)
>
> **组件**: kotlin-stdlib (JVM)
>
> **不兼容性类型**: 二进制级
>
> **概述**: Kotlin 1.3 从 stdlib 删除了 `org.jetbrains.annotations` 包内的注解, 移动到随编译器一起发布的其他库文件中: `annotations-13.0.jar` 和 `mutability-annotations-compat.jar`
>
> **废弃周期**:
>
> - <1.3: 这些注解随 stdlib 库文件一起发布
> - &gt;=1.3: 这些注解随其他库文件一起发布