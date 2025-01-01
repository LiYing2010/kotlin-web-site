[//]: # (title: 向 Kotlin/Wasm 项目添加 Kotlin 库依赖项)

你可以在 Kotlin/Wasm 中使用最流行的 Kotlin 库, 这个功能开箱即用, 不需要额外的设置.

## Kotlin/Wasm 支持的 Kotlin 库

使用 Maven central 仓库, 向你的项目添加 Kotlin 库:

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}
```

| 支持的库                          |
|-------------------------------|
| stdlib                        |
| kotlin-test                   |
| kotlinx-coroutines            |
| Compose Multiplatform         |
| Compose Compiler              |
| kotlinx-serialization         |
| kotlinx-atomicfu              |
| kotlinx-collections-immutable |
| kotlinx-datetime              |
| skiko                         |

## 在你的项目中启用库

要设置对一个库的依赖项, 例如 [`kotlinx.serilization`](serialization.md) 和 [`kotlinx.coroutines`](coroutines-guide.md),
请更新你的 `build.gradle.kts` 文件:

```kotlin
// `build.gradle.kts`

repositories {
    mavenCentral()
}

kotlin {
    sourceSets {
        val wasmJsMain by getting {
            dependencies {
                implementation("org.jetbrains.kotlinx:kotlinx-serialization-core:%serializationVersion%")
                implementation("org.jetbrains.kotlinx:kotlinx-coroutines-core:%coroutinesVersion%")
            }
        }
    }
}
```

## 下一步做什么?

[查看 Kotlin/Wasm 与 JavaScript 的交互能力](wasm-js-interop.md)
