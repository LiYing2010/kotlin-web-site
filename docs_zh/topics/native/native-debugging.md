[//]: # (title: 调试 Kotlin/Native 代码)

Kotlin/Native 编译器能够生成带调试信息的二进制文件, 还能够创建调试符号文件, 用于 [崩溃报告符号化](#debug-ios-applications).

调试信息兼容于 [DWARF 2](https://dwarfstd.org/download.html) 规范, 因此 LLDB 和 GDB 等现代调试工具可以执行:

* [设置断点](#set-breakpoints)
* [单步调试](#use-stepping)
* [查看变量和类型信息](#inspect-variables)

> 支持 DWARF 2 规范就意味着调试工具会把 Kotlin 程序识别为 C89,
> 因为在 DWARF 5 规范之前, 规范中还没有标识符可以标识语言类型是 Kotlin.
>
{style="note"}

## 生成带调试信息的二进制文件 {id="generate-binaries-with-debug-information"}

在 IntelliJ IDEA, Android Studio 或 Xcode 中进行调试时, 会自动生成带调试信息的二进制文件
(除非构建使用了不同的配置).

你也可以手动启用调试, 生成包含调试信息的二进制文件, 方法如下:

* **使用 Gradle task**. 要得到调试二进制文件, 请使用 `linkDebug*` Gradle task, 例如:

  ```bash
  ./gradlew linkDebugFrameworkNative
  ```

  task 的名称取决于因二进制文件类型 (例如 `linkDebugSharedNative`) 或编译目标 (例如 `linkDebugExecutableMacosArm64`).

* **使用命令行编译器**. 在命令行中, 使用 `-g` 选项编译你的 Kotlin/Native 二进制文件:

  ```bash
  kotlinc-native hello.kt -g -o terminator
  ```

然后启动你的调试工具. 例如:

```bash
lldb terminator.kexe
```

调试器输出如下:

```bash
$ cat - > hello.kt
fun main(args: Array<String>) {
  println("Hello world")
  println("I need your clothes, your boots and your motorcycle")
}
$ dist/bin/konanc -g hello.kt -o terminator
KtFile: hello.kt
$ lldb terminator.kexe
(lldb) target create "terminator.kexe"
Current executable set to 'terminator.kexe' (x86_64).
(lldb) b kfun:main(kotlin.Array<kotlin.String>)
Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
(lldb) r
Process 28473 launched: '/Users/minamoto/ws/.git-trees/debugger-fixes/terminator.kexe' (x86_64)
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x00000001000012e4 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:2
   1    fun main(args: Array<String>) {
-> 2      println("Hello world")
   3      println("I need your clothes, your boots and your motorcycle")
   4    }
(lldb) n
Hello world
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = step over
    frame #0: 0x00000001000012f0 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:3
   1    fun main(args: Array<String>) {
   2      println("Hello world")
-> 3      println("I need your clothes, your boots and your motorcycle")
   4    }
(lldb)
```

## 设置断点 {id="set-breakpoints"}

现代调试器提供了多种方法可以设置断点. 各种调试工具的具体方法请看下文:

### LLDB {id="lldb"}

* 通过名称设置断点:

  ```bash
  (lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
  Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
  ```

  `-n` 参数是可选的, 默认会启用.

* 通过位置 (文件名, 行号) 设置断点:

  ```bash
  (lldb) b -f hello.kt -l 1
  Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
  ```

* 通过地址设置断点:

  ```bash
  (lldb) b -a 0x00000001000012e4
  Breakpoint 2: address = 0x00000001000012e4
  ```

* 通过正规表达式设置断点. 调试生成的 artifact 时, 你可能会发现这个功能很有用,
  比如 Lambda 表达式 (名称中包含 `#` 符号):

  ```bash
  (lldb) b -r main\(
  3: regex = 'main\(', locations = 1
    3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
  ```

### GDB {id="gdb"}

* 通过正规表达式设置断点:

  ```bash
  (gdb) rbreak main(
  Breakpoint 1 at 0x1000109b4
  struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
  ```

* _不能_ 通过名称设置断点, 因为 `:` 是通过位置设置断点命令的分隔符:

  ```bash
  (gdb) b kfun:main(kotlin.Array<kotlin.String>)
  No source file named kfun.
  Make breakpoint pending on future shared library load? (y or [n]) y
  Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
  ```

* 通过位置设置断点:

  ```bash
  (gdb) b hello.kt:1
  Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
  ```

* 通过地址设置断点:

  ```bash
  (gdb) b *0x100001704
  Note: breakpoint 2 also set at pc 0x100001704.
  Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
  ```

## 单步调试 {id="use-stepping"}

单步调试功能与 C/C++ 程序基本相同.

## 查看变量 {id="inspect-variables"}

对于 `var` 变量的查看功能, 对于基本类型和非基本类型都是直接可用的:

```bash
$ cat -n main.kt
     1  fun main(args: Array<String>) {
     2      var x = 1
     3      var y = 2
     4      var p = Point(x, y)
     5      println("p = $p")
     6  }
     7 
     8  data class Point(val x: Int, val y: Int)

$ lldb ./program.kexe -o 'b main.kt:5' -o
(lldb) target create "./program.kexe"
Current executable set to './program.kexe' (x86_64).
(lldb) b main.kt:5
Breakpoint 1: where = program.kexe`kfun:main(kotlin.Array<kotlin.String>) + 289 at main.kt:5
(lldb) r
Process 4985 stopped
* thread #1, name = 'program.kexe', stop reason = breakpoint 1.1
    frame #0: program.kexe`kfun:main(kotlin.Array<kotlin.String>) at main.kt:5
   2        var x = 1
   3        var y = 2
   4        var p = Point(x, y)
-> 5        println("p = $p")
   6    }
   7   
   8    data class Point(val x: Int, val y: Int)

Process 4985 launched: './program.kexe' (x86_64)
(lldb) fr var
(int) x = 1
(int) y = 2
(ObjHeader *) p = Point(x=1, y=2)

(lldb) v p->x
(int32_t) p->x = 1
```

## 调试 iOS 应用程序 {id="debug-ios-applications"}

调试 iOS 应用程序有时需要详细分析崩溃报告.
崩溃报告通常需要进行符号化(symbolication), 也就是将内存地址转换为可读的源代码位置.

要对 Kotlin 代码中的地址进行符号化 (例如, 对应于 Kotlin 代码的调用栈元素),
你需要一个特殊的调试符号 (`.dSYM`) 文件.
这个文件将崩溃报告中的内存地址映射到源代码中的实际位置, 例如函数或行号.

Kotlin/Native 编译器会在 Apple 平台上为 Release (优化过的) 二进制文件默认生成 `.dSYM` 文件.
在 Xcode 中构建时, IDE 会在标准位置查找 `.dSYM` 文件, 并自动将其用于符号化.
Xcode 会自动检测从 IntelliJ IDEA 模板创建的项目中的 `.dSYM` 文件.

在其他平台上, 你可以使用 `-Xadd-light-debug` 编译器选项将调试信息添加到生成的二进制文件中
(这样会增加二进制文件的大小):

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
kotlin {
    targets.withType<org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget> {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=enable"
        }
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
kotlin {
    targets.withType(org.jetbrains.kotlin.gradle.plugin.mpp.KotlinNativeTarget) {
        binaries.all {
            freeCompilerArgs += "-Xadd-light-debug=enable"
        }
    }
}
```

</tab>
</tabs>

关于崩溃报告, 详情请参见 [Apple 文档](https://developer.apple.com/documentation/xcode/diagnosing-issues-using-crash-reports-and-device-logs).

## 已知的问题 {id="known-issues"}

* Python 绑定的性能问题.
* 调试工具中不支持表达式求值, 目前也没有计划实现这个功能.
