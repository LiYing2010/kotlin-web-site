---
type: doc
layout: reference
category:
title: "Kotlin 1.5.20 版中的新功能"
---

# Kotlin 1.5.20 版中的新功能

本页面最终更新: 2021/06/24

_[发布日期: 2021/06/24](releases.html#release-details)_

Kotlin 1.5.20 修复了在 1.5.0 新功能中发现的问题, 还包含很多工具改进.

关于这个版本的变更概要, 可以查看 [release blog](https://blog.jetbrains.com/kotlin/2021/06/kotlin-1-5-20-released/)
和以下视频:

<iframe width="560" height="360" src="https://www.youtube.com/embed/SV8CgSXQe44" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


## Kotlin/JVM

Kotlin 1.5.20 包含 JVM 平台上的以下更新: 
* [通过动态调用拼接字符串](#string-concatenation-via-invokedynamic)
* [支持 JSpecify 的可否为 null 注解](#support-for-jspecify-nullness-annotations)
* [支持在包含 Kotlin 和 Java 代码的模块内调用 Lombok 生成的 Java 方法](#support-for-calling-java-s-lombok-generated-methods-within-modules-that-have-kotlin-and-java-code)

### 通过动态调用拼接字符串

Kotlin 1.5.20 在 JVM 9+ 以上的目标平台, 将字符串拼接编译为 [动态调用(dynamic invocation)](https://docs.oracle.com/javase/7/docs/technotes/guides/vm/multiple-language-support.html#invokedynamic)
(`invokedynamic`), 与最新的 Java 版本保持一致.
确切的说, 它使用 [`StringConcatFactory.makeConcatWithConstants()`](https://docs.oracle.com/javase/9/docs/api/java/lang/invoke/StringConcatFactory.html#makeConcatWithConstants-java.lang.invoke.MethodHandles.Lookup-java.lang.String-java.lang.invoke.MethodType-java.lang.String-java.lang.Object...-)
实现字符串拼接.

要切换回以前版本中使用的 [`StringBuilder.append()`](https://docs.oracle.com/javase/9/docs/api/java/lang/StringBuilder.html#append-java.lang.String-)
拼接模式, 请添加编译器选项 `-Xstring-concat=inline`.

关于如何添加编译器选项, 请参见 [Gradle](gradle.html#compiler-options), [Maven](maven.html#specifying-compiler-options), 和 [命令行编译器](compiler-reference.html#compiler-options) 文档.

### 支持 JSpecify 的可否为 null 注解

Kotlin 编译器可以读取多种类型的 [可否为 null 注解](jvm/java-interop.html#nullability-annotations),
以便将可否为 null 信息从 Java 传递到 Kotlin. 
1.5.20 版增加了对 [JSpecify 项目](https://jspecify.dev/) 的支持, 这个项目包括统一的 Java 可否为 null 注解.

通过 JSpecify, 你可以提供更加详细的可否为 null 信息, 帮助 Kotlin 与 Java 代码交互时保证 null 值安全性.
你可以对声明, 包, 或模块范围设置默认的可否为 null 设定, 也可以通过参数指定可否为 null, 以及其他功能. 
详细的功能请参见 [JSpecify 用户指南](https://jspecify.dev/user-guide.html).

下面是一个示例, 演示 Kotlin 如何处理 JSpecify 注解:

```java
// JavaClass.java
import org.jspecify.nullness.*;

@NullMarked
public class JavaClass {
  public String notNullableString() { return ""; }
  public @Nullable String nullableString() { return ""; }
}
```

```kotlin
// Test.kt
fun kotlinFun() = with(JavaClass()) {
  notNullableString().length // OK
  nullableString().length    // 警告: 接受者的可否为 null 设定不匹配
}
```

在 1.5.20 中, 根据 JSpecify 提供的可否为 null 信息, 所有的可否为 null 设定不匹配, 会被报告为编译警告.
可以添加 `-Xjspecify-annotations=strict` 和 `-Xtype-enhancement-improvements-strict-mode` 编译器选项,
在使用 JSpecify 时启动严格模式 (报告为编译错误).
请注意, JSpecify 项目还在活跃开发中. 它的 API 和实现随时有可能发生大的变化.

[关于 null 值安全性和平台类型](jvm/java-interop.html#null-safety-and-platform-types).

### 支持在包含 Kotlin 和 Java 代码的模块内调用 Lombok 生成的 Java 方法

> Lombok 编译器插件是 [试验性功能](components-stability.html).
> 它随时有可能变更或被删除. 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-7112) 提供你的反馈意见.
{:.warning}

Kotlin 1.5.20 引入了 [Lombok 编译器插件](lombok.html)(试验性功能).
这个插件能够在包含 Kotlin 和 Java 代码的模块内, 生成并使用 Java 的 [Lombok](https://projectlombok.org/) 声明.
Lombok 注解 只能用于 Java 源代码, 如果你在 Kotlin 代码中使用, 会被忽略.

插件支持以下注解:
* `@Getter`, `@Setter`
* `@NoArgsConstructor`, `@RequiredArgsConstructor`, 和 `@AllArgsConstructor`
* `@Data`
* `@With`
* `@Value`

我们还在继续完善这个插件. 关于目前的开发状态, 详情请参见 [Lombok 编译器插件的 README](https://github.com/JetBrains/kotlin/blob/master/plugins/lombok/lombok-compiler-plugin/README.md).

目前, 我们不计划支持 `@Builder` 注解.
但如果你 [在 YouTrack 投票支持 `@Builder`](https://youtrack.jetbrains.com/issue/KT-46959), 我们可以考虑增加这个功能.

[关于如何配置 Lombok 编译器插件](lombok.html#gradle).

## Kotlin/Native

Kotlin/Native 1.5.20 提供了新功能的预览, 以及工具的改进:

* [Opt-in: 导出 KDoc 注释到生成的 Objective-C 头文件](#opt-in-export-of-kdoc-comments-to-generated-objective-c-headers)
* [编译器 bug 修正](#compiler-bug-fixes)
* [在同一个数组内的 Array.copyInto() 的性能改进](#improved-performance-of-array-copyinto-inside-one-array)

### Opt-in: 导出 KDoc 注释到生成的 Objective-C 头文件

> 导出 KDoc 注释到生成的 Objective-C 头文件是 [试验性功能](components-stability.html).
> 它随时有可能变更或被删除. 
> 需要使用者明确同意(Opt-in) (详情请参见下文), 而且你应该只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-38600) 提供你的反馈意见.
{:.warning}

现在你可以设置 Kotlin/Native 编译器, 让它将 Kotlin 代码中的 [文档注释 (KDoc)](kotlin-doc.html),
导出到生成的 Objective-C 框架, 使得框架的使用者可以访问这些文档注释.

比如, 下面是带有 KDoc 的 Kotlin 代码:

```kotlin
/**
 * 打印输出参数的和.
 * 妥善处理和超越 32 位整数的情况.
 */
fun printSum(a: Int, b: Int) = println(a.toLong() + b)
```

会生成下面的 Objective-C 头文件:

```objc
/**
 * 打印输出参数的和.
 * 妥善处理和超越 32 位整数的情况.
 */
+ (void)printSumA:(int32_t)a b:(int32_t)b __attribute__((swift_name("printSum(a:b:)")));
```

这个功能同样适用于 Swift.

要试用这个功能, 导出 KDoc 注释到 Objective-C 头文件, 请使用 `-Xexport-kdoc` 编译器选项.
向你希望导出注释的 Gradle 项目的 `build.gradle(.kts)` 文件添加以下内容:


<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        compilations.get("main").kotlinOptions.freeCompilerArgs += "-Xexport-kdoc"
    }
}
```

</div>
</div>

如果你能通过这个 [YouTrack 票](https://youtrack.jetbrains.com/issue/KT-38600)反馈你的意见, 我们将会非常感谢.

### 编译器 bug 修正

在 1.5.20 中, Kotlin/Native 编译器修正了多个 bug.
完整列表请参见 [变更列表](https://github.com/JetBrains/kotlin/releases/tag/v1.5.20).

有一个重要的 bug 修正会影响到兼容性: 在以前的版本中, 包含不正确
UTF [surrogate pair](https://en.wikipedia.org/wiki/Universal_Character_Set_characters#Surrogates)
的字符串常数, 在编译期间会丢失其内容. 现在这样的字符串值会保留.
应用程序开发者可以安全的更新到 1.5.20 – 不会出现任何问题.
但是, 使用 1.5.20 编译的库将不能兼容以前版本的编译器.
详情请参见 [这个 YouTrack issue](https://youtrack.jetbrains.com/issue/KT-33175).

### 在同一个数组内的 Array.copyInto() 的性能改进

当 copy 的来源与目标是同一个数组时, 我们改进了 `Array.copyInto()` 的工作方式.
由于对这种场景的内存管理进行了优化, 现在这样的操作速度提高了 20 倍 (具体数字取决与复制的对象数量).

## Kotlin/JS

1.5.20 版中, 我们发布了一个指南, 帮助你将项目迁移到 Kotlin/JS 的新的 [基于 IR 的编译器后端](js/js-ir-compiler.html).

### 针对 JS IR 编译器后端的迁移指南

新的 [针对 JS IR 编译器后端的迁移指南](js/js-ir-migration.html) 列举了你在迁移过程中可能遇到的问题, 并提供了解决方案.
如果你发现了迁移指南中未提到的其他问题, 请到我们的 [问题追踪系统](http://kotl.in/issue) 提交报告.

## Gradle

Kotlin 1.5.20 增加了以下功能, 改进 Gradle 的使用体验:

* [在 kapt 中, 注解处理器的 classloader 缓存](#caching-for-annotation-processors-classloaders-in-kapt)
* [废弃 `kotlin.parallel.tasks.in.project` 属性](#deprecation-of-the-kotlin-parallel-tasks-in-project-build-property)

### 在 kapt 中, 注解处理器的 classloader 缓存

> 在 kapt 中, 注解处理器的 classloader 缓存是 [试验性功能](components-stability.html).
> 它随时有可能变更或被删除. 请注意, 只为评估和试验目的来使用这个功能.
> 希望你能通过我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-28901) 提供你的反馈意见.
{:.warning}

现在有一个新的试验性功能, 可以在 [kapt](kapt.html) 中缓存注解处理器的 classloader.
对于连续执行很多 Gradle 任务, 这个功能可以提高 kapt 的速度.

要启用这个功能, 请在你的 `gradle.properties` 文件中添加以下属性:

```properties
# 正数值会启用缓存功能
# 请在这里指定与使用 kapt 的模块数相同的数字
kapt.classloaders.cache.size=5

# 为让缓存正确工作, 需要关闭这个设定
kapt.include.compile.classpath=false
```

详情请参见 [kapt](kapt.html).

### 废弃 kotlin.parallel.tasks.in.project 属性

这个发布版中, Kotlin 的并行编译会通过 [Gradle 并行执行标记 `--parallel`](https://docs.gradle.org/current/userguide/performance.html#parallel_execution) 来控制.
使用这个标记, Gradle 可以并行执行多个任务, 提高编译任务的速度, 更加有效的使用资源.

你不再需要使用 `kotlin.parallel.tasks.in.project` 属性.
这个属性已被废弃, 并将在下一个主发布版中删除.

## 标准库

Kotlin 1.5.20 修改了与字符相关的几个函数的平台相关实现, 因此统一了各个平台上的结果:
* [在 Kotlin/Native 和 Kotlin/JS 平台, Char.digitToInt() 函数支持所有的 Unicode 数字](#support-for-all-unicode-digits-in-char-digittoint-in-kotlin-native-and-kotlin-js).
* [Unification of Char.isLowerCase()/isUpperCase() implementations across platforms](#unification-of-char-islowercase-isuppercase-implementations-across-platforms).

### 在 Kotlin/Native 和 Kotlin/JS 平台, Char.digitToInt() 函数支持所有的 Unicode 数字  

函数 [`Char.digitToInt()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/digit-to-int.html)
返回字符所表达的十进制数字值.
在 1.5.20 之前, 这个函数只在 Kotlin/JVM 平台上支持所有的 Unicode 数字字符:
Native 和 JS 平台的实现只支持 ASCII 数字.

从现在开始, 在 Kotlin/Native 和 Kotlin/JS 平台, 你可以对任何 Unicode 数字字符调用 `Char.digitToInt()`,
得到字符所表达的数值.

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
    val ten = '\u0661'.digitToInt() + '\u0039'.digitToInt() // 阿拉伯文数字1 + 数字9
    println(ten)
//sampleEnd
}
```

</div>


### 在所有平台统一了 Char.isLowerCase()/isUpperCase() 的实现

函数 [`Char.isUpperCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-upper-case.html) 和
[`Char.isLowerCase()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/is-lower-case.html)
根据字符的大小写返回布尔值.
对 Kotlin/JVM 平台, 函数的实现会检查 [Unicode 属性](https://en.wikipedia.org/wiki/Unicode_character_property) `General_Category` 和 `Other_Uppercase`/`Other_Lowercase` .

在 1.5.20 以前, 其他平台的函数实现工作方式不同, 只考虑了 general category.
在 1.5.20 中, 所有平台的实现全部统一, 全部使用这两个属性来确定字符的大小写:

<div class="sample" markdown="1" theme="idea" data-min-compiler-version="1.5">

```kotlin
fun main() {
//sampleStart
    val latinCapitalA = 'A' // general category 为 "Lu"
    val circledLatinCapitalA = 'Ⓐ' // 有 "Other_Uppercase" 属性
    println(latinCapitalA.isUpperCase() && circledLatinCapitalA.isUpperCase())
//sampleEnd
}
```

</div>
