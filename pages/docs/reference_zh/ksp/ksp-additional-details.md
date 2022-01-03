---
type: doc
layout: reference
category:
title: "KSP 如何将 Kotlin 代码组织为模型"
---

# KSP 如何将 Kotlin 代码组织为模型

本页面最终更新: 2022/04/14

可以在
[KSP GitHub 代码仓库](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp)
找到 API 定义 .
下面的类图大致说明了 KSP 中 Kotlin 的
[模型结构](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/symbol/)
:

![类图]({{ url_for('asset', path='/docs/images/ksp-class-diagram.svg') }})

## 类型解析

在 API 的底层实现中, 主要的资源消耗是类型解析. 因此类型引用设计为由处理器明确解析(也有少数例外情况).
当引用一个 _类型(Type)_ (比如 `KSFunctionDeclaration.returnType` 或 `KSAnnotation.annotationType`),
永远是 `KSTypeReference`, 这是一个带有注解和修饰符的 `KSReferenceElement`.

```kotlin
interface KSFunctionDeclaration : ... {
  val returnType: KSTypeReference?
  // ...
}

interface KSTypeReference : KSAnnotated, KSModifierListOwner {
  val type: KSReferenceElement
}
```

一个 `KSTypeReference` 可以解析为一个 `KSType`, 它引用到 Kotlin 类型系统中的一个类型.

一个`KSTypeReference` 拥有一个 `KSReferenceElement`, 它是 Kotlin 程序结构的数据模型: 也就是, 类型引用是如何编写的.
它对应于 Kotlin 语法中的 [`type`](https://kotlinlang.org/docs/reference/grammar.html#type) 元素.

一个 `KSReferenceElement` 可以是一个 `KSClassifierReference` 或 `KSCallableReference`, 其中包含很多不需要解析的有用信息.
比如,
`KSClassifierReference` 拥有 `referencedName`,
`KSCallableReference` 拥有 `receiverType`, `functionArguments`, 和 `returnType`.

如果需要一个 `KSTypeReference` 引用的原始声明, 通常可以解析到 `KSType`, 并通过访问 `KSType.declaration` 得到.
要从一个类型被使用的地方, 得到它的类声明的地方, 代码如下:

```kotlin
val ksType: KSType = ksTypeReference.resolve()
val ksDeclaration: KSDeclaration = ksType.declaration
```

类型解析的代价很高, 因此需要明确调用. 通过解析得到的有些信息在 `KSReferenceElement` 中已经存在了.
比如, 通过 `KSClassifierReference.referencedName` 可以过滤掉很多不感兴趣的元素.
你应该只有在需要从 `KSDeclaration` 或 `KSType` 得到具体信息的时候才进行类型解析.

指向一个函数类型的 `KSTypeReference` 在它的元素中已经有了大部分信息.
尽管可以解析到 `Function0`, `Function1`, 等等的函数群, 但这些解析不会带来比 `KSCallableReference` 更多的任何信息.
有一种情况需要解析函数类型引用, 就是处理函数原型(Function Prototype)的 identity.
