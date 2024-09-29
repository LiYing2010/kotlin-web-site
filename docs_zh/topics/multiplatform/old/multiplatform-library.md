[//]: # (title: 教程 - 创建并发布跨平台的库)

最终更新: %latestDocDate%

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

1. 在 IntelliJ IDEA 中, 选择 **File | New | Project**.
2. 在左侧面板中, 选择 **Kotlin Multiplatform**.
3. 输入一个项目名称, 然后在 **Multiplatform** 中 选择 **Library** 作为项目模板.

   ![选择一个项目模板]({{ url_for('asset', path='docs/images/multiplatform/multiplatform-project-1.png') }})

   默认情况下, 你的项目会使用 Gradle 和 Kotlin DSL 作为构建系统.
4. 指定 [JDK](https://www.jetbrains.com/help/idea/sdk.html#jdk), 这是开发 Kotlin 项目需要的.
5. 点击 **Next**, 然后点击 **Finish**.

更多项目配置

对于更加复杂的项目, 你可能需要添加更多的模块和编译目标:
 * 要添加模块, 请选择 **Project**, 然后点击 **+** 按钮. 选择模块类型.
 * 要添加编译目标平台, 请选择 **library**, 然后点击 **+** 按钮. 选择编译目标.
 * 配置编译目标设置, 比如编译目标 JVM 版本, 以及测试框架.
   <img src="/assets/docs/images/multiplatform/multiplatform-project-2.png" alt="配置项目" width="700"/>
 * 如果需要, 指定模块间的依赖项目:
    * Multiplatform 和 Android 模块
    * Multiplatform 和 iOS 模块
    * JVM 模块
      <img src="/assets/docs/images/multiplatform/multiplatform-project-3.png" alt="配置项目" width="700"/>
 
向导将会创建一个跨平台库的示例, 结构如下:

<img src="/assets/docs/images/multiplatform/multiplatform-lib-structure.png" alt="跨平台库结构" width="250"/>

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
详情请参见 [平台相关的实现](multiplatform-connect-to-apis.html).

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
> 
{style="note"}

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
            encoded.forEach { append(it.toInt().toChar()) }
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
    import kotlin.test.assertEquals

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
            get(it).code.toByte()
        }
    }
    ```

4. 在终端中, 执行 Gradle task `check`:

    ```bash
    ./gradlew check
    ```

   > 你也可以在 Gradle task 列表中双击 `check` 来运行它.
> 
{style="note"}

测试将在所有的平台上运行 (JVM, JS, 和 Native).

### 添加平台相关的测试

你还可以添加只为特定平台云运行的测试. 比如, 你可以对 JVM 添加 UTF-16 测试.

1. 在 `jvmTest/kotlin` 目录内, 创建 `org.jetbrains.base64` 包.
2. 在这个新的包内创建 `Base64Test.kt` 文件.
3. 在这个文件内添加测试:

   ```kotlin
   package org.jetbrains.base64
   
   import kotlin.test.Test
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

1. 在 `build.gradle.kts` 文件中, 使用 `maven-publish` plugin, 并为你的库指定 group 和版本:

   ```kotlin
   plugins {
       kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
       id("maven-publish")
   }
   
   group = "org.jetbrains.base64"
   version = "1.0.0"
   ```

2. 在终端中, 运行 Gradle task `publishToMavenLocal`, 将你的库发布到你的本地 Maven 仓库:

   ```bash
   ./gradlew publishToMavenLocal
   ```

   > 你也可以在 Gradle task 列表中双击 `publishToMavenLocal` 来运行它.
> 
{style="note"}


你的库将被发布本地 Maven 仓库.

## 将你的库发布到外部的 Maven Central 仓库

你可以将你的跨平台库发布到 [Maven Central](https://search.maven.org/),
一个存储和管理 maven artifact 文件的远程仓库.
通过这种方式, 其他开发者就可以找到它, 并在他们的项目中将你的库添加为依赖项.

### 注册一个 Sonatype 帐号, 并生成 GPG Key

如果这是你的第一个库, 或者你过去使用已废弃的 Bintray 来发布库, 那么你首先需要注册一个 Sonatype 帐号.

你可以参考 GetStream 的文章来创建并设置你的帐号.
[注册 Sonatype 帐号](https://getstream.io/blog/publishing-libraries-to-mavencentral-2021/#registering-a-sonatype-account)
小节描述了具体步骤:

1. 注册一个 [Sonatype Jira 帐号](https://issues.sonatype.org/secure/Signup!default.jspa).
2. 创建一个新的 issue. 你可以参考 [我们的 issue](https://issues.sonatype.org/browse/OSSRH-65092) 作为例子.
3. 对于你想要用来发布你的 artifact 文件的 group ID, 验证对应的域名的所有权.

然后, 由于发布到 Maven Central 的 artifact 文件需要签名, 请遵照
[生成 GPG Key 对](https://getstream.io/blog/publishing-libraries-to-mavencentral-2021/#generating-a-gpg-key-pair)
小节中描述的来进行:

1. 生成一个 GPG Key pair, 用于对你的 artifact 文件进行签名.
2. 发布你的 Public Key.
3. 导出你的 private Key.

当你的库的 Maven 仓库和签名 Key 准备好之后, 你可以继续设置你的构建脚本, 将库的 artifact 文件上传到 staging 仓库, 并发布它.

### 对发布进行设置

现在你需要指示 Gradle 如何发布库. 大多数工作已经由 `maven-publish` 和 Kotlin Gradle plugin 完成了, 所有必须的发布都会自动创建.
在库发布到本地 Maven 仓库时, 你已经知道了发布结果. 
要发布到 Maven Central, 你需要添加下面的步骤:

1. 配置 Public Maven 仓库 URL 和帐号信息.
2. 对所有的库组件, 指定描述信息和 `javadocs`.
3. 对发布进行签名.

你可以在 Gradle 脚本中完成所有这些工作. 我们从库模块的 `build.script` 中抽取出所有与发布相关的逻辑,
这样, 将来你就可以很容易的为其他模块重用这些代码.

最符合习惯而且最灵活的方式是使用 Gradle 的
[预编译脚本 plugin](https://docs.gradle.org/current/userguide/custom_plugins.html#sec:precompiled_plugins).
所有的构建逻辑都会成为预编译的脚本 plugin, 对我们的库的每个模块, 可以通过 plugin ID 来应用这些 plugin.

具体做法是, 将发布逻辑移动到一个单独的 Gradle 项目:

1. 在你的库的根项目内, 添加一个新的项目.
   创建一个新的文件夹, 名为 `convention-plugins`, 然后在这个文件夹内创建新文件 `build.gradle.kts`.
2. 在新文件 `build.gradle.kts` 中添加以下代码:

   ```kotlin
   plugins {
       `kotlin-dsl` // 需要这个 plugin, 以便将我们用 Kotlin 编写的构建逻辑转变为 Gradle Plugin
   }
   
   repositories {
       gradlePluginPortal() // 需要这段代码, 以便在我们的 plugin 中使用 'maven-publish' 和 'signing' plugin
   }
   ```

3. 在 `convention-plugins` 目录中, 创建一个 `src/main/kotlin/convention.publication.gradle.kts` 文件,
   其中包含所有的发布逻辑.
4. 在新文件中添加所有需要的逻辑.
   请注意, 要修改这些代码, 以符合你的项目的配置, 尤其是用尖括号括起的部分 (例如. `<replace-me>`):

   ```kotlin
   import org.gradle.api.publish.maven.MavenPublication
   import org.gradle.api.tasks.bundling.Jar
   import org.gradle.kotlin.dsl.`maven-publish`
   import org.gradle.kotlin.dsl.signing
   import java.util.*
   
   plugins {
       `maven-publish`
       signing
   }
   
   // 密码信息的桩设定值, 在没有进行发布设定值时, 让项目也能够同步并正确构建, 
   ext["signing.keyId"] = null
   ext["signing.password"] = null
   ext["signing.secretKeyRingFile"] = null
   ext["ossrhUsername"] = null
   ext["ossrhPassword"] = null
   
   // 从 local.properties 文件或从环境变量获取密码信息, CI 中可能会使用环境变量
   val secretPropsFile = project.rootProject.file("local.properties")
   if (secretPropsFile.exists()) {
       secretPropsFile.reader().use {
           Properties().apply {
               load(it)
           }
       }.onEach { (name, value) ->
           ext[name.toString()] = value
       }
   } else {
       ext["signing.keyId"] = System.getenv("SIGNING_KEY_ID")
       ext["signing.password"] = System.getenv("SIGNING_PASSWORD")
       ext["signing.secretKeyRingFile"] = System.getenv("SIGNING_SECRET_KEY_RING_FILE")
       ext["ossrhUsername"] = System.getenv("OSSRH_USERNAME")
       ext["ossrhPassword"] = System.getenv("OSSRH_PASSWORD")
   }
   
   val javadocJar by tasks.registering(Jar::class) {
       archiveClassifier.set("javadoc")
   }
   
   fun getExtraString(name: String) = ext[name]?.toString()
   
   publishing {
       // 配置 Maven Central 仓库
       repositories {
           maven {
               name = "sonatype"
               setUrl("https://s01.oss.sonatype.org/service/local/staging/deploy/maven2/")
               credentials {
                   username = getExtraString("ossrhUsername")
                   password = getExtraString("ossrhPassword")
               }
           }
       }
   
       // 配置所有的发布
       publications.withType<MavenPublication> {
           // javadoc.jar artifact 文件的桩设置
           artifact(javadocJar.get())
   
           // 设置 Maven Central 需要的 artifact 信息
           pom {
               name.set("MPP Sample library")
               description.set("Sample Kotlin Multiplatform library (jvm + ios + js) test")
               url.set("https://github.com/<your-github-repo>/mpp-sample-lib")
   
               licenses {
                   license {
                       name.set("MIT")
                       url.set("https://opensource.org/licenses/MIT")
                   }
               }
               developers {
                   developer {
                   id.set("<your-github-profile>")
                   name.set("<your-name>")
                   email.set("<your-email>") 
               }
           }
               scm {
                   url.set("https://github.com/<your-github-repo>/mpp-sample-lib")
               }
           }
       }
   }

   // 对 artifact 文件签名. 将会使用 Signing.* 属性值
   signing {
       sign(publishing.publications)
   }
   ```

   对于发布到本地 Maven 仓库, 适用 `maven-publish` 就足够了, 但对 Maven Central 还不够.
   在上面的脚本中, 你会从 `local.properties` 或环境变量得到密码信息,
   在 `publishing` 小节进行所有必须的配置, 使用 signing plugin 对你的发布文件进行签名.

5. 回到你的库项目. 为了让 Gradle 预构建你的 plugin, 需要更新根项目的 `settings.gradle.kts`, 如下:

   ```kotlin
   rootProject.name = "multiplatform-lib" // 你的项目名称
   includeBuild("convention-plugins")
   ```

6. 现在, 你可以在库的 `build.script` 中适用这段发布逻辑.
   在 `plugins` 小节, 将 `maven-publish` 替换为 `conventional.publication`:

   ```kotlin
   plugins {
       kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
       id("convention.publication")
   }
   ```

7. 在你的库的根目录内, 创建一个 `local.properties` 文件, 其中包含所有必须的密码信息, 而且要确认将它添加到了你的 `.gitignore` 中:

   ```none
   # GPG Key 对 ID (它的指纹中的至少 8 位数字)
   signing.keyId=...
   # Key 对的密码 
   signing.password=...
   # 你前面导出的 Private Key
   signing.secretKeyRingFile=...
   # 你的 Jira 帐号的用户名和密码 
   ossrhUsername=...
   ossrhPassword=...
   ```

8. 运行 `./gradlew clean`, 并同步你的项目.

与 Sonatype 仓库相关的新的 Gradle 任务 应该会出现在 "publishing" 组中 – 这代表一切准备就绪, 你可以发布你的库了.

### 将你的库发布到 Maven Central

要将你的库上传到 Sonatype 仓库, 请运行以下命令:

```bash
./gradlew publishAllPublicationsToSonatypeRepository
```

这个命令将会创建 staging 仓库, 所有发布中的所有 artifact 文件都会被上传到这个仓库.
剩下要做的是, 检查你希望上传的所有 artifact 文件是否已存在于仓库中, 然后就可以按下发布按钮了.

这些步骤请参见
[你的第一次发布](https://getstream.io/blog/publishing-libraries-to-mavencentral-2021/#your-first-release)
小节.
简单的说, 你需要做的是:

1. 访问 [https://s01.oss.sonatype.org](https://s01.oss.sonatype.org), 使用你的 Sonatype Jira 帐号登录.
2. 在 **Staging repositories** 中找到你的仓库.
3. 关闭它.
4. 发布库.
5. 要启动与 Maven Central 的同步, 回到你创建的 Jira issue, 留下一条评论, 说你已经发布了你的第一个组件.
   只在你的第一次发布时才需要这个步骤.

很快, 就能在 [https://repo1.maven.org/maven2](https://repo1.maven.org/maven2) 看到你的库,
其他开发者就可以将它添加为一个依赖项了.
几个小时之内, 其他开发者将能够通过 [Maven Central 仓库检索](https://search.maven.org/) 找到它.

## 将发布的库添加为依赖项

你可以在向其他的跨平台项目中, 将你的库添加为一个依赖项.

在 `build.gradle.kts` 文件中, 添加 `mavenLocal()` 仓库,
如果库被发布到了外部的仓库, 那么需要添加 `MavenCentral()`仓库,
然后添加一个对你的库的依赖项:

```kotlin
repositories {
    mavenCentral()
    mavenLocal()
}

kotlin {
    sourceSets {
        val commonMain by getting {
            dependencies {
                implementation("org.jetbrains.base64:multiplatform-lib:1.0.0")
            }
        }
    }
}
```

`implementation` 依赖项包括:

* group ID 和版本 — 之前在 `build.gradle.kts` 文件中指定
* artifact ID — 默认, 它是你的项目名称, 在 `settings.gradle.kts` 文件中指定的

详情请参见 [Gradle 文档](https://docs.gradle.org/current/userguide/publishing_maven.html) 关于 `maven-publish` plugin 的章节.

## 下一步做什么?

* 学习 [发布跨平台库](multiplatform-publish-lib.html).
* 学习 [Kotlin 跨平台](multiplatform-get-started.html).
* [教程 - 创建你的第一个跨平台移动应用程序](../multiplatform-mobile/multiplatform-mobile-create-first-app.html).
* [教程 - 使用 Kotlin Multiplatform 构建一个全栈 Web 应用程序](multiplatform-full-stack-app.html).
