---
type: doc
layout: reference
category:
title: "教程 - 创建并发布跨平台的库"
---

# 教程 - 创建并发布跨平台的库

本页面最终更新: 2022/04/19

本教程中, 你将学习如何为 JVM, JS, 和 Native 平台创建一个跨平台库, 对所有的平台编写共通测试, 并将库发布到本地 Maven 仓库.

这个库将原生数据 – 字符串和字节数组 – 转换为 [Base64](https://en.wikipedia.org/wiki/Base64) 格式.
它可以使用在 Kotlin/JVM, Kotlin/JS, 以及任何支持的 Kotlin/Native 平台.

在不同的平台上, 你将使用不同的方法来实现到 Base64 格式的转换:

* 对于 JVM – 使用 [`java.util.Base64` 类](https://docs.oracle.com/javase/8/docs/api/java/util/Base64.html).
* 对于 JS – 使用 [`btoa()` 函数](https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/btoa).
* 对于 Kotlin/Native – 使用你自己的实现.

你还将使用共通测试来测试你的代码, 然后将库发布到你的本地 Maven 仓库.

## 设置环境

你可以在任何操作系统上完成本教程.
下载并安装 [IntelliJ IDEA 的最新版本](https://www.jetbrains.com/idea/download/index.html),
它带有 [Kotlin plugin 的最新版本](../releases.html).

## 创建一个项目

1. 在 IntelliJ IDEA 中, 选择 **File \| New \| Project**.
2. 在左侧面板中, 选择 **Kotlin**.
3. 输入一个项目名称, 然后在 **Multiplatform** 中 选择 **Library** 作为项目模板.

   ![选择一个项目模板]({{ url_for('asset', path='/docs/images/mpp/mpp-project-1.png') }})

4. 选择 Gradle DSL – Kotlin 或 Groovy.
5. 指定 [JDK](https://www.jetbrains.com/help/idea/sdk.html#jdk), 这是开发 Kotlin 项目需要的.
5. 点击 **Next**, 然后点击 **Finish**.

向导将会创建一个跨平台库的示例, 结构如下:

<img src="/assets/docs/images/mpp/mpp-lib-structure.png" alt="跨平台库结构" width="250"/>

## 编写跨平台代码

定义你将要在共通代码中实现的类和接口.

1. 在 `commonMain/kotlin` 目录中, 创建 `org.jetbrains.base64` 包.
2. 在新的包中, 创建 `Base64.kt` 文件.
3. 定义 `Base64Encoder` 接口, 将字节转换为 `Base64` 格式:

    ```kotlin
    package org.jetbrains.base64
    
    interface Base64Encoder {
        fun encode(src: ByteArray): ByteArray
    }
    ```

4. 定义 `Base64Factory` 对象, 向共通代码提供 `Base64Encoder` 接口的一个实例:
   
    ```kotlin
    expect object Base64Factory {
        fun createEncoder(): Base64Encoder
    }
    ```

在跨平台代码中, 这个工厂对象标注了 `expect` 关键字.
对每个平台, 你都应该提供 `Base64Factory` 对象的一个 `actual` 实现, 返回平台相关的编码器.
详情请参见 [平台相关的实现](mpp-connect-to-apis.html).

## 提供平台相关的实现

现在你要为每个平台创建 `Base64Factory` 对象的 `actual` 实现:

* [JVM](#jvm)
* [JS](#js)
* [Native](#native)

### JVM

1. 在 `jvmMain/kotlin` 目录中, 创建 `org.jetbrains.base64` 包.
2. 在新的包中, 创建 `Base64.kt` 文件.
3. 提供 `Base64Factory` 对象的一个简单实现, 代理到 `java.util.Base64` 类:

   > IDEA 代码检查器会帮助你为 `expect` 声明创建 `actual` 实现.
   {:.note}

    ```kotlin
    package org.jetbrains.base64
    import java.util.*
    
    actual object Base64Factory {
        actual fun createEncoder(): Base64Encoder = JvmBase64Encoder
    }
    
    object JvmBase64Encoder : Base64Encoder {
        override fun encode(src: ByteArray): ByteArray = Base64.getEncoder().encode(src)
    }
    ```

非常简单, 是不是? 你已经提供了一个平台相关的实现, 直接代理到一个第三方实现.

### JS

JS 实现将会非常类似于 JVM 的实现.

1. 在 `jsMain/kotlin` 目录中, 创建 `org.jetbrains.base64` 包.
2. 在新的包中, 创建 `Base64.kt` 文件.
3. 提供 `Base64Factory` 对象的一个简单实现, 代理到 `btoa()` 函数.

    ```kotlin
    package org.jetbrains.base64
    
    import kotlinx.browser.window
    
    actual object Base64Factory {
        actual fun createEncoder(): Base64Encoder = JsBase64Encoder
    }
    
    object JsBase64Encoder : Base64Encoder {
        override fun encode(src: ByteArray): ByteArray {
            val string = src.decodeToString()
            val encodedString = window.btoa(string)
            return encodedString.encodeToByteArray()
        }
    }
    ```

### Native

不幸的是, 没有第三方实现可用于所有的 Kotlin/Native 目标平台, 因此你需要自己编写.

1. 在 `nativeMain/kotlin` 目录中, 创建 `org.jetbrains.base64` 包.
2. 在新的包中, 创建 `Base64.kt` 文件.
3. 为 `Base64Factory` 对象提供你自己的实现:

    ```kotlin
    package org.jetbrains.base64
    
    private val BASE64_ALPHABET: String = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
    private val BASE64_MASK: Byte = 0x3f
    private val BASE64_PAD: Char = '='
    private val BASE64_INVERSE_ALPHABET = IntArray(256) {
        BASE64_ALPHABET.indexOf(it.toChar())
    }
    
    private fun Int.toBase64(): Char = BASE64_ALPHABET[this]
    
    actual object Base64Factory {
        actual fun createEncoder(): Base64Encoder = NativeBase64Encoder
    }
    
    object NativeBase64Encoder : Base64Encoder {
        override fun encode(src: ByteArray): ByteArray {
            fun ByteArray.getOrZero(index: Int): Int = if (index >= size) 0 else get(index).toInt()
            // Base64 编码后的大小为 4n / 3
            val result = ArrayList<Byte>(4 * src.size / 3)
            var index = 0
            while (index < src.size) {
                val symbolsLeft = src.size - index
                val padSize = if (symbolsLeft >= 3) 0 else (3 - symbolsLeft) * 8 / 6
                val chunk = (src.getOrZero(index) shl 16) or (src.getOrZero(index + 1) shl 8) or src.getOrZero(index + 2)
                index += 3
    
                for (i in 3 downTo padSize) {
                    val char = (chunk shr (6 * i)) and BASE64_MASK.toInt()
                    result.add(char.toBase64().code.toByte())
                }
                // pad 部分填充 '='
                repeat(padSize) { result.add(BASE64_PAD.code.toByte()) }
            }
    
            return result.toByteArray()
        }
    }
    ```

## 测试你的库

你的 `Base64Factory` 对象在所有的平台上都有了 `actual` 实现, 现在可以测试你的跨平台库了.

为了节省测试的时间, 你可以编写共通的测试, 在所有的平台上执行, 而不是为每个平台分别编写测试.

### 准备

在编写测试之前, 向 `Base64Encoder` 接口添加带有默认实现的 `encodeToString` 方法, 它定义在 `commonMain/kotlin/org/jetbrains/base64/Base64.kt` 中.
这个实现将字节数组转换为字符串, 因此更加容易测试.

```kotlin
interface Base64Encoder {
    fun encode(src: ByteArray): ByteArray

    fun encodeToString(src: ByteArray): String {
        val encoded = encode(src)
        return buildString(encoded.size) {
            encoded.forEach { append(it.toChar()) }
        }
    }
}
```

对特定平台, 你也可以为这个方法提供一个更加高效的实现, 比如, 对于 JVM, 在 `jvmMain/kotlin/org/jetbrains/base64/Base64.kt` 中:

```kotlin
object JvmBase64Encoder : Base64Encoder {
    override fun encode(src: ByteArray): ByteArray = Base64.getEncoder().encode(src)
    override fun encodeToString(src: ByteArray): String = Base64.getEncoder().encodeToString(src)
}
```

跨平台库的好处之一是, 可以对所有的平台拥有一个默认实现, 并选择性的在某些平台上用新的实现覆盖它.

### 编写共通测试

现在你有了一个基于字符串的 API, 你可以使用基本的测试来覆盖这个 API.

1. 在 `commonTest/kotlin` 目录中, 创建 `org.jetbrains.base64` 包.
2. 在新的包中, 创建 `Base64Test.kt` 文件.
3. 向这个文件添加测试 :

    ```kotlin
    package org.jetbrains.base64
   
    import kotlin.test.Test
   
    class Base64Test {
        @Test
        fun testEncodeToString() {
            checkEncodeToString("Kotlin is awesome", "S290bGluIGlzIGF3ZXNvbWU=")
        }
    
        @Test
        fun testPaddedStrings() {
            checkEncodeToString("", "")
            checkEncodeToString("1", "MQ==")
            checkEncodeToString("22", "MjI=")
            checkEncodeToString("333", "MzMz")
            checkEncodeToString("4444", "NDQ0NA==")
        }
    
        private fun checkEncodeToString(input: String, expectedOutput: String) {
            assertEquals(expectedOutput, Base64Factory.createEncoder().encodeToString(input.asciiToByteArray()))
        }
    
        private fun String.asciiToByteArray() = ByteArray(length) {
            get(it).toByte()
        }
    }
    ```

4. 在终端中, 执行 Gradle task `check`:

    ```text
    ./gradlew check 
    ```

   > 你也可以在 Gradle task 列表中双击 `check` 来运行它.
   {:.note}

测试将在所有的平台上运行 (JVM, JS, 和 Native).

### 添加平台相关的测试

你还可以添加只为特定平台云运行的测试.
比如, 你可以对 JVM 添加 UTF-16 测试. 步骤与共通测试一样, 但请创建在 `jvmTest/kotlin/org/jetbrains/base64` 中 `Base64Test` 文件:

```kotlin
package org.jetbrains.base64

import org.junit.Test
import kotlin.test.assertEquals

class Base64JvmTest {
    @Test
    fun testNonAsciiString() {
        val utf8String = "Gödel"
        val actual = Base64Factory.createEncoder().encodeToString(utf8String.toByteArray())
        assertEquals("R8O2ZGVs", actual)
    }
}
```

在 JVM 平台上, 除共通测试之外, 还将自动运行这个测试.

## 将你的库发布到本地 Maven 仓库

现在可以发布你的跨平台库, 供其他项目使用了.

要发布你的库, 请使用 [`maven-publish` Gradle plugin](https://docs.gradle.org/current/userguide/publishing_maven.html).

1. 在 `build.gradle(.kts)` 文件中, 使用 `maven-publish` plugin, 并为你的库指定 group 和版本:

   <div class="multi-language-sample" data-lang="kotlin">
   <div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>
   
   ```kotlin
   plugins {
       kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
       id("maven-publish")
   }
   
   group = "org.jetbrains.base64"
   version = "1.0.0"
   ```
   
   </div>
   </div>
   
   <div class="multi-language-sample" data-lang="groovy">
   <div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">
   
   ```groovy
   plugins {
      id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
      id 'maven-publish'
   }
   
   group = 'org.jetbrains.base64'
   version = '1.0.0'
   ```
   
   </div>
   </div>
   
2. 在终端中, 运行 Gradle task `publishToMavenLocal`, 将你的库发布到你的本地 Maven 仓库:

    ```text
    ./gradlew publishToMavenLocal
    ```

   > 你也可以在 Gradle task 列表中双击 `publishToMavenLocal` 来运行它.
   {:.note}


你的库将被发布本地 Maven 仓库.

## 将发布的库添加为依赖项

现在你可以在向其他的跨平台项目中, 将你的库添加为一个依赖项.

添加 `mavenLocal()` 仓库, 然后对 `build.gradle(.kts)` 文件添加一个对你的库的依赖项.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
repositories {
   mavenCentral()
   mavenLocal()
}

kotlin {
   sourceSets {
      val commonMain by getting {
         dependencies {
            implementation("org.jetbrains.base64:Base64:1.0.0")
         }
      }
   }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
repositories {
   mavenCentral()
   mavenLocal()
}

kotlin {
   sourceSets {
      commonMain {
         dependencies {
            implementation 'org.jetbrains.base64:Base64:1.0.0'
         }
      }
   }
}
```

</div>
</div>

## 总结

在本教程中, 你:
* 创建了一个跨平台库, 包含平台相关的实现.
* 编写了在所有平台上运行的共通测试.
* 将你的库发布到了本地 Maven 仓库.

## 下一步做什么?

* 学习 [发布跨平台库](mpp-publish-lib.html).
* 学习 [Kotlin 跨平台](mpp-intro.html).
* [教程 - 为 Android 和 iOS 平台创建你的第一个跨平台应用程序](../kmm/kmm-create-first-app.html).
* [实际动手(hands-on)教程 - 使用 Kotlin Multiplatform 创建一个全栈的 Web 应用程序](https://play.kotlinlang.org/hands-on/Full%20Stack%20Web%20App%20with%20Kotlin%20Multiplatform/01_Introduction).
