[//]: # (title: 在 Kotlin Multiplatform 中使用 KSP)

作为一个快速入门的示例, 可以参见 [Kotlin Multiplatform 示例项目](https://github.com/google/ksp/tree/main/examples/multiplatform),
其中定义了 KSP 处理器.

从 KSP 1.0.1 开始, 在跨平台项目中使用 KSP, 与在单一平台的 JVM 项目中类似.
主要区别是, 在依赖项中不是编写 `ksp(...)` 配置,
而是使用 `add(ksp<Target>)` 或 `add(ksp<SourceSet>)`, 指定哪个编译目标在编译之前需要符号处理.

```kotlin
plugins {
    kotlin("multiplatform")
    id("com.google.devtools.ksp")
}

kotlin {
    jvm {
        withJava()
    }
    linuxX64() {
        binaries {
            executable()
        }
    }
    sourceSets {
        val commonMain by getting
        val linuxX64Main by getting
        val linuxX64Test by getting
    }
}

dependencies {
    add("kspCommonMainMetadata", project(":test-processor"))
    add("kspJvm", project(":test-processor"))
    add("kspJvmTest", project(":test-processor")) // 不会进行任何处理, 因为对 JVM 平台没有测试代码
    // 对于 Linux x64 的 main 源代码集没有任何处理, 因为没有指定 kspLinuxX64
    add("kspLinuxX64Test", project(":test-processor"))
}
```

## 编译与处理 {id="compilation-and-processing"}

在跨平台项目中, 对每个平台 Kotlin 编译可能发生多次 (`main`, `test`, 或其他构建配置).
符号处理也是如此.
每存在一个 Kotlin 编译 task, 并且指定了对应的 `ksp<Target>` 或 `ksp<SourceSet>` 配置, 就会创建一个符号处理 task.

比如, 在上面的 `build.gradle.kts` 中, 有 4 个编译 task: common/metadata, JVM main, Linux x64 main, Linux x64 test,
以及 3 个符号处理 task: common/metadata, JVM main, Linux x64 test.

## 在 KSP 1.0.1+ 中不再使用 ksp(...) 配置 {id="avoid-the-ksp-configuration-on-ksp-1-0-1"}

在 KSP 1.0.1 之前, 只有唯一一个, 统一的 `ksp(...)` 配置可以使用.
因此, 处理器要么对所有的编译目标适用, 要么不对任何编译目标适用.
注意, 即使是在传统的非跨平台项目中, `ksp(...)` 配置不仅适用于 main 源代码集, 如果存在 test 源代码集的话, 也会适用.
这就对构建时间带来了不必要的负担.

从 KSP 1.0.1 开始, 提供了对各个编译目标分别进行配置的功能, 如上面的示例所示. 将来:
1. 对于跨平台项目, `ksp(...)` 配置将被废弃, 并删除.
2. 对于单一平台项目, `ksp(...)` 配置将只适用于 main, 默认编译 task.
   其他编译目标, 比如 `test`, 将需要指定 `kspTest(...)` 来适用处理器.

从 KSP 1.0.1 开始, 有一个早期预览版的 flag `-DallowAllTargetConfiguration=false`, 可以切换到更加高效率的模式.
如果目前的模式造成了性能问题, 请试用这个 flag.
在 KSP 2.0 中, 这个 flag 的默认值将会从 `true` 切换到 `false`.
