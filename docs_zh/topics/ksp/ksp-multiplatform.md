[//]: # (title: 在 Kotlin Multiplatform 中使用 KSP)
[//]: # (description: 在 Kotlin Multiplatform 项目中添加 KSP)

本文介绍如何在 Kotlin Multiplatform 项目中使用 Kotlin 符号处理 (Kotlin Symbol Processing, KSP).
如需快速上手, 请参见 [源代码仓库](https://github.com/google/ksp/tree/main/examples/multiplatform) 中的示例 Multiplatform 项目,
这个示例项目在多个编译目标中使用 KSP, 示例项目中的处理器会生成项目使用的 `Foo` 类.

## 在跨平台项目中添加 KSP {id="add-ksp-to-a-multiplatform-project"}

在客户端模块(使用处理器的模块)的 `build.gradle.kts` 文件中, 为需要符号处理的每个编译目标, 添加相应的 KSP 处理器依赖项:

```kotlin
dependencies {
    add("ksp<Target>", <processor>)
}
```

* `<Target>` 是跨平台项目使用的编译目标之一.

  > 关于完整的编译目标列表, 请参见 [Multiplatform Gradle DSL 参考文档](multiplatform-dsl-reference.md#targets)
  > 和 [Kotlin/Native 支持的编译目标](native-target-support.md).
  >
  {style="tip"}

* `<processor>` 是 Gradle 项目路径. 它可以是:

  * 项目中包含符号处理器逻辑的特定目录:

      ```kotlin
      add("kspJvm", project(":local-processor"))
      ```

  * 外部处理器, 例如 Room:

      ```kotlin
      add("kspJvm", "androidx.room:room-compiler:2.6.1")
      ```

> 从 KSP 2 开始, 适用于所有编译目标的 `ksp(...)` 配置已废弃.
> 请对每个编译目标明确进行配置, 避免在不需要的编译目标上运行处理器.
>
{style="warning"}

### 在单个编译目标中使用多个处理器 {id="use-multiple-processors-in-a-single-target"}

可以为一个编译目标添加多个处理器:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
add("kspAndroid", project(":test-processor"))
add("kspAndroid", "androidx.room:room-compiler:2.6.1")
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
add('kspAndroid', project(':test-processor'))
add('kspAndroid', 'androidx.room:room-compiler:2.6.1')
```

</tab>
</tabs>

### 在多个编译目标中使用同一个处理器 {id="use-the-same-processor-in-multiple-targets"}

可以为多个编译目标添加同一个处理器:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
add("kspIosX64", project(":test-processor"))
add("kspIosArm64", project(":test-processor"))
add("kspIosSimulatorArm64", project(":test-processor"))
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
add('kspIosX64', project(':test-processor'))
add('kspIosArm64', project(':test-processor'))
add('kspIosSimulatorArm64', project(':test-processor'))
```

</tab>
</tabs>

如果有多个 iOS 编译目标, 可以使用循环, 避免重复编写配置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin.targets.filter { it.name.startsWith("ios") }.forEach { target ->
    add(
        "ksp${target.name.replaceFirstChar { it.uppercaseChar() }}",
        project(":test-processor")
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
kotlin.targets.filter { it.name.startsWith("ios") }.forEach { target ->
    add(
        "ksp${target.name.replaceFirstChar { it.uppercaseChar() }}",
        project(":test-processor")
    )
}
```

</tab>
</tabs>

### 为测试编译配置 KSP {id="configure-ksp-for-test-compilations"}

要在测试编译期间运行 KSP, 请将处理器添加到相应的测试配置中:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
add("kspJvmTest", project(":test-processor"))
add("kspJsTest", project(":test-processor"))
add("kspIosX64Test", project(":test-processor"))
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
add('kspJvmTest', project(':test-processor'))
add('kspJsTest', project(':test-processor'))
add('kspIosX64Test', project(':test-processor'))
```

</tab>
</tabs>

对于 Android 主机测试和设备测试, KSP 根据对应的源代码集名称生成配置名称:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
add("kspAndroidHostTest", project(":test-processor"))
add("kspAndroidDeviceTest", project(":test-processor"))
```

</tab>
<tab title="Groovy" group-key="groovy">

```Groovy
add('kspAndroidHostTest', project(':test-processor'))
add('kspAndroidDeviceTest', project(':test-processor'))
```

</tab>
</tabs>

## 查找 KSP 配置名称 {id="find-ksp-configuration-names"}

KSP 根据 Kotlin Multiplatform 源代码集生成配置名称.
要查看某个模块的 KSP 配置的完整列表, 请运行以下命令:

```Bash
./gradlew :<your-module-name>:dependencies | grep ksp
```

在输出中查找与编译目标源代码集对应的配置名称.

## 编译与处理 {id="compilation-and-processing"}

在跨平台项目中, Kotlin 会为每个编译目标和源代码集分别创建 [编译任务](multiplatform-advanced-project-structure.md#compilations),
例如 `main` 和 `test`.
对于配置了一个或多个 KSP 处理器的每个 Kotlin 编译任务, KSP 都会创建相应的符号处理任务.

[示例项目](https://github.com/google/ksp/tree/main/examples/multiplatform) 定义了 6 个编译目标.
每个编译目标都有 `main` 和 `test` 编译任务, 因此会产生以下编译任务和符号处理任务:

* **JVM**: `jvmMain` 和 `jvmTest`

* **JS**: `jsMain` 和 `jsTest`

* **LinuxX64**: `linuxX64Main` 和 `linuxX64Test`

* **AndroidNativeX64**: `androidNativeX64Main` 和 `androidNativeX64Test`

* **AndroidNativeArm64**: `androidNativeArm64Main` 和 `androidNativeArm64Test`

* **MingwX64**: `mingwX64Main` 和 `mingwX64Test`

在示例项目的 `workload/build.gradle.kts` 文件中, 为以下配置声明了 KSP 依赖项:

* `kspJvm` 和 `kspJvmTest`
* `kspJs` 和 `kspJsTest`
* `kspAndroidNativeX64` 和 `kspAndroidNativeX64Test`
* `kspAndroidNativeArm64` 和 `kspAndroidNativeArm64Test`
* `kspLinuxX64`
* `kspMingwX64`

对于每个声明了 KSP 依赖项的配置, KSP 都会创建一个符号处理任务.
在这个示例中, 项目创建了至少 12 个 Kotlin 编译任务和 10 个符号处理任务.
其余的编译任务没有对应的 KSP 任务, 因为没有为它们配置 KSP.
