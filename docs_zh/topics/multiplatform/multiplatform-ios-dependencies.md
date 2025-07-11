[//]: # (title: 添加 iOS 依赖项)

在 Kotlin Multiplatform 项目中, Apple SDK 依赖项(比如 Foundation 或 Core Bluetooth) 可以作为一组预构建的库来使用.
不需要额外的配置.

你也可以在你的 iOS 源代码集中重用 iOS 生态系统中的其它库和框架.
Kotlin 支持与 Objective-C 依赖项交互, 也支持 Swift 依赖项, 但要求它们的 API 使用 `@objc` 属性导出到 Objective-C.
纯 Swift 的依赖项目前还不支持.

要在 Kotlin Multiplatform 项目中管理 iOS 依赖项, 你可以使用 [cinterop 工具](#with-cinterop),
或使用 [CocoaPods 依赖项管理器](#with-cocoapods) (不支持纯 Swift pod).

### 使用 cinterop {id="with-cinterop"}

你可以使用 cinterop 工具来为 Objective-C 或 Swift 声明创建 Kotlin 绑定.
然后就可以从 Kotlin 代码调用它们.

对于 [库](#add-a-library) 和 [框架](#add-a-framework) 的步骤略有不同,
但过程大致如下:

1. 下载你的依赖项.
2. 构建它, 得到它的二进制文件.
3. 创建一个专用的 `.def` [定义文件](native-definition-file.md), 为 cinterop 描述这个依赖项.
4. 调节你的构建脚本, 在构建过程中生成绑定.

#### 添加一个库 {id="add-a-library"}

1. 下载库的源代码, 放在从你的项目可以引用的某个地方.
2. 构建库 (库作者通常会提供文档说明具体方法), 得到二进制文件路径.
3. 在你的项目中, 创建一个 `.def` 文件, 比如 `DateTools.def`.
4. 向这个文件添加第 1 行内容: `language = Objective-C`. 如果你想要使用一个纯 C 的依赖项, 请省略 language 属性.
5. 为这 2 个必须属性指定值:

    * `headers` 描述哪些头文件要由 cinterop 处理.
    * `package` 设置这些声明应该放置的包名称.

   例如:

    ```none
    headers = DateTools.h
    package = DateTools
    ```

6. 向构建脚本添加与这个库交互的信息:

    * 传递 `.def` 文件的路径.
      如果你的 `.def` 文件与 cinterop 名称相同, 并放置在 `src/nativeInterop/cinterop/` 目录中, 那么这个路径可以省略.
    * 使用 `includeDirs` 选项, 告诉 cinterop 到哪里寻找头文件.
    * 配置如何链接到库的二进制文件.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 文件路径
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    // 头文件查找目录 (类似于 -I<path> 编译器选项)
                    includeDirs("include/this/directory", "path/to/another/directory")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 链接到库需要的链接器选项.
                linkerOpts("-L/path/to/library/binaries", "-lbinaryname")
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 文件路径
                        definitionFile = project.file("src/nativeInterop/cinterop/DateTools.def")

                        // 头文件查找目录 (类似于 -I<path> 编译器选项)
                        includeDirs("include/this/directory", "path/to/another/directory")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 链接到库需要的链接器选项.
                linkerOpts "-L/path/to/library/binaries", "-lbinaryname"
            }
        }
    }
    ```

    </tab>
    </tabs>

7. 构建项目.

现在你可以在你的 Kotlin 代码中使用这个依赖项了. 方法是, 导入你在 `.def` 文件的 `package` 属性中设置的那个包.
对于上面的示例, 应该是:

```kotlin
import DateTools.*
```

#### 添加一个框架 {id="add-a-framework"}

1. 下载框架源代码, 放在从你的项目可以引用的某个地方.
2. 构建框架 (框架作者通常会提供文档说明具体方法), 得到二进制文件路径.
3. 在你的项目中, 创建一个 `.def` 文件, 比如 `MyFramework.def`.
4. 向这个文件添加第 1 行内容: `language = Objective-C`. 如果你想要使用一个纯 C 的依赖项, 请省略 language 属性.
5. 为这 2 个必须属性指定值:

    * `modules` – 需要由 cinterop 处理的框架名称.
    * `package` – 这些声明应该放置的包名称.

   比如:

    ```none
    modules = MyFramework
    package = MyFramework
    ```

6. 向构建脚本添加与这个框架交互的信息:

    * 传递 .def 文件路径.
      如果你的 `.def` 文件与 cinterop 名称相同, 并放置在 `src/nativeInterop/cinterop/` 目录中, 那么这个路径可以省略.
    * 使用 `-framework` 选项, 向编译器和链接器传递框架名称.
      使用 `-F` 选项, 向编译器和链接器传递框架源代码和二进制文件的路径.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        iosArm64() {
            compilations.getByName("main") {
                val DateTools by cinterops.creating {
                    // .def 文件路径
                    definitionFile.set(project.file("src/nativeInterop/cinterop/DateTools.def"))

                    compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                }
                val anotherInterop by cinterops.creating { /* ... */ }
            }

            binaries.all {
                // 告诉链接器框架的位置.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
       }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        iosArm64 {
            compilations.main {
                cinterops {
                    DateTools {
                        // .def 文件路径
                        definitionFile = project.file("src/nativeInterop/cinterop/MyFramework.def")

                        compilerOpts("-framework", "MyFramework", "-F/path/to/framework/")
                    }
                    anotherInterop { /* ... */ }
                }
            }

            binaries.all {
                // 告诉链接器框架的位置.
                linkerOpts("-framework", "MyFramework", "-F/path/to/framework/")
            }
        }
    }
    ```

    </tab>
    </tabs>

7. 构建项目.

现在你可以在你的 Kotlin 代码中使用这个依赖项了. 方法是, 导入你在 .def 文件的 package 属性中设置的那个包.
对于上面的示例, 应该是:

```kotlin
import MyFramework.*
```

详情请参见 [与 Objective-C 和 Swift 交互](native-objc-interop.md)
以及 [在 Gradle 中配置 cinterop](multiplatform-dsl-reference.md#cinterops).

### 使用 CocoaPods {id="with-cocoapods"}

1. 执行 [CocoaPods 集成的初始设置](native-cocoapods.md#set-up-an-environment-to-work-with-cocoapods).
2. 在你的项目的 `build.gradle(.kts)` 文件中加入 `pod()` 函数调用, 添加 CocoaPods 仓库中的你想要使用的 Pod 库的依赖项.

    <tabs group="build-script">
    <tab title="Kotlin" group-key="kotlin">

    ```kotlin
    kotlin {
        cocoapods {
            version = "2.0"
            // ...
            pod("SDWebImage") {
                version = "5.20.0"
            }
        }
    }
    ```

    </tab>
    <tab title="Groovy" group-key="groovy">

    ```groovy
    kotlin {
        cocoapods {
            version = '2.0'
            // ...
            pod('SDWebImage') {
                version = '5.20.0'
            }
        }
    }
    ```

    </tab>
    </tabs>

   你可以通过以下方式添加 Pod 库依赖项:

   * [使用 CocoaPods 仓库](native-cocoapods-libraries.md#from-the-cocoapods-repository)
   * [使用本地存储的库](native-cocoapods-libraries.md#on-a-locally-stored-library)
   * [使用自定义的 Git 仓库](native-cocoapods-libraries.md#from-a-custom-git-repository)
   * [使用自定义的 Podspec 仓库](native-cocoapods-libraries.md#from-a-custom-podspec-repository)
   * [使用自定义的 cinterop 选项](native-cocoapods-libraries.md#with-custom-cinterop-options)

3. 在 IntelliJ IDEA 中, 运行 **Reload All Gradle Projects** (如果是 Android Studio, 请运行 **Sync Project with Gradle Files**),
   重新导入项目.

要在你的 Kotlin 代码中使用依赖项, 请导入包 `cocoapods.<library-name>`. 在上面的示例中中, 应该是:

```kotlin
import cocoapods.SDWebImage.*
```

## 下一步做什么?

查看跨平台项目中添加依赖项的其他资料, 并学习以下内容:

* [连接到平台库](native-platform-libs.md)
* [添加对跨平台库或其他跨平台项目的依赖项](multiplatform-add-dependencies.md)
* [添加 Android 依赖项](multiplatform-android-dependencies.md)
