[//]: # (title: Null 值安全性)

Null 值安全性是 Kotlin 的一个功能特性, 它的设计目的是为了极大的减少 null 引用带来的危险,
也就是所谓的 [造成十亿美元损失的大错误](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions).

在许多编程语言(包括 Java)中, 最常见的陷阱之一就是, 对一个指向 null 值的对象访问它的成员, 导致一个 null 引用异常.
在 Java 中, 就是 `NullPointerException`, 简称 _NPE_.

Kotlin 明确的支持可空性, 这是它类型系统的一部分, 也就是说, 你可以明确的声明哪些变量或属性可以为 `null`.
而且, 当你声明非 null 变量时, 编译器会强制这些变量不能保存 `null` 值, 防止出现 NPE.

Kotlin 的 Null 值安全性通过在编译期发现与 null 相关的潜在问题, 而不是在运行期, 保证代码更加安全.
这个功能通过明确表达 `null` 值, 让代码更加易于理解和维护, 能够改善代码的健壮性, 可读性, 以及可维护性.

在 Kotlin 中只有以下情况可能导致 NPE:

* 明确调用 [`throw NullPointerException()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-null-pointer-exception/).
* 使用 [非 null 断言操作符 `!!`](#not-null-assertion-operator).
* 初始化过程中存在数据不一致, 比如:
  * 在构造器中可以访问的未初始化的 `this`,
    被其它代码访问(也就是 ["`this` 泄露"](https://youtrack.jetbrains.com/issue/KTIJ-9751)).
  * [基类的构造器调用了 open 的成员函数](inheritance.md#derived-class-initialization-order),
    但这个成员函数在子类中的实现使用了未初始化的状态数据.
* Java 互操作:
  * 试图对一个 [平台类型](java-interop.md#null-safety-and-platform-types)的 `null` 引用访问其成员函数.
  * 泛型类型的可空性存在问题.
    比如, 一段 Java 代码向一个 Kotlin `MutableList<String>` 中添加一个 `null` 值,
    对这种情况应该使用 `MutableList<String?>` 才能正确处理.
  * 外部 Java 代码导致的其他问题.

> 除了 NPE 之外, 另一个与 null 安全性有关的异常是 [`UninitializedPropertyAccessException`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-uninitialized-property-access-exception/).
> 当你试图访问一个还没有初始化的属性时, Kotlin 会抛出这个异常, 以确保非 null 属性在初始化之后才能访问.
> 这种情况通常发生在 [`lateinit` 属性](properties.md#late-initialized-properties-and-variables) 中.
>
{style="tip"}

## 可为 null 的类型与不可为 null 的类型 {id="nullable-types-and-non-nullable-types"}

在 Kotlin 中, 类型系统明确区分可以为 `null` 的类型 (可为 null 类型) 与不可以为 null 的类型 (非 null 类型).
比如, 一个通常的 `String` 类型变量不可以指向 `null`:

```kotlin
fun main() {
//sampleStart
    // 将一个非 null 字符串赋值给一个变量
    var a: String = "abc"
    // 试图将非 null 变量再次赋值为 null
    a = null
    print(a)
    // 编译错误: Null can not be a value of a non-null type String
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

你可以安全的对 `a` 调用方法, 或访问属性. 可以保证不会出现 NPE, 因为 `a` 是一个非 null 变量.
编译器确保 `a` 永远保存一个有效的 `String` 值, 因此不存在当它为 `null` 值时访问属性或方法的危险:

```kotlin
fun main() {
//sampleStart
    // 将一个非 null 字符串赋值给一个变量
    val a: String = "abc"
    // 返回非 null 变量的 length
    val l = a.length
    print(l)
    // 输出结果为: 3
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

要允许 `null` 值, 声明变量时请在变量类型之后添加一个 `?` 符号.
例如, 通过 `String?` 可以声明一个可为 null 的字符串.
这个表达式表示可以接受 `null` 值的 `String` 类型:

```kotlin
fun main() {
//sampleStart
    // 将可为 null 的字符串赋值给一个变量
    var b: String? = "abc"
    // 将可为 null 的变量再次赋值为 null, 成功
    b = null
    print(b)
    // 输出结果为: null
//sampleEnd
}
```
{kotlin-runnable="true"}

如果你试图直接对 `b` 访问 `length`, 编译器会报告错误. 这是因为 `b` 被声明为可为 null 的变量, 可以保存 `null` 值.
试图对可为 null 的值直接访问属性会导致 NPE:

```kotlin
fun main() {
//sampleStart
    // 将可为 null 的字符串赋值给一个变量
    var b: String? = "abc"
    // 将可为 null 的变量再次赋值为 null
    b = null
    // 试图直接返回可为 null 的变量的 length
    val l = b.length
    print(l)
    // 编译错误: Only safe (?.) or non-null asserted (!!.) calls are allowed on a nullable receiver of type String?
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

在上面的示例中, 编译器要求你在访问属性或执行操作之前使用安全调用来检查是否为 null.
处理可为 null 的值有几种方法:

* [使用 `if` 条件进行 `null` 检查](#check-for-null-with-the-if-conditional)
* [安全调用操作符 `?.`](#safe-call-operator)
* [Elvis 操作符 `?:`](#elvis-operator)
* [非 null 断言操作符 `!!`](#not-null-assertion-operator)
* [可为 null 的接受者](#nullable-receiver)
* [`let` 函数](#let-function)
* [安全类型转换 `as?`](#safe-casts)
* [可为 null 的类型构成的集合](#collections-of-a-nullable-type)

关于 `null` 处理的各种工具和技术的详情, 以及示例, 请阅读下面的章节.

## 使用 if 条件进行 null 检查 {id="check-for-null-with-the-if-conditional"}

在使用可为 null 的类型时, 你需要安全的处理 null 值, 以避免 NPE.
一种方法是使用 `if` 条件表达式明确的检查是否为 null.

例如, 先检查 `b` 是否为 `null`, 然后再访问 `b.length`:

```kotlin
fun main() {
//sampleStart
    // 将 null 赋值给一个可为 null 的变量
    val b: String? = null
    // 先检查是否为 null, 然后再访问 length
    val l = if (b != null) b.length else -1
    print(l)
    // 输出结果为: -1
//sampleEnd
}
```
{kotlin-runnable="true"}

在上面的示例中, 编译器执行一个 [智能转换](typecasts.md#smart-casts), 将类型从可为 null 的 `String?` 变为不可为 null 的 `String`.
它还会追踪你执行过哪些检查, 因此允许在 `if` 条件内访问 `length`.

更复杂的条件也是支持的:

```kotlin
fun main() {
//sampleStart
    // 将可为 null 的字符串赋值给一个变量
    val b: String? = "Kotlin"

    // 先检查是否为 null, 然后再访问 length
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
        // 输出结果为: String of length 6
    } else {
        print("Empty string")
        // 如果条件不满足, 提供一个替代结果
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

注意, 只有在编译器能够确保 `b` 在检查与使用之间不会变化的情况下, 上面的示例才能正常工作,
[智能类型转换的前提条件](typecasts.md#smart-cast-prerequisites) 一样.

## 安全调用操作符 {id="safe-call-operator"}

使用安全调用操作符 `?.`, 你可以用更短的方式安全的处理 null 值.
如果对象为 `null`, `?.` 直接返回 `null`, 而不会抛出 NPE:

```kotlin
fun main() {
//sampleStart
    // 将可为 null 的字符串赋值给一个变量
    val a: String? = "Kotlin"
    // 将 null 赋值给一个可为 null 的变量
    val b: String? = null

    // 检查是否为 null, 返回 length, 或返回 null
    println(a?.length)
    // 输出结果为: 6
    println(b?.length)
    // 输出结果为: null
//sampleEnd
}
```
{kotlin-runnable="true"}

`b?.length` 表达式会检查是否为 null, 如果 `b` 不是 null, 返回 `b.length`, , 否则返回 `null`.
这个表达式本身的类型为 `Int?`.

在 Kotlin 中, 对 [`var` 和 `val` 变量](basic-syntax.md#variables) 都可以使用 `?.` 操作符:

* 一个可为 null 的 `var` 可以保存 `null` 值 (例如, `var nullableValue: String? = null`) 或非 null 值 (例如, `var nullableValue: String? = "Kotlin"`).
  如果它是非 null 值, 你随时都可以将它变为 `null`.
* 一个可为 null 的 `val` 可以保存 `null` 值 (例如, `val nullableValue: String? = null`) 或非 null 值 (例如, `val nullableValue: String? = "Kotlin"`).
  如果它是非 null 值, 之后你就不能将它变为 `null`.

安全调用在链式调用的情况下非常有用.
比如, 雇员 Bob 可能被派属某个部门 Department (也可能不属于任何部门),
这个部门可能存在另一个雇员, 担任部门主管.
为了取得 Bob 所属部门的主管的名字, (如果存在的话), 你可以编写下面的代码:

```kotlin
bob?.department?.head?.name
```

只要链式调用中的任何一个属性是 `null`, 这个链式调用就会返回 `null` .
你也可以在赋值运算的左侧使用安全调用:

```kotlin
person?.department?.head = managersPool.getManager()
```

在上面的示例中, 如果链式安全调用中的任何一个接受者为 `null`, 赋值运算就会被跳过, 完全不会对赋值运算右侧的表达式进行计算.
例如, 如果 `person` 或 `person.department` 为 `null`, 函数就不会调用.

下面是这个安全调用使用 `if` 条件的等价写法:

```kotlin
if (person != null && person.department != null) {
    person.department.head = managersPool.getManager()
}
```

## Elvis 操作符 {id="elvis-operator"}

在使用可为 null 的类型时, 你可以检查是否为 `null`, 并为 `null` 提供一个替代的值.
例如, 如果 `b` 不是 `null`, 访问 `b.length`. 否则, 返回一个替代的值:

```kotlin
fun main() {
//sampleStart
    // 将 null 赋值给一个可为 null 的变量
    val b: String? = null
    // 检查是否为 null. 如果不是 null, 返回 length. 如果是 null, 返回 0
    val l: Int = if (b != null) b.length else 0
    println(l)
    // 输出结果为: 0
//sampleEnd
}
```
{kotlin-runnable="true"}

除了上例这种完整的 `if` 表达式之外, 你还可以使用 Elvis 操作符 `?:`, 以更加简洁的方式来处理:

```kotlin
fun main() {
//sampleStart
    // 将 null 赋值给一个可为 null 的变量
    val b: String? = null
    // 检查是否为 null. 如果不是 null, 返回 length. 如果是 null, 返回一个非 null 值
    val l = b?.length ?: 0
    println(l)
    // 输出结果为: 0
//sampleEnd
}
```
{kotlin-runnable="true"}

如果 `?:` 左侧的表达式值不是 `null`, Elvis 操作符就会返回它的值. 否则, Elvis 操作符返回右侧表达式的值.
只有在左侧表达式值为 `null` 时, 才会计算右侧表达式.

由于在 Kotlin 中 `throw` 和 `return` 都是表达式, 因此, 你也可以在 Elvis 操作符的右侧使用它们.
这种用法很方便, 比如, 可以用来检查函数参数值是否合法:

```kotlin
fun foo(node: Node): String? {
    // 检查 getParent(). 如果不是 null, 它会被赋值给 parent. 如果是 null, 返回 null
    val parent = node.getParent() ?: return null
    // 检查 getName(). 如果不是 null, 它会被赋值给 name. 如果是 null, 抛出异常
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## 非 null 断言操作符 {id="not-null-assertion-operator"}

非 null 判定操作符 `!!` 可以将任何值转换为非 null 类型.

如果你对一个值不是 `null` 的变量使用 `!!` 操作符, 它会被安全的做为非 null 类型来处理, 代码会正常执行.
但是, 如果值是 `null`, `!!` 操作符强制将它当作非 null 类型处理, 结果会导致 NPE.

当 `b` 不是 `null`, `!!` 操作符要求它返回非 null 值 (这个示例中是 `String`), 就能正确的访问 `length`:

```kotlin
fun main() {
//sampleStart
    // 将可为 null 的字符串赋值给一个变量
    val b: String? = "Kotlin"
    // 将 b 当作非 null 值, 并访问它的 length
    val l = b!!.length
    println(l)
    // 输出结果为: 6
//sampleEnd
}
```
{kotlin-runnable="true"}

当 `b` 是 `null`, `!!` 操作符要求它返回非 null 值, 会发生 NPE:

```kotlin
fun main() {
//sampleStart
    // 将 null 赋值给一个可为 null 的变量
    val b: String? = null
    // 将 b 当作非 null 值, 并尝试访问它的 length
    val l = b!!.length
    println(l) 
    // 错误: Exception in thread "main" java.lang.NullPointerException
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" validate="false"}

当你确信一个值不是 `null`, 并且不可能发生 NPE, 但编译器由于某些规则无法确定这一点时, `!!` 操作符会非常有用.
在这种情况下, 你可以使用 `!!` 操作符来明确的告诉编译器, 值不是 `null`.

## 可为 null 的接受者 {id="nullable-receiver"}

你可以使用带有 [可为 null 的接受者类型](extensions.md#nullable-receiver) 的扩展函数,
这样就允许对可能为 `null` 的变量调用这些函数.

通过对可为 null 的接受者类型定义扩展函数, 你可以在函数内部处理 `null` 值, 而不必在每次调用函数的时候检查 `null` 值.

例如, [`.toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html) 扩展函数, 可以对可为 null 的接受者调用.
在对 `null` 值调用时, 它会安全的返回字符串 `"null"`, 不会抛出异常:

```kotlin
//sampleStart
fun main() {
    // 将 null 赋值给保存在 person 变量中的可为 null 的 Person 对象
    val person: Person? = null

    // 对可为 null 的 person 变量调用 .toString, 并打印输出结果字符串
    println(person.toString())
    // 输出结果为: null
}

// 定义一个简单的 Person 类
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

在上面的示例中, 即使 `person` 是 `null`, `.toString()` 函数仍然安全的返回字符串 `"null"`.
对于调试和日志输出, 这会很有用.

如果你希望 `.toString()` 函数返回可为 null 的字符串 (要么是对象的字符串表达, 要么是 `null` 值),
请使用 [安全调用操作符 `?.`](#safe-call-operator).
`?.` 操作符只有在对象不为 `null` 时才会调用 `.toString()`, 否则它返回 `null`:

```kotlin
//sampleStart
fun main() {
    // 将可为 null 的 Person 对象赋值给一个变量
    val person1: Person? = null
    val person2: Person? = Person("Alice")

    // 如果 person 为 null, 打印输出 "null"; 否则打印输出 person.toString() 的结果
    println(person1?.toString())
    // 输出结果为: null
    println(person2?.toString())
    // 输出结果为: Person(name=Alice)
}

// 定义一个 Person 类
data class Person(val name: String)
//sampleEnd
```
{kotlin-runnable="true"}

通过 `?.` 操作符, 你可以安全的处理潜在的 `null` 值, 同时仍然能够访问可能为 `null` 的对象的属性或函数.

## let 函数 {id="let-function"}

要处理 `null` 值, 并且只对非 null 的情况执行操作,
你可以将安全调用操作符 `?.` 和 [`let` 函数](scope-functions.md#let) 一起使用.

如果要计算一个表达式, 检查结果是否为 `null`, 然后只对非  `null` 的情况执行代码, 这样的组合会很有用, 能够避免手动的检查 null 值:

```kotlin
fun main() {
//sampleStart
    // 声明一个可为 null 的字符串的 List
    val listWithNulls: List<String?> = listOf("Kotlin", null)

    // 遍历 List 中的每个元素
    for (item in listWithNulls) {
        // 检查元素是否为 null, 只打印非 null 的值
        item?.let { println(it) }
        // 输出结果为: Kotlin
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

## 安全类型转换 {id="safe-casts"}

用于 [类型转换](typecasts.md#unsafe-cast-operator) 的通常的 Kotlin 操作符是 `as` 操作符.
但是, 如果对象不是我们期望的目标类型, 那么通常的类型转换就会导致异常.

你可以使用 `as?` 操作符进行安全类型转换.
它会尝试将一个值转换为指定的类型, 如果值不是这个类型, 则返回 `null`:

```kotlin
fun main() {
//sampleStart
    // 声明一个 Any 类型的变量, 可以保存任何类型的值
    val a: Any = "Hello, Kotlin!"

    // 使用 'as?' 操作符, 安全转换为 Int
    val aInt: Int? = a as? Int
    // 使用 'as?' 操作符, 安全转换为 String
    val aString: String? = a as? String

    println(aInt)
    // 输出结果为: null
    println(aString)
    // 输出结果为: "Hello, Kotlin!"
//sampleEnd
}
```
{kotlin-runnable="true"}

上面的代码打印输出 `null`, 因为 `a` 不是 `Int`, 因此转换会安全的失败.
代码还打印输出 `"Hello, Kotlin!"`, 因为它是 `String?` 类型, 因此安全转换成功.

## 可为 null 的类型构成的集合 {id="collections-of-a-nullable-type"}

如果你的有一个可为 null 的元素构成的集合, 并且只想保留其中非 null 值的元素,
可以使用 `filterNotNull()` 函数:

```kotlin
fun main() {
//sampleStart
    // 声明一个 List, 包含一些 null 和非 null 的整数值
    val nullableList: List<Int?> = listOf(1, 2, null, 4)

    // 过滤非 null 的值, 结果是一个非 null 整数构成的 list
    val intList: List<Int> = nullableList.filterNotNull()
  
    println(intList)
    // 输出结果为: [1, 2, 4]
//sampleEnd
}
```
{kotlin-runnable="true"}

## 下一步做什么?

* 学习 [在 Java 和 Kotlin 中如何处理可空性(nullability)](java-to-kotlin-nullability-guide.md).
* 学习 [确定不含 null 值的泛型](generics.md#definitely-non-nullable-types).
