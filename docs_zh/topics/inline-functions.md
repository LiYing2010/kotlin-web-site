[//]: # (title: 内联函数(Inline Function))

最终更新: %latestDocDate%

使用 [高阶函数](lambdas.md) 在运行时会带来一些不利: 每个函数都是一个对象, 而且它还要捕获一个闭包,
闭包是指一个环境范围, 在这个范围内, 函数体内部可以访问外层变量.
内存占用(函数对象和类都会占用内存) 以及虚方法调用都会带来运行时的消耗.

但在很多情况下, 通过将 Lambda 表达式内联在使用处, 可以消除这些运行时消耗.
下文中的函数就是很好的例子. `lock()` 函数可以很容易地内联在调用处.
看看下面的例子:

```kotlin
lock(l) { foo() }
```

编译器可以直接产生下面的代码, 而不必为参数创建函数对象, 然后再调用这个参数指向的函数:

```kotlin
l.lock()
try {
    foo()
} finally {
    l.unlock()
}
```

为了让编译器做到这点, 需要对 `lock()` 函数标记 `inline` 修饰符:

```kotlin
inline fun <T> lock(lock: Lock, body: () -> T): T { ... }
```

`inline` 修饰符既会影响到函数本身, 也影响到传递给它的 Lambda 表达式: 这两者都会被内联到调用处.

函数内联也许会导致编译产生的代码尺寸变大.
但只要你合理的使用(不要内联太大的函数), 就可以换来性能的提高, 尤其是在循环内发生的 "megamorphic" 函数调用.
(译注: 关于 megamorphic 请参见 [Inline caching](https://en.wikipedia.org/wiki/Inline_caching#Megamorphic_inline_caching))

## `noinline`

如果一个内联函数的参数中有多个 Lambda 表达式, 而你只希望内联其中的一部分,
可以对函数的一部分参数添加 `noinline` 修饰符:

```kotlin
inline fun foo(inlined: () -> Unit, noinline notInlined: () -> Unit) { ... }
```

可内联的 Lambda 表达式只能在内联函数内部调用, 或者再作为可内联的参数传递给其他函数,
而 `noinline` 的 Lambda 表达式可以按照你喜欢的方式任意使用:
可以保存在域内, 也可以当作参数传递, 等等.

> 如果一个内联函数不存在可以内联的函数类型参数, 而且没有 [实体化的类型参数](#reified-type-parameters),
> 编译器将会产生一个警告, 因为将这样的函数内联不太可能带来任何益处.
> (如果你确信需要内联, 可以使用 `@Suppress("NOTHING_TO_INLINE")` 注解关闭这个警告)
>
{style="note"}

## 非局部返回(Non-local return) {id="non-local-returns"}

在 Kotlin 中, 使用无限定符的通常的 `return` 语句, 只能用来退出一个有名称的函数, 或匿名函数.
要退出一个 Lambda 表达式, 可以使用一个 [标签](returns.md#return-to-labels).
在 Lambda 表达式内禁止使用无标签的 `return`, 因为 Lambda 表达式不允许强制包含它的函数 `return`:

```kotlin
fun ordinaryFunction(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    ordinaryFunction {
        return // 错误: 这里不允许让 `foo` 函数返回
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true" validate="false"}

但是, 如果 Lambda 表达式被传递去的函数是内联函数, 那么 `return` 语句也可以内联, 因此 `return` 是允许的:

```kotlin
inline fun inlined(block: () -> Unit) {
    println("hi!")
}
//sampleStart
fun foo() {
    inlined {
        return // OK: 这里的 Lambda 表达式是内联的
    }
}
//sampleEnd
fun main() {
    foo()
}
```
{kotlin-runnable="true"}

这样的 `return` 语句(位于 Lambda 表达式内部, 但是退出包含 Lambda 表达式的函数) 称为 *非局部(non-local)* 返回.
这样的结构经常出现在循环中, 而循环也常常就是包含内联函数的地方:

```kotlin
fun hasZeros(ints: List<Int>): Boolean {
    ints.forEach {
        if (it == 0) return true // 从 hasZeros 函数返回
    }
    return false
}
```

注意, 有些内联函数可能并不在自己的函数体内直接调用传递给它的 Lambda 表达式参数, 而是通过另一个执行环境来调用,
比如通过一个局部对象, 或者一个嵌套函数. 这种情况下, 在 Lambda 表达式内, 非局部的控制流同样是禁止的.
为了标识内联函数的 Lambda 表达式参数不能使用非局部(non-local)返回,
需要对 Lambda 表达式参数添加 `crossinline` 修饰符:

```kotlin
inline fun f(crossinline body: () -> Unit) {
    val f = object: Runnable {
        override fun run() = body()
    }
    // ...
}
```

> 在内联的 Lambda 表达式中目前还不能使用 `break` 和 `continue`, 但我们计划将来支持它们.
>
{style="note"}

## 实体化的类型参数(Reified type parameter) {id="reified-type-parameters"}

有些时候你需要访问作为参数传递来的类型:

```kotlin
fun <T> TreeNode.findParentOfType(clazz: Class<T>): T? {
    var p = parent
    while (p != null && !clazz.isInstance(p)) {
        p = p.parent
    }
    @Suppress("UNCHECKED_CAST")
    return p as T?
}
```

这里, 你向上遍历一颗树, 然后使用反射来检查节点是不是某个特定的类型.
这些都没问题, 但这个函数的调用代码不太漂亮:

```kotlin
treeNode.findParentOfType(MyTreeNode::class.java)
```

更好的解决方案是简单地将一个类型传递给这个函数, 可以象这样调用它:

```kotlin
treeNode.findParentOfType<MyTreeNode>()
```

为了达到这个目的, 内联函数支持 *实体化的类型参数(reified type parameter)*, 使用这个功能你可以将代码写成:

```kotlin
inline fun <reified T> TreeNode.findParentOfType(): T? {
    var p = parent
    while (p != null && p !is T) {
        p = p.parent
    }
    return p as T?
}
```

上面的代码给类型参数添加了 `reified` 修饰符, 使得它可以在函数内部访问, 就好象它是一个普通的类一样.
由于函数是内联的, 因此不必使用反射, 而且通常的操作符都可以使用, 比如 `!is` 和 `as`.
此外, 你可以通过上面提到那种方式来调用这个函数: `myTree.findParentOfType<MyTreeNodeType>()`.

虽然很多情况下并不需要, 但你仍然可以对一个实体化的类型参数使用反射:

```kotlin
inline fun <reified T> membersOf() = T::class.members

fun main(s: Array<String>) {
    println(membersOf<StringBuilder>().joinToString("\n"))
}
```

通常的函数(没有使用 inline 标记的) 不能够使用实体化的类型参数.
一个没有运行时表现的类型(比如, 一个没有实体化的类型参数, 或者一个虚拟类型, 比如 `Nothing`) 不可以用作实体化的类型参数.

## 内联属性(Inline property) {id="inline-properties"}

对于不存在 [后端域变量(Backing Field)](properties.md#backing-fields) 的属性, 可以对它的取值和设值方法使用 `inline` 修饰符.
你可以标识单个的属性取值/设值方法:

```kotlin
val foo: Foo
    inline get() = Foo()

var bar: Bar
    get() = ...
    inline set(v) { ... }
```

也可以标注整个属性, 等于将它的取值和设值方法都标注为 `inline`:

```kotlin
inline var bar: Bar
    get() = ...
    set(v) { ... }
```

属性取值/设值方法被标注为 `inline` 后, 会被内联到调用处, 就像通常的内联函数一样.

## 对 Public API 内联函数的限制

当一个内联函数是 `public` 或 `protected` 的, 但不属于 `private` 或 `internal` 类型的一部分,
这个函数将被认为是一个 [模块(module)](visibility-modifiers.md#modules) 的 Public API.
它可以在其它模块中调用, 并且被内联到调用处.

假如内联函数的定义模块发生了变化, 而调用它的模块没有重新编译, 这时就可能会造成二进制代码不兼容的风险.

为了解决由模块中的 *非*-public API 变更带来的不兼容性,
Public API 内联函数的函数体部分, 不允许使用 非-Public-API, 也就是, 定义为 `private` 和 `internal` 的部分.

定义为 `internal` 的元素也可以使用 `@PublishedApi` 注解, 这就允许它被 Public API 内联函数使用.
当 `internal` 内联函数标注为 `@PublishedApi` 时, 也会象 Public API 内联函数一样检查它的函数体.
