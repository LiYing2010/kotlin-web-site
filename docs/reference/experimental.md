---
type: doc
layout: reference
category: "Syntax"
title: "实验性 API 标记(Experimental API Marker)"
---

# 实验性 API 标记(Experimental API Marker)
> 用于标记和使用实验性 API 的注解(`@Experimental` 和 `@UseExperimental`) 在 Kotlin 1.3 中是 *实验性功能*.
详情请参见 [下文](#experimental-status-of-experimental-api-markers).
{:.note}

Kotlin 标准库为开发者提供了一种机制, 用来创建和使用 _实验性_ API.
这种机制允许库的开发者告知使用者, 库 API 中的某些部分, 比如某些类或者某些函数, 目前还未稳定, 将来可能发生变更.
这样的变更可能会要求库的使用者重新编写并重新编译他们的代码.
为了防止潜在的兼容性问题, 编译器对使用实验性 API 的代码会提示警告, 并会要求开发者明确同意使用实验性 API.

## 使用实验性 API

如果库中的一个类或一个函数被作者标记为实验性 API, 那么在你的代码中使用它会导致编译警告甚至编译错误, 除非你明确同意接受使用这个实验性 API.
有几种方法来同意接受使用实验性 API; 可以使用任何一种方法, 它们都不存在技术上的限制.
你可以自由选择最适合你情况的方法.

### 传递式使用(Propagating Use)

如果你在代码中使用了实验性 API, 而你的代码本身又打算给第三方使用(是一个库), 那么你也可以将你的 API 标记为实验性 API.
为了做到这一点, 需要将你的函数体中使用到的 API 的 _实验性 API 标记注解_ 添加到你的函数的声明部分.
这样你就可以使用这个标记标注过的 API 元素了.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 库代码
@Experimental
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime            // 实验性 API 标注

@ExperimentalDateTime                            
class DateProvider                              // 实验性类
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 库的使用者代码
fun getYear(): Int {  
    val dateProvider: DateProvider // 错误: DateProvider 是实验性 API
    // ...
}

@ExperimentalDateTime
fun getDate(): Date {  
    val dateProvider: DateProvider // OK: 这个函数已被标注为实验性 API
    // ...
}

fun displayDate() {
    println(getDate()) // 错误: getDate() 是实验性 API, 需要明确表示同意使用实验性 API
}
```

</div>

在上面的示例中我们可以看到, 被注解的函数变得象是 `@ExperimentalDateTime` 实验性 API 的一部分.
因此, 实验性 API 的状态传递到了使用实验性 API 的代码中; 这段代码又会要求使用它的代码必须明确同意使用实验性 API.
如果要使用多个实验性 API, 请在你的函数声明中分别添加它们的注解.

### 非传递式使用(Non-propagating Use)

在并不对外提供 API 的模块内部, 比如应用程序模块, 你可以使用实验性 API, 而不必将这种状态传递到你的代码中.
这种情况下, 请使用 [@UseExperimental(Marker::class)](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-use-experimental/index.html) 注解来标注你的代码,
并在这个注解中指明实验性 API 的标记注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 库代码
@Experimental
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime            // 实验性 API 标注

@ExperimentalDateTime                            
class DateProvider                              // 实验性类
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 库的使用者代码
@UseExperimental(ExperimentalDateTime::class)
fun getDate(): Date {              // 使用 DateProvider; 但不对外导出实验性 API 状态
    val dateProvider: DateProvider
    // ...
}

fun displayDate() {
    println(getDate())                     // OK: getDate() 不是实验性 API
}
```

</div>

当使用者调用 `getDate()` 函数时, 他们不会被警告说这个函数内部使用了实验性 API.

如果想要一个源代码文件的所有类和所有函数内使用某个实验性 API, 可以在文件最前部, 在包声明和包导入语句之前, 添加源代码文件级别的注解 `@file:UseExperimental`.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

 ```kotlin
 // 库的使用者代码
 @file:UseExperimental(ExperimentalDateTime::class)
 ```

 </div>

### 模块范围内使用(Module-wide Use)

如果你不希望在你的代码中每次使用实验性 API 的地方都添加标注, 那么你可以在你的整个模块级别上同意使用实验性 API.
模块范围内使用实验性 API, 本身也可以是传递式的, 或者非传递式的:
* 如果希望使用实验性 API, 但不对外传递, 可以使用参数 `-Xuse-experimental` 来编译模块, 并指定你所使用的实验性 API 的标注的完全限定名称: `-Xuse-experimental=org.mylibrary.ExperimentalMarker`. 使用这个参数来编译代码, 效果等于让模块内的每一个声明都添加 `@UseExperimental(ExperimentalMarker::class)` 注解.
* 如果希望使用实验性 API, 并且让你的整个模块都成为实验性的状态, 可以使用参数 `-Xexperimental=org.mylibrary.ExperimentalMarker` 来编译模块.
这种情况下, 模块内的 _每一个声明_ 都会变成实验性 API. 使用这个模块会也要求使用者明确同意使用实验性 API.

如果使用 Gradle 来编译模块, 你可以这样添加编译参数:

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
compileKotlin {
    kotlinOptions {
        freeCompilerArgs += "-Xuse-experimental=org.mylibrary.ExperimentalMarker"
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
tasks.withType<KotlinCompile>().all {
    kotlinOptions.freeCompilerArgs += "-Xuse-experimental=org.mylibrary.ExperimentalMarker"
}
```

</div>
</div>

对于 Maven, 可以这样添加编译参数:

<div class="sample" markdown="1" mode="xml" theme="idea" data-highlight-only>

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
                    <arg>-Xuse-experimental=org.mylibrary.ExperimentalMarker</arg>                    
                </args>
            </configuration>
        </plugin>
    </plugins>
</build>
```

</div>

如果希望在模块级别上使用多个实验性 API, 请对你的模块中使用到的每一个实验性 API 的标注, 逐个使用上述编译参数.

## 标记实验性 API

### 创建标记用的注解

如果你希望将你的模块 API 声明为实验性 API, 需要创建一个注解, 用来作为这个 API 的 _实验性 API 标注_.
这个注解类本身必须标注 [@Experimental](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/index.html) 注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Experimental
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

</div>

用作实验性 API 标注的注解类, 必须满足几个要求:
* [retention](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-annotation-retention/index.html) 为 `BINARY`
* [targets](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.annotation/-annotation-target/index.html) 不含 `EXPRESSION` 和 `FILE`
* 没有参数.

实验性 API 标注的注解类, 需要标注它的 [严重级别](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-experimental/-level/index.html), 用来告知使用者, 严重级别包括以下两个值:
* `Experimental.Level.ERROR`. 对实验性 API 的明确同意是必须的. 否则, 被这个注解标注过的 API, 使用它的代码会编译失败. 默认使用这个严重级别.
* `Experimental.Level.WARNING`. 对实验性 API 的明确同意不是必须的, 但建议你明确表示同意. 否则, 编译器会给出警告.
请使用 `@Experimental` 注解的 `level` 参数来设置你希望的严重级别.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Experimental(level = Experimental.Level.WARNING)
@Retention(AnnotationRetention.BINARY)
@Target(AnnotationTarget.CLASS, AnnotationTarget.FUNCTION)
annotation class ExperimentalDateTime
```

</div>

如果你需要对外公布多个实验性的功能, 请为其中的每一个分别定义不同的标注注解.
不同的注解可以使你的代码的使用者在使用实验性功能时更加安全: 他们可以只使用他们需要的那部分功能.
同时也使你自己能够控制各个功能, 将它们分别升级到稳定状态.

### 标记实验性 API

想要将 API 标记为实验性 API, 请在它的声明部分添加你定义的那个实验性 API 标注注解:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@ExperimentalDateTime
class DateProvider

@ExperimentalDateTime
fun getTime(): Time {}
```

</div>

### 模块范围内的标记(Module-wide Marker)
如果你认为你的整个模块内的所有的 API 都是实验性 API, 那么可以对整个模块进行标注, 使用编译参数 `-Xexperimental`, 详情请参见 [模块范围内使用(Module-wide Use)](#module-wide-use).

## 实验性 API 升级为正式 API
一旦你的实验性 API 升级为正式 API, 可以按照它最终的状态发布了, 这时请从它的声明中删除实验性 API 标记注解, 以便允许使用者不受限制地使用它.
但是, 你还需要将实验性 API 标记注解本身继续留在模块内, 以免破坏使用者代码的兼容性.
为了让 API 的使用者相应地升级他们的模块(也就是从他们的代码中删除实验性 API 标记注解, 并重新编译代码), 请将注解标注为 [`@Deprecated`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-deprecated/index.html), 并在这个注解的 `message` 参数中给出解释.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Deprecated("This experimental API marker is not used anymore. Remove its usages from your code.")
@Experimental
annotation class ExperimentalDateTime
```

</div>

## 实验性 API 标注本身的实验性状态
本章中我们介绍了实验性 API 使用时的标注机制, 但在 Kotlin 1.3 中, 这种机制本身也是实验性的功能.
也就是说, 在未来的发布版中, 可能会发生变化, 并导致不兼容.
为了让 `@Experimental` 和 `UseExperimental` 注解的使用者意识到这两个注解的实验性状态,
对于使用这些注解的代码, 编译器会提示警告信息:

```This class can only be used with the compiler argument '-Xuse-experimental=kotlin.Experimental'```

 To remove the warnings, add the compiler argument `-Xuse-experimental=kotlin.Experimental`.
