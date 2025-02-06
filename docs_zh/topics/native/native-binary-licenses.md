[//]: # (title: Kotlin/Native 二进制文件的许可证)

和其它很多开源项目一样, Kotlin 依赖于第三方代码, 也就是说, Kotlin 项目包含一部分并不是由 JetBrains 或 Kotlin 编程语言贡献者们开发的代码.
有时这些代码是派生作品, 例如将 C++ 代码重写为 Kotlin.

> 你可以在我们的 GitHub 仓库中找到 Kotlin 中使用的第三方作品的许可证:
>
> * [Kotlin 编译器](https://github.com/JetBrains/kotlin/tree/master/license/third_party)
> * [Kotlin/Native](https://github.com/JetBrains/kotlin/tree/master/kotlin-native/licenses/third_party)
>
{style="note"}

具体来说, Kotlin/Native 编译器生成的二进制文件, 其中可能包含第三方代码, 数据或派生作品.
这意味着, Kotlin/Native 编译的二进制文件, 受第三方许可证的条款和条件的约束.

具体来说, 如果你分发一个 Kotlin/Native 编译的 [最终二进制文件](multiplatform-build-native-binaries.md),
你应该始终在你的二进制发行版中包含必要的许可证文件.
这些文件应该以你的发行版的使用者可以读取形式访问.

对于相应项目, 请你始终包含以下许可证文件:

<table>
   <tr>
      <th>项目</th>
      <th>需要包含的文件</th>
   </tr>
   <tr>
        <td><a href="https://kotlinlang.org/">Kotlin</a></td>
        <td rowspan="4">
         <list>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/license/LICENSE.txt">Apache license 2.0</a></li>
            <li><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/harmony_NOTICE.txt">Apache Harmony 版权声明</a></li>
         </list>
        </td>
   </tr>
   <tr>
        <td><a href="https://harmony.apache.org/">Apache Harmony</a></td>
   </tr>
   <tr>
        <td><a href="https://www.gwtproject.org/">GWT</a></td>
   </tr>
   <tr>
        <td><a href="https://guava.dev">Guava</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/ianlancetaylor/libbacktrace">libbacktrace</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/libbacktrace_LICENSE.txt">带有版权声明的 3-clause BSD license</a></td>
   </tr>
   <tr>
        <td><a href="https://github.com/microsoft/mimalloc">mimalloc</a></td>
        <td>
          <p><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mimalloc_LICENSE.txt">MIT license</a></p>
          <p>如果你使用 mimalloc 内存分配器而不是默认分配器(设置了 <code>-Xallocator=mimalloc</code> 编译器选项), 请包含这个许可证文件.</p>
        </td>
   </tr>
   <tr>
        <td><a href="https://www.unicode.org/">Unicode character database</a></td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/unicode_LICENSE.txt">Unicode license</a></td>
   </tr>
   <tr>
        <td>Multi-producer/multi-consumer bounded queue</td>
        <td><a href="https://github.com/JetBrains/kotlin/blob/master/kotlin-native/licenses/third_party/mpmc_queue_LICENSE.txt">版权声明</a></td>
   </tr>
</table>

`mingwX64` 编译目标还要求额外的许可证文件:

| 项目                                                               | 需要包含的文件                                                                                                                                                                                                                                                                                                              |
|-----------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [MinGW-w64 头文件和运行时库](https://www.mingw-w64.org/) | <list><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/COPYING.MinGW-w64-runtime/COPYING.MinGW-w64-runtime.txt">MinGW-w64 运行时许可证</a></li><li><a href="https://sourceforge.net/p/mingw-w64/mingw-w64/ci/master/tree/mingw-w64-libraries/winpthreads/COPYING">Winpthreads license</a></li></list> |

> 注意, 这些库要求你分发的 Kotlin/Native 二进制文件开源.
>
{style="note"}
