---
type: doc
layout: reference
category: "JavaScript"
title: "创建 Kotlin/JS 工程(Project)"
---

# 创建 Kotlin JavaScript 工程(Project)

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin JavaScript 工程(Project) 使用 Gradle 进行编译.
为了方便开发者管理 Kotlin JavaScript 工程, 我们提供了 `kotlin.multiplatform` Gradle 插件, 其中包括工程配置工具,
以及对 JavaScript 开发中常见业务进行自动化处理的帮助性任务.
比如, 这个插件会在后台下载 [Yarn](https://yarnpkg.com/) 包管理器, 用来管理 [npm](https://www.npmjs.com/) 依赖项,
还可以使用 [webpack](https://webpack.js.org/) 将 Kotlin 工程编译为 JavaScript bundle.
依赖项管理和配置调整大部分可以直接在 Gradle 构建脚本文件中完成, 还可以通过选项覆盖自动生成的配置, 获得完全的控制能力.

你可以在 Gradle 工程的 `build.gradle(.kts)` 文件中手动的应用 `org.jetbrains.kotlin.multiplatform` 插件:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
     kotlin("multiplatform") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.multiplatform' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

通过 Kotlin Multiplatform Gradle 插件, 你可以在编译脚本的 `kotlin` 节中管理工程的各方面设置.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    //...
}
```

</div>

在 `kotlin {}` 代码段中, 你可以管理以下方面:

* [目标执行环境](#execution-environments): 浏览器, 或 Node.js
* [工程的依赖项目管理](#dependencies): Maven 或 npm
* [运行配置(configuration)](#run-task)
* [测试配置(configuration)](#test-task)
* 对于浏览器工程的 [打包(Bundling)](#webpack-bundling) 和 [CSS 支持](#css)
* [目标目录](#distribution-target-directory) 和 [模块名称](#module-name)
* [工程的 `package.json` 文件](#package-json-customization)

## 执行环境

Kotlin/JS 工程可以运行于两种不同的执行环境:

* 浏览器环境, 用于浏览器内运行的客户端脚本
* [Node.js](https://nodejs.org/), 在浏览器之外运行 JavaScript 代码, 比如, 运行服务器端脚本.

要为 Kotlin/JS 工程定义目标运行环境, 需要添加 `js {}` 代码段, 其中包含 `browser {}` 或 `nodejs {}`:

```groovy
kotlin {
    js {
        browser {
        }
        binaries.executable()
    }
}    
```

`binaries.executable()` 指令明确的指示 Kotlin 编译器输出可执行的 `.js` 文件.
使用当前的 Kotlin/JS 编译器时, 这是默认的行为, 但如果你使用 [Kotlin/JS IR 编译器](js-ir-compiler.html),
或者在 `gradle.properties` 文件中设置过 `kotlin.js.generate.executable.default=false`,
则需要明确的指定这条指令.
这些情况下, 省略 `binaries.executable()` 会导致编译器只生成 Kotlin-internal 库文件,
这些库文件可以被其他项目使用, 但不能独立运行.

> 与创建可执行文件相比, 这样通常会更快, 而且在处理你项目中的非叶(non-leaf)模块时, 这是一种可能的优化.
{:.tip}

Kotlin Multiplatform 插件会针对选定的运行环境, 自动配置它的编译任务.
包括下载并安装应用程序运行和测试所需要的环境和依赖项目,
因此开发者可以编译, 运行, 以及测试简单的工程, 而无需再添加更多配置.
对于编译目标为 Node.js 的项目, 还有一个选项可以使用本地已安装的 Node.js.
详情请参见 [使用已安装的 Node.js](#use-pre-installed-node-js).

## 依赖项目

与其他 Gradle 工程一样, Kotlin/JS 工程编译脚本的 `dependencies {}` 代码段内, 支持添加传统的 Gradle [依赖项目声明](https://docs.gradle.org/current/userguide/declaring_dependencies.html):

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</div>
</div>

Kotlin Multiplatform Gradle 插件也支持在编译脚本的 `kotlin {}` 代码段中添加特定源代码集合(source set)的依赖项目声明:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        val jsMain by getting {
            dependencies {
                implementation("org.example.myproject:1.1.0")
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        jsMain {
            dependencies {
                implementation 'org.example.myproject:1.1.0'
            }
        }
    }
}
```

</div>
</div>


> 并不是 Kotlin 编程语言中所有可用的库在 JavaScript 平台都可用:
> 只有那些包含针对 Kotlin/JS 的 artifact 的库才能使用.
{:.note}

如果你添加的库依赖于 [来自 npm 的包](#npm-dependencies), Gradle 也会自动解析这些传递性依赖项.

### Kotlin 标准库

对 [标准库](https://kotlinlang.org/api/latest/jvm/stdlib/index.html) 的依赖项会自动添加.
标准库的版本与 Kotlin Multiplatform 插件的版本相同.

对于跨平台的测试, 可以使用 [`kotlin.test`](https://kotlinlang.org/api/latest/kotlin.test/) API.
当你创建跨平台项目时, 你可以在 `commonTest` 中使用一个依赖项, 对所有的源代码集添加测试依赖项:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    sourceSets {
        commonTest.dependencies {
              implementation(kotlin("test")) // 会自动引入所有的平台依赖项
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        commonTest {
            dependencies {
                implementation kotlin("test") // 会自动引入所有的平台依赖项
            }
        }
    }
}
```

</div>
</div>

### npm 依赖项目

在 JavaScript 的世界中, 管理依赖项目的最常见方式是 [npm](https://www.npmjs.com/).
它提供了各种 JavaScript 模块(module) 的最大的公共仓库(repository).

通过 Kotlin Multiplatform Gradle 插件, 可以在 Gradle 编译脚本中声明 npm 依赖项目, 方法和声明其他依赖项目类似.

要声明一个 npm 依赖项目, 可以在一个依赖项目声明中使用 `npm()` 函数指定依赖项目的名称和版本.
也可以使用 [npm semver 语法](https://docs.npmjs.com/misc/semver#versions), 指定一个或多个版本范围.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation(npm("react", "> 14.0.0 <=16.9.0"))
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation npm('react', '> 14.0.0 <=16.9.0')
}
```

</div>
</div>

插件会使用 [Yarn](https://yarnpkg.com/lang/en/) 包管理器来下载和安装 npm 依赖项.
不需要额外配置, 默认即可工作, 但你也可以根据需要对其进行调整.
详情请参见 [在 Kotlin Multiplatform Gradle plugin 中配置 Yarn](#yarn).

除了标准依赖项之外, 在 Gradle DSL 中使用还可以使用 3 种其他类型的依赖项.
关于什么情况下应该选择什么类型的依赖项, 请阅读 npm 提供的官方文档:

* [devDependencies](https://docs.npmjs.com/files/package.json#devdependencies), 通过 `devNpm(...)` 使用,
* [optionalDependencies](https://docs.npmjs.com/files/package.json#optionaldependencies) 通过 `optionalNpm(...)` 使用, 以及
* [peerDependencies](https://docs.npmjs.com/files/package.json#peerdependencies) 如果 `peerNpm(...)` 使用.

一个 npm 依赖项目安装完成之后, 你就可以如 [在 Kotlin 中调用 JavaScript](js-interop.html) 中介绍过的那样, 在你的代码中使用它的 API.

## run 任务

Kotlin Multiplatform Gradle 插件提供了一个 `jsRun` 任务, 它可以运行你的纯 Kotlin/JS 工程, 无需额外的配置.

对于在浏览器内运行 Kotlin/JS 工程的情况, 这个是 `browserDevelopmentRun` 任务的一个别名(在 Kotlin 跨平台项目也可以使用).
它使用 [webpack DevServer](https://webpack.js.org/configuration/dev-server/) 来提供你的 JavaScript artifact.
如果你想要自定义 DevServer 的配置, 例如, 改变端口号, 请使用 [webpack 配置文件](#webpack-bundling).

对于在 Node.js 平台运行 Kotlin/JS 项目的情况, 请使用 `jsRun` 任务, 它是 `nodeRun` 任务的别名.

要运行一个工程, 请执行 Gradle 编译周期(lifecycle)中标准的 `jsRun` 任务, 或者运行它作为别名对应的真实的任务:

```bash
./gradlew jsRun
```

如果要在修改过源代码文件后自动对你的应用程序进行重新构建,
可以使用 Gradle 的 [连续构建(continuous build)](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 功能:

```bash
./gradlew jsRun --continuous
```

或者

```bash
./gradlew jsRun -t
```

工程构建成功后, `webpack-dev-server` 会自动刷新浏览器页面.

## test 任务

Kotlin Multiplatform Gradle 插件会为工程自动设置测试环境. 对于浏览器工程, 它会下载并安装测试运行器 [Karma](https://karma-runner.github.io/), 以及相关的依赖项目;
对于 Node.js 项目, 会使用 [Mocha](https://mochajs.org/) 测试框架.

插件还提供了很多有用的测试功能, 比如:

* 生成源代码文件映射(Source map)
* 生成测试报告(Test report)
* 在控制台输出测试运行结果

为了运行浏览器中的测试, 插件会默认使用
[Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md).
你也可以选择其他浏览器来运行测试, 方法是在编译脚本的 `useKarma {}` 代码段中添加相应的设置:

```groovy
kotlin {
    js {
        browser {
            testTask {
                useKarma {
                    useIe()
                    useSafari()
                    useFirefox()
                    useChrome()
                    useChromeCanary()
                    useChromeHeadless()
                    usePhantomJS()
                    useOpera()
                }
            }
        }
        binaries.executable()
        // ...
    }
}
```

或者你也可以在 `gradle.properties` 文件中添加测试的目标浏览器:

```text
kotlin.js.browser.karma.browsers=firefox,safari
```

通过这种方法, 你可以为所有的模块定义一组浏览器, 然后在某些模块的构建脚本中添加特定的浏览器.

请注意, Kotlin Multiplatform Gradle 插件不会为你自动安装这些浏览器, 而只是使用那些在它的运行环境中可用的浏览器.
比如说, 如果在一个持续集成服务器上运行 Kotlin/JS 测试, 请注意确保安装了你需要测试的浏览器.

如果想要跳过测试, 可以在 `testTask {}` 代码段中添加 `enabled = false` 设置.

```groovy
kotlin {
    js {
        browser {
            testTask {
                enabled = false
            }
        }
        binaries.executable()
        // ...
    }
}
```

要运行测试, 请执行 Gradle 编译周期(lifecycle)中标准的 `check` 任务:

```bash
./gradlew check
```

如果要指定你的 Node.js 测试运行器使用的环境变量
(比如, 向你的测试代码传递外部信息, 或对包的解析进行微调),
可以在你的构建脚本的 `testTask {}` 代码段中使用 `environment()` 函数, 参数是键-值对:

```groovy
kotlin {
    js {
        nodejs {
            testTask {
                environment("key", "value")
            }
        }
    }
}        
```

## 配置 Karma

Kotlin Multiplatform Gradle 插件会在构建时自动生成 Karma 配置文件,
其中包括你的 `build.gradle(.kts)` 文件中的 [`kotlin.js.browser.testTask.useKarma {}` 代码段](#test-task) 中的设置.
你可以在 `build/js/packages/projectName-test/karma.conf.js` 找到这个文件.
要调整 Karma 所使用的配置, 请将你的额外配置文件  放在你的项目根目录的 `karma.config.d` 目录之下.
在构建时, 这个目录下的所有 `.js` 配置文件都会被读取, 并自动合并到生成的 `karma.conf.js` 文件中.

Karma 配置的详细功能请参见 Karma 的 [文档](https://karma-runner.github.io/5.0/config/configuration-file.html).

## webpack 打包(Bundling)

如果编译目标为浏览器环境, Kotlin/JS 插件使用大家都熟悉的 [webpack](https://webpack.js.org/) 来打包模块.

### webpack 版本

Kotlin Multiplatform 插件使用 webpack {{ site.data.releases.webpackMajorVersion }}.

如果你的项目通过 plugin  1.5.0 以前版本创建,
那么可以在你的项目的 `gradle.properties` 文件中添加以下设置,
临时切换回这些版本使用的 webpack {{ site.data.releases.webpackPreviousMajorVersion }}:

```none
kotlin.js.webpack.major.version={{ site.data.releases.webpackPreviousMajorVersion }}
```

### webpack 任务

在 Gradle 编译脚本的 `kotlin.js.browser.webpackTask {}` 配置代码段中, 可以直接调整最常见的 webpack 配置:
* `outputFileName` - webpack 的输出文件名称.
  执行webpack 任务之后, 这个文件将生成在 `<projectDir>/build/dist/<targetName>` 文件夹内.
  默认值是工程名称.
* `output.libraryTarget` - 用于 webpack 输出文件的模块系统.
  详情请参见 [Kotlin/JS 工程可用的模块系统](js-modules.html).
  默认值是 `umd`.

```groovy
webpackTask {
    outputFileName = "mycustomfilename.js"
    output.libraryTarget = "commonjs2"
}
```

还可以在 `commonWebpackConfig {}` 代码段中配置 webpack 的共通设置, 用于打包(bundling), 运行, 以及测试任务.

### webpack 配置文件

Kotlin Multiplatform Gradle plugin 在构建时会自动生成一个标准的 webpack 配置文件.
位置是 `build/js/packages/projectName/webpack.config.js`.

如果还想对 webpack 配置进行进一步的调整, 请将你的额外的配置文件放在你的工程的 `webpack.config.d` 目录内.
编译你的工程时, 所有的 `.js` 配置文件都会被自动合并到 `build/js/packages/projectName/webpack.config.js` 文件内.
比如, 如果要添加一个新的 [webpack loader](https://webpack.js.org/loaders/),
请要把以下内容添加到 `webpack.config.d` 目录内的一个 `.js` 中:

> 这种情况下, 配置对象是全局对象 `config`. 你需要在你的脚本中修改这个对象.
{:.note}

```groovy
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

关于 webpack 的所有配置项目, 请参见它的 [文档](https://webpack.js.org/concepts/configuration/).

### 构建可执行文件

要通过 webpack 编译可执行的 JavaScript artifact, Kotlin Multiplatform Gradle 插件包含 Gradle 任务
`browserDevelopmentWebpack` 和 `browserProductionWebpack`.

* `browserDevelopmentWebpack` 创建开发模式的 artifact, 文件尺寸会比较大, 但构建时间比较短.
因此, 在活跃开发阶段请使用 `browserDevelopmentWebpack` 任务.

* `browserProductionWebpack` 会执行 [死代码消除](javascript-dce.html),
生成 artifact 文件, 并对输出结果的 JavaScript 文件最小化, 构建时间更长, 但生成的可执行文件尺寸更小.
因此, 在构建你的项目用于生成目的时, 请使用 `browserProductionWebpack` 任务.

执行这两个任务可以分别得到开发模式和生产模式的 artifact 文件.
生成的文件会在 `build/dist` 目录下, 除非 [另有设置](#distribution-target-directory).

```bash
./gradlew browserProductionWebpack
```

注意, 只有在你的编译目标设置为生成可执行文件 (通过 `binaries.executable()`) 时, 这些任务才可用.

## CSS

Kotlin Multiplatform Gradle 创建还支持 webpack 的
[CSS](https://webpack.js.org/loaders/css-loader/)
和
[style](https://webpack.js.org/loaders/style-loader/) 装载器.
虽然所有的选项都可以直接修改构建你的项目的 [webpack 配置文件](#webpack-bundling), 但最常用的方法是使用 `build.gradle(.kts)` 中直接可用的设定.

要在你的项目中打开 CSS 支持, 请在 Gradle 构建文件的 `commonWebpackConfig {}` 代码段中设置 `cssSupport.enabled` 选项.
通过 IDE 向导创建新工程时, 这个配置也会默认启用.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
browser {
    commonWebpackConfig {
        cssSupport {
            enabled.set(true)
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
browser {
    commonWebpackConfig {
        cssSupport {
            it.enabled.set(true)
        }
    }
}
```

</div>
</div>

或者, 也可以单独对 `webpackTask {}`, `runTask {}`, 和 `testTask {}` 添加 CSS 支持:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
browser {
    webpackTask {
        cssSupport {
            enabled.set(true)
        }
    }
    runTask {
        cssSupport {
            enabled.set(true)
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                enabled.set(true)
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
browser {
    webpackTask {
        cssSupport {
            it.enabled.set(true)
        }
    }
    runTask {
        cssSupport {
            it.enabled.set(true)
        }
    }
    testTask {
        useKarma {
            // ...
            webpackConfig.cssSupport {
                it.enabled.set(true)
            }
        }
    }
}
```

</div>
</div>

对你的项目打开 CSS 支持, 有助于防止在未配置的项目中使用样式表时发生的常见错误, 比如 `Module parse failed: Unexpected character '@' (14:0)`.

可以使用 `cssSupport.mode` 来指定 CSS 应该如何处理. 可选的设定值如下:

* `"inline"` (默认值): 样式添加到全局的 `<style>` tag.
* `"extract"`: 样式抽取为单独的文件. 然后通过 HTML 页面来添加.
* `"import"`: 样式作为字符串处理. 如果你需要在你的代码中访问 CSS, 这会很有用
(比如, `val styles = require("main.css")`).

如果要对同一个项目使用不同的模式, 请使用 `cssSupport.rules`. 这里, 你可以指定一组 `KotlinWebpackCssRules`, 其中每一项定义一个 mode, 以及 [include](https://webpack.js.org/configuration/module/#ruleinclude) 和 [exclude](https://webpack.js.org/configuration/module/#ruleexclude) pattern.

## Node.js

对于编译到 Node.js 的 Kotlin/JS 项目, plugin 会在主机上自动下载并安装 Node.js 环境.
如果已经安装过 Node.js, 你也可以使用已经存在的 Node.js.

### 使用已安装的 Node.js

如果在构建 Kotlin/JS 项目的主机上已经安装了 Node.js, 你可以配置 Kotlin Multiplatform Gradle 插件,
让它使用已安装的 Node.js, 而不要安装另外的 Node.js 实例.

要使用已安装的 Node.js, 请向 `build.gradle(.kts)` 文件添加以下内容:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension>().download = false
    // 默认设置为 "true"
}

```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>


```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.nodejs.NodeJsRootExtension).download = false
}
```

</div>
</div>


## Yarn

为了在构建时下载并安装你声明的依赖项, plugin 会管理它自己的 [Yarn](https://yarnpkg.com/lang/en/) 包管理器实例.
不需要额外配置, 默认即可工作, 但你也可以对其进行调整, 或者使用你的主机上已经安装的 Yarn.

### Yarn 的更多功能: .yarnrc

如果要配置 Yarn 的更多功能, 请将一个 `.yarnrc` 文件放在你的工程根目录.
编译时, 会自动使用它.

比如, 如果要对 npm 包使用一个自定义的仓库, 请将以下内容添加到工程根目录下的一个 `.yarnrc` 文件中:

```text
registry "http://my.registry/api/npm/"
```

关于 `.yarnrc` 文件的更多信息, 请参见 [Yarn 官方文档](https://classic.yarnpkg.com/en/docs/yarnrc/).

### 使用已安装的 Yarn

如果在构建 Kotlin/JS 项目的主机上已经安装了 Yarn, 你可以配置 Kotlin Multiplatform Gradle 插件,
让它使用已安装的 Yarn, 而不要安装另外的 Yarn 实例.

要使用已安装的 Yarn, 请向 `build.gradle(.kts)` 文件添加以下内容:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().download = false
    // 默认设置为 "true"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).download = false
}

```

</div>
</div>

### 通过 kotlin-js-store 锁定版本

> 通过 `kotlin-js-store` 锁定版本, 这个功能从 Kotlin 1.6.10 开始可用.
{:.note}

项目根目录下的 `kotlin-js-store` 目录 由 Kotlin Multiplatform Gradle 插件自动生成, 存储 `yarn.lock` 文件, 这个文件用来锁定版本.
lock 文件完全由 Yarn plugin 管理, 并在 Gradle 任务 `kotlinNpmInstall` 执行时被更新.

为了遵循 [Yarn 推荐的最佳实践](https://classic.yarnpkg.com/blog/2016/11/24/lockfiles-for-all/),
请将 `kotlin-js-store` 和其中的内容提交到你的版本管理系统.
这样可以保证你的应用程序在所有的机器上都使用完全相同的依赖项目树来进行构建.

如果需要, 你可以在 `build.gradle(.kts)` 文件修改目录和 lock 文件名称:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> {
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileDirectory =
        project.rootDir.resolve("my-kotlin-js-store")
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().lockFileName = "my-yarn.lock"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileDirectory =
        file("my-kotlin-js-store")
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).lockFileName = 'my-yarn.lock'
}
``` 

</div>
</div>

> 修改 lock 文件名称, 可能会导致依赖项检查工具不再正确读取这个文件.
{:.warning}

关于 `.yarnrc` 文件的更多信息, 请参见 [Yarn 官方文档](https://classic.yarnpkg.com/lang/en/docs/yarn-lock/).

### 报告 yarn.lock 的变更

Kotlin/JS 提供了 Gradle 设置, 可以通知你 `yarn.lock` 文件是否发生变更.
如果你想要在 CI 构建过程中 `yarn.lock` 发生变更时收到通知, 你可以使用这些设置:

* `YarnLockMismatchReport`, 指定对 `yarn.lock` 文件的变更如何进行报告.
  你可以使用以下值之一:
  * `FAIL` 让对应的 Gradle task 失败. 这是默认设置.
  * `WARNING` 将变更信息写入警告日志.
  * `NONE` 禁用报告.
* `reportNewYarnLock`, 会明确的对最近创建的 `yarn.lock` 文件进行报告.
  默认情况下, 这个选项是禁用的: 常见的做法是在最开始生成一个新的 `yarn.lock` 文件.
  你可以使用这个选项, 来确保 `yarn.lock` 文件已经提交到了你的代码仓库.
* `yarnLockAutoReplace`, 会在 Gradle task 每次运行时自动替换 `yarn.lock`.

要使用这些选项, 请更新 `build.gradle(.kts)` 文件:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin::class.java) {
    rootProject.the<YarnRootExtension>().yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.the<YarnRootExtension>().reportNewYarnLock = false // true
    rootProject.the<YarnRootExtension>().yarnLockAutoReplace = false // true
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnLockMismatchReport
import org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension

rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockMismatchReport =
        YarnLockMismatchReport.WARNING // NONE | FAIL
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).reportNewYarnLock = false // true
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).yarnLockAutoReplace = false // true
}
```

</div>
</div>

### 默认使用 --ignore-scripts 安装 npm 依赖项 

> 默认使用 `--ignore-scripts` 安装 npm 依赖项, 这个功能从 Kotlin 1.6.10 开始可用.
{:.note}

如果 npm 包被攻击, 其中可能包含恶意代码, 为了减少执行这种恶意代码的可能性,
Kotlin Multiplatform Gradle 插件在安装 npm 依赖项时默认会禁止执行
[Life Cycle 脚本](https://docs.npmjs.com/cli/v8/using-npm/scripts#life-cycle-scripts).

你可以明确的允许 Life Cycle 脚本执行, 方法是在 `build.gradle(.kts)` 中添加以下设定:

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
rootProject.plugins.withType<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin> { 
    rootProject.the<org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension>().ignoreScripts = false
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
rootProject.plugins.withType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnPlugin) {
    rootProject.extensions.getByType(org.jetbrains.kotlin.gradle.targets.js.yarn.YarnRootExtension).ignoreScripts = false
}
``` 

</div>
</div>

## 设置发布目录

默认设置下, Kotlin/JS 工程编译的输出在工程根目录下的 `/build/dist/<targetName>/<binaryName>` 目录内.

> 在 Kotlin 1.9.0 以前, 默认的发布目录为 `/build/distributions`.
{:.note }

如果要为工程设置另外的发布位置, 请在编译脚本的 `browser {}` 代码段内, 添加 `distribution {}` 代码段,
在这里使用 `set()` 方法为 `outputDirectory` 属性设置一个值.
当你运行工程的构建任务时, Gradle 会将输出的 bundle 文件和工程的资源文件一起, 保存到这个位置.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
    js {
        browser {
            distribution {
                outputDirectory.set(projectDir.resolve("output"))
            }
        }
        binaries.executable()
        // ...
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    js {
        browser {
            distribution {
                outputDirectory.set(file("$projectDir/output"))
            }
        }
        binaries.executable()
        // ...
    }
}
```

</div>
</div>

## 模块名称

如果要调整 JavaScript _模块(module)_ 名称 (模块将被生成在 `build/js/packages/myModuleName` 路径),
包括对应的 `.js` 和 `.d.ts` 文件名称, 请使用 `moduleName` 选项:

```groovy
js {
    moduleName = "myModuleName"
}
```

注意, 这个设置不会影响位于 `build/dist` 的 webpacked 输出.

## 自定义 package.json 文件

`package.json` 文件包含 JavaScript 包的元数据(metadata).
常用的包登记系统, 比如 npm, 要求所有发布的包带有这个文件.
包登记系统会使用这个文件来追踪和管理包的发布.

对 Kotlin/JS 工程, Kotlin Multiplatform Gradle 插件在构建时会自动生成 `package.json`.
这个文件默认会包含最基本的数据: 名称, 版本, 许可证, 依赖项目, 以及包的一些其他属性.

除了基本的包属性之外, `package.json` 还可以定义 JavaScript 包应该如何动作,
比如, 标识可以运行的脚本.

你可以通过 Gradle DSL 向工程的 `package.json` 文件添加自定义的内容.
要添加自定义的项目到你的 `package.json` 文件, 可以在编译任务的 `packageJson` 代码段中使用 `customField()` 函数:

```kotlin
kotlin {
    js {
        compilations["main"].packageJson {
            customField("hello", mapOf("one" to 1, "two" to 2))
        }
    }
}
```

构建工程时, 这段代码会向 `package.json` 文件添加以下内容:

```json
"hello": {
    "one": 1,
    "two": 2
}
```

关于如何为 npm 登记项目编写 `package.json` 文件, 详情请参见 [npm 文档](https://docs.npmjs.com/cli/v6/configuring-npm/package-json).

## 错误排查

使用 Kotlin 1.3.xx 构建 Kotlin/JS 项目时, 如果你的某个依赖项 (或任何一个传递依赖项)
使用 Kotlin 1.4 或更高版本构建, 你可能会遇到 Gradle 错误:
`Could not determine the dependencies of task ':client:jsTestPackageJson'.` / `Cannot choose between the following variants`.
这是一个已知的问题, 解决方法请参见 [这个页面](https://youtrack.jetbrains.com/issue/KT-40226).
