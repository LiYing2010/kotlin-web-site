---
type: doc
layout: reference
category: "Native"
title: "调试"
---


## 调试

Kotlin/Native 编译器目前输出的调试信息兼容于 DWARF 2 规范,
因此现代的调试工具可以执行以下操作:
- 设置断点
- 单步执行
- 查看类型信息
- 查看变量

### 使用 Kotlin/Native 编译器输出带调试信息的二进制文件

要让 Kotlin/Native 编译器输出带调试信息的二进制文件, 只需要在命令行添加 ``-g`` 选项.<br/>
_示例:_

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
0:b-debugger-fixes:minamoto@unit-703(0)# cat - > hello.kt
fun main(args: Array<String>) {
  println("Hello world")
  println("I need your clothes, your boots and your motocycle")
}
0:b-debugger-fixes:minamoto@unit-703(0)# dist/bin/konanc -g hello.kt -o terminator
KtFile: hello.kt
0:b-debugger-fixes:minamoto@unit-703(0)# lldb terminator.kexe
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
   3      println("I need your clothes, your boots and your motocycle")
   4    }
(lldb) n
Hello world
Process 28473 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = step over
    frame #0: 0x00000001000012f0 terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) at hello.kt:3
   1    fun main(args: Array<String>) {
   2      println("Hello world")
-> 3      println("I need your clothes, your boots and your motocycle")
   4    }
(lldb)
```

</div>

### 断点
现代调试器提供了多种方法可以设置断点, 各种调试工具的具体方法请看下文:

#### lldb
- 通过名称设置断点

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
(lldb) b -n kfun:main(kotlin.Array<kotlin.String>)
Breakpoint 4: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
```

</div>

 _``-n`` 参数是可选的, 这个参数默认会启用_
- 通过位置 (文件名, 行号) 设置断点

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
(lldb) b -f hello.kt -l 1
Breakpoint 1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = 0x00000001000012e4
```

</div>

- 通过地址设置断点

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
(lldb) b -a 0x00000001000012e4
Breakpoint 2: address = 0x00000001000012e4
```

</div>

- 通过正规表达式设置断点, 调试编译器生成的代码时, 你可能会发现这个功能很有用,
  比如 Lambda 表达式, 等等. (因为它的名称中使用了 ``#`` 符号).

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
3: regex = 'main\(', locations = 1
  3.1: where = terminator.kexe`kfun:main(kotlin.Array<kotlin.String>) + 4 at hello.kt:2, address = terminator.kexe[0x00000001000012e4], unresolved, hit count = 0
```

</div>

#### gdb
- 通过正规表达式设置断点

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
(gdb) rbreak main(
Breakpoint 1 at 0x1000109b4
struct ktype:kotlin.Unit &kfun:main(kotlin.Array<kotlin.String>);
```

</div>

- __不能__ 通过名称设置断点, 因为名称中的 ``:`` 字符, 会被看作是通过位置设置断点目录命令的一个分隔符

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
(gdb) b kfun:main(kotlin.Array<kotlin.String>)
No source file named kfun.
Make breakpoint pending on future shared library load? (y or [n]) y
Breakpoint 1 (kfun:main(kotlin.Array<kotlin.String>)) pending
```

</div>

- 通过位置设置断点

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
(gdb) b hello.kt:1
Breakpoint 2 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 1.
```

</div>

- 通过地址设置断点

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
(gdb) b *0x100001704
Note: breakpoint 2 also set at pc 0x100001704.
Breakpoint 3 at 0x100001704: file /Users/minamoto/ws/.git-trees/hello.kt, line 2.
```

</div>


### 单步调试
单步调试功能的使用方法与大多数 C/C++ 程序一样.

### 查看变量

对于 var 变量的查看功能, 对于基本类型是直接可用的.
对于非基本类型, 可以使用 `konan_lldb.py` 中针对 lldb 的自定义格式化工具:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
λ cat main.kt | nl
     1  fun main(args: Array<String>) {
     2      var x = 1
     3      var y = 2
     4      var p = Point(x, y)
     5      println("p = $p")
     6  }

     7  data class Point(val x: Int, val y: Int)

λ lldb ./program.kexe -o 'b main.kt:5' -o
(lldb) target create "./program.kexe"
Current executable set to './program.kexe' (x86_64).
(lldb) b main.kt:5
Breakpoint 1: where = program.kexe`kfun:main(kotlin.Array<kotlin.String>) + 289 at main.kt:5, address = 0x000000000040af11
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
(ObjHeader *) p = 0x00000000007643d8
(lldb) command script import dist/tools/konan_lldb.py
(lldb) fr var
(int) x = 1
(int) y = 2
(ObjHeader *) p = [x: ..., y: ...]
(lldb) p p
(ObjHeader *) $2 = [x: ..., y: ...]
(lldb) script lldb.frame.FindVariable("p").GetChildMemberWithName("x").Dereference().GetValue()
'1'
(lldb)
```

</div>


把对象变量转换为易于阅读的字符串表达形式, 也可以使用内建的运行期函数 `Konan_DebugPrint` 来实现
(这个方法也适用于 gdb, 使用 command 语法中的一个模块):

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
0:b-debugger-fixes:minamoto@unit-703(0)# cat ../debugger-plugin/1.kt | nl -p
     1  fun foo(a:String, b:Int) = a + b
     2  fun one() = 1
     3  fun main(arg:Array<String>) {
     4    var a_variable = foo("(a_variable) one is ", 1)
     5    var b_variable = foo("(b_variable) two is ", 2)
     6    var c_variable = foo("(c_variable) two is ", 3)
     7    var d_variable = foo("(d_variable) two is ", 4)
     8    println(a_variable)
     9    println(b_variable)
    10    println(c_variable)
    11    println(d_variable)
    12  }
0:b-debugger-fixes:minamoto@unit-703(0)# lldb ./program.kexe -o 'b -f 1.kt -l 9' -o r
(lldb) target create "./program.kexe"
Current executable set to './program.kexe' (x86_64).
(lldb) b -f 1.kt -l 9
Breakpoint 1: where = program.kexe`kfun:main(kotlin.Array<kotlin.String>) + 463 at 1.kt:9, address = 0x0000000100000dbf
(lldb) r
(a_variable) one is 1
Process 80496 stopped
* thread #1, queue = 'com.apple.main-thread', stop reason = breakpoint 1.1
    frame #0: 0x0000000100000dbf program.kexe`kfun:main(kotlin.Array<kotlin.String>) at 1.kt:9
   6      var c_variable = foo("(c_variable) two is ", 3)
   7      var d_variable = foo("(d_variable) two is ", 4)
   8      println(a_variable)
-> 9      println(b_variable)
   10     println(c_variable)
   11     println(d_variable)
   12   }

Process 80496 launched: './program.kexe' (x86_64)
(lldb) expression -- (int32_t)Konan_DebugPrint(a_variable)
(a_variable) one is 1(int32_t) $0 = 0
(lldb)

```

</div>


### 已知的问题
- Python 绑定的性能问题.

_注意:_ 支持 DWARF 2 规范就意味着调试器会把 Kotlin 程序识别为 C89, 因为在 DWARF 5 规范之前, 还没有标识符可以标识语言类型是 Kotlin.
