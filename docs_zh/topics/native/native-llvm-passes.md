[//]: # (title: 自定义 LLVM 后端的技巧)
<primary-label ref="advanced"/>

Kotlin/Native 编译器使用 [LLVM](https://llvm.org/) 来针对不同的目标平台进行优化, 并生成二进制可执行文件.
编译时间中有相当一部分也耗费在 LLVM 上, 对于大型应用程序, 这可能会导致耗时长到无法接受.

你可以自定义 Kotlin/Native 使用 LLVM 的方式, 并调整优化 pass 的列表.

## 检查构建日志 {id="examine-the-build-log"}

让我们查看构建日志, 了解编译时间中有多少花费在 LLVM 优化 pass 上:

1. 使用 `-Pkotlin.internal.compiler.arguments.log.level=warning` 选项运行 `linkRelease*` Gradle task,
   让 Gradle 输出 LLVM 性能分析的详细信息, 例如:

   ```bash
   ./gradlew linkReleaseExecutableMacosArm64 -Pkotlin.internal.compiler.arguments.log.level=warning
   ```

   在执行过程中, task 会打印输出必要的编译器参数, 例如:

   ```none
   > Task :linkReleaseExecutableMacosArm64
   Run in-process tool "konanc"
   Entry point method = org.jetbrains.kotlin.cli.utilities.MainKt.daemonMain
   Classpath = [
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/kotlin-native-compiler-embeddable.jar
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/konan/lib/trove4j.jar
   ]
   Arguments = [
           -Xinclude=...
           -library
           /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib
           -no-endorsed-libs
           -nostdlib
           ...
   ]
   ```

2. 使用提供的参数加上 `-Xprofile-phases` 参数, 运行命令行编译器, 例如:

   ```bash
   /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/bin/kotlinc-native \
   -Xinclude=... \
   -library /Users/user/.konan/kotlin-native-prebuilt-macos-aarch64-2.2.0/klib/common/stdlib \
   ... \
   -Xprofile-phases
   ```

3. 查看构建日志中生成的输出. 日志可能包含数万行; 包含 LLVM 性能分析的部分在最末尾.

以下是对一个简单 Kotlin/Native 程序运行时的输出节选:

```none
Frontend: 275 msec
PsiToIr: 1186 msec
...
... 30k lines
...
LinkBitcodeDependencies: 476 msec
StackProtectorPhase: 0 msec
MandatoryBitcodeLLVMPostprocessingPhase: 2 msec
===-------------------------------------------------------------------------===
                          Pass execution timing report
===-------------------------------------------------------------------------===
  Total Execution Time: 6.7726 seconds (6.7192 wall clock)

   ---User Time---   --System Time--   --User+System--   ---Wall Time---  --- Name ---
   0.9778 ( 22.4%)   0.5043 ( 21.0%)   1.4821 ( 21.9%)   1.4628 ( 21.8%)  InstCombinePass
   0.3827 (  8.8%)   0.2497 ( 10.4%)   0.6323 (  9.3%)   0.6283 (  9.4%)  InlinerPass
   0.2815 (  6.4%)   0.1792 (  7.5%)   0.4608 (  6.8%)   0.4555 (  6.8%)  SimplifyCFGPass
...
   0.6444 (100.0%)   0.5474 (100.0%)   1.1917 (100.0%)   1.1870 (100.0%)  Total

ModuleBitcodeOptimization: 8118 msec
...
LTOBitcodeOptimization: 1399 msec
...
```

Kotlin/Native 编译器运行两个独立的 LLVM 优化序列: 模块 pass 和链接时(link-time) pass.
对于一次典型的编译, 这两个管道(pipeline)依次运行, 唯一真正的区别在于它们运行的 LLVM 优化 pass 不同.

在上面的日志中, 两个 LLVM 优化是 `ModuleBitcodeOptimization` 和 `LTOBitcodeOptimization`.
格式化的表格是优化的输出, 包含每个 pass 耗费的时间.

## 自定义 LLVM 优化 pass {id="customize-llvm-optimization-passes"}

如果上述某个 pass 耗费的时间看起来过长, 你可以跳过它.
但是, 这可能会损害运行时性能, 因此你应该在之后检查性能基准测试的变化.

目前, 没有直接的方法来 [禁用特定的 pass](https://youtrack.jetbrains.com/issue/KT-69212).
但是, 你可以使用以下编译器选项, 来提供一个新的 pass 列表来运行:

| **选项**                 | **Release 二进制文件的默认值**             |
|------------------------|-----------------------------------|
| `-Xllvm-module-passes` | `"default<O3>"`                   |
| `-Xllvm-lto-passes`    | `"internalize,globaldce,lto<O3>"` |

默认值会展开为一个很长的实际 pass 列表, 你需要从中排除不需要的 pass.

要获取实际的 pass 列表, 请运行 [`opt`](https://llvm.org/docs/CommandGuide/opt.html) 工具,
它会随 LLVM 发行版自动下载到
`~/.konan/dependencies/llvm-{VERSION}-{ARCH}-{OS}-dev-{BUILD}/bin` 目录.

例如, 要获取链接时 pass 的列表, 请运行:

```bash
opt -print-pipeline-passes -passes="internalize,globaldce,lto<O3>" < /dev/null
```

这个命令会输出一个警告, 和一个很长的 pass 列表, 具体内容取决于 LLVM 版本.

`opt` 工具的 pass 列表与 Kotlin/Native 编译器实际运行的 pass 之间有两个区别:

* 由于 `opt` 是调试工具, 它包含一个或多个 `verify` pass, 而这些 pass 通常不会运行.
* Kotlin/Native 禁用了 `devirt` pass, 因为 Kotlin 编译器自己已经执行了这些操作.

禁用任何 pass 之后, 一定要重新运行性能测试, 检查运行时性能的降低是否在可接受的范围内.
