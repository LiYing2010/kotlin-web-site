[//]: # (title: 序列化)

_序列化(serialization)_ 是指将应用程序使用的数据转换为一种格式, 使它可以通过网络传输, 或保存到数据库或文件.
相应的, _反序列化(deserialization)_ 是指相反的过程, 从外部读取数据, 将它转换为运行时对象.
这两种功能结合到一起, 就是大多数应用程序与第三方交换数据时必不可少的部分.

有些序列化格式, 比如
[JSON](https://www.json.org/json-en.html)
和
[protocol buffers](https://developers.google.com/protocol-buffers)
是非常通用的.
它们独立于编程语言和运行平台, 可以用来在各种现代语言编写的系统之间交换数据.

在 Kotlin 中, 数据序列化工具是一个单独的组件,
[kotlinx.serialization](https://github.com/Kotlin/kotlinx.serialization).
其中包含几个主要部分:
`org.jetbrains.kotlin.plugin.serialization` Gradle plugin, [运行库](#libraries),
以及编译器插件.

编译器插件, `kotlinx-serialization-compiler-plugin` 和 `kotlinx-serialization-compiler-plugin-embeddable`,
直接发布到 Maven Central.
第 2 个插件用来与 `kotlin-compiler-embeddable` artifact 配合使用, 对于脚本 artifact, 它是默认选项.
Gradle 会把编译器插件添加为你的项目的编译器参数.

## 库 {id="libraries"}

`kotlinx.serialization` 提供了一组库, 用于所有支持的平台 – JVM, JavaScript, Native –
而且支持很多序列化格式 – JSON, CBOR, protocol buffers, 以及其他格式.
关于所支持的序列化格式的完整列表, 请参见[下文](#formats).

所有的 Kotlin 序列化库都属于 `org.jetbrains.kotlinx:` 组.
库名称以 `kotlinx-serialization-` 开头, 后缀对应于序列化格式.
比如:
* `org.jetbrains.kotlinx:kotlinx-serialization-json`,
  为 Kotlin 项目提供 JSON 序列化功能.
* `org.jetbrains.kotlinx:kotlinx-serialization-cbor`,
  提供 CBOR 序列化功能.

针对各编译平台的 artifact 会自动选择; 你不需要手动添加.
在 JVM, JS, Native, 和跨平台项目中, 可以使用相同的依赖项.

注意, `kotlinx.serialization` 库使用单独的版本结构, 与 Kotlin 本身的版本不同.
最新的发布版本请参见
[GitHub](https://github.com/Kotlin/kotlinx.serialization/releases)
的版本列表.

## 格式 {id="formats"}

`kotlinx.serialization` 包括针对多种序列化格式的库:

* [JSON](https://www.json.org/):
  [`kotlinx-serialization-json`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#json)
* [Protocol buffers](https://developers.google.com/protocol-buffers):
  [`kotlinx-serialization-protobuf`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#protobuf)
* [CBOR](https://cbor.io/):
  [`kotlinx-serialization-cbor`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#cbor)
* [Properties](https://en.wikipedia.org/wiki/.properties):
  [`kotlinx-serialization-properties`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#properties)
* [HOCON](https://github.com/lightbend/config/blob/master/HOCON.md):
  [`kotlinx-serialization-hocon`](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md#hocon) (只限于 JVM 平台)

注意, 除 JSON 序列化(`kotlinx-serialization-json`)之外, 其他所有库都处于[实验状态](components-stability.md),
也就是说, 它们的 API 可能会发生变化, 不另行通知.

此外还有社区维护的库, 支持更多序列化格式, 比如 [YAML](https://yaml.org/) 或 [Apache Avro](https://avro.apache.org/).
关于可用的序列化格式, 详情请参见 [`kotlinx.serialization` 文档](https://github.com/Kotlin/kotlinx.serialization/blob/master/formats/README.md).

## 示例: JSON 序列化 {id="example-json-serialization"}

下面我们来看一看如何将 Kotlin 对象序列化为 JSON.

### 添加插件和依赖项 {id="add-plugins-and-dependencies"}

开始之前, 你需要配置你的构建脚本, 使你的项目能够使用 Kotlin 序列化工具:

1. 应用 Kotlin 序列化 Gradle 插件 `org.jetbrains.kotlin.plugin.serialization`
(在 Kotlin Gradle DSL 中是 `kotlin("plugin.serialization")`).

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    plugins {
        kotlin("jvm") version "%kotlinVersion%"
        kotlin("plugin.serialization") version "%kotlinVersion%"
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    plugins {
        id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
        id 'org.jetbrains.kotlin.plugin.serialization' version '%kotlinVersion%'
    }
    ```

    </tab>
    </tabs>

2. 添加 JSON 序列化库的依赖项:
`org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%`

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    dependencies {
        implementation("org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%")
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    dependencies {
        implementation 'org.jetbrains.kotlinx:kotlinx-serialization-json:%serializationVersion%'
    }
    ```

    </tab>
    </tabs>

现在, 可以在你的代码中使用序列化 API 了.
API 所在的包是 `kotlinx.serialization`, 以及各个格式专用的子包, 比如 `kotlinx.serialization.json`.

### 序列化和反序列化 JSON {id="serialize-and-deserialize-json"}

1. 对一个类添加 `@Serializable` 注解, 使它可以被序列化.

    ```kotlin
    import kotlinx.serialization.Serializable

    @Serializable
    data class Data(val a: Int, val b: String)
    ```

2. 调用函数 `Json.encodeToString()`, 序列化这个类的实例.

    ```kotlin
    import kotlinx.serialization.Serializable
    import kotlinx.serialization.json.Json
    import kotlinx.serialization.encodeToString

    @Serializable
    data class Data(val a: Int, val b: String)

    fun main() {
      val json = Json.encodeToString(Data(42, "str"))
    }
    ```

    结果, 你会得到一个 JSON 格式的字符串, 其中包含这个对象的状态: `{"a": 42, "b": "str"}`

    > 也可以通过单次函数调用, 序列化对象的集合, 比如 List:
    >
    > ```kotlin
    > val dataList = listOf(Data(42, "str"), Data(12, "test"))
    > val jsonList = Json.encodeToString(dataList)
    > ```
    >
    {style="note"}

3. 使用 `decodeFromString()` 函数, 从 JSON 字符串中反序列化对象:

    ```kotlin
    import kotlinx.serialization.Serializable
    import kotlinx.serialization.json.Json
    import kotlinx.serialization.decodeFromString

    @Serializable
    data class Data(val a: Int, val b: String)

    fun main() {
      val obj = Json.decodeFromString<Data>("""{"a":42, "b": "str"}""")
    }
    ```

就是这样! 你已经成功的将对象序列化为 JSON 字符串, 然后将 JSON 字符串反序列化为对象.

## 下一步 {id="what-s-next"}

关于 Kotlin 中的序列化, 更多详情请阅读
[Kotlin 序列化指南](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serialization-guide.md).

你可以阅读以下资料, 学习 Kotlin 序列化的不同方面:

* [Kotlin 序列化及其核心概念](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/basic-serialization.md)
* [Kotlin 的内建可序列化类](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/builtin-classes.md)
* [序列化器的更多详情, 并学习如何创建自定义的序列化器](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/serializers.md)
* [Kotlin 如何处理多态序列化](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/polymorphism.md#open-polymorphism)
* [Kotlin 序列化如何处理 JSON 的各种功能](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/json.md#json-elements)
* [Kotlin 支持的实验性序列化格式](https://github.com/Kotlin/kotlinx.serialization/blob/master/docs/formats.md)
