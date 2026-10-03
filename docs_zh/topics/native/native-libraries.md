[//]: # (title: Kotlin/Native 库)

## 库的编译 {id="library-compilation"}

你可以使用你的项目的构建文件, 或 Kotlin/Native 编译器, 来为你的库产生 `*.klib` 文件.

### 使用 Gradle 构建文件 {id="using-gradle-build-file"}

你可以在你的 Gradle 构建文件中指定一个 [Kotlin/Native 编译目标](native-target-support.md), 来编译 `*.klib` 库文件:

1. 在你的 `build.gradle(.kts)` 文件中, 声明至少 1 个 Kotlin/Native 编译目标. 例如:

   ```kotlin
   // build.gradle.kts
   plugins {
       kotlin("multiplatform") version "%kotlinVersion%"
   }
 
   kotlin {
       macosArm64()    // 用于 macOS
       // linuxArm64() // 用于 Linux
       // mingwX64()   // 用于 Windows
   }
   ```

2. 运行 `<target>Klib` task. 例如:

   ```bash
   ./gradlew macosArm64Klib
   ```

Gradle 会自动对这个编译目标编译源代码文件, 并在项目的 `build/libs` 目录中生成 `.klib` 文件.

### 使用 Kotlin/Native 编译器 {id="using-kotlin-native-compiler"}

要通过 Kotlin/Native 编译器编译产生库文件, 请执行以下步骤:

1. [下载并安装 Kotlin/Native 编译器](native-get-started.md#download-and-install-the-compiler).
2. 要将一个 Kotlin/Native 源代码文件编译为一个库, 请使用 `-produce library` 或 `-p library` 选项:

   ```bash
   kotlinc-native foo.kt -p library -o bar
   ```

   这个命令将 `foo.kt` 文件的内容编译为名为 `bar` 的库, 产生 `bar.klib` 文件.

3. 要将另一个文件链接到一个库, 请使用 `-library <name>` 或 `-l <name>` 选项. 例如:

   ```bash
   kotlinc-native qux.kt -l bar
   ```

   这个命令编译 `qux.kt` 源代码文件和 `bar.klib` 库的内容, 产生最终的可执行文件 `program.kexe`.

## klib 工具 {id="klib-utility"}

**klib** 库管理工具可以用来查看库, 使用以下语法:

```bash
klib <command> <library path> [<option>]
```

目前可用的命令如下:

| 命令                            | 描述                                                                                                                                                     |
|-------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------|
| `info`                        | 库的一般信息.                                                                                                                                                |
| `dump-abi`                    | 导出 ABI 快照库. 快照中的每 1 行对应 1 个声明. 如果某个声明发生 ABI 不兼容的变化, 这个变化会出现在快照对应的行中.                                                                                   |
| `dump-ir`                     | 导出库声明的中间表达形式(Intermediate Representation, IR). 请只在调试中使用.                                                                                               |
| `dump-ir-signatures`          | 对库的所有非 private 声明, 以及这个库使用的所有非 private 声明, 导出 IR 签名(输出为 2 个单独的文件). 这个命令完全依赖于 IR 中的数据.                                                                  |
| `dump-ir-inlinable-functions` | 导出库中可内联的函数的 IR. 请只在调试中使用.                                                                                                                              |
| `dump-metadata`               | 导出所有库声明的元数据. 请只在调试中使用.                                                                                                                                 |
| `dump-metadata-signatures`    | 根据库的元数据, 导出所有非 private 库声明的 IR 签名. 大多数情况下, 输出与 `dump-ir-signatures` 命令(它根据 IR 生成签名) 相同. 但是, 如果在编译期间使用了 IR 变换编译器 plugin (例如 Compose), 修改后的声明可能会具有不同的签名. |

上面所有的导出(dump)命令都接受一个额外的 `-signature-version {N}` 参数, 告诉 klib 工具在导出签名时使用哪个 IR 签名版本.
如果没有指定这个参数, 它会使用库支持的最新版本. 例如:

```bash
klib dump-metadata-signatures mylib.klib -signature-version 1
```

此外, the `dump-metadata` 命令可以使用 `-print-signatures {true|false}` 参数,
告诉 klib 工具为每个声明打印 IR 签名.

## 创建和使用一个库 {id="creating-and-using-a-library"}

1. 创建一个库, 首先将源代码放在 `kotlinizer.kt` 文件内:

   ```kotlin
   package kotlinizer

   val String.kotlinized
       get() = "Kotlin $this"
   ```

2. 将库编译为一个 `.klib` 文件:

   ```bash
   kotlinc-native kotlinizer.kt -p library -o kotlinizer
   ```

3. 在当前目录中查看创建的库:

   ```bash
   ls kotlinizer.klib
   ```

4. 查看库的一般信息:

   ```bash
   klib info kotlinizer.klib
   ```

5. 在 `use.kt` 文件中编写一段小程序:

   ```kotlin
   import kotlinizer.*

   fun main(args: Array<String>) {
       println("Hello, ${"world".kotlinized}!")
   }
   ```

6. 编译这个程序, 将 `use.kt` 源代码文件链接到你的库:

   ```bash
   kotlinc-native use.kt -l kotlinizer -o kohello
   ```

7. 运行程序:

   ```bash
   ./kohello.kexe
   ```

你会在输出中看到 `Hello, Kotlin world!`.

## 库的查找顺序 {id="library-search-sequence"}

> 库的搜索机制很快会发生变更. 请注意本节的更新, 不要依赖于已废弃的选项.
>
{style="note"}

当我们指定 `-library foo` 选项时, 编译器会按照以下顺序查找 `foo` 库:

1. 当前编译目录, 或一个绝对路径.
2. 默认仓库中安装的所有库.

   > 默认仓库是 `~/.konan`. 你可以设置 Gradle 属性 `konan.data.dir` 来修改这个值.
   >
   > 或者, 也可以使用 `-Xkonan-data-dir` 编译器选项, 通过 `cinterop` 和  `konanc` 工具来配置你的的自定义目录路径.
   >
   {style="note"}

3. `$installation/klib` 目录中安装的所有库.

## 库文件的格式 {id="library-format"}

Kotlin/Native 库是 zip 文件, 包含预定义的目录结构, 如下:

`foo.klib` 解压缩到 `foo/` 目录后会得到以下内容:

```text
- foo/
  - $component_name/
    - ir/
      - 序列化后的 Kotlin IR.
    - targets/
      - $platform/
        - kotlin/
          - Kotlin 编译产生的 LLVM bitcode 文件.
        - native/
          - 其他原生对象的 bitcode 文件.
      - $another_platform/
        - 可能存在几组平台相关的目录, 其中都包含 kotlin 和 native 目录.
    - linkdata/
      - 一组 ProtoBuf 文件, 包含序列化链接元数据(serialized linkage metadata).
    - resources/
      - 一般资源文件, 比如图像文件. (暂时没有使用).
    - manifest - 库的描述文件, 使用 java property 格式.
```

在你的 Kotlin/Native 编译器安装的 `klib/common/stdlib` 目录中, 可以找到库文件结构的例子.

## 在 klib 中使用相对路径 {id="using-relative-paths-in-klibs"}

源代码文件的序列化后的 IR 表达是一个 `klib` 库的[一部分](#library-format).
其中包含文件路径, 用于生成正确的调试信息.
默认情况下, 存储的路径是绝对路径.

使用编译器选项 `-Xklib-relative-path-base` , 你可以修改库的格式, 在 artifact 中只使用相对路径.
要让这个功能有效, 需要向编译器选项的参数传递一个或多个源代码文件基准路径:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named<KotlinCompilationTask<*>>("compileKotlin").configure {
    // $base 是源代码文件的基准路径
    compilerOptions.freeCompilerArgs.add("-Xklib-relative-path-base=$base")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.kotlin.gradle.tasks.KotlinCompilationTask
// ...

tasks.named('compileKotlin', KotlinCompilationTask) {
    compilerOptions {
        // $base 是源代码文件的基准路径
        freeCompilerArgs.add("-Xklib-relative-path-base=$base")
    }
}
```

</tab>
</tabs>

## 下一步做什么? {id="what-s-next"}

[学习如何使用 cinterop 工具来产生 `*.klib` 文件](native-definition-file.md)
