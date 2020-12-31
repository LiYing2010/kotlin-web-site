---
type: doc
layout: reference
category: "语法"
title: "序列化"
---

# 序列化(serialization)

_序列化(serialization)_ 是指将应用程序使用的数据转换为一种格式, 使它可以通过网络传输, 或保存到数据库或文件.
相应的, _反序列化(deserialization)_ 是指相反的过程, 从外部读取数据, 将它转换为运行时对象.
这两种功能结合到一起, 就是大多数应用程序与第三方交换数据时必不可少的部分.

有些序列化格式, 比如 [JSON](https://www.json.org/json-en.html) 和 [protocol buffers](https://developers.google.com/protocol-buffers) 是非常通用的.
它们独立于编程语言和运行平台, 可以用来在各种现代语言编写的系统之间交换数据.

在 Kotlin 中, 数据序列化工具是一个单独的组件, [*kotlinx.serialization*](https://github.com/Kotlin/kotlinx.serialization).
其中包含 2 个主要部分: Gradle 插件 –`org.jetbrains.kotlin.plugin.serialization` 和运行库.

## 库

`kotlinx.serialization` 提供了一组库, 用于所有支持的平台 – JVM, JavaScript, Native –
而且支持很多序列化格式 – JSON, CBOR, protocol buffers, 以及其他格式.
关于所支持的序列化格式的完整列表, 请参见[下文](#formats).

所有的 Kotlin 序列化库都属于 `org.jetbrains.kotlinx:` 组. 库名称以 `kotlinx-serialization-` 开头,
后缀对应于序列化格式及所支持的目标平台, 比如 `-js` 或 `-native`.
用于 JVM 的库, 以及用于跨平台项目的共通代码的库, 没有后缀. 比如:
* `org.jetbrains.kotlinx:kotlinx-serialization-core` 针对 JVM 平台, 提供 JSON 序列化功能.
* `org.jetbrains.kotlinx:kotlinx-cbor-js` 针对 JavaScript 平台, 提供 CBOR 序列化功能.

注意, `kotlinx.serialization` 库使用单独的版本结构, 与 Kotlin 本身的版本不同.
最新的发布版本请参见 [GitHub](https://github.com/Kotlin/kotlinx.serialization/releases) 的版本列表.

## 格式

`kotlinx.serialization` 包括针对多种序列化格式的库:

* [JSON](https://www.json.org/): `kotlinx-serialization-core`
* [Protocol buffers](https://developers.google.com/protocol-buffers): `kotlinx-serialization-protobuf`
* [CBOR](https://cbor.io/): `kotlinx-serialization-cbor`
* [Properties](https://en.wikipedia.org/wiki/.properties): `kotlinx-serialization-properties`
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md): `kotlinx-serialization-hocon` (只限于 JVM 平台)

注意, 除 JSON 序列化(`kotlinx-serialization-core`)之外, 其他所有库都处于实验状态, 也就是说, 它们的 API 可能会发生变化, 不另行通知.

此外还有社区维护的库, 支持更多序列化格式, 比如 [YAML](https://yaml.org/) 或 [Apache Avro](https://avro.apache.org/).
关于可用的序列化格式, 详情请参见 [`kotlinx.serialization` 文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md).

## 示例: JSON 序列化

下面我们来看一看如何将 Kotlin 对象序列化为 JSON.

开始之前, 你需要配置你的构建脚本, 使你的项目能够使用 Kotlin 序列化工具:

1. 应用 Kotlin 序列化 Gradle 插件 `org.jetbrains.kotlin.plugin.serialization`
(在 Kotlin Gradle DSL 中是 `kotlin(“plugin.serialization”)`).

    <div class="multi-language-sample" data-lang="groovy">
    <div class="sample" markdown="1" theme="idea" mode='groovy'>

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '{{ site.data.releases.latest.version }}'
        id 'org.jetbrains.kotlin.plugin.serialization' version '{{ site.data.releases.latest.version }}'  
    }
    ```

    </div>
    </div>

    <div class="multi-language-sample" data-lang="kotlin">
    <div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

    ```kotlin
    plugins {
        kotlin("jvm") version "{{ site.data.releases.latest.version }}"
        kotlin("plugin.serialization") version "{{ site.data.releases.latest.version }}"
    }
    ```

    </div>
    </div>

2. 添加 JSON 序列化库的依赖项:`org.jetbrains.kotlinx:kotlinx-serialization-core:{{ site.data.releases.latest.serialization.version }}`

    <div class="multi-language-sample" data-lang="groovy">
    <div class="sample" markdown="1" theme="idea" mode='groovy'>

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:{{ site.data.releases.latest.serialization.version }}'
    }
    ```

    </div>
    </div>

    <div class="multi-language-sample" data-lang="kotlin">
    <div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:{{ site.data.releases.latest.serialization.version }}")
    }
    ```

    </div>
    </div>

现在, 可以在你的代码中使用序列化 API 了.

首先, 对一个类添加 `@Serializable` 注解, 使它可以被序列化.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Serializable
data class Data(val a: Int, val b: String)
```
</div>

然后就可以调用函数 `Json.encodeToString()`, 序列化这个类的实例.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
Json.encodeToString(Data(a = 42, b = "str"))
```
</div>

结果, 你会得到一个 JSON 格式的字符串, 其中包含这个对象的状态: `{"a": 42, "b": "str"}`

也可以通过单次函数调用, 序列化对象的集合, 比如 List.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

 ```kotlin
val dataList = listOf(Data(42, "abc"), Data(12, "test"))
val jsonList = Json.encodeToString(dataList)
 ```
</div>

要从 JSON 字符串中反序列化对象, 请使用 `decodeFromString()` 函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

 ```kotlin
val obj = Json.decodeFromString<Data>("""{"a":42, "b": "str"}""")
 ```
 </div>

关于 Kotlin 中的序列化, 更多详情请阅读 [Kotlin 序列化 指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md).
