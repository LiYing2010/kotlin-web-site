[//]: # (title: 与 Java 比较)

## Kotlin 中得到解决的一些 Java 问题 {id="some-java-issues-addressed-in-kotlin"}

Java 中长期困扰的一系列问题, 在 Kotlin 得到了解决:

* Null 引用 [由类型系统管理](null-safety.md).
* [没有原生类型(raw type)](java-interop.md#java-generics-in-kotlin)
* Kotlin 中的数组是 [类型不可变的](arrays.md)
* 与 Java 中的 SAM 变换方案相反, Kotlin 中存在专门的 [函数类型(function type)](lambdas.md#function-types)
* 不使用通配符的 [使用处类型变异(Use-site variance)](generics.md#use-site-variance-type-projections)
* Kotlin 中不存在受控 [异常](exceptions.md)
* [集合的接口定义区分为只读集合与可变集合](collections-overview.md)

## Java 中有, 而 Kotlin 中没有的功能

* [受控异常](exceptions.md)
* 不是类的 [基本数据类型](basic-types.md).
  Kotlin 编译产生的字节码会尽可能使用基本数据类型, 但在 Kotlin 源代码中并不能明确的使用基本数据类型.
* [静态成员](classes.md)
  在 Kotlin 中由以下功能代替:
  [同伴对象(Companion Object)](object-declarations.md#companion-objects),
  [顶级(top-level) 函数](functions.md),
  [扩展(extension) 函数](extensions.md#extension-functions),
  以及 [@JvmStatic 注解](java-to-kotlin-interop.md#static-methods).
* [通配符类型(Wildcard-type)](generics.md)
  在 Kotlin 中由以下功能代替:
  [声明处类型变异(declaration-site variance)](generics.md#declaration-site-variance)
  以及 [类型投射(type projection)](generics.md#type-projections).
* [条件(三元)运算符 `a ? b : c`](control-flow.md#if-expression)
  在 Kotlin 中由以下功能代替: [if 表达式](control-flow.md#if-expression).
* [记录类(Record)](https://openjdk.org/jeps/395)
* [记录模式(Record Pattern)](https://openjdk.org/jeps/440)
* **Java 22**: [未命名变量和模式](https://openjdk.org/jeps/456)

## Kotlin 中有, 而 Java 中没有的功能

* [Lambda 表达式](lambdas.md) + [内联函数](inline-functions.md) = 实现自定义的控制结构
* [扩展函数](extensions.md)
* [Null 值安全性](null-safety.md)
* [类型智能转换](typecasts.md) (**Java 16**: [对 instanceof 的模式匹配](https://openjdk.org/jeps/394))
* [字符串模板](strings.md) (**Java 21**: [字符串模板 (预览版)](https://openjdk.org/jeps/430))
* [属性](properties.md)
* [主构造器](classes.md)
* [委托(First-class delegation)](delegation.md)
* [变量和属性的类型推断](basic-types.md) (**Java 10**: [局部变量的类型推断](https://openjdk.org/jeps/286))
* [单例(Singleton)](object-declarations.md)
* [声明处类型变异(Declaration-site variance) 和类型投射(Type projection)](generics.md)
* [值范围表达式](ranges.md)
* [操作符重载](operator-overloading.md)
* [同伴对象(Companion object)](classes.md#companion-objects)
* [数据类](data-classes.md)
* [协程](coroutines-overview.md)
* [顶级(Top Level)函数](functions.md)
* [默认参数](functions.md#default-arguments)
* [命名参数](functions.md#named-arguments)
* [中缀(Infix)函数](functions.md#infix-notation)
* [预期声明与实际声明](multiplatform-expect-actual.md)

## 下一步做什么?

学习:
* 如何执行 [Java 与 Kotlin 中常见的字符串处理任务](java-to-kotlin-idioms-strings.md).
* 如何执行 [Java 与 Kotlin 中常见的集合(Collection)处理任务](java-to-kotlin-collections-guide.md).
* 如何 [在 Java 与 Kotlin 中处理可空性(Nullability)](java-to-kotlin-nullability-guide.md).
