[//]: # (title: 明确要求使用者同意的功能(Opt-in Requirement))

最终更新: %latestDocDate%

Kotlin 标准库提供了一种机制, 可以要求用户明确同意使用 API 中的某些部分.
对于某些需要使用者明确同意的情况, 库的开发者可以通过这种机制告知他们 API 的使用者,
比如, 如果一个 API 还出在实验性阶段, 未来可能发生变化.

为了防止潜在的问题, 编译器会向这些 API 的使用者提示这些条件的警告信息, 并要求他们同意(Opt-in), 然后才能够使用 API.

## 同意使用 API {id="opt-in-to-using-api"}

如果库的作者将库中的一个 API 标记为 _[要求使用者同意(requiring opt-in)](#require-opt-in-for-api)_,
那么你在自己的代码中使用它时, 需要明确表示同意使用.
有几种方法来同意使用这样的 API, 可以使用任何一种方法, 它们都不存在技术上的限制.
你可以自由选择最适合你情况的方法.

### 传递式同意(Propagating opt-in) {id="propagating-opt-in"}

如果你在代码中使用了某个 API, 而你的代码本身又打算给第三方使用(是一个库),
那么你也可以将这个的 API 的要求使用者同意设定传递给你的 API.
为了做到这一点, 需要将你的函数体中使用到的 API 的
_[明确要求使用者同意(Opt-in Requirement) 注解](#create-opt-in-requirement-annotations)_
添加到你的函数的声明部分.
这样你就可以使用要求使用者同意的 API 元素了.

```kotlin
// 库代码
@RequiresOptIn(message = "This API is experimental. It may be changed in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime // 明确要求使用者同意的注解

@MyDateTime
class DateProvider // 一个明确要求使用者同意的类
```

```kotlin
// 库的使用者代码
fun getYear(): Int {
    val dateProvider: DateProvider // 编译错误: DateProvider 要求使用者同意
    // ...
}

@MyDateTime
fun getDate(): Date {
    val dateProvider: DateProvider // OK: 使用这个类的函数本身也要求使用者同意
    // ...
}

fun displayDate() {
    println(getDate()) // 编译错误: getDate() 要求使用者同意
}
```

在上面的示例中我们可以看到, 被注解的函数变得象是 `@MyDateTime` API 的一部分.
因此, 这种对使用者同意的强制要求传递到了使用 API 的代码中; 使用这段代码的其他代码也会看到同样的编译警告, 并要求须明确同意使用.

隐含使用要求使用者同意的 API, 本身也需要使用者同意.
如果一个 API 元素没有要求使用者同意注解, 但它的签名包含了要求使用者同意的类型,
那么使用这个 API 仍然会产生警告.
请看下面的例子.

```kotlin
// 库的使用者代码
fun getDate(dateProvider: DateProvider): Date { // 编译错误: DateProvider 要求使用者同意
    // ...
}

fun displayDate() {
    println(getDate()) // 编译警告: getDate() 的签名包含了 DateProvider, 这个类型要求使用者同意
}
```

如果要使用多个要求使用者同意的 API, 请在你的函数声明中分别添加它们的注解.

### 非传递式同意(Non-propagating opt-in) {id="non-propagating-opt-in"}

在并不对外提供 API 的模块内部, 比如应用程序模块, 你可以同意使用 API, 而不必将这种对使用者同意的强制要求传递到你的代码中.
这种情况下, 请对你的函数声明标注
[`@OptIn`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-opt-in/)
注解, 并在这个注解的参数中指明要求使用者同意的注解:

```kotlin
// 库代码
@RequiresOptIn(message = "This API is experimental. It may be changed in the future without notice.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime // 明确要求使用者同意的注解

@MyDateTime
class DateProvider // 一个明确要求使用者同意的类
```

```kotlin
// 库的使用者代码
@OptIn(MyDateTime::class)
fun getDate(): Date { // 使用 DateProvider 类; 但不会传递对使用者同意的强制要求
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate()) // OK: 不需要使用者同意
}
```

当使用者调用 `getDate()` 函数时, 他们不会由于这个函数内部使用的 API 而被被警告说需要明确同意.

注意, 如果 `@OptIn` 用在函数声明上, 而函数的签名包含了要求使用者同意的类型,
那个对使用者同意的要求仍然会向外传递:

```kotlin
// Client code
@OptIn(MyDateTime::class)
fun getDate(dateProvider: DateProvider): Date { // 函数签名包含 DateProvider 类型; 对使用者同意的要求会向外传递
    // ...
}

fun displayDate() {
    println(getDate()) // 警告: getDate() 要求使用者同意
}
```

如果想要在一个源代码文件的所有类和所有函数内使用某个要求使用者同意的 API,
可以在文件最前部, 在包声明和包导入语句之前, 添加源代码文件级别的 `@file:OptIn` 注解.

```kotlin
// 库的使用者代码
@file:OptIn(MyDateTime::class)
```

### 模块范围内同意使用(Module-wide opt-in) {id="module-wide-opt-in"}

> 从 Kotlin 1.6.0 开始支持编译器选项 `-opt-in`. 对更早的 Kotlin 版本, 请使用 `-Xopt-in`.
>
{style="note"}

如果你不希望在你的代码中每次使用需要同意的 API 的地方都添加标注, 那么你可以在你的整个模块级别上同意使用这些 API.
要在一个模块内同意使用某个 API, 可以使用参数 `-opt-in` 来编译模块,
并指定你所使用的 API 的要求用户同意标注的完全限定名称: `-opt-in=org.mylibrary.OptInAnnotation`.
使用这个参数来编译代码, 效果等于让模块内的每一个声明都添加 `@OptIn(OptInAnnotation::class)` 注解.

如果使用 Gradle 编译模块, 你可以象下面的例子这样来添加参数:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    compilerOptions.freeCompilerArgs.add("-opt-in=org.mylibrary.OptInAnnotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        freeCompilerArgs.add("-opt-in=org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
</tabs>

如果你的 Gradle 模块是一个跨平台模块, 请使用 `optIn` 方法:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
sourceSets {
    all {
        languageSettings.optIn("org.mylibrary.OptInAnnotation")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
sourceSets {
    all {
        languageSettings {
            optIn('org.mylibrary.OptInAnnotation')
        }
    }
}
```

</tab>
</tabs>

对于 Maven, 可以这样添加编译参数:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-plugin</artifactId>
            <version>${kotlin.version}</version>
            <executions>...</executions>
            <configuration>
                <args>
                    <arg>-opt-in=org.mylibrary.OptInAnnotation</arg>
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

如果要在整个模块级别同意使用多个 API, 请对你的模块中使用到的每个要求用户同意的元素逐个添加上述参数.

## 对 API 标记要求使用者同意 {id="require-opt-in-for-api"}

### 创建表示要求使用者同意(Opt-in requirement)的注解 {id="create-opt-in-requirement-annotations"}

如果你希望要求使用者明确同意使用你的模块中的 API, 需要创建一个注解, 用来作为 _要求使用者同意(Opt-in requirement)注解_.
这个注解类本身必须标注
[@RequiresOptIn](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/)
注解:

```kotlin
@RequiresOptIn
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class MyDateTime
```

要求使用者同意(Opt-in requirement)注解, 必须满足几个要求:
* [retention](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-retention/)
  设置为 `BINARY` 或 `RUNTIME`
* [targets](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-target/)
  中不含 `EXPRESSION`, `FILE`, `TYPE`, 或 `TYPE_PARAMETER`
* 没有参数.

对用户同意要求的严重
[级别](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-requires-opt-in/-level/)
可以是以下两种之一:
* `RequiresOptIn.Level.ERROR`. 用户的明确同意是必须的. 否则, t被这个注解标注过的 API, 使用它的代码会编译失败. 默认使用这个严重级别.
* `RequiresOptIn.Level.WARNING`. 用户的明确同意不是必须的, 但建议你明确表示同意. 否则, 编译器会给出警告.

请使用 `@RequiresOptIn` 注解的`level` 参数来设置你希望的严重级别.

此外, 你还可以指定一个 `message` 来提示 API 使用者关于这个 API 的特定条件.
对于使用这个 API 但没有明确同意的用户, 编译器会显示提示这个警告信息.

```kotlin
@RequiresOptIn(level = RequiresOptIn.Level.WARNING, message = "This API is experimental. It can be incompatibly changed in the future.")
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

如果你需要对外公布多个独立的功能, 都要求用户同意, 那么请为其中的每一个分别定义不同的标注注解.
不同的注解可以使你的代码的使用者在使用这些功能时更加安全: 他们可以只使用他们明确接受的那部分功能.
同时也使你自己能够控制各个功能, 对各个功能分别取消用户同意的强制要求.

### 标记要求使用者同意的 API 元素 {id="mark-api-elements"}

想要将 API 标记为要求使用者同意, 请在它的声明部分添加你定义的那个 opt-in requirement 要求使用者同意注解:

```kotlin
@MyDateTime
class DateProvider

@MyDateTime
fun getTime(): Time {}
```

注意, 对于一些语言元素, 不能使用要求使用者同意的注解:
* 对覆盖方法(overriding method)标注的注解只能是这个函数在基类声明中已经出现过的注解.
* 不能用这种注解标注属性的后端域变量(backing field)或取值函数(getter), 只能标注属性本身.
* 不能用这种注解标注局部变量或函数的值参数.

## 未稳定发布的 API 对使用者同意的要求 {id="opt-in-requirements-for-pre-stable-apis"}

如果你对未稳定发布的功能要求使用者同意, 请仔细维护你的 API, 确保不要破坏使用者的代码.

一旦你的未稳定发布的 API 开发完成, 并以稳定模式发布之后, 请在它的声明中删除要求使用者同意的注解.
之后, 使用者的代码就能够不受限制地使用这些 API 了.
但是, 你还需要将这些注解类继续保留在模块中, 以与现有的使用者代码保持兼容.

如果想要让 API 的使用者相应地更新他们的模块(从他们的代码中删除这些注解, 并重新编译),
请将注解标记为
[`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/),
并在描述信息中解释原因.

```kotlin
@Deprecated("This opt-in requirement is not used anymore. Remove its usages from your code.")
@RequiresOptIn
annotation class ExperimentalDateTime
```
