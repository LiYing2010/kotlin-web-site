---
type: doc
layout: reference
category: "Syntax"
title: "包与导入"
---

# 包

源代码文件的开始部分可以是包声明:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
package foo.bar

fun baz() { ... }
class Goo { ... }

// ...
```
</div>

源代码内的所有内容(比如类, 函数)全部都包含在所声明的包之内.
因此, 上面的示例代码中, `baz()` 函数的完整名称将是 `foo.bar.baz`, `Goo` 类的完整名称将是 `foo.bar.Goo`.

如果没有指定包, 那么源代码文件中的内容将属于 "default" 包, 这个包没有名称.

## 默认导入

以下各个包会被默认导入到每一个 Kotlin 源代码文件:

- [kotlin.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/index.html)
- [kotlin.annotation.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/index.html)
- [kotlin.collections.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/index.html)
- [kotlin.comparisons.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.comparisons/index.html)  (since 1.1)
- [kotlin.io.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.io/index.html)
- [kotlin.ranges.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.ranges/index.html)
- [kotlin.sequences.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.sequences/index.html)
- [kotlin.text.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/index.html)

根据编译的目标平台不同, 还会导入以下包:

- JVM 平台:
  - java.lang.*
  - [kotlin.jvm.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.jvm/index.html)

- JavaScript 平台:
  - [kotlin.js.*](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/index.html)

## 导入(Import)

除默认导入(Import)的内容之外, 各源代码可以包含自己独自的 import 指令.
import 指令的语法请参见 [语法](https://kotlinlang.org/docs/reference/grammar.html#importHeader).

我们可以导入一个单独的名称, 比如

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import foo.Bar // 导入后 Bar 就可以直接访问, 不必指定完整的限定符
```
</div>

也可以导入某个范围(包, 类, 对象, 等等)之内所有可访问的内容:

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import foo.* // 导入后 'foo' 内的一切都可以访问了
```
</div>

如果发生了名称冲突, 我们可以使用 *as*{: .keyword } 关键字, 给重名实体指定新的名称(新名称仅在当前范围内有效):

<div class="sample" markdown="1" theme="idea" data-highlight-only>
```kotlin
import foo.Bar // 导入后 Bar 可以访问了
import bar.Bar as bBar // 可以使用新名称 bBar 来访问 'bar.Bar'
```
</div>

`import` 关键字不仅可以用来导入类; 还可以用来导入其他声明:

  * 顶级(top-level) 函数和属性;
  * [对象声明](object-declarations.html#object-declarations) 中定义的函数和属性;
  * [枚举常数](enum-classes.html).

与 Java 不同, Kotlin 没有单独的 ["import static"](https://docs.oracle.com/javase/8/docs/technotes/guides/language/static-import.html) 语法; 所有这些声明都使用通常的 `import` 关键字来表达.

## 顶级(top-level) 声明的可见度

如果一个顶级(top-level) 声明被标注为 *private*{: .keyword }, 它将成为私有的, 只有在它所属的文件内可以访问(参见 [可见度修饰符](visibility-modifiers.html)).
