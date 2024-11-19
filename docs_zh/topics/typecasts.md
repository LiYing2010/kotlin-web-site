[//]: # (title: 类型检查与类型转换)

在 Kotlin 中, 你可以进行类型检查, 在运行时检查一个对象的类型.
通过类型转换, 你可以将对象转换为另一个类型.

> 关于 **泛型** 的类型检查和转换, 例如 `List<T>`, `Map<K,V>`,
> 请参见 [泛型的类型检查和转换](generics.md#generics-type-checks-and-casts).
>
{style="tip"}

## is 与 !is 操作符 {id="is-and-is-operators"}

要在运行时检查一个对象与一个给定的类型是否一致, 可以使用 `is` 操作符, 或相反的 `!is` 操作符:

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

## 智能类型转换 {id="smart-casts"}

大多数情况下, 你不必使用显式的类型转换操作, 因为编译器会自动为你进行类型转换. 这个功能叫做智能类型转换.
编译器会追踪对不可变值的类型检查和[显式的类型转换](#unsafe-cast-operator),
然后在需要的时候自动插入隐式的(安全的)类型转换:

```kotlin
fun demo(x: Any) {
    if (x is String) {
        print(x.length) // x 被自动转换为 String 类型
    }
}
```

如果一个相反的类型检查导致了 return, 此时编译器足够智能, 能够判断出转换处理是安全的:

```kotlin
if (x !is String) return

print(x.length) // x 被自动转换为 String 类型
```

### 控制流

智能类型转换不仅能够用于 `if` 条件表达式, 还能用于 [`when` 表达式](control-flow.md#when-expression)
和 [`while` 循环](control-flow.md#while-loops):

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

如果你声明一个 `Boolean` 类型的变量, 然后在你的 `if`, `when`, 或 `while` 条件中使用它,
那么编译器收集的关于这个变量的所有信息, 在对应的代码块中都可以用于智能类型转换.

当你想要将布尔条件抽取到变量中时, 这个功能会很有用.
之后, 你可以给变量一个有意义的名字, 这样可以提高你的代码的可读性, 并可以在之后的代码中重用这个变量.
例如:

```kotlin
class Cat {
    fun purr() {
        println("Purr purr")
    }
}

fun petAnimal(animal: Any) {
    val isCat = animal is Cat
    if (isCat) {
        // 编译器能够得到关于 isCat 的信息,
        // 因此它知道 animal 已经被智能转换为 Cat 类型.
        // 所以, 可以调用 purr() 函数.
        animal.purr()
    }
}

fun main(){
    val kitty = Cat()
    petAnimal(kitty)
    // 输出结果为: Purr purr
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-local-variables" validate="false"}

### 逻辑操作符

对于 `&&` 和 `||` 操作符, 如果在操作符左侧进行了(通常的或相反的)类型检查, 那么编译器能够右侧进行智能类型转换:

```kotlin
// 在 `||` 的右侧, x 被自动转换为 String 类型
if (x !is String || x.length == 0) return

// 在 `&&` 的右侧, x 被自动转换为 String 类型
if (x is String && x.length > 0) {
    print(x.length) // x 被自动转换为 String 类型
}
```

如果你将对象的多个类型检查用 `or` 操作符 (`||`) 组合起来, 智能类型转换的结果会是这些类型最接近的共通超类型:

```kotlin
interface Status {
    fun signal() {}
}

interface Ok : Status
interface Postponed : Status
interface Declined : Status

fun signalCheck(signalStatus: Any) {
    if (signalStatus is Postponed || signalStatus is Declined) {
        // signalStatus 被智能类型转换为共通超类型 Status
        signalStatus.signal()
    }
}
```

> 共通超类型是 [联合类型(Union Type)](https://en.wikipedia.org/wiki/Union_type) 的一种 **近似**.
> 联合类型 [在 Kotlin 中目前不支持](https://youtrack.jetbrains.com/issue/KT-13108/Denotable-union-and-intersection-types).
>
{style="note"}

### 内联函数

对传递给 [内联函数](inline-functions.md) 的 Lambda 函数中捕获的变量, 编译器能够进行智能类型转换.

内联函数会被当作具有隐含的 [`callsInPlace`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.contracts/-contract-builder/calls-in-place.html)
契约(Contract).
这就意味着, 传递给内联函数的任何 Lambda 函数都会被原地调用(call in place).
由于 Lambda 函数被原地调用, 因此编译器知道 Lambda 函数不会泄露它的函数体中所包含的任何变量的引用.

编译器使用这些信息, 以及其它分析, 决定对捕获的变量能否安全的进行智能类型转换.
例如:

```kotlin
interface Processor {
    fun process()
}

inline fun inlineAction(f: () -> Unit) = f()

fun nextProcessor(): Processor? = null

fun runProcessor(): Processor? {
    var processor: Processor? = null
    inlineAction {
        // 编译器知道 processor 是一个局部变量, inlineAction() 是一个内联函数,
        // 因此对 processor 的引用不会泄露.
        // 所以, 对 processor 可以安全的进行智能类型转换.
      
        // 如果 processor 不为 null, processor 会被智能类型转换
        if (processor != null) {
            // 编译器知道 processor 不为 null, 因此不需要安全调用
            processor.process()
        }

        processor = nextProcessor()
    }

    return processor
}
```

### 异常处理

智能类型转换信息会被传递给 `catch` 和 `finally` 代码块.
这能够让你的代码更加安全, 因为编译器会追踪你的对象是不是可为 null 的类型.
例如:

```kotlin
//sampleStart
fun testString() {
    var stringInput: String? = null
    // stringInput 被智能类型转换为 String 类型
    stringInput = ""
    try {
        // 编译器知道 stringInput 不为 null
        println(stringInput.length)
        // 输出结果为: 0

        // 编译器丢弃 stringInput 之前的智能类型转换信息.
        // 现在 stringInput 类型为 String?.
        stringInput = null

        // 触发异常
        if (2 > 1) throw Exception()
        stringInput = ""
    } catch (exception: Exception) {
        // 编译器知道 stringInput 可以为 null
        // 因此 stringInput 继续保持可为 null 的类型.
        println(stringInput?.length)
        // 输出结果为: null
    }
}
//sampleEnd
fun main() {
    testString()
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="2.0" id="kotlin-smart-casts-exception-handling"}

### 智能类型转换的前提条件

> 注意, 在类型检查语句与变量使用语句之间, 只有在编译器能够确保变量不会改变的情况下, 智能类型转换才是有效的.
>
{style="warning"}

在以下条件下可以使用智能类型转换:

<table style="none">
    <tr>
        <td>
            <code>val</code> 局部变量
        </td>
        <td>
            永远有效, 但 <a href="delegated-properties.md">局部的委托属性</a> 例外.
        </td>
    </tr>
    <tr>
        <td>
            <code>val</code> 属性
        </td>
        <td>
            如果属性是 <code>private</code> 的, 或 <code>internal</code> 的, 或者类型检查处理与属性定义出现在同一个
            <a href="visibility-modifiers.md#modules">模块(module)</a> 内, 那么智能类型转换是有效的.
            对于 <code>open</code> 属性, 或存在自定义 get 方法的属性, 智能类型转换是无效的.
        </td>
    </tr>
    <tr>
        <td>
           <code>var</code> 局部变量
        </td>
        <td>
            如果在类型检查语句与变量使用语句之间, 变量没有被改变, 而且它没有被 Lambda 表达式捕获并在 Lambda 表达式内修改它,
            并且它不是一个局部的委托属性, 那么智能类型转换是有效的.
        </td>
    </tr>
    <tr>
        <td>
            <code>var</code> 属性
        </td>
        <td>
            永远无效, 因为其他代码随时可能改变变量值.
        </td>
    </tr>
</table>

## "不安全的" 类型转换操作符 {id="unsafe-cast-operator"}

要将一个对象明确的转换为一个非 null 的类型, 请使用 the *不安全的(unsafe)* 类型转换操作符 `as`:

```kotlin
val x: String = y as String
```

如果不能进行转换, 编译器会抛出一个异常. 因此这种操作被称为 _不安全的(unsafe)_.

在上面的示例中, 如果 `y` 是 `null`, 上面的代码也会抛出异常.
这是因为 `null` 不能转换为 `String`, `String` 不是 [可为 null](null-safety.md) 的类型.
要让这个示例能够处理 null 值, 请在转换操作的右侧使用可为 null 的类型:

```kotlin
val x: String? = y as String?
```

## "安全的" (nullable) 类型转换操作 {id="safe-nullable-cast-operator"}

为了避免抛出异常, 请使用 *安全的* 类型转换操作符 `as?`, 当类型转换失败时, 它会返回 `null`.

```kotlin
val x: String? = y as? String
```

注意, 尽管 `as` 操作符的右侧是一个非 null 的 `String` 类型, 但这个转换操作的结果仍然是可为 null 的.
