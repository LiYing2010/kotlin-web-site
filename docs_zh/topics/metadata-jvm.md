[//]: # (title: Kotlin Metadata JVM 库)

<primary-label ref="advanced"/>

[`kotlin-metadata-jvm`](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm) 库 提供了很多工具, 用于对 JVM 编译上的 Kotlin 类, 读取, 修改, 以及生成 metadata.
这些 metadata, 保存在 `.class` 文件内的 [`@Metadata`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/-metadata/) 注解中,
由 [`kotlin-reflect`](reflection.md) 等等库和工具使用, 用于在运行期检查 Kotlin 专有的结构, 例如属性, 函数, 以及类.

> `kotlin-reflect` 库依赖 metadata, 以便在运行期获取 Kotlin 专有的类详细信息.
> metadata 与实际的 `.class` 文件之间的任何不一致, 都可能导致在使用反射时出现不正确的行为.
> 
{style="warning"}

你也可以使用 Kotlin Metadata JVM 库, 检查各种声明属性, 例如可见度或模态(modality), 或者生成 metadata, 并将它嵌入到 `.class` 文件中.

## 向你的项目添加这个库 {id="add-the-library-to-your-project"}

要在你的项目中包含 Kotlin Metadata JVM 库, 请根据你的构建工具, 添加对应的依赖项配置.

> Kotlin Metadata JVM 库遵循与 Kotlin 编译器和标准库相同的版本.
> 请确认你使用的版本与你的项目的 Kotlin 版本相同.
> 
{style="note"}

### Gradle {id="gradle"}

向你的 `build.gradle(.kts)` 文件添加以下依赖项:

<tabs group="build-tool">
<tab title="Kotlin" group-key="kotlin">

```kotlin
// build.gradle.kts
repositories {
    mavenCentral()
}

dependencies {
    implementation("org.jetbrains.kotlin:kotlin-metadata-jvm:%kotlinVersion%")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
// build.gradle
repositories {
    mavenCentral()
}

dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-metadata-jvm:%kotlinVersion%'
}
```
</tab>
</tabs>

### Maven {id="maven"}

向你的 `pom.xml` 文件文件添加以下依赖项.

```xml
<project>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-metadata-jvm</artifactId>
            <version>%kotlinVersion%</version>
        </dependency>
    </dependencies>
    ...
</project>
```


## 读取并解析 metadata {id="read-and-parse-metadata"}

`kotlin-metadata-jvm` 库从编译后的 Kotlin `.class` 文件提取结构化信息, 例如类名称, 可见度, 以及签名.
你可以在需要分析编译后的 Kotlin 声明的项目中使用它.
例如, [二进制兼容性验证器(Binary Compatibility Validator, BCV)](https://github.com/Kotlin/binary-compatibility-validator) 依赖 `kotlin-metadata-jvm` 来打印 public API 声明.

你可以从使用反射从编译后的类获取 `@Metadata` 注解开始探索 Kotlin 类的 metadata:

```kotlin
fun main() {
    // 指定类的完全限定名称
    val clazz = Class.forName("org.example.SampleClass")

    // 获取 @Metadata 注解
    val metadata = clazz.getAnnotation(Metadata::class.java)

    // 检查 metadata 是否存在
    if (metadata != null) {
        println("This is a Kotlin class with metadata.")
    } else {
        println("This is not a Kotlin class.")
    }
}
```

获取 `@Metadata` 注解之后, 请使用 [`KotlinClassMetadata`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/) API
的
[`readLenient()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-lenient.html)
或 [`readStrict()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/read-strict.html) 函数来解析它.
这些函数提取类或文件的详细信息, 同时满足不同的兼容性要求:

* `readLenient()`:
  使用这个函数读取 metadata, 包括由比较新的 Kotlin 编译器版本生成的 metadata.
  这个函数不支持修改或写入 metadata.
* `readStrict()`:
  当你需要修改和写入 metadata 时, 请使用这个函数.
  `readStrict()` 函数只支持由你的项目完全支持的 Kotlin 编译器版本生成的 metadata.

    > `readStrict()` 函数支持的 metadata 格式最高是 [`JvmMetadataVersion.LATEST_STABLE_SUPPORTED`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-jvm-metadata-version/-companion/-l-a-t-e-s-t_-s-t-a-b-l-e_-s-u-p-p-o-r-t-e-d.html) 之后的一个版本,
    > 这个版本对应于项目中使用的最新 Kotlin 版本.
    > 例如, 如果你的项目依赖于 `kotlin-metadata-jvm:2.1.0`, `readStrict()` 最高能够处理 Kotlin `2.2.x` 的 metadata;
    > 否则, 它会抛出错误, 以防错误处理未知的格式.
    > 
    > 详情请参见 [Kotlin Metadata 的 GitHub 代码仓库](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#detailed-explanation). 
    >
    {style="note"}

在解析 metadata 时, `KotlinClassMetadata` 实例会提供关于类或文件级声明的结构化信息.
对于类, 请使用 [`kmClass`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-class/km-class.html) 属性来分析详细的类级 metadata, 例如类名称, 函数, 属性, 以及特性, 例如可见度.
对于文件级声明, metadata 由 `kmPackage` 属性表示, 其中包含由 Kotlin 编译器生成的文件 facade 中的定层函数和属性.

下面的代码示例演示如何使用 `readLenient()` 来解析 metadata, 使用 `kmClass` 分析类级详细信息, 以及使用 `kmPackage` 获取文件级声明:

```kotlin
// 导入需要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定类的完全限定名称
    val className = "org.example.SampleClass"

    try {
        // 获取指定名称的类对象
        val clazz = Class.forName(className)

        // 获取 @Metadata 注解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // 使用 readLenient() 函数解析 metadata
            val metadata = KotlinClassMetadata.readLenient(metadataAnnotation)
            when (metadata) {
                is KotlinClassMetadata.Class -> {
                    val kmClass = metadata.kmClass
                    println("Class name: ${kmClass.name}")

                    // 遍历所有函数, 检查可见度
                    kmClass.functions.forEach { function ->
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                is KotlinClassMetadata.FileFacade -> {
                    val kmPackage = metadata.kmPackage

                    // 遍历所有函数, 检查可见度
                    kmPackage.functions.forEach { function ->
                        val visibility = function.visibility
                        println("Function: ${function.name}, Visibility: $visibility")
                    }
                }
                else -> {
                    println("Unsupported metadata type: $metadata")
                }
            }
        } else {
            println("No Kotlin Metadata found for class: $className")
        }
    } catch (e: ClassNotFoundException) {
        println("Class not found: $className")
    } catch (e: Exception) {
        println("Error processing metadata: ${e.message}")
        e.printStackTrace()
    }
}
```

### 在 metadata 中写入和读取注解 {id="write-and-read-annotations-in-metadata"}
<primary-label ref="experimental-general"/>

你可以在 Kotlin metadata 中存储注解, 并使用 `kotlin-metadata-jvm` 库访问它们.
这样就不再需要通过签名来匹配注解, 使对重载的声明的访问更加可靠.

要让注解在你的编译后的文件的 metadata 中可以使用, 请添加以下编译器选项:

```kotlin
-Xannotations-in-metadata
```

或者, 添加到你的 Gradle 构建文件的 `compilerOptions {}` 代码段:

```kotlin
// build.gradle.kts
kotlin {
    compilerOptions {
        freeCompilerArgs.add("-Xannotations-in-metadata")
    }
}
```

当你启用这个选项时, Kotlin 编译器会将注解与 JVM 字节码一起写入 metadata,
使 `kotlin-metadata-jvm` 库能够访问它们.

这个库提供了以下 API 来访问注解:

* `KmClass.annotations`
* `KmFunction.annotations`
* `KmProperty.annotations`
* `KmConstructor.annotations`
* `KmPropertyAccessorAttributes.annotations`
* `KmValueParameter.annotations`
* `KmFunction.extensionReceiverAnnotations`
* `KmProperty.extensionReceiverAnnotations`
* `KmProperty.backingFieldAnnotations`
* `KmProperty.delegateFieldAnnotations`
* `KmEnumEntry.annotations`

这些 API 是 [实验性功能](components-stability.md#stability-levels-explained).
要选择使用者同意(Opt-in), 请使用 `@OptIn(ExperimentalAnnotationsInMetadata::class)` 注解.

下面是一个从 Kotlin metadata 读取注解的示例:

```kotlin
@file:OptIn(ExperimentalAnnotationsInMetadata::class)

import kotlin.metadata.ExperimentalAnnotationsInMetadata
import kotlin.metadata.jvm.KotlinClassMetadata

annotation class Label(val value: String)

@Label("Message class")
class Message

fun main() {
    val metadata = Message::class.java.getAnnotation(Metadata::class.java)
    val kmClass = (KotlinClassMetadata.readStrict(metadata) as KotlinClassMetadata.Class).kmClass
    println(kmClass.annotations)
    // 输出结果为: [@Label(value = StringValue("Message class"))]
}
```

> 如果在你的项目中使用 `kotlin-metadata-jvm` 库, 我们推荐更新并测试你的代码, 以支持注解.
> 否则, 如果在未来的 Kotlin 版本中, metadata 中的注解变为 [默认启用](https://youtrack.jetbrains.com/issue/KT-75736),
> 你的项目可能会生成不正确的或不完整的 metadata.
>
> 如果你遇到任何问题, 请报告到我们的 [问题追踪系统](https://youtrack.jetbrains.com/issue/KT-31857).
>
{style="warning"}

### 从字节码提取 metadata  {id="extract-metadata-from-bytecode"}

你可以使用反射获取 metadata, 另一种方式是使用字节码操作框架, 例如 [ASM](https://asm.ow2.io/), 从字节码提取 metadata.

你可以通过以下步骤实现:

1. 使用 ASM 库的 `ClassReader` 类, 读取一个 `.class` 文件的字节码.
   这个类会处理编译后的文件, 并生成一个 `ClassNode` 对象, 它代表类的结构.
2. 从 `ClassNode` 对象提取 `@Metadata`. 下面的示例使用一个自定义的扩展函数 `findAnnotation()` 来实现.
3. 使用 `KotlinClassMetadata.readLenient()` 函数, 解析提取的 metadata.
4. 使用 `kmClass` 和 `kmPackage` 属性, 检查解析后的 metadata.

示例代码如下:

```kotlin
// 导入需要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*
import org.objectweb.asm.*
import org.objectweb.asm.tree.*
import java.io.File

// 检查一个注解是否引用指定的名称
fun AnnotationNode.refersToName(name: String) =
    desc.startsWith('L') && desc.endsWith(';') && desc.regionMatches(1, name, 0, name.length)

// 通过 key 获取注解值
private fun List<Any>.annotationValue(key: String): Any? {
    for (index in (0 until size / 2)) {
        if (this[index * 2] == key) {
            return this[index * 2 + 1]
        }
    }
    return null
}

// 自定义扩展函数, 在 ClassNode 中通过注解名称查找注解
fun ClassNode.findAnnotation(annotationName: String, includeInvisible: Boolean = false): AnnotationNode? {
    val visible = visibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
    if (!includeInvisible) return visible
    return visible ?: invisibleAnnotations?.firstOrNull { it.refersToName(annotationName) }
}

// 操作符函数, 用于简化注解值的获取
operator fun AnnotationNode.get(key: String): Any? = values.annotationValue(key)

// 从一个 class node 提取 Kotlin metadata
fun ClassNode.readMetadataLenient(): KotlinClassMetadata? {
    val metadataAnnotation = findAnnotation("kotlin/Metadata", false) ?: return null
    @Suppress("UNCHECKED_CAST")
    val metadata = Metadata(
        kind = metadataAnnotation["k"] as Int?,
        metadataVersion = (metadataAnnotation["mv"] as List<Int>?)?.toIntArray(),
        data1 = (metadataAnnotation["d1"] as List<String>?)?.toTypedArray(),
        data2 = (metadataAnnotation["d2"] as List<String>?)?.toTypedArray(),
        extraString = metadataAnnotation["xs"] as String?,
        packageName = metadataAnnotation["pn"] as String?,
        extraInt = metadataAnnotation["xi"] as Int?
    )
    return KotlinClassMetadata.readLenient(metadata)
}

// 将一个文件转换为a ClassNode, 用于检查字节码
fun File.toClassNode(): ClassNode {
    val node = ClassNode()
    this.inputStream().use { ClassReader(it).accept(node, ClassReader.SKIP_CODE) }
    return node
}

fun main() {
    val classFilePath = "build/classes/kotlin/main/org/example/SampleClass.class"
    val classFile = File(classFilePath)

    // 读取字节码, 并将它处理为一个 ClassNode 对象
    val classNode = classFile.toClassNode()

    // 查找 @Metadata 注解, 并以宽松模式读取它
    val metadata = classNode.readMetadataLenient()
    if (metadata != null && metadata is KotlinClassMetadata.Class) {
        // 检查解析后的 metadata
        val kmClass = metadata.kmClass

        // 打印输出类的详细信息
        println("Class name: ${kmClass.name}")
        println("Functions:")
        kmClass.functions.forEach { function ->
            println("- ${function.name}, Visibility: ${function.visibility}")
        }
    }
}
```

## 修改 metadata {id="modify-metadata"}

在使用 [ProGuard](https://github.com/Guardsquare/proguard) 之类的工具缩减和优化字节码时, 有些声明可能会被从 `.class` 文件中删除.
ProGuard 会自动更新 metadata, 使它与修改后的字节码保持一致.

但是, 如果你在开发一个自定义工具, 以类似的方式修改 Kotlin 字节码, 你就需要确保 metadata 也进行了相应的调整.
使用 `kotlin-metadata-jvm` 库, 你可以更新声明, 调整特性, 以及删除特定的元素.

例如, 如果你使用一个 JVM tool 从 Java 类文件删除 private 方法, 你还必须从 Kotlin metadata 中删除 private 函数, 以保证一致:

1. 使用 `readStrict()` 函数解析 metadata, 将 `@Metadata` 注解载入到结构化的 `KotlinClassMetadata` 对象中.
2. 调整 metadata , 例如直接在 `kmClass` 或其他 metadata 结构中过滤函数, 或改变特性, 完成修改.
3. 使用 [`write()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/write.html) 函数, 将修改后的 metadata 编码为一个新的 `@Metadata` 注解.

下面是一段示例代码, private 函数会从类的 metadata 中删除:

```kotlin
// 导入需要的库
import kotlin.metadata.jvm.*
import kotlin.metadata.*

fun main() {
    // 指定类的完全限定名称
    val className = "org.example.SampleClass"

    try {
        // 获取指定名称的类对象
        val clazz = Class.forName(className)

        // 获取 @Metadata 注解
        val metadataAnnotation = clazz.getAnnotation(Metadata::class.java)
        if (metadataAnnotation != null) {
            println("Kotlin Metadata found for class: $className")

            // 使用 readStrict() 函数解析 metadata
            val metadata = KotlinClassMetadata.readStrict(metadataAnnotation)
            if (metadata is KotlinClassMetadata.Class) {
                val kmClass = metadata.kmClass

                // 从类的 metadata 中删除 private 函数
                kmClass.functions.removeIf { it.visibility == Visibility.PRIVATE }
                println("Removed private functions. Remaining functions: ${kmClass.functions.map { it.name }}")

                // 将修改后的 metadata 序列化回去
                val newMetadata = metadata.write()
                // 修改 metadata 之后, 你需要将它写回到类文件中
                // 你可以使用字节码操作框架来实现, 例如 ASM

                println("Modified metadata: ${newMetadata}")
            } else {
                println("The metadata is not a class.")
            }
        } else {
            println("No Kotlin Metadata found for class: $className")
        }
    } catch (e: ClassNotFoundException) {
        println("Class not found: $className")
    } catch (e: Exception) {
        println("Error processing metadata: ${e.message}")
        e.printStackTrace()
    }
}
```

> 不需要分别调用 `readStrict()` 和 `write()`, 你可以使用 [`transform()`](https://kotlinlang.org/api/kotlinx-metadata-jvm/kotlin-metadata-jvm/kotlin.metadata.jvm/-kotlin-class-metadata/-companion/transform.html) 函数.
> 这个函数解析 metadata, 通过 Lambda 表达式完成变换, 并自动将修改后的写回.
> 
{style="tip"}

## 从头开始创建 metadata {id="create-metadata-from-scratch"}

使用 Kotlin Metadata JVM 库, 为一个 Kotlin 类文件从头开始创建 metadata 的步骤如下:

1. 根据你想要生成的 metadata 类型, 创建一个 `KmClass`, `KmPackage`, 或 `KmLambda` 实例.
2. 向实例添加特性, 例如类名称, 可见度, 构造器, 以及函数签名.

    > 在设置属性时, 你可以使用 [作用域函数](scope-functions.md) `apply()`, 来减少样板代码.
    >
    {style="tip"}

3. 使用实例创建一个 `KotlinClassMetadata` 对象, 它可以生成 `@Metadata` 注解.
4. 指定 metadata 版本, 例如 `JvmMetadataVersion.LATEST_STABLE_SUPPORTED`, 并设置 flag (`0` 表示没有 flag, 或者如果需要, 可以从既有的文件复制 flag).
5. 使用 [ASM](https://asm.ow2.io/) 的 `ClassWriter` 类, 将 metadata field, 例如 `kind`, `data1` 和 `data2` 嵌入到 `.class` 文件中.

下面的示例代码演示如何为一个简单的 Kotlin 类创建 metadata:

```kotlin
// 导入需要的库
import kotlin.metadata.*
import kotlin.metadata.jvm.*
import org.objectweb.asm.*

fun main() {
    // 创建 KmClass 实例
    val klass = KmClass().apply {
        name = "Hello"
        visibility = Visibility.PUBLIC
        constructors += KmConstructor().apply {
            visibility = Visibility.PUBLIC
            signature = JvmMethodSignature("<init>", "()V")
        }
        functions += KmFunction("hello").apply {
            visibility = Visibility.PUBLIC
            returnType = KmType().apply {
                classifier = KmClassifier.Class("kotlin/String")
            }
            signature = JvmMethodSignature("hello", "()Ljava/lang/String;")
        }
    }

    // 将一个 KotlinClassMetadata.Class 实例, 包括版本和 flag, 序列化到 @kotlin.Metadata 注解中
    val annotationData = KotlinClassMetadata.Class(
        klass, JvmMetadataVersion.LATEST_STABLE_SUPPORTED, 0
    ).write()

    // 使用 ASM 生成 .class 文件
    val classBytes = ClassWriter(0).apply {
        visit(Opcodes.V1_6, Opcodes.ACC_PUBLIC, "Hello", null, "java/lang/Object", null)
        // 将 @kotlin.Metadata 实例写入到 .class 文件
        visitAnnotation("Lkotlin/Metadata;", true).apply {
            visit("mv", annotationData.metadataVersion)
            visit("k", annotationData.kind)
            visitArray("d1").apply {
                annotationData.data1.forEach { visit(null, it) }
                visitEnd()
            }
            visitArray("d2").apply {
                annotationData.data2.forEach { visit(null, it) }
                visitEnd()
            }
            visitEnd()
        }
        visitEnd()
    }.toByteArray()

    // 将生成的 .class 文件写入磁盘
    java.io.File("Hello.class").writeBytes(classBytes)

    println("Metadata and .class file created successfully.")
}
```

> 更多详细示例, 请参见 [Kotlin Metadata JVM 的 GitHub 代码仓库](https://github.com/JetBrains/kotlin/blob/50331fb1496378c82c862db04af597e4198ec645/libraries/kotlinx-metadata/jvm/test/kotlin/metadata/test/MetadataSmokeTest.kt#L43).
> 
{style="tip"}

## 下一步做什么 {id="what-s-next"}

* [查看 Kotlin Metadata JVM 库的 API 参考文档](https://kotlinlang.org/api/kotlinx-metadata-jvm/).
* [查看 Kotlin Metadata JVM 的 GitHub 代码仓库](https://github.com/JetBrains/kotlin/tree/master/libraries/kotlinx-metadata/jvm).
* [了解模块的 metadata, 以及如何使用 `.kotlin_module` 文件](https://github.com/JetBrains/kotlin/blob/master/libraries/kotlinx-metadata/jvm/ReadMe.md#module-metadata).
