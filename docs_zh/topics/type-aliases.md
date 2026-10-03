[//]: # (title: 类型别名)

类型别名为既有的类型提供替代的名称. 它们可以让较长或经常使用的类型表达式更简短, 更易于理解.

例如, 你可以为泛型类型, 函数类型, 以及嵌套类或内部类创建别名:

```kotlin
// 泛型类型
typealias UserIndex = Map<Long, User>
typealias FileTable<K> = MutableMap<K, MutableList<File>>

// 函数类型
typealias RequestHandler = (Request) -> Response
typealias Predicate<T> = (T) -> Boolean

// 内部类和嵌套类
class Database {
    inner class Transaction
}
typealias DatabaseTransaction = Database.Transaction
```

类型别名不会创建新类型, 它会为既有的类型引入替代名称. 别名和它的底层类型可以互换使用.
例如, 如果你添加了 `typealias Predicate<T>`, 在使用 `Predicate<Int>` 时, 编译器会将它展开为 `(Int) -> Boolean`.
在期望底层类型的地方, 可以使用通过别名声明的值, 反过来也可以:

```kotlin
typealias Predicate<T> = (T) -> Boolean

fun evaluate(predicate: Predicate<Int>) = predicate(42)

fun main() {
    val isPositive: (Int) -> Boolean = { it > 0 }
    println(evaluate(isPositive))
    // 输出结果为: true

    val isValid: Predicate<Int> = { it > 0 }
    println(listOf(1, -2).filter(isValid))
    // 输出结果为: [1]
}
```
{kotlin-runnable="true"}

## 声明类型别名 {id="declare-type-aliases"}

可以在以下位置声明类型别名:

* 在 Kotlin 文件的顶层, 即 [顶层类型别名](#top-level-type-aliases).
* 在类, 接口, 或对象的内部, 即 [嵌套类型别名](#nested-type-aliases).

不能在局部作用域中声明类型别名, 例如函数或 [Lambda 表达式](lambdas.md#lambda-expressions-and-anonymous-functions) 内部.

声明的位置决定类型别名的作用域, 而它的可见度决定哪些代码可以访问它.
类型别名默认是 `public`. [嵌套类型别名](#nested-type-aliases) 只能在包含它的类, 接口或对象可访问的位置使用.
例如, `internal` 类中的 `public` 别名无法从模块外部访问.

类型别名不能暴露比它自身 [可见度](visibility-modifiers.md) 更严格的底层类型.
例如, `public` 类型别名不能引用 `private` 类.

### 顶层类型别名 {id="top-level-type-aliases"}

顶层类型别名是包级的声明. 在同一包中, 可以通过别名的不带限定的名称引用它.
要从其他包使用别名, 请导入别名, 或使用它的限定名称:

```kotlin
// UserId.kt
package org.example.users

typealias UserId = Long

// 通过不带限定的名称, 引用同一包内的别名
fun createUser(id: UserId) {
    // ...
}

// UserService.kt
package org.example.services

import org.example.users.UserId

// 通过不带限定的名称, 使用导入的别名
fun findUser(id: UserId) {
    // ...
}

// 使用完全限定名称
fun deleteUser(id: org.example.users.UserId) {
    // ...
}
```

### 嵌套类型别名 {id="nested-type-aliases"}

嵌套类型别名可以改进封装性, 减少包级名称混乱, 简化内部实现, 使代码更加简洁, 更易于维护.
嵌套类型别名的作用域规则和名称解析规则, 与 [嵌套类](nested-classes.md) 相同.

当替代名称只与类, 接口或对象的上下文相关时, 请在这个声明的内部声明类型别名.
这样可以让别名靠近使用它的代码, 而且避免向包作用域添加另一个名称.

在包含类型别名的声明内部, 可以通过不带限定的名称来引用别名.
在声明的外部, 请使用包含它的声明的名称作为限定名称:

```kotlin
class UserRepository {
    typealias UserIndex = Map<UserId, User>

    // 在 UserRepository 内部, 通过不带限定的名称引用别名
    fun saveAll(users: UserIndex) {
        // ...
    }
}

// 在 UserRepository 外部, 通过限定名称引用别名
fun synchronizeUsers(users: UserRepository.UserIndex) {
    // ...
}
```

> Kotlin Multiplatform 的 [`expect/actual` 声明](multiplatform-expect-actual.md) 不支持嵌套类型别名.
>
{style="note"}

#### 类型参数 {id="type-parameters"}

要在嵌套类型别名中使用类型参数, 请将类型参数添加到别名的声明中:

```kotlin
class Graph<Node> {
    typealias Path<T> = List<T>
}

val cityPath: Graph.Path<String> = listOf("London", "Berlin")
```

在这个示例中, `Path` 声明了类型参数 `T`.
在 `Graph.Path<String>` 中, `String` 是 `T` 的类型参数, 它与 `Graph` 声明的 `Node` 类型参数相互独立.

如果引用包含它的类或接口声明的类型参数, 编译器会报告错误:

```kotlin
class Graph<Node> {
    typealias Path = List<Node>
    // 错误: Unresolved reference 'Node'.
}
```

这里, `Path` 引用了 `Graph` 的 `Node` 类型参数, 而不是声明自己的类型参数.
