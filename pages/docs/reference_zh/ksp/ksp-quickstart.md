---
type: doc
layout: reference
category:
title: "KSP 快速入门"
---

# KSP 快速入门

本页面最终更新: 2022/02/24

要快速入门 KSP, 你可以创建自己的处理器, 或者参考 [示例代码](https://github.com/google/ksp/tree/main/examples/playground).

## 创建一个你自己的处理器 

1. 创建一个空的 gradle 项目.
2. 在根项目中指定 Kotlin plugin 版本 `{{ site.data.releases.kspSupportedKotlinVersion }}`, 供其他项目模块使用:

   ```kotlin
   plugins {
       kotlin("jvm") version "{{ site.data.releases.kspSupportedKotlinVersion }}" apply false
   }
   
   buildscript {
       dependencies {
           classpath(kotlin("gradle-plugin", version = "{{ site.data.releases.kspSupportedKotlinVersion }}"))
       }
   }
   ```

3. 添加一个模块, 容纳处理器.

4. 在模块的构建脚本中, 使用 Kotlin plugin, 并在 `dependencies` 代码段添加 KSP API.

   ```kotlin
   plugins {
       kotlin("jvm")
   }
   
   repositories {
       mavenCentral()
   }
   
   dependencies {
       implementation("com.google.devtools.ksp:symbol-processing-api:{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}")
   }
   ```

5. 你需要实现
   [`com.google.devtools.ksp.processing.SymbolProcessor`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)  
   和
   [`com.google.devtools.ksp.processing.SymbolProcessorProvider`](https://github.com/google/ksp/tree/main/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt).
   你实现的 `SymbolProcessorProvider` 将被作为一个服务装载, 负责创建你实现的 `SymbolProcessor` 实例.
   注意以下几点:
    * 实现
      [`SymbolProcessorProvider.create()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessorProvider.kt),
      负责创建一个 `SymbolProcessor`. 
      通过 `SymbolProcessorProvider.create()` 的参数传递你的处理器需要的依赖项 (比如 `CodeGenerator`, 处理器选项).
    * 你的主逻辑应该在
      [`SymbolProcessor.process()`](https://github.com/google/ksp/blob/master/api/src/main/kotlin/com/google/devtools/ksp/processing/SymbolProcessor.kt)
      方法中.
    * 使用 `resolver.getSymbolsWithAnnotation()`, 给定一个注解的完全限定名称, 得到你希望处理的符号.
    * KSP 的一个常见使用场景是实现一个自定义的访问器 (`com.google.devtools.ksp.symbol.KSVisitor` 接口)
      来操作符号. 一个简单的访问器模板是 `com.google.devtools.ksp.symbol.KSDefaultVisitor`.
    * 关于 `SymbolProcessorProvider` 和 `SymbolProcessor` 接口实现的例子, 请参见示例项目中的以下文件.
        * `src/main/kotlin/BuilderProcessor.kt`
        * `src/main/kotlin/TestProcessor.kt`
    * 编写完你自己的处理器之后, 需要向包注册你的处理器 provider, 方法是在 
      `resources/META-INF/services/com.google.devtools.ksp.processing.SymbolProcessorProvider`
      中包含它的完全限定名称.

## 在一个项目中使用你自己的处理器

1. 创建另一个模块, 包含一段工作程序, 用来试验你的处理器.

   ```kotlin
   pluginManagement { 
       repositories { 
           gradlePluginPortal()
       }
   }
   ```

2. 在模块的构建脚本中, 使用指定版本的 `com.google.devtools.ksp` plugin, 并在依赖项中添加你的处理器.

   ```kotlin
   plugins {
       id("com.google.devtools.ksp") version "{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}"
   }
   
   dependencies {
       implementation(kotlin("stdlib-jdk8"))
       implementation(project(":test-processor"))
       ksp(project(":test-processor"))
   }
   ```

3. 运行 `./gradlew build`. 你可以在 `build/generated/source/ksp` 目录下看到生成的代码.

下面是一个构建脚本示例, 它对工作程序使用 KSP plugin:

```kotlin
plugins {
    id("com.google.devtools.ksp") version "{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}"
    kotlin("jvm") 
}

version = "1.0-SNAPSHOT"

repositories {
    mavenCentral()
}

dependencies {
    implementation(kotlin("stdlib-jdk8"))
    implementation(project(":test-processor"))
    ksp(project(":test-processor"))
}
```

## 向处理器传递选项

在 gradle 构建脚本中指定 `SymbolProcessorEnvironment.options` 中的处理器选项:

```properties
ksp {
  arg("option1", "value1")
  arg("option2", "value2")
  ...
}
```

## 让 IDE 感知生成的 代码

默认情况下, IntelliJ IDEA 或其他 IDE 不知道生成的代码. 因此 IDE 会将生成的符号标记为无法解析.
要让 IDE 能够理解生成的符号, 请将以下路径标记为生成的源代码根目录:

```text
build/generated/ksp/main/kotlin/
build/generated/ksp/main/java/
```

如果你的 IDE 支持资源目录, 那么还需要标记下面的路径:

```text
build/generated/ksp/main/resources/
```

在你的 KSP 使用者模块的构建脚本中, 可能还需要配置这些目录:

```kotlin
kotlin {
    sourceSets.main {
        kotlin.srcDir("build/generated/ksp/main/kotlin")
    }
    sourceSets.test {
        kotlin.srcDir("build/generated/ksp/test/kotlin")
    }
}
```
