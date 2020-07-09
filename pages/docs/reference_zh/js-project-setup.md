---
type: doc
layout: reference
category: "JavaScript"
title: "创建 Kotlin JavaScript 工程(Project)"
---

# 创建 Kotlin JavaScript 工程(Project)

Kotlin JavaScript 工程(Project) 使用 Gradle 进行编译. 为了方便开发者管理 Kotlin JavaScript 工程, 我们提供了 Kotlin/JS Gradle 插件, 其中包括工程配置根据, 以及对 JavaScript 开发中常见业务进行自动化处理的帮助性任务. 比如, 这个插件会在后台下载 [Yarn](https://yarnpkg.com/) 包管理器, 用来管理 [npm](https://www.npmjs.com/) 依赖项, 还可以使用 [webpack](https://webpack.js.org/) 将 Kotlin 工程编译为 JavaScript bundle.

在 IntelliJ IDEA 中, 要创建一个 Kotlin JavaScript 工程, 请选择菜单 **File | New | Project**, 然后选择 **Gradle | Kotlin/JS for browser**
 或 **Kotlin/JS for Node.js**. 注意要取消 **Java** 选择框.

![New project wizard]({{ url_for('asset', path='images/reference/js-project-setup/wizard.png') }})


或者, 你也可以对 Gradle 工程的 Gradle 编译脚本 (`build.gradle` 或 `build.gradle.kts`) 手工应用 `org.jetbrains.kotlin.js` 插件.
如果使用 Gradle Kotlin DSL, 那么可以通过 `kotlin(“js”)` 语句应用这个插件.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" theme="idea" mode='groovy'>

```groovy
plugins {
    id 'org.jetbrains.kotlin.js' version '{{ site.data.releases.latest.version }}'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" theme="idea" mode='kotlin' data-highlight-only>

```kotlin
plugins {
     kotlin("js") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

通过 Kotlin/JS 插件, 你可以在编译脚本的 `kotlin` 节中管理工程的各方面设置.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    //...
}
```

</div>

在 `kotlin` 节中, 你可以管理以下方面:

* [目标执行环境](#choosing-execution-environment): 浏览器, 或 Node.js 
* [工程的依赖项目管理](#managing-dependencies): Maven 或 npm
* [运行配置(configuration)](#configuring-run-task)
* [测试配置(configuration)](#configuring-test-task)
* 对浏览器工程 [打包(Bundling)](#configuring-webpack-bundling)
* [目标目录](#distribution-target-directory)

## 选择执行环境

Kotlin/JS 工程可以运行于两种不同的执行环境: 

* 浏览器环境, 用于浏览器内运行的客户端脚本
* [Node.js](https://nodejs.org/), 在浏览器之外运行 JavaScript 代码, 比如, 运行服务器端脚本.

要为 Kotlin/JS 工程定义目标运行环境, 需要添加 `target` 节, 其中包含 `browser {}` 或 `nodejs {}`.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin {
    target {
        browser {
        }       
    }
}    
```

</div>

或者直接写为

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin.target.browser {     
}    
```

</div>

Kotlin/JS 插件会针对选定的运行环境, 自动配置它的编译任务.
包括下载并安装应用程序运行和测试所需要的依赖项目, 然后开发者可以编译, 运行, 以及测试简单的工程, 而无需再添加更多配置. 

## 管理依赖项目

与其他 Gradle 工程一样, Kotlin/JS 工程编译脚本的 `dependencies` 节内, 支持添加传统的 Gradle [依赖项目声明](https://docs.gradle.org/current/userguide/declaring_dependencies.html).

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation 'org.example.myproject:1.1.0'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation("org.example.myproject", "1.1.0")
}
```

</div>
</div>

Kotlin/JS Gradle 插件也支持在编译脚本的 `kotlin` 节中添加特定源代码集合(source set)的依赖项目声明.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin {
    sourceSets {
        main {
            dependencies {
                implementation 'org.example.myproject:1.1.0'
            }
        }
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin {
  sourceSets["main"].dependencies {
    implementation("org.example.myproject", "1.1.0")
  }
}
```

</div>
</div>


### Kotlin 标准库

对所有的 Kotlin/JS 工程来说, Kotlin/JS [标准库](/api/latest/jvm/stdlib/index.html) 的依赖项目是强制的. 如果你的工程包含 Kotlin 编写的测试, 那么还需要添加 [kotlin.test](/api/latest/kotlin.test/index.html) 库的依赖项目.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation 'org.jetbrains.kotlin:kotlin-stdlib-js'
    testImplementation 'org.jetbrains.kotlin:kotlin-test-js'
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation(kotlin("stdlib-js"))
    testImplementation(kotlin("test-js"))
}
```

</div>
</div>

### npm 依赖项目

在 JavaScript 的世界中, 管理依赖项目的通常方式是 [npm](https://www.npmjs.com/).
它提供了最大的公共 [仓库(repository)](https://www.npmjs.com/), 可供下载各种 JavaScript 模块(module) 和工具.

通过 Kotlin/JS 插件, 可以在 Gradle 编译脚本, 和其他依赖项目一样声明 npm 依赖项目, 然后插件会自动处理其他一切任务.
它会安装 [Yarn](https://yarnpkg.com/lang/en/) 包管理器, 并使用它将依赖项目从 npm 仓库下载到你的工程的 `node_modules` 目录中 -
这是 JavaScript 工程的 npm 依赖项目通常的保存位置. 

要声明一个 npm 依赖项目, 可以在一个依赖项目声明中使用 `npm()` 函数指定依赖项目的名称和版本.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
dependencies {
    implementation npm('react', '16.12.0')
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
dependencies {
    implementation(npm("react", "16.12.0"))
}
```

</div>
</div>

一个 npm 依赖项目安装完成之后, 你就可以如 [在 Kotlin 中调用 JavaScript](js-interop.html) 中介绍过的那样, 在你的代码中使用它的 API.

## 配置 run 任务

Kotlin/JS 插件提供了一个 run 任务, 它可以运行你的工程, 无需额外的配置.
它使用 [webpack DevServer](https://webpack.js.org/configuration/dev-server/) 来运行 Kotlin/JS 工程.
如果你想要自定义 DevServer 的配置, 比如, 改变端口号, 请使用 webpack 配置文件.

要运行工程, 请执行 Gradle 编译周期(lifecycle)中标准的 `run` 任务:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew run
```

</div>

如果要不重新启动 DevServer, 直接在浏览器中立即查看源代码文件的变化, 可以使用 Gradle [连续构建(continuous build)](https://docs.gradle.org/current/userguide/command_line_interface.html#sec:continuous_build) 功能:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew run --continuous
```

</div>

或者 

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew run -t
```

</div>

## 配置 test 任务

Kotin/JS Gradle 插件会为工程自动设置测试环境. 对于浏览器工程, 它会下载并安装测试运行器 [Karma](https://karma-runner.github.io/), 以及相关的依赖项目;
对于 NodeJS 项目, 会使用 [Mocha](https://mochajs.org/) 测试框架. 

插件还提供了很多有用的测试功能, 比如:

* 生成源代码文件映射(Source map)
* 生成测试报告(Test report)
* 在控制台输出测试运行结果

默认情况下, 插件使用 [Headless Chrome](https://chromium.googlesource.com/chromium/src/+/lkgr/headless/README.md) 运行浏览器中的测试.
你也可以在其他浏览器内运行测试, 方法是在编译脚本的 `useKarma` 节中添加相应的设置:

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin.target.browser {
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
```

</div>

如果想要跳过测试, 可以在 `testTask` 中添加 `enabled = false` 设置.

<div class="sample" markdown="1" mode="groovy" theme="idea">

```groovy
kotlin.target.browser {
    testTask {
        enabled = false
    }
}
```

</div>

要运行测试, 请执行 Gradle 编译周期(lifecycle)中标准的 `check` 任务:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew check
```

</div>

## webpack 打包(Bundling)配置

如果编译目标为浏览器环境, Kotlin/JS 插件使用大家都熟悉的 [webpack](https://webpack.js.org/) 来打包模块.

Kotlin/JS Gradle 插件会在编译时自动生成标准的 webpack 配置文件, 你可以在 `build/js/packages/projectName/webpack.config.js` 找到这个文件.

在 Gradle 编译脚本的 `kotlin.target.browser.webpackTask` 配置块中, 可以直接调整最常见的 webpack 配置.

如果还想对 webpack 配置进行进一步的调整, 请将你的额外的配置文件放在你的工程的 `webpack.config.d` 目录内.
编译你的工程时, 所有的 JS 配置文件都会被自动合并到 `build/js/packages/projectName/webpack.config.js` 文件内.
比如, 如果要添加一个新的 [webpack loader](https://webpack.js.org/loaders/), 请要把以下内容添加到 `webpack.config.d` 目录内的一个 `.js` 中:

<div class="sample" markdown="1" mode="javascript" theme="idea">

```javascript
config.module.rules.push({
    test: /\.extension$/,
    loader: 'loader-name'
});
```

</div>

关于 webpack 的所有配置项目, 请参见它的 [文档](https://webpack.js.org/concepts/configuration/).

要通过 webpack 编译可执行的 JavaScript artifact, Kotlin/JS 插件包含 Gradle 任务 `browserDevelopmentWebpack` 和 `browserProductionWebpack`. 执行这些任务可以分别得到开发模式和生产模式的 artifact 文件:

<div class="sample" markdown="1" mode="shell" theme="idea">

```bash
./gradlew browserProductionWebpack
```

</div>

## 配置 Yarn

如果要配置 Yarn 的更多功能, 请将一个 `.yarnrc` 文件放在你的工程根目录.
编译时, 会自动使用它.

比如, 如果要对 npm 包使用一个自定义的仓库, 请将以下内容添加到工程根目录下的一个 `.yarnrc` 文件中:

<div class="sample" markdown="1" mode="shell" theme="idea">

```
registry "http://my.registry/api/npm/"
```

</div>

关于 `.yarnrc` 文件的更多信息, 请参见 [Yarn 官方文档](https://classic.yarnpkg.com/en/docs/yarnrc/).

## 设置发布目录

默认设置下, Kotlin/JS 工程编译的输出在工程根目录下的 `/build/distribution` 目录内.

如果要为工程设置另外的发布位置, 请在编译脚本的 `browser` 节内添加 `distribution`, 在这里为 `directory` 属性设置一个值.
当你运行工程的构建任务时, Gradle 会将输出的 bundle 文件和工程的资源文件一起, 保存到这个位置.

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
kotlin.target.browser {
    distribution {
        directory = file("$projectDir/output/")
    }
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
kotlin.target.browser {
    distribution {
        directory = File("$projectDir/output/")
    }
}
```

</div>
</div>
