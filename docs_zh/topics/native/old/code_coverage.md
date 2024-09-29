[//]: # (title: 代码覆盖率(Code Coverage))

最终更新: %latestDocDate%
---



# 代码覆盖率(Code Coverage)
Kotlin/Native 有一个代码覆盖率统计工具, 它是基于 Clang 的 [Source-based Code Coverage](https://clang.llvm.org/docs/SourceBasedCodeCoverage.html) 开发的.

**注意**:
1. 代码覆盖率统计工具还处于非常早期的阶段, 并在活跃开发中. 目前已知的问题和限制包括:
    * 代码覆盖率统计结果可能不准确.
    * 单行的执行次数统计结果可能不准确.
    * 只支持 macOS 和 iOS 模拟器二进制文件.

2. 本章介绍的大部分功能将来会被合并到 Gradle plugin 中.

### 使用方法

#### TL;DR
```bash
kotlinc-native main.kt -Xcoverage
./program.kexe
llvm-profdata merge program.kexe.profraw -o program.profdata
llvm-cov report program.kexe -instr-profile program.profdata
```

#### 编译时打开代码覆盖率选项

有 2 个编译器选项, 可以生成代码覆盖率信息:
* `-Xcoverage`. 对当前项目源代码生成代码覆盖率信息.
* `-Xlibrary-to-cover=<path>`. 对指定的 `klib` 库生成代码覆盖率信息.
注意, 这个库本身链接时也需要使用 `-library/-l` 参数, 或者需要是一个传递性的依赖项.

#### 运行带代码覆盖率信息的可执行文件

编译产生的二进制文件(比如. `program.kexe`)运行之后, 会生成 `program.kexe.profraw` 文件.
默认情况下这个文件会产生在二进制文件相同的路径下. 有两种方法可以改变这个文件的输出路径:
 * `-Xcoverage-file=<path>` 编译选项.
 * `LLVM_PROFILE_FILE` 环境变量. 因此, 如果你使用这样的方法运行你的程序:
```
LLVM_PROFILE_FILE=build/program.profraw ./program.kexe
```
代码覆盖率信息将被存储到 `build` 目录的 `program.profraw` 文件内.

#### 解析 `*.profraw` 文件

生成的代码覆盖率信息文件可以使用 `llvm-profdata` 工具程序来解析. 基本用法是:
```
llvm-profdata merge default.profraw -o program.profdata
```  
更多命令行选项请参见 [目录行指南](http://llvm.org/docs/CommandGuide/llvm-profdata.html).

#### 创建报告

最后一步是使用 `program.profdata` 文件创建报告.
可以使用 `llvm-cov` 工具程序来完成 (具体用法请参见 [目录行指南](http://llvm.org/docs/CommandGuide/llvm-cov.html)).
比如, 我们可以通过以下命令来查看基本报告:
```
llvm-cov report program.kexe -instr-profile program.profdata
```
也可以使用以下命令来生成 html 格式的, 各代码行的覆盖率报告:
```
llvm-cov show program.kexe -instr-profile program.profdata  -format=html > report.html
```

### 示例
通常, 会在运行测试程序的过程中收集代码覆盖率信息.
具体做法请参见 [`samples/coverage`](https://github.com/JetBrains/kotlin-native/tree/b22404c947c6f728cf7406d6725b475e77b2c84c/samples/coverage).


### 相关资料
* [LLVM 代码覆盖率映射格式](https://llvm.org/docs/CoverageMappingFormat.html)
