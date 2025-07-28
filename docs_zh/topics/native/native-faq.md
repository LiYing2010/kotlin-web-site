[//]: # (title: Kotlin/Native FAQ)

## 怎样运行程序? {id="how-do-i-run-my-program"}

你需要定义一个顶层的函数 `fun main(args: Array<String>)`,
如果你不需要接受命令行参数, 也可以写成 `fun main()`, 请注意不要把这个函数放在包内.
另外, 也可以使用编译器的 `-entry` 选项, 把任何一个函数指定为程序的入口点,
但这个函数应该接受 `Array<String>` 参数, 或者没有参数, 并且函数返回值类型应该是 `Unit`.

## Kotlin/Native 的内存管理机制是怎样的? {id="what-is-kotlin-native-memory-management-model"}

Kotlin/Native 使用一种自动化的内存管理机制, 与 Java 和 Swift 类似.

详情请参见 [Kotlin/Native 内存管理器](native-memory-manager.md)

## 怎样创建一个共享库? {id="how-do-i-create-a-shared-library"}

可以使用编译器选项 `-produce dynamic`, 或在你的 Gradle 构建文件中使用 `binaries.sharedLib()`:

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.sharedLib()
    }
}
```

编译器会产生各平台专有的共享库文件
(对 Linux 环境 `.so` 文件, 对 macOS 环境是 `.dylib` 文件,  对 Windows 环境是 `.dll` 文件),
还会生成一个 C 语言头文件, 用来在 C/C++ 代码中访问你的 Kotlin/Native 程序中的所有 public API.

[请完成使用 Kotlin/Native 开发动态库教程](native-dynamic-libraries.md)

## 怎样创建静态库, 或 object 文件? {id="how-do-i-create-a-static-library-or-an-object-file"}

可以使用编译器选项 `-produce static`, 或在你的 Gradle 构建文件中使用 `binaries.staticLib()`:

```kotlin
kotlin {
    iosArm64("mylib") {
        binaries.staticLib()
    }
}
```

编译器会产生各平台专有的 object 文件(.a 库格式), 以及一个 C 语言头文件,
用来在 C/C++ 代码中访问你的 Kotlin/Native 程序中的所有 public API.

## 怎样在企业的网络代理服务器之后运行 Kotlin/Native? {id="how-do-i-run-kotlin-native-behind-a-corporate-proxy"}

由于 Kotlin/Native 需要下载各平台相关的工具链,
因此你需要对编译器或 `gradlew` 设置 `-Dhttp.proxyHost=xxx -Dhttp.proxyPort=xxx` 选项,
或者通过 `JAVA_OPTS` 环境变量来设置这个选项.

## 怎样为 Kotlin 框架指定自定义的 Objective-C 前缀或名称? {id="how-do-i-specify-a-custom-objective-c-prefix-name-for-my-kotlin-framework"}

可以使用编译器的 `-module-name` 选项, 或对应的 Gradle DSL 语句.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += listOf("-module-name", "TheName")
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    iosArm64("myapp") {
        binaries.framework {
            freeCompilerArgs += ["-module-name", "TheName"]
        }
    }
}
```

</tab>
</tabs>

## 怎样改变 iOS 框架的名称? {id="how-do-i-rename-the-ios-framework"}

iOS 框架的默认名称是 `<project name>.framework`.
要使用自定义的名称, 请使用 `baseName` 选项. 这个选项也会设置模块的名称.

```kotlin
kotlin {
    iosArm64("myapp") {
       binaries {
          framework {
              baseName = "TheName"
          }
       }
    }
}
```

## 怎样对 Kotlin 框架启用 bitcode? {id="how-do-i-enable-bitcode-for-my-kotlin-framework"}

对所有的 Apple 编译目标, Bitcode 内嵌功能(Bitcode embedding)在 Xcode 14 中已被废弃, 在 Xcode 15 中已被删除.
从 Kotlin 2.0.20 开始, Kotlin/Native 编译器不支持 Bitcode 内嵌功能.

如果你在使用旧版本的 Xcode, 但想要升级到 Kotlin 2.0.20 或更高版本,
请在你的 Xcode 项目中禁用 Bitcode 内嵌功能.

## 怎样在不同的协程中安全的引用对象? {id="how-do-i-reference-objects-safely-from-different-coroutines"}

在 Kotlin/Native 中, 要在多个协程之间安全的访问或更新对象, 请考虑使用并发安全的构造, 例如 `@Volatile` 和 `AtomicReference`.

可以使用 [`@Volatile`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent/-volatile/) 注解一个 `var` 属性.
这样可以让对属性的后端域变量(Backing Field)的所有读和写都成为原子操作.
此外, 写入的值会立即成为对其它线程可见.
当另一个线程访问这个属性时, 它不仅会得到更新后的值, 而且还会看到更新之前发生的其他变更.

或者, 也可以使用 [AtomicReference](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.concurrent.atomics/-atomic-reference/),
它支持原子化的读和更新.
在 Kotlin/Native 中, 它封装了一个 volatile 变量, 并执行原子化的操作.
Kotlin 还提供了针对特定数据类型进行原子化操作专门定制的一组类型.
你可以使用 `AtomicInt`, `AtomicLong`, `AtomicBoolean`, `AtomicArray`, 以及 `AtomicIntArray` 和 `AtomicLongArray`.

关于如何访问共享的可变状态, 详情请参见 [协程文档](shared-mutable-state-and-concurrency.md).

## 怎样使用还未发布的 Kotlin/Native 版本来编译项目? {id="how-can-i-compile-my-project-with-unreleased-versions-of-kotlin-native"}

首先, 请考虑使用 [预览版](eap.md).

如果你需要更新的开发版, 你可以通过源代码来编译 Kotlin/Native:
clone [Kotlin 代码仓库](https://github.com/JetBrains/kotlin),
然后按照 [这些步骤](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source) 进行编译.
