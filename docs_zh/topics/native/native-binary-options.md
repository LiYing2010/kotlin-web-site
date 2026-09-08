[//]: # (title: Kotlin/Native 二进制文件选项)

本章列出了实用的 Kotlin/Native 二进制文件选项, 可以用来配置 Kotlin/Native [最终二进制文件](multiplatform-build-native-binaries.md),
还介绍了在项目中设置二进制文件选项的方法.

## 如何启用 {id="how-to-enable"}

你可以在 `gradle.properties` 文件或构建文件中, 启用二进制文件选项, 也可以将这些选项传递为编译器参数.

### 在 Gradle 属性文件中 {id="in-gradle-properties"}

你可以在项目的 `gradle.properties` 文件中, 使用 `kotlin.native.binary` 属性设置二进制文件选项. 例如:

```properties
kotlin.native.binary.latin1Strings=true
```

### 在构建文件中 {id="in-your-build-file"}

你可以在 `build.gradle.kts` 文件中, 为项目设置二进制文件选项:

* 使用 `binaryOption` 属性, 针对特定二进制文件进行设置. 例如:

  ```kotlin
  kotlin {
      iosArm64 {
          binaries {
              framework {
                  binaryOption("smallBinary", "true")
              }
          }
      }
  }
  ```

* 在 `freeCompilerArgs` 属性中, 通过 `-Xbinary=$option=$value` 编译器选项设置. 例如:

  ```kotlin
  kotlin {
      iosArm64 {
          compilations.configureEach {
              compilerOptions.configure {
                  freeCompilerArgs.add("-Xbinary=smallBinary=true")
              }
          }
      }
  }
  ```

### 在命令行编译器中 {id="in-the-command-line-compiler"}

你可以在执行 [Kotlin/Native 编译器](native-get-started.md#using-the-command-line-compiler) 时,
在命令行中, 以 `-Xbinary=$option=$value` 的形式, 直接传递二进制文件选项. 例如:

```bash
kotlinc-native main.kt -Xbinary=enableSafepointSignposts=true
```

## 二进制文件选项 {id="binary-options"}

> 这里列出的并不是现有选项的完整列表, 只列出了最值得关注的选项.
>
{style="note"}

<table column-width="fixed">
    <tr>
        <td width="240">选项</td>
        <td width="170">值</td>
        <td>说明</td>
        <td width="110">状态</td>
    </tr>
    <tr>
        <td><a href="native-objc-interop.md#explicit-parameter-names-in-objective-c-block-types"><code>objcExportBlockExplicitParameterNames</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false (默认值)</code></li>
            </list>
        </td>
        <td>为导出的 Objective-C 头文件中的函数类型, 添加明确的参数名称.</td>
        <td>从 2.2.20 开始, 为实验性功能</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#smaller-binary-size-for-release-binaries"><code>smallBinary</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认值)</li>
            </list>
        </td>
        <td>减小发布版本二进制文件的大小.</td>
        <td>从 2.2.20 开始, 为实验性功能</td>
    </tr>
    <tr>
        <td><a href="whatsnew2220.md#support-for-stack-canaries-in-binaries"><code>stackProtector</code></a></td>
        <td>
            <list>
                <li><code>yes</code></li>
                <li><code>strong</code></li>
                <li><code>all</code></li>
                <li><code>no</code> (默认值)</li>
            </list>
        </td>
        <td>启用栈金丝雀(Stack Canary): 对易受攻击的函数使用 <code>yes</code>, 对所有函数使用 <code>all</code>, 使用 <code>strong</code> 采用更强的启发式算法.</td>
        <td>从 2.2.20 开始可用</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#disable-allocator-paging"><code>pagedAllocator</code></a></td>
        <td>
            <list>
                <li><code>true</code> (默认值)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>控制分配(缓冲)的分页. 当值为 <code>false</code> 时, 内存分配器按对象为单位预留内存.</td>
        <td>从 2.2.0 开始, 为实验性功能</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#enable-support-for-latin-1-strings"><code>latin1Strings</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认值)</li>
            </list>
        </td>
        <td>控制对 Latin-1 编码字符串的支持, 以减小应用程序二进制文件大小, 并调整内存消耗.</td>
        <td>从 2.2.0 开始, 为实验性功能</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#track-memory-consumption-on-apple-platforms"><code>mmapTag</code></a></td>
        <td><code>UInt</code></td>
        <td>控制内存标记, 在 Apple 平台上跟踪内存消耗需要这个功能. 可用值为 <code>240</code>-<code>255</code>(默认值为 <code>246</code>); <code>0</code> 禁用内存标记.</td>
        <td>从 2.2.0 开始可用</td>
    </tr>
    <tr>
        <td><code>disableMmap</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认值)</li>
            </list>
        </td>
        <td>控制默认的内存分配器. 当值为 <code>true</code> 时, 使用 <code>malloc</code> 内存分配器, 而不是 <code>mmap</code>.</td>
        <td>从 2.2.0 开始可用</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#garbage-collector"><code>gc</code></a></td>
        <td>
            <list>
                <li><code>cms</code> (默认值)</li>
                <li><code>pmcs</code></li>
                <li><code>stwms</code></li>
                <li><a href="native-memory-manager.md#disable-garbage-collection"><code>noop</code></a></li>
            </list>
        </td>
        <td>控制垃圾收集行为:
            <list>
                <li><code>cms</code> 使用并发的标记和清除</li>
                <li><code>pmcs</code> 使用并行的标记和并发的清除</li>
                <li><code>stwms</code> 使用简单的完全停顿标记和清除</li>
                <li><code>noop</code> 禁用垃圾收集</li>
            </list>
        </td>
        <td>从 2.4.0 开始, 默认值为 <code>cms</code></td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#garbage-collector"><code>gcMarkSingleThreaded</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认值)</li>
            </list>
        </td>
        <td>禁用垃圾收集中标记阶段的并行化. 在大尺寸的堆上, 可能会增加 GC 暂停时间.</td>
        <td>从 1.7.20 开始可用</td>
    </tr>
    <tr>
        <td><a href="native-memory-manager.md#monitor-gc-performance"><code>enableSafepointSignposts</code></a></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认值)</li>
            </list>
        </td>
        <td>启用对项目中 GC 相关暂停的跟踪, 用于在 Xcode Instruments 中调试.</td>
        <td>从 2.0.20 开始可用</td>
    </tr>
    <tr>
        <td><code>preCodegenInlineThreshold</code></td>
        <td><code>UInt</code></td>
        <td>
            <p>在 Kotlin IR 编译器中配置内联优化过程, 这个过程在实际代码生成阶段之前执行(默认为禁用).</p>
            <p>推荐的 token 数量(编译器解析的代码单元)为 40.</p>
        </td>
        <td>从 2.1.20 开始, 为实验性功能</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#deinitializers"><code>objcDisposeOnMain</code></a></td>
        <td>
            <list>
                <li><code>true</code> (默认值)</li>
                <li><code>false</code></li>
            </list>
        </td>
        <td>控制 Swift/Objective-C 对象的反初始化. 当值为 <code>false</code> 时, 反初始化在特殊的 GC 线程上进行, 而不是在主线程上.</td>
        <td>从 1.9.0 开始可用</td>
    </tr>
    <tr>
        <td><a href="native-arc-integration.md#support-for-background-state-and-app-extensions"><code>appStateTracking</code></a></td>
        <td>
            <list>
                <li><code>enabled</code></li>
                <li><code>disabled</code> (默认值)</li>
            </list>
        </td>
        <td>
            <p>控制应用程序在后台运行时, 基于定时器的垃圾收集器调用.</p>
            <p>当值为 <code>enabled</code> 时, 仅在内存消耗过高时才会调用 GC.</p>
       </td>
        <td>从 1.7.20 开始, 为实验性功能</td>
    </tr>
    <tr>
        <td><code>bundleId</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置 Bundle ID (<code>CFBundleIdentifier</code>).</td>
        <td>从 1.7.20 开始可用</td>
    </tr>
    <tr>
        <td><code>bundleShortVersionString</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置 Bundle 的短版本号 (<code>CFBundleShortVersionString</code>).</td>
        <td>从 1.7.20 开始可用</td>
    </tr>
    <tr>
        <td><code>bundleVersion</code></td>
        <td>
            <list>
                <li><code>String</code></li>
            </list>
        </td>
        <td>在 <code>Info.plst</code> 文件中设置 Bundle 的版本号 (<code>CFBundleVersion</code>).</td>
        <td>从 1.7.20 开始可用</td>
    </tr>
    <tr>
        <td><code>sourceInfoType</code></td>
        <td>
            <list>
                <li><code>libbacktrace</code></li>
                <li><code>coresymbolication</code> (Apple 目标平台)</li>
                <li><code>noop</code> (默认值)</li>
            </list>
        </td>
        <td>
            <p>向异常的堆栈跟踪(Stack Trace)添加文件位置和行号信息.</p>
            <p><code>coresymbolication</code> 只能用于 Apple 目标平台, 并且在调试模式下, 对 macOS 和 Apple 模拟器默认启用.</p>
        </td>
        <td>从 1.6.20 开始, 为实验性功能</td>
    </tr>
    <!-- <tr>
        <td><code>objcExportReportNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认值)</li>
            </list>
        </td>
        <td>When <code>enabled</code>, reports warnings in case name collisions occur during Objective-C export.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>objcExportErrorOnNameCollisions</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认值)</li>
            </list>
        </td>
        <td>When <code>true</code>, issues errors in case name collisions occur during Objective-C export.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>debugCompilationDir</code></td>
        <td><code>String</code></td>
        <td>Specifies the directory path to use for debug information in the compiled binary.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>fixedBlockPageSize</code></td>
        <td><code>UInt</code></td>
        <td>Controls the page size for fixed memory blocks in the memory allocator. Affects memory allocation performance and fragmentation.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>gcMutatorsCooperate</code></td>
        <td>
            <list>
                <li><code>true</code></li>
                <li><code>false</code> (默认值)</li>
            </list>
        </td>
        <td>Controls cooperation between mutator threads and the garbage collector.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>auxGCThreads</code></td>
        <td><code>UInt</code></td>
        <td>Specifies the number of auxiliary threads to use for garbage collection.</td>
        <td></td>
    </tr>
    <tr>
        <td><code>sanitizer</code></td>
        <td>
            <list>
                <li><code>address</code></li>
                <li><code>thread</code></li>
            </list>
        </td>
        <td>Enables runtime sanitizers for detecting various issues like memory errors, data races, and undefined behavior.</td>
        <td>Experimental</td>
    </tr> -->
</table>

> 关于稳定性级别, 详情请参见 [相关文档](components-stability.md#stability-levels-explained).
>
{style="tip"}

## 下一步做什么? {id="what-s-next"}

了解如何 [构建最终的原生二进制文件](multiplatform-build-native-binaries.md).
