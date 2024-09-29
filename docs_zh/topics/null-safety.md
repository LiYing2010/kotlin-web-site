[//]: # (title: Null 值安全性)

最终更新: %latestDocDate%

## 可为 null 的类型与不可为 null 的类型 {id="nullable-types-and-non-nullable-types"}

Kotlin 类型系统的设计目标就是希望消除 null 引用带来的危险,
也就是所谓的 [造成十亿美元损失的大错误](https://en.wikipedia.org/wiki/Tony_Hoare#Apologies_and_retractions).

在许多编程语言(包括 Java)中, 最常见的陷阱之一就是, 对一个指向 null 值的对象访问它的成员, 导致一个 null 引用异常.
在 Java 中就是 `NullPointerException`, 简称 _NPE_.

在 Kotlin 中只有以下情况可能导致 NPE:

* 明确调用 `throw NullPointerException()`.
* 使用 `!!` 操作符, 详情见后文.
* 初始化过程中存在数据不一致, 比如:
  * 在构造器中可以访问到未初始化的 `this`, 并且将它传递给了其他代码,
    然后在其他代码中使用了这个未初始化的 `this` (也就是所谓的 "leaking `this`" 警告);
  * [基类的构造器调用了 open 的成员函数](inheritance.md#derived-class-initialization-order),
    但这个成员函数在子类中的实现使用了未初始化的状态数据.
* Java 互操作:
  * 试图对一个 [平台类型](java-interop.md#null-safety-and-platform-types)的 `null` 引用访问其成员函数.
  * 用于 Java 互操作的泛型类型的可空性存在问题.
    比如, 一段 Java 代码可能向一个 Kotlin `MutableList<String>` 中添加一个 `null` 值,
    因此, 对这种情况应该使用 `MutableList<String?>`.
  * 外部 Java 代码导致的其他问题.

在 Kotlin 中, 类型系统明确区分可以指向 `null` 的引用 (可为 null 引用) 与不可以指向 null 的引用 (非 null 引用).
比如, 一个通常的 `String` 类型变量不可以指向 `null`:

```kotlin
fun main() {
//sampleStart
    var a: String = "abc" // 通常的初始化语句代表默认类型为非 null
    a = null // 编译错误
//sampleEnd
}
```
{kotlin-runnable="true" validate="false"}

要允许 null 值, 你可以将变量声明为可为 null 的字符串, 写作 `String?`:

```kotlin
fun main() {
//sampleStart
    var b: String? = "abc" // 可以设置为 null
    b = null // ok
    print(b)
//sampleEnd
}
```
{kotlin-runnable="true"}

现在, 假如你对 `a` 调用方法或访问属性, 可以确信不会产生 NPE, 因此你可以安全地编写以下代码:

```kotlin
val l = a.length
```

但如果你要对 `b` 访问同样的属性, 就不是安全的, 编译器会报告错误:

```kotlin
val l = b.length // 错误: 变量 'b' 可能为 null
```

但你仍然需要访问这个属性, 对不对? 有以下几种方法可以实现.

## 在条件语句中进行 `null` 检查 {id="check-for-null-with-the-if-conditional"}

首先, 你可以明确地检查 `b` 是否为 `null`, 然后对两种情况分别处理:

```kotlin
val l = if (b != null) b.length else -1
```

编译器将会追踪你执行过的检查, 因此允许在 `if` 内访问 `length` 属性 .
更复杂的条件也是支持的:

```kotlin
fun main() {
//sampleStart
    val b: String? = "Kotlin"
    if (b != null && b.length > 0) {
        print("String of length ${b.length}")
    } else {
        print("Empty string")
    }
//sampleEnd
}
```
{kotlin-runnable="true"}

注意, 以上方案需要的前提是, `b` 的内容不可变
(也就是说, 对于局部变量的情况, 在 null 值检查与变量使用之间, 要求这个局部变量没有被修改,
对于类属性的情况, 要求是一个使用后端域变量的 `val` 属性, 并且不允许被后代类覆盖),
因为, 假如没有这样的限制的话, `b` 就有可能会在检查之后被修改为 `null` 值.

## 安全调用 {id="safe-calls"}

要访问可能为 null 值的变量的属性, 第二个选择方案是使用安全调用操作符 `?.`:

```kotlin
fun main() {
//sampleStart
    val a = "Kotlin"
    val b: String? = null
    println(b?.length)
    println(a?.length) // 安全调用操作符在这里是不必要的
//sampleEnd
}
```
{kotlin-runnable="true"}

如果 `b` 不是 null, 这个表达式将会返回 `b.length`, 否则返回 `null`.
这个表达式本身的类型为 `Int?`.

安全调用在链式调用的情况下非常有用.
比如, 雇员 Bob 可能被派属某个部门 Department (也可能不属于任何部门),
这个部门可能存在另一个雇员担任部门主管.
为了取得 Bob 所属部门的主管的名字, (如果存在的话), 你可以编写下面的代码:

```kotlin
bob?.department?.head?.name
```

这样的链式调用, 只要属性链中任何一个属性为 `null`, 整个表达式就会返回 `null`.

如果需要只对非 null 的值执行某个操作,
你可以组合使用安全调用操作符和 [`let`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/let.html):

```kotlin
fun main() {
//sampleStart
    val listWithNulls: List<String?> = listOf("Kotlin", null)
    for (item in listWithNulls) {
      item?.let { println(it) } // 打印 Kotlin, 并忽略 null 值
 }
//sampleEnd
}
```
{kotlin-runnable="true"}

在赋值运算的左侧也可以使用安全调用. 这时, 如果链式安全调用中的任何一个接受者为 `null`,
赋值运算就会被跳过, 完全不会对赋值运算右侧的表达式进行计算:

```kotlin
// 如果 `person` 或 `person.department` 为 null, 那么这个函数不会被调用:
person?.department?.head = managersPool.getManager()
```

## 可为 null 的接受者 {id="nullable-receiver"}

可以对 [可为 null 的接受者](extensions.md#nullable-receiver) 定义扩展函数.
通过这种方式, 你可以指定 null 值的行为, 而不必在每次调用时都进行 null 检查.

例如,
[`toString()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/to-string.html)
函数, 定义在可为 null 的接受者上. 它返回字符串 "null" (而不是一个 `null` 值).
在某些情况下会很有用, 比如, 在输出日志时:

```kotlin
val person: Person? = null
logger.debug(person.toString()) // 日志会输出 "null", 不会抛出异常
```

如果你希望你的 `toString()` 调用返回可为 null 的字符串, 请使用 [安全调用操作符 `?.`](#safe-calls):

```kotlin
var timestamp: Instant? = null
val isoTimestamp = timestamp?.toString() // 返回 String? 对象, 这里的结果是 `null`
if (isoTimestamp == null) {
   // 处理 timestamp 是 `null` 的情况
}
```

## Elvis 操作符 {id="elvis-operator"}

假设你有一个可为 null 的引用 `b`, 你可以说,
"如果 `b` 不为 `null`, 那么就使用它, 否则, 就使用某个非 null 的值":

```kotlin
val l: Int = if (b != null) b.length else -1
```

除了上例这种完整的 `if` 表达式之外, 你还可以使用 Elvis 操作符 `?:` 来表达:

```kotlin
val l = b?.length ?: -1
```

如果 `?:` 左侧的表达式值不是 `null`, Elvis 操作符就会返回它的值, 否则, 返回右侧表达式的值.
注意, 只有在左侧表达式值为 `null` 时, 才会计算右侧表达式.

由于在 Kotlin 中 `throw` 和 `return` 都是表达式, 因此它们也可以用在 Elvis 操作符的右侧.
这种用法很方便, 比如, 可以用来检查函数参数值是否合法:

```kotlin
fun foo(node: Node): String? {
    val parent = node.getParent() ?: return null
    val name = node.getName() ?: throw IllegalArgumentException("name expected")
    // ...
}
```

## `!!` 操作符 {id="the-operator"}

对于 NPE 的热爱者们来说, 还有第三个选择方案:
非 null 判定操作符(`!!`) 可以将任何值转换为 非 null 类型, 如果这个值是 `null` 则会抛出一个异常.
你可以写 `b!!`, 对于 `b` 不为 null 的情况, 这个表达式将会返回这个非 null 的值
(比如, 在我们的例子中就是一个 `String` 类型值),
如果 `b` 是 `null`, 这个表达式就会抛出一个 NPE:

```kotlin
val l = b!!.length
```

所以, 如果你确实想要 NPE, 你可以抛出它,
但你必须明确地提出这个要求, 否则 NPE 不会在你没有注意的地方忽然出现.

## 安全的类型转换

如果对象不是我们期望的目标类型, 那么通常的类型转换就会导致 `ClassCastException`.
另一种选择是使用安全的类型转换, 如果转换不成功, 它将会返回 `null`:

```kotlin
val aInt: Int? = a as? Int
```

## 可为 null 的类型构成的集合

如果你的有一个集合, 其中的元素是可为 null 的类型, 并且希望将其中非 null 值的元素过滤出来,
那么可以使用 `filterNotNull` 函数:

```kotlin
val nullableList: List<Int?> = listOf(1, 2, null, 4)
val intList: List<Int> = nullableList.filterNotNull()
```

## 下一步做什么?

* 学习 [在 Java 和 Kotlin 中如何处理可空性(nullability)](java-to-kotlin-nullability-guide.md).
* 学习 [确定不含 null 值的泛型](generics.md#definitely-non-nullable-types).
