[//]: # (title: 解构声明)

最终更新: %latestDocDate%

有些时候, 能够将一个对象 *解构(destructure)* 为多个变量, 将会很方便, 比如:

```kotlin
val (name, age) = person
```

这种语法称为 *解构声明(destructuring declaration)*. 一个解构声明会一次性创建多个变量.
上例中你声明了两个变量: `name` 和 `age`, 并且可以独立地使用这两个变量:

```kotlin
println(name)
println(age)
```

解构声明在编译时将被分解为以下代码:

```kotlin
val name = person.component1()
val age = person.component2()
```

这里的 `component1()` 和 `component2()` 函数是 Kotlin 中广泛使用的 *约定原则(principle of convention)* 的又一个例子
(其它例子请参见 `+` 和 `*` 操作符, `for` 循环).
任何东西都可以作为解构声明右侧的被解构值, 只要可以对它调用足够数量的组件函数(component function).
当然, 还可以存在 `component3()` 和 `component4()` 等等.

> `componentN()` 函数需要标记为 `operator`, 才可以在解构声明中使用.
>
{style="note"}

解构声明还可以使用在 `for` 循环中:

```kotlin
for ((a, b) in collection) { ... }
```

上面的代码将遍历集合中的所有元素, 然后对各个元素调用 `component1()` 和 `component2()` 函数, 变量 `a` 和 `b` 将得到 `component1()` 和 `component2()` 函数的返回值.

## 示例: 从一个函数返回两个值

假如你需要从一个函数返回两个值, 比如, 一个是结果对象, 另一个是某种状态值.
在 Kotlin 中有一种紧凑的方法实现这个功能, 我们可以声明一个 [数据类](data-classes.md),
然后返回这个数据类的一个实例:

```kotlin
data class Result(val result: Int, val status: Status)
fun function(...): Result {
    // 计算

    return Result(result, status)
}

// 然后, 可以这样使用这个函数:
val (result, status) = function(...)
```

由于数据类会自动声明 `componentN()` 函数, 因此可以在这里使用解构声明.

> 你也可以使用标准库中的 `Pair` 类, 让上例中的 `function()` 函数返回一个 `Pair<Int, Status>` 实例,
> 但是, 给你的数据恰当地命名, 通常是一种更好的设计.
>
{style="note"}

## 示例: 解构声明与 Map

遍历一个 map 的最好的方式可能就是:

```kotlin
for ((key, value) in map) {
   // 使用 key 和 value 执行某种操作
}
```

为了让上面的代码正确运行, 你应该:

* 实现 `iterator()` 函数, 使得 map 成为多个值构成的序列.
* 实现 `component1()` 和 `component2()` 函数, 使得 map 内的每个元素成为一对值.

Kotlin 的标准库也的确实现了这些扩展函数:

```kotlin
operator fun <K, V> Map<K, V>.iterator(): Iterator<Map.Entry<K, V>> = entrySet().iterator()
operator fun <K, V> Map.Entry<K, V>.component1() = getKey()
operator fun <K, V> Map.Entry<K, V>.component2() = getValue()
```

因此, 你可以在对 map 的 `for` 循环中自由地使用解构声明
(也可以在对数据类集合的 `for` 循环中使用解构声明).

## 用下划线代替未使用的变量 {id="underscore-for-unused-variables"}

如果在解构声明中, 你不需要其中的某个变量, 你可以用下划线来代替变量名:

```kotlin
val (_, status) = getResult()
```

以这种方式跳过的变量, 不会调用对应的 `componentN()` 操作符函数.

## 在 Lambda 表达式中使用解构声明 {id="destructuring-in-lambdas"}

你可以在 lambda 表达式的参数中使用解构声明语法. 如果 lambda 表达式的一个参数是 `Pair` 类型
(或 `Map.Entry` 类型, 或者任何其他类型, 只要它拥有适当的 `componentN` 函数),
就可以使用几个新的参数来代替原来的参数, 只需要将新参数包含在括号内:

```kotlin
map.mapValues { entry -> "${entry.value}!" }
map.mapValues { (key, value) -> "$value!" }
```

请注意声明两个参数, 与将一个参数解构为多个参数的区别:

```kotlin
{ a -> ... } // 这里是一个参数
{ a, b -> ... } // 这里是两个参数
{ (a, b) -> ... } // 这里是将一个参数解构为两个参数
{ (a, b), c -> ... } // 这里是将一个参数解构为两个参数, 然后是另一个参数
```

如果解构后得到的某个参数未被使用到, 你可以用下划线代替它, 这样就不必为它编造一个变量名了:

```kotlin
map.mapValues { (_, value) -> "$value!" }
```

你可以为解构前的整个参数指定类型, 也可以为解构后的部分参数单独指定类型:

```kotlin
map.mapValues { (_, value): Map.Entry<Int, String> -> "$value!" }

map.mapValues { (_, value: String) -> "$value!" }
```
