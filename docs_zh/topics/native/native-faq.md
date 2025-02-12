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

可以使用编译器的 `-produce dynamic` 选项, 或在 Gradle 中使用 `binaries.sharedLib()`.

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

## 怎样创建静态库, 或 object 文件? {id="how-do-i-create-a-static-library-or-an-object-file"}

可以使用编译器的 `-produce static` 选项, 或在 Gradle 中使用 `binaries.staticLib()`.

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

## 为什么会遇到 InvalidMutabilityException 异常? {id="why-do-i-see-invalidmutabilityexception"}

> 这个问题只会在旧的内存管理器中发生.
> 从 Kotlin 1.7.20 开始会默认启用新的内存管理器, 详情请参见 [Kotlin/Native 内存管理](native-memory-manager.md).
>
{style="note"}

这个异常发生很可能是因为, 你试图修改一个已冻结的对象值.
对象可以明确地转变为冻结状态, 对某个对象调用 `kotlin.native.concurrent.freeze` 函数,
那么只被这个对象访问的其他所有对象子图都会被冻结, 对象也可以隐含的冻结
(也就是, 它只被 `enum` 或全局单子对象访问 - 详情请参见下一个问题).

## 怎样让一个单子对象(Singleton Object)可以被修改? {id="how-do-i-make-a-singleton-object-mutable"}

> 这个问题只会在旧的内存管理器中发生.
> 从 Kotlin 1.7.20 开始会默认启用新的内存管理器, 详情请参见 [Kotlin/Native 内存管理](native-memory-manager.md).
>
{style="note"}

目前, 单子对象都是不可修改的(也就是, 创建后就被冻结), 而且我们认为让全局状态值不可变更, 通常是比较好的编程方式.
如果处于某些理由, 你需要在这样的对象内包含可变更的状态值, 请在对象上使用 `@konan.ThreadLocal` 注解.
另外, `kotlin.native.concurrent.AtomicReference` 类可以用来在被冻结的对象内,
保存指向不同的冻结对象的指针, 而且可以自动更新这些指针.

## 怎样使用还未发布的 Kotlin/Native 版本来编译项目? {id="how-can-i-compile-my-project-with-unreleased-versions-of-kotlin-native"}

首先, 请考虑使用 [预览版](eap.md).

如果你需要更新的开发版, 你可以通过源代码来编译 Kotlin/Native:
clone [Kotlin 代码仓库](https://github.com/JetBrains/kotlin),
然后按照 [这些步骤](https://github.com/JetBrains/kotlin/blob/master/kotlin-native/README.md#building-from-source) 进行编译.
