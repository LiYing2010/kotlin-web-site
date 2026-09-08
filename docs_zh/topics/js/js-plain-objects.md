[//]: # (title: JS Plain Objects 编译器插件)

<primary-label ref="experimental-general"/>

JavaScript (JS) Plain Objects 编译器插件 (`js-plain-objects`) 让你能够以类型安全的方式创建和复制普通(Plain) JS 对象.

本章介绍关于普通 JS 对象的信息, 以及如何在 Kotlin/JS 项目中使用 `js-plain-objects` 编译器插件.

> `js-plain-objects` 插件只能与新的 K2 Kotlin 编译器配合使用.
>
{style="warning"}

## 普通(Plain) JS 对象 {id="plain-js-objects"}

普通(Plain)对象是通过对象字面值 (`{}`) 创建的简单 JS 对象, 其中包含数据属性.
许多 JS API 接受/返回普通 JS 对象用于配置或数据交换.

使用 `js-plain-objects` 插件, 你可以声明一个 Kotlin `external` 接口来描述对象的结构, 并使用 `@JsPlainObject` 对其进行注解.
然后编译器会生成便利函数, 用于创建和复制这样的对象, 同时保持 Kotlin 的类型安全性.

## 启用插件 {id="enable-the-plugin"}

将 `js-plain-objects` 插件添加到项目的 Gradle 配置文件中, 方法如以下 Kotlin DSL 所示:

<tabs group="js-plain-objects">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
plugins {
    kotlin("multiplatform") version "%kotlinVersion%"
    kotlin("plugin.js-plain-objects") version "%kotlinVersion%"
}

kotlin {
    js {
        browser() // 或 nodejs()
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '%kotlinVersion%'
    id 'org.jetbrains.kotlin.plugin.js-plain-objects' version '%kotlinVersion%'
}

kotlin {
    js {
        browser() // 或 nodejs()
    }
}
```

</tab>
</tabs>

## 声明普通对象类型 {id="declare-a-plain-object-type"}

启用 `js-plain-objects` 插件后, 你就可以声明普通对象类型.
使用 `@JsPlainObject` 对 `external` 接口进行注解. 例如:

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    // 你可以使用可为 null 的类型, 将属性声明为可选
    val email: String?
}
```

当插件处理这样的接口时, 它会生成一个同伴对象, 其中包含2 个辅助函数, 用于创建和复制对象的:

```kotlin
@JsPlainObject
external interface User {
    val name: String
    val age: Int
    val email: String?

    // 由插件生成
    @JsExport.Ignore
    companion object {
        inline operator fun invoke(name: String, age: Int, email: String? = NOTHING): User =
            js("({ name: name, age: age, email: email })")

        inline fun copy(source: User, name: String = NOTHING, age: Int = NOTHING, email: String? = NOTHING): User =
            js("Object.assign({}, source, { name: name, age: age, email: email })")
    }
}
```

从上面的示例可以看到:

* `name` 和 `age` 声明时没有可为 null 标记, 因此它们是必须的.
* `email` 声明为可为 null, 所以它是可选的, 在创建时可以省略.
* 操作符 `invoke` 使用提供的属性创建一个新的普通 JS 对象.
* `copy` 函数浅复制(shallow-copy) `source`, 并覆盖任何指定的属性, 创建一个新对象.
* 同伴对象被标记了 `@JsExport.Ignore`, 以避免这些辅助函数被泄露到 JS 导出中.

## 使用普通对象 {id="use-plain-objects"}

使用生成的辅助函数来创建和复制对象:

```kotlin
fun main() {
    val user = User(name = "Name", age = 10)
    val copy = User.copy(user, age = 11, email = "some@user.com")

    println(JSON.stringify(user))
    // 输出结果为: { "name": "Name", "age": 10 }
    println(JSON.stringify(copy))
    // 输出结果为: { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

Kotlin 代码编译为 JavaScript:

```javascript
function main () {
    var user = { name: "Name", age: 10 };
    var copy = Object.assign({}, user, { age: 11, email: "some@user.com" });

    println(JSON.stringify(user));
    // 输出结果为: { "name": "Name", "age": 10 }
    println(JSON.stringify(copy));
    // 输出结果为: { "name": "Name", "age": 11, "email": "some@user.com" }
}
```

使用这种方案创建的所有 JavaScript 对象都是安全的.
当你使用错误的属性名或值类型时, 会遇到编译期错误.
这种方案也是零开销的, 因为生成的代码被内联为简单的对象字面值和 `Object.assign` 调用.

## 下一步 {id="whats-next"}

阅读 [在 Kotlin 中使用 JavaScript 代码](js-interop.md) 和 [dynamic 类型](dynamic-type.md) 章节,
了解与 JavaScript 互操作性的更多信息.
