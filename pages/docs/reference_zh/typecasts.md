---
type: doc
layout: reference
category: "Syntax"
title: "类型检查与类型转换"
---

# 类型检查与类型转换

本页面最终更新: 2022/01/13

## is 与 !is 操作符

可以使用 `is` 操作符, 或者它相反的 `!is` 操作符, 在运行时检查一个对象与一个给定的类型是否一致:

```kotlin
if (obj is String) {
    print(obj.length)
}

if (obj !is String) { // 等价于 !(obj is String)
    print("Not a String")
} else {
    print(obj.length)
}
```

## 智能类型转换

大多数情况下, 在 Kotlin 中你不必使用显式的类型转换操作,
因为编译器会对不可变值的 `is` 检查和[显式的类型转换](#unsafe-cast-operator) 进行追踪,
然后在需要的时候自动插入(安全的)类型转换:

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x 被自动转换为 String 类型
    }
}
```

如果一个相反的类型检查导致了 return, 此时编译器足够智能, 可以判断出转换处理是安全的:

```kotlin
if (x !is String) return

print(x.length) // x 被自动转换为 String 类型
```

在 `&&` 和 `||` 操作符的右侧也是如此:

```kotlin
// 在 `||` 的右侧, x 被自动转换为 String 类型
if (x !is String || x.length == 0) return

// 在 `&&` 的右侧, x 被自动转换为 String 类型
if (x is String && x.length > 0) {
    print(x.length) // x 被自动转换为 String 类型
}
```

智能类型转换(Smart Cast) 对于 [`when` 表达式](control-flow.html#when-expressions)
和 [`while` 循环](control-flow.html#while-loops) 同样有效:

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

注意, 在类型检查语句与变量使用语句之间, 只有在编译器能够确保变量不会改变的情况下, 智能类型转换才是有效的.
更具体地说, 必须满足以下条件时, 智能类型转换才有效:

* 局部的 `val` 变量 - 永远有效, 但 [局部委托属性](delegated-properties.html#local-delegated-properties) 例外.
* `val` 属性 - 如果属性是 private 的, 或 internal 的,
  或者类型检查处理与属性定义出现在同一个 [模块(module)](visibility-modifiers.html#modules) 内, 那么智能类型转换是有效的.
  对于 open 属性, 或存在自定义 get 方法的属性, 智能类型转换是无效的.
* 局部的 `var` 变量 - 如果在类型检查语句与变量使用语句之间, 变量没有被改变, 而且它没有被 Lambda 表达式捕获并在 Lambda 表达式内修改它, 并且它不是一个局部的委托属性, 那么智能类型转换是有效的.
* `var` 属性 - 永远无效, 因为其他代码随时可能改变变量值.


## "不安全的" 类型转换操作符

如果类型转换不成功, 类型转换操作符通常会抛出一个异常. 因此, 称为 *不安全的(unsafe)* 类型转换.
在 Kotlin 中, 不安全的类型转换使用中缀操作符 `as`:

```kotlin
val x: String = y as String
```

注意, `null` 不能被转换为 `String`, 因为这个类型不是 [可为 null 的(nullable)](null-safety.html).
如果 `y` 为 null, 上例中的代码将抛出一个异常.
为了让这段代码能够处理 null 值, 需要在类型转换操作符的右侧使用可为 null 的类型:

```kotlin
val x: String? = y as String?
```

## "安全的" (nullable) 类型转换操作

为了避免抛出异常, 请使用 *安全的* 类型转换操作符 `as`, 当类型转换失败时, 它会返回 `null`.

```kotlin
val x: String? = y as? String
```

注意, 尽管 `as` 操作符的右侧是一个非 null 的 `String` 类型, 但这个转换操作的结果仍然是可为 null 的.

## 类型擦除(Type erasure) 与泛型类型检查

涉及 [泛型](generics.html) 的情况下, Kotlin 会在编译期间确保代码的类型安全性,
而在运行期间, 泛型类型的实例中并不保存它们的实际类型参数的信息.
比如, `List<Foo>` 的类型信息会被擦除, 变成 `List<*>`.
通常情况下, 在运行期间没有办法检查一个实例是不是属于带有某个类型参数的泛型类型.

因此, 由于类型擦除导致的, 在运行期间无法正确执行的 `is` 检查,
编译器会禁止使用, 比如 `ints is List<Int>` 或 `list is T` (T 是类型参数).
但是, 你可以检查实例是否属于 [星号投射类型](generics.html#star-projections):

```kotlin
if (something is List<*>) {
    something.forEach { println(it) } // List 中元素的类型都被识别为 `Any?`
}
```

类似的, 如果(在编译期间)已经对一个实例的类型参数进行了静态检查,
你可以对泛型之外的部分进行 `is` 检查, 或类型转换.
注意, 下面的示例中省略了尖括号:

```kotlin
fun handleStrings(list: List<String>) {
    if (list is ArrayList) {
        // `list` 会被智能转换为 `ArrayList<String>`
    }
}
```

对于不涉及类型参数的类型转换, 可以使用的相同语法, 但省略类型参数: `list as ArrayList`.

使用 [实体化的类型参数(Reified type parameter)](inline-functions.html#reified-type-parameters) 的内联函数,
会将它们的实际类型参数内联到每一个调用处, 因此可以对类型参数使用 `arg is T` 检查,
但是如果 `arg` 本身是一个泛型类型的实例, *它自己* 的类型参数仍然会被擦除.

<div class="sample" markdown="1" theme="idea">

```kotlin
//sampleStart
inline fun <reified A, reified B> Pair<*, *>.asPairOf(): Pair<A, B>? {
    if (first !is A || second !is B) return null
    return first as A to second as B
}

val somePair: Pair<Any?, Any?> = "items" to listOf(1, 2, 3)

val stringToSomething = somePair.asPairOf<String, Any>()
val stringToInt = somePair.asPairOf<String, Int>()
val stringToList = somePair.asPairOf<String, List<*>>()
val stringToStringList = somePair.asPairOf<String, List<String>>() // 这段代码能够编译, 但破坏了类型安全型!
// 请展开示例代码查看详情

//sampleEnd

fun main() {
    println("stringToSomething = " + stringToSomething)
    println("stringToInt = " + stringToInt)
    println("stringToList = " + stringToList)
    println("stringToStringList = " + stringToStringList)
    //println(stringToStringList?.second?.forEach() {it.length}) // 这里会抛出 ClassCastException 异常, 因为 list 中的元素不是字符串
}
```
</div>

## 未检查的类型转换

如上文所述, 类型擦除使得在运行期间无法检查一个泛型类型的实例的实际类型参数,
而且, 代码中的泛型类型相互之间的关系可能会不够紧密, 使得编译无法确保类型安全性.

即便如此, 有时我们还是可能通过更高级别的程序逻辑来暗示类型安全性. 比如:

```kotlin
fun readDictionary(file: File): Map<String, *> = file.inputStream().use {
    TODO("Read a mapping of strings to arbitrary elements.")
}

// 我们把值为 `Int` 的 map 保存到了这个文件
val intsFile = File("ints.dictionary")

// 此处会出现编译警告: Unchecked cast: `Map<String, *>` to `Map<String, Int>`
val intsDictionary: Map<String, Int> = readDictionary(intsFile) as Map<String, Int>
```

最后一行中的类型转换会出现编译警告.
编译器无法对这个类型转换在运行期进行完整地检查, 因此不能保证 map 中的值是 `Int`.

为了避免这种未检查的类型转换, 你可以重新设计你的程序结构.
在上例中, 你可以声明 `DictionaryReader<T>` 和 `DictionaryWriter<T>` 接口,
然后对不同的数据类型提供类型安全的实现类.
你可以引入合理的抽象层次, 将未检查的类型转换, 从对接口的调用代码中, 移动到具体的实现类中.
正确使用 [泛型类型变异(eneric variance)](generics.html#variance) 也可能有助于解决这类问题.

对于泛型函数, 使用 [实体化的类型参数(Reified type parameter)](inline-functions.html#reified-type-parameters)
可以使得 `arg as T` 之类的类型转换变成可被检查的类型转换,
除非 `arg` 的类型带有 *它自己的* 类型参数, 并且在运行期间被擦除了.

对类型转换语句, 或这个语句所属的声明, 添加 `@Suppress("UNCHECKED_CAST")` [注解](annotations.html#annotations),
可以屏蔽未检查的类型转换导致的编译警告:

```kotlin
inline fun <reified T> List<*>.asListOfType(): List<T>? =
    if (all { it is T })
        @Suppress("UNCHECKED_CAST")
        this as List<T> else
        null
```

>**在 JVM 平台**: [数组类型](basic-types.html#arrays) (`Array<Foo>`) 保持了被擦除的数组元素类型信息,
>将某个类型向数组类型进行的转换, 可以进行部分地检查: 数组元素可否为空, 以及数组元素本身的类型参数仍然会被擦除.
>比如, 只要 `foo` 是一个数组, 并且元素类型是任意一种 `List<*>`, 无论元素可否为 null,
>那么 `foo as Array<List<String>?>` 转换就会成功.
{:.note}
