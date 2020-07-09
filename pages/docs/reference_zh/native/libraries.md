---
type: doc
layout: reference
category: "Native"
title: "Kotlin 库"
---


# Kotlin/Native 库

## Kotlin 编译器使用方法

要通过 Kotlin/Native 编译器编译产生库文件, 请使用 `-produce library` 或 `-p library` 参数.
例如:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ kotlinc foo.kt -p library -o bar
```

</div>

上例的命令会编译源代码文件 `foo.kt`, 输出为库文件 `bar.klib`.

要链接一个库, 请使用 `-library <name>` 或 `-l <name>` 参数.
例如:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ kotlinc qux.kt -l bar
```

</div>


上例的命令会编译源代码文件 `qux.kt`, 与库文件 `bar.klib` 链接, 输出为 `program.kexe`.


## cinterop 工具使用方法

**cinterop** 工具会对原生的库文件生成 `.klib` 格式的包装.
比如, 可以使用 Kotlin/Native 发布中附带的简单的 `libgit2.def` 原生库定义文件

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ cinterop -def samples/gitchurn/src/nativeInterop/cinterop/libgit2.def -compiler-option -I/usr/local/include -o libgit2
```

</div>

我们可以得到 `libgit2.klib` 文件.

详情请参见 [与 C 代码交互](c_interop.html)


## klib 工具

**klib** 库管理工具可以用来查看和安装库.

可用的命令如下.

列出库的内容:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ klib contents <name>
```

</div>

查看库的内容细节:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ klib info <name>
```

</div>

要把库安装到默认的位置, 可以使用:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ klib install <name>
```

</div>

从默认的仓库中删除一个库, 可以使用:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ klib remove <name>
```

</div>

以上所有命令都可以接受一个 `-repository <directory>` 参数, 用来指定默认值以外的仓库位置.

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ klib <command> <name> -repository <directory>
```

</div>


## 几个例子

首先我们来创建一个库.
把我们这个小小的库的源代码放在 `kotlinizer.kt` 文件内:

<div class="sample" markdown="1" theme="idea" mode="shell">

```kotlin
package kotlinizer
val String.kotlinized
    get() = "Kotlin $this"
```

```bash
$ kotlinc kotlinizer.kt -p library -o kotlinizer
```

</div>

库会被创建到当前目录下:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ ls kotlinizer.klib
kotlinizer.klib
```

</div>

现在我们来看看库的内容:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ klib contents kotlinizer
```

</div>

我们可以将 `kotlinizer` 库安装到默认的仓库中:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ klib install kotlinizer
```

</div>

然后在当前目录中删除它的一切痕迹:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ rm kotlinizer.klib
```

</div>

编写一个很短的程序, 放在 `use.kt` 文件中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
import kotlinizer.*

fun main(args: Array<String>) {
    println("Hello, ${"world".kotlinized}!")
}
```

</div>

然后编译这个程序, 并链接我们刚才创建的库:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ kotlinc use.kt -l kotlinizer -o kohello
```

</div>

然后运行这个程序:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
$ ./kohello.kexe
Hello, Kotlin world!
```

</div>

祝你玩得开心!

# 高级问题

## 库的查找顺序

当我们指定 `-library foo` 参数时, 编译器会按照以下顺序查找 `foo` 库:

  * 当前编译目录, 或一个绝对路径.

  * 通过 `-repo` 参数指定的所有仓库.

  * 默认仓库中安装的所有库(默认仓库现在是 `~/.konan` 目录, 但可以设置 **KONAN_DATA_DIR** 环境变量来修改这个路径).

  * `$installation/klib` 目录中安装的所有库.

## 库文件的格式

Kotlin/Native 库是 zip 文件, 包含预定义的目录结构, 如下:

**foo.klib** 解压缩到 **foo/** 后会得到以下内容:

```yaml
  - foo/
    - $component_name/
      - ir/
        - Seriaized Kotlin IR.
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
      - manifest - 库的描述文件, 使用 *java property* 格式.
```

在你的 Kotlin/Native 环境的 `klib/stdlib` 目录下可以找到这些库文件结构的例子.
