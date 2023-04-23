---
type: doc
layout: reference
category:
title: "KSP 快速入门"
---

# KSP 快速入门

最终更新: {{ site.data.releases.latestDocDate }}

要快速入门 KSP, 你可以创建自己的处理器, 或者参考 [示例代码](https://github.com/google/ksp/tree/main/examples/playground).

## 创建一个你自己的处理器 

1. 创建一个空的 gradle 项目.
2. 在根项目中指定 Kotlin plugin 版本 `{{ site.data.releases.kspSupportedKotlinVersion }}`, 供其他项目模块使用:

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
   
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
   
   </div>
   </div>
   
   <div class="multi-language-sample" data-lang="groovy">
   <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
   
   ```groovy
   plugins {
       id 'org.jetbrains.kotlin.jvm' version '{{ site.data.releases.kspSupportedKotlinVersion }}' apply false
   }
   
   buildscript {
       dependencies {
           classpath 'org.jetbrains.kotlin:kotlin-gradle-plugin:{{ site.data.releases.kspSupportedKotlinVersion }}'
       }
   }
   ```
   
   </div>
   </div>

3. 添加一个模块, 容纳处理器.

4. 在模块的构建脚本中, 使用 Kotlin plugin, 并在 `dependencies` 代码段添加 KSP API.

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
   
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
   
   </div>
   </div>
   
   <div class="multi-language-sample" data-lang="groovy">
   <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
   
   ```groovy
   plugins {
       id 'org.jetbrains.kotlin.jvm' version '{{ site.data.releases.latest.version }}'
   }
   
   repositories {
       mavenCentral()
   }
   
   dependencies {
       implementation 'com.google.devtools.ksp:symbol-processing-api:{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}'
   }
   ```
   
   </div>
   </div>

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

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
   
   ```kotlin
   pluginManagement { 
       repositories { 
           gradlePluginPortal()
       }
   }
   ```
   
   </div>
   </div>
   
   <div class="multi-language-sample" data-lang="groovy">
   <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
   
   ```groovy
   pluginManagement {
       repositories {
           gradlePluginPortal()
       }
   }
   ```
   
   </div>
   </div>

2. 在模块的构建脚本中, 使用指定版本的 `com.google.devtools.ksp` plugin, 并在依赖项中添加你的处理器.

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
   
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

   </div>
   </div>
   
   <div class="multi-language-sample" data-lang="groovy">
   <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

   ```groovy
   plugins {
       id 'com.google.devtools.ksp' version '{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}'
   }

   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-stdlib:{{ site.data.releases.latest.version }}'
       implementation project(':test-processor')
       ksp project(':test-processor')
   }
   ```

   </div>
   </div>

3. 运行 `./gradlew build`. 你可以在 `build/generated/source/ksp` 目录下看到生成的代码.

   下面是一个构建脚本示例, 它对工作程序使用 KSP plugin:

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
   
   ```kotlin
   plugins {
       id("com.google.devtools.ksp") version "{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}"
       kotlin("jvm") 
   }
   
   repositories {
       mavenCentral()
   }
   
   dependencies {
       implementation(kotlin("stdlib-jdk8"))
       implementation(project(":test-processor"))
       ksp(project(":test-processor"))
   }
   ```
   
   </div>
   </div>
   
   <div class="multi-language-sample" data-lang="groovy">
   <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
   
   ```groovy
   plugins {
       id 'com.google.devtools.ksp' version '{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}'
       id 'org.jetbrains.kotlin.jvm' version '{{ site.data.releases.latest.version }}'
   }
   
   repositories {
       mavenCentral()
   }
   
   dependencies {
       implementation 'org.jetbrains.kotlin:kotlin-stdlib:{{ site.data.releases.latest.version }}'
       implementation project(':test-processor')
       ksp project(':test-processor')
   }
   ```
   
   </div>
   </div>


## 向处理器传递选项

在 gradle 构建脚本中指定 `SymbolProcessorEnvironment.options` 中的处理器选项:

```none
ksp {
    arg("option1", "value1")
    arg("option2", "value2")
    ...
}
```

## 让 IDE 感知生成的代码

> 从 KSP 1.8.0-1.0.9 开始, 生成的源代码文件会自动进行注册.
> 如果你在使用 KSP 1.0.9 或更高版本, 但不需要让 IDE 感知生成的资源, 那么可以跳过这一章节.
{:.note}

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

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

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

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        main.kotlin.srcDirs += 'build/generated/ksp/main/kotlin'
        test.kotlin.srcDirs += 'build/generated/ksp/test/kotlin'
    }
}
```

</div>
</div>

如果你使用 IntelliJ IDEA, 并在 Gradle plugin 中使用 KSP, 那么上面的代码段会出现以下警告:

```text
Execution optimizations have been disabled for task ':publishPluginJar' to ensure correctness due to the following reasons:
Gradle detected a problem with the following location: '../build/generated/ksp/main/kotlin'. 
Reason: Task ':publishPluginJar' uses this output of task ':kspKotlin' without declaring an explicit or implicit dependency.
```

这种情况下, 请改为使用下面的构建脚本:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    // ...
    idea
}

idea {
    module {
        // 由于 https://github.com/gradle/gradle/issues/8749, 不要使用 +=
        sourceDirs = sourceDirs + file("build/generated/ksp/main/kotlin") // 或者 tasks["kspKotlin"].destination
        testSourceDirs = testSourceDirs + file("build/generated/ksp/test/kotlin")
        generatedSourceDirs = generatedSourceDirs + file("build/generated/ksp/main/kotlin") + file("build/generated/ksp/test/kotlin")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    // ...
    id 'idea'
}

idea {
    module {
        // 由于 https://github.com/gradle/gradle/issues/8749, 不要使用 +=
        sourceDirs = sourceDirs + file('build/generated/ksp/main/kotlin') // 或者 tasks["kspKotlin"].destination
        testSourceDirs = testSourceDirs + file('build/generated/ksp/test/kotlin')
        generatedSourceDirs = generatedSourceDirs + file('build/generated/ksp/main/kotlin') + file('build/generated/ksp/test/kotlin')
    }
}
```

</div>
</div>
