[//]: # (title: 类型检查与类型转换)

最终更新: %latestDocDate%

在 Kotlin 中, 你可以进行类型检查, 在运行时检查一个对象的类型. 类型转换可以将对象转换为另一个类型.

> 关于 **泛型** 的类型检查和转换, 例如 `List<T>`, `Map<K,V>`,
> 请参见 [泛型的类型检查和转换](generics.md#generics-type-checks-and-casts).
>
{style="tip"}

## is 与 !is 操作符 {id="is-and-is-operators"}

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

## 智能类型转换 {id="smart-casts"}

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

对于 `&&` 和 `||` 操作符, 如果在操作符左侧进行了适当的(通常的或相反的)类型检查, 那么操作符的右侧也是如此:

```kotlin
// 在 `||` 的右侧, x 被自动转换为 String 类型
if (x !is String || x.length == 0) return

// 在 `&&` 的右侧, x 被自动转换为 String 类型
if (x is String && x.length > 0) {
    print(x.length) // x 被自动转换为 String 类型
}
```

智能类型转换(Smart Cast) 对于 [`when` 表达式](control-flow.md#when-expression)
和 [`while` 循环](control-flow.md#while-loops) 同样有效:

```kotlin
when (x) {
    is Int -> print(x + 1)
    is String -> print(x.length + 1)
    is IntArray -> print(x.sum())
}
```

> 注意, 在类型检查语句与变量使用语句之间, 只有在编译器能够确保变量不会改变的情况下, 智能类型转换才是有效的.
>
{style="warning"}

在以下条件下可以使用智能类型转换:

<table header-style="none">
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

如果类型转换不成功, 类型转换操作符通常会抛出一个异常. 因此, 称为 _不安全的(unsafe)_ 类型转换.
在 Kotlin 中, 不安全的类型转换使用中缀操作符 `as`:

```kotlin
val x: String = y as String
```

注意, `null` 不能被转换为 `String`, 因为这个类型不是 [可为 null 的(nullable)](null-safety.md).
如果 `y` 为 null, 上例中的代码将抛出一个异常.
为了让这段代码能够处理 null 值, 需要在类型转换操作符的右侧使用可为 null 的类型:

```kotlin
val x: String? = y as String?
```

## "安全的" (nullable) 类型转换操作 {id="safe-nullable-cast-operator"}

为了避免抛出异常, 请使用 *安全的* 类型转换操作符 `as?`, 当类型转换失败时, 它会返回 `null`.

```kotlin
val x: String? = y as? String
```

注意, 尽管 `as` 操作符的右侧是一个非 null 的 `String` 类型, 但这个转换操作的结果仍然是可为 null 的.
