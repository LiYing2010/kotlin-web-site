[//]: # (title: 解构声明)

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

## 示例: 从一个函数返回两个值 {id="example-returning-two-values-from-a-function"}

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

## 示例: 解构声明与 Map {id="example-destructuring-declarations-and-maps"}

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

## 基于名称的解构 {id="name-based-destructuring"}
<primary-label ref="experimental-opt-in"/>

Kotlin 支持 *基于名称的解构声明*,
变量按照名称与属性匹配, 而不是象 *基于位置* 的解构那样, 按照 `componentN()` 函数定义的位置进行匹配.

> 关于基于名称的解构, 详情请参见这个功能的 [KEEP](https://github.com/Kotlin/KEEP/blob/main/proposals/KEEP-0438-name-based-destructuring.md).
>
{style="tip"}

在基于位置的解构中, 变量与 `componentN()` 函数的顺序相对应, 例如:

```kotlin
data class User(val username: String, val email: String)

fun main() {
    val user = User("alice", "alice@example.com")

    val (email, username) = user

    println(email)
    // 输出结果为: alice

    println(username)
    // 输出结果为: alice@example.com
}
```
{kotlin-runnable="true"}

在这个示例中, 由于解构依赖于 `componentN()` 函数的顺序, `email` 会得到 `username` 的值, `username` 会得到 `email` 的值.

使用基于名称的解构, 会根据属性名决定获取哪个值, 而不是由 `componentN()` 函数的位置决定:

```kotlin
fun main() {
    val user = User("alice", "alice@example.com")

    // 以明确指定的形式使用基于名称的解构
    (val mail = email, val name = username) = user

    println(name)
    // 输出结果为: alice

    println(mail)
    // 输出结果为: alice@example.com
}
```

基于名称的解构是 [实验性功能](components-stability.md#stability-levels-explained).
启用这个功能时, 它还会引入基于位置的解构的新的语法, 使用方括号.
对于元素顺序至关重要的类型, 例如 List 和其它有顺序的集合, 以及没有名称的元组, 例如 `Pair` 或 `Triple`, 请使用这个语法:

```kotlin
val point = Pair(10, 20)

// 使用基于位置的解构
val [x, y] = point
```

你可以使用 `-Xname-based-destructuring` 编译器选项, 控制编译器如何解释解构声明.

这个选项包含以下模式:

* `only-syntax`: 启用基于名称的解构的明确调用形式, 不改变既有的解构声明的行为.
* `name-mismatch`: 当对数据类使用基于位置的解构时, 如果使用的变量名称与属性名称不匹配, 报告警告.
* `complete`: 启用基于名称的解构的圆括号简写形式, 并且通过方括号语法, 继续支持基于位置的解构.

> 在启用 `complete` 模式之前, 请先在 `name-mismatch` 模式下查看报告的警告, 并解决这些警告.
> 这些警告表明, 在 `complete` 模式下, 编译器对哪些解构声明的解释方式会不同, 并包含了对这些声明相应的修改建议.
>
{style="tip"}

如果你使用 `complete` 模式, 解构语法的圆括号简写形式会将变量匹配到属性名称, 而不是依赖它的位置:

```kotlin
val (email, username) = user
```

要在你的项目中启用基于名称的解构, 请对你的构建配置文件添加编译器选项:

<tabs group="build-system">
<tab title="Gradle" group-key="gradle">

```kotlin
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xname-based-destructuring=only-syntax")
    }
}
```

</tab> 
<tab title="Maven" group-key="maven">

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <configuration>
                <args>
                    <arg>-Xname-based-destructuring=only-syntax</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</tab>
</tabs>
