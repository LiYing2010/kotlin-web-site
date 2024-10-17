[//]: # (title: Kotlin/Native 库)

## Kotlin 编译器使用方法

要通过 Kotlin/Native 编译器编译产生库文件, 请使用 `-produce library` 或 `-p library` 参数.
例如:

```bash
$ kotlinc-native foo.kt -p library -o bar
```

这个命令会编译源代码文件 `foo.kt`, 输出为库文件 `bar.klib`.

要链接一个库, 请使用 `-library <name>` 或 `-l <name>` 参数.
例如:

```bash
$ kotlinc-native qux.kt -l bar
```

这个命令会编译源代码文件 `qux.kt`, 与库文件 `bar.klib` 链接, 输出为 `program.kexe`.

## cinterop 工具使用方法

**cinterop** 工具会对原生的库文件生成 `.klib` 格式的包装.
比如, 可以使用 Kotlin/Native 发布中附带的简单的 `libgit2.def` 原生库定义文件

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

我们可以得到 `libgit2.klib` 文件.

详情请参见 [与 C 代码交互](native-c-interop.md).

## klib 工具 {id="klib-utility"}

**klib** 库管理工具可以用来查看和安装库.

可用的命令如下:

* `content` – 列出库的内容:

  ```bash
  $ klib contents <name>
  ```

* `info` – 查看库的内容细节:

  ```bash
  $ klib info <name>
  ```

* `install` – 要把库安装到默认的位置, 可以使用:

  ```bash
  $ klib install <name>
  ```

* `remove` – 从默认的仓库中删除一个库, 可以使用:

  ```bash
  $ klib remove <name>
  ```

以上所有命令都可以接受一个 `-repository <directory>` 参数, 用来指定默认值以外的仓库位置.

```bash
$ klib <command> <name> -repository <directory>
```

## 几个例子

首先我们来创建一个库.
把我们这个小小的库的源代码放在 `kotlinizer.kt` 文件内:

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc-native kotlinizer.kt -p library -o kotlinizer
```

库会被创建到当前目录下:

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

现在我们来看看库的内容:

```bash
$ klib contents kotlinizer
```

你可以将 `kotlinizer` 库安装到默认的仓库中:

```bash
$ klib install kotlinizer
```

然后在当前目录中删除它的一切痕迹:

```bash
$ rm kotlinizer.klib
```

编写一个很短的程序, 放在 `use.kt` 文件中:

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

然后编译这个程序, 并链接你刚才创建的库:

```bash
$ kotlinc-native use.kt -l kotlinizer -o kohello
```

然后运行这个程序:

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

祝你玩得开心!

## 高级问题

### 库的查找顺序 {id="library-search-sequence"}

当我们指定 `-library foo` 参数时, 编译器会按照以下顺序查找 `foo` 库:

* 当前编译目录, 或一个绝对路径.
* 通过 `-repo` 参数指定的所有仓库.
* 默认仓库中安装的所有库.

   > 默认仓库是 `~/.konan`. You can change it 你可以设置 Gradle 属性 `kotlin.data.dir` 来修改这个值.
   >
   > 或者, 也可以使用 `-Xkonan-data-dir` 编译器选项, 通过 `cinterop` 和  `konanc` 工具来配置你的的自定义目录路径.
   >
   {style="note"}

* `$installation/klib` 目录中安装的所有库.

### 库文件的格式 {id="library-format"}

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

在你的 Kotlin/Native 环境的 `klib/stdlib` 目录下可以找到这些库文件结构的例子.

### 在 klib 中使用相对路径 {id="using-relative-paths-in-klibs"}

> klib 中的相对路径功能从 Kotlin 1.6.20 开始可用.
>
{style="note"}

源代码文件的序列化后的 IR 表达是一个 `klib` 库的[一部分](#library-format).
其中包含文件路径, 用于生成正确的调试信息.
默认情况下, 存储的路径是绝对路径.
使用 `-Xklib-relative-path-base` , 你可以修改库的格式, 在 artifact 中只使用相对路径.
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
