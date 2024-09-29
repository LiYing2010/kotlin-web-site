[//]: # (title: HTML)

最终更新: %latestDocDate%

HTML 是 Dokka 的默认并且推荐的输出格式. 目前处于 Beta 版, 正在接近稳定发布版.

你可以浏览
[kotlinx.coroutines](https://kotlinlang.org/api/kotlinx.coroutines/)
的文档, 看看 HTML 输出的示例.

## 生成 HTML 文档 {id="generate-html-documentation"}

所有的运行器都支持 HTML 输出格式. 要生成 HTML 文档, 请根据你的构建工具和运行器, 执行以下步骤:

* 对于 [Gradle](dokka-gradle.md#generate-documentation), 运行 `dokkaHtml` 或 `dokkaHtmlMultiModule` task.
* 对于 [Maven](dokka-maven.md#generate-documentation), 运行 `dokka:dokka` goal.
* 对于 [CLI 运行器](dokka-cli.md#generate-documentation), 运行 HTML 依赖项集合.

> 这种格式生成的 HTML 页面, 需要托管在 Web 服务器上, 才能正常显示它的全部内容.
>
> 你可以使用任何免费的静态网站托管服务, 例如
> [GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/about-github-pages).
>
> 在本地, 你可以使用 [内建的 IntelliJ Web 服务器](https://www.jetbrains.com/help/idea/php-built-in-web-server.html).
>
{style="note"}

## 配置 {id="configuration"}

HTML 格式是 Dokka 的基本格式, 因此它可以通过 `DokkaBase` 和 `DokkaBaseConfiguration` 类配置:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

通过类型安全的 Kotlin DSL:

```kotlin
import org.jetbrains.dokka.base.DokkaBase
import org.jetbrains.dokka.gradle.DokkaTask
import org.jetbrains.dokka.base.DokkaBaseConfiguration

buildscript {
    dependencies {
        classpath("org.jetbrains.dokka:dokka-base:%dokkaVersion%")
    }
}

tasks.withType<DokkaTask>().configureEach {
    pluginConfiguration<DokkaBase, DokkaBaseConfiguration> {
        customAssets = listOf(file("my-image.png"))
        customStyleSheets = listOf(file("my-styles.css"))
        footerMessage = "(c) 2022 MyOrg"
        separateInheritedMembers = false
        templatesDir = file("dokka/templates")
        mergeImplicitExpectActualDeclarations = false
    }
}
```

通过 JSON:

```kotlin
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType<DokkaTask>().configureEach {
    val dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg",
      "separateInheritedMembers": false,
      "templatesDir": "${file("dokka/templates")}",
      "mergeImplicitExpectActualDeclarations": false
    }
    """
    pluginsMapConfiguration.set(
        mapOf(
            // plugin 的完整限定名称, to, json 配置
            "org.jetbrains.dokka.base.DokkaBase" to dokkaBaseConfiguration
        )
    )
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
import org.jetbrains.dokka.gradle.DokkaTask

tasks.withType(DokkaTask.class) {
    String dokkaBaseConfiguration = """
    {
      "customAssets": ["${file("assets/my-image.png")}"],
      "customStyleSheets": ["${file("assets/my-styles.css")}"],
      "footerMessage": "(c) 2022 MyOrg"
      "separateInheritedMembers": false,
      "templatesDir": "${file("dokka/templates")}",
      "mergeImplicitExpectActualDeclarations": false
    }
    """
    pluginsMapConfiguration.set(
        // plugin 的完整限定名称, :, json 配置
        ["org.jetbrains.dokka.base.DokkaBase": dokkaBaseConfiguration]
    )
}
```

</tab>
<tab title="Maven" group-key="mvn">

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <pluginsConfiguration>
            <!-- plugin 的完整限定名称 -->
            <org.jetbrains.dokka.base.DokkaBase>
                <!-- 选项名称 -->
                <customAssets>
                    <asset>${project.basedir}/my-image.png</asset>
                </customAssets>
                <customStyleSheets>
                    <stylesheet>${project.basedir}/my-styles.css</stylesheet>
                </customStyleSheets>
                <footerMessage>(c) MyOrg 2022 Maven</footerMessage>
                <separateInheritedMembers>false</separateInheritedMembers>
                <templatesDir>${project.basedir}/dokka/templates</templatesDir>
                <mergeImplicitExpectActualDeclarations>false</mergeImplicitExpectActualDeclarations>
            </org.jetbrains.dokka.base.DokkaBase>
        </pluginsConfiguration>
    </configuration>
</plugin>
```

</tab>
<tab title="CLI" group-key="cli">

通过 [命令行选项](dokka-cli.md#run-with-command-line-options):

```Bash
java -jar dokka-cli-%dokkaVersion%.jar \
     ...
     -pluginsConfiguration "org.jetbrains.dokka.base.DokkaBase={\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}
"
```

通过 [JSON 配置](dokka-cli.md#run-with-json-configuration):

```json
{
  "moduleName": "Dokka Example",
  "pluginsConfiguration": [
    {
      "fqPluginName": "org.jetbrains.dokka.base.DokkaBase",
      "serializationFormat": "JSON",
      "values": "{\"customAssets\": [\"my-image.png\"], \"customStyleSheets\": [\"my-styles.css\"], \"footerMessage\": \"(c) 2022 MyOrg\", \"separateInheritedMembers\": false, \"templatesDir\": \"dokka/templates\", \"mergeImplicitExpectActualDeclarations\": false}"
    }
  ]
}
```

</tab>
</tabs>

### 配置选项 {id="configuration-options"}

下表包括所有可以使用的配置选项, 以及它们的用途.

| **选项**                                  | **描述**                                                                                                                                         |
|-----------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------|
| `customAssets`                          | 要与文档绑定到一起的图片资源的路径列表. 图片资源可以使用任意的文件扩展名. 更多详情请参见 [自定义资源](#customize-assets).                                                                     |
| `customStyleSheets`                     | 要与文档绑定到一起并在显示时使用的 `.css` 样式表的路径列表. 更多详情请参见 [自定义样式表](#customize-styles).                                                                        |
| `templatesDir`                          | 包含自定义 HTML 模板的目录路径. 更多详情请参见 [模板](#templates).                                                                                                  |
| `footerMessage`                         | 在页脚显示的文字.                                                                                                                                      |
| `separateInheritedMembers`              | 这是一个 boolean 选项. 如果设置为 `true`, Dokka 会将属性/函数与继承的属性/继承的函数分开显示. 这个设置默认关闭.                                                                        |
| `mergeImplicitExpectActualDeclarations` | 这是一个 boolean 选项. 如果设置为 `true`, Dokka 合并那些没有声明为 [expect/actual](multiplatform-connect-to-apis.md) 的声明, 但使用相同的完整限定名称. 这个设置对旧的代码库可能很有用. 这个设置默认关闭. |

关于 Dokka plugin 配置的更多详情, 请参见 [配置 Dokka plugins](dokka-plugins.md#configure-dokka-plugins).

## 自定义 {id="customization"}

为了帮助你为你的文档添加自己的外观和风格, HTML 格式支持很多的自定义选项.

### 自定义样式表 {id="customize-styles"}

你可以使用 `customStyleSheets` [配置选项](#configuration), 使用你自己的样式表.
这些配置会被应用于所有的页面.

可以通过提供相同名称的文件来覆盖 Dokka 的默认样式表:

| **样式表名称**         | **描述**                                         |
|-------------------|------------------------------------------------|
| `style.css`       | 主样式表, 包含在所有页面中使用的大部分样式                         |
| `logo-styles.css` | 页头 logo 样式                                     |
| `prism.css`       | 用于 [PrismJS](https://prismjs.com/) 语法高亮度显示器的样式 |

Dokka 所有样式表的源代码, 请参见
[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/styles).

### 自定义资源 {id="customize-assets"}

你可以使用 `customAssets` [配置选项](#configuration), 提供你自己的绑定到文档的图片. 

这些文件会被复制到 `<output>/images` 目录.

可以通过提供相同名称的文件来覆盖 Dokka 的图片和图标.
最重要的是 `logo-icon.svg`, 它是用于页头的图片. 其他主要是图标.

Dokka 使用的所有图片, 请参见
[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/images).

### 修改 logo {id="change-the-logo"}

要自定义 logo, 你可以从 [提供你自己的 `logo-icon.svg` 资源](#customize-assets) 开始.

如果你不喜欢它的外观, 或者你想要使用 `.png` 文件, 而不是默认的 `.svg` 文件,
你可以 [覆盖 `logo-styles.css` 样式表](#customize-styles) 来定制它.

具体的例子, 请参见我们的
[自定义格式的示例项目](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/gradle/dokka-customFormat-example).

### 修改页脚 {id="modify-the-footer"}

你可以使用 `footerMessage` [配置选项](#configuration), 修改页脚中的文字.

### 模板 {id="templates"}

Dokka 提供了修改用于生成文档页面的 [FreeMarker](https://freemarker.apache.org/) 模板的能力.

你可以完全彻底的修改页头, 添加你的自己的横幅/菜单/搜索, 负载析, 修改页面 body 样式, 等等等等.

Dokka 使用以下模板:

| **模板**                             | **描述**                                                          |
|------------------------------------|-----------------------------------------------------------------|
| `base.ftl`                         | 定义显示的所有页面的通常设计.                                                 |
| `includes/header.ftl`              | 页头, 默认包含 logo, 版本, 源代码集选择器, 浅色/深色主题切换, 以及搜索.                    |
| `includes/footer.ftl`              | 页脚, 包含 `footerMessage` [配置选项](#configuration), 以及版权信息.          |
| `includes/page_metadata.ftl`       | 在 `<head>` 容器内使用的元数据.                                           |
| `includes/source_set_selector.ftl` | 页头中的 [源代码集](multiplatform-discover-project.md#source-sets) 选择器. |

基础模板是 `base.ftl`, 它引入(include)其它所有模板.
Dokka 所有模板的源代码请参见
[GitHub](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-base/src/main/resources/dokka/templates).

你可以使用 `templatesDir` [配置选项](#configuration) 覆盖任何一个模板.
Dokka 会在指定的目录搜索指定的模板名称. 如果无法找到用户定义的模板, 它会使用默认模板.

#### 变量 {id="variables"}

下表是在所有模板内可以使用的变量:

| **变量**             | **描述**                                                                                                                          |
|--------------------|---------------------------------------------------------------------------------------------------------------------------------|
| `${pageName}`      | 页面名称                                                                                                                            |
| `${footerMessage}` | `footerMessage` [配置选项](#configuration) 设置的文字                                                                                    |
| `${sourceSets}`    | 用于对跨平台页面的 [源代码集](multiplatform-discover-project.md#source-sets) List, 可为 null. List 中的每个元素包含 `name`, `platform`, 和 `filter` 属性. |
| `${projectName}`   | 项目名称. 只能在 `template_cmd` 命令内使用.                                                                                                 |
| `${pathToRoot}`    | 从当前页面到根的路径. 可以用于定位资源, 只能在 `template_cmd` 命令内使用.                                                                                 |

变量 `projectName` 和 `pathToRoot` 只能在 `template_cmd` 命令内使用,
因为它们需要更多的上下文信息, 因此需要在更晚的阶段由 [MultiModule](dokka-gradle.md#multi-project-builds) task 解析:

```html
<@template_cmd name="projectName">
    <span>${projectName}</span>
</@template_cmd>
```

#### 命令 {id="directives"}

你也可以使用下面这些由 Dokka 定义的 [命令](https://freemarker.apache.org/docs/ref_directive_userDefined.html):

| **变量**          | **描述**                                                                                                                                                                |
|-----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `<@content/>`   | 主页面内容.                                                                                                                                                                |
| `<@resources/>` | 资源, 例如脚本和样式表.                                                                                                                                                         |
| `<@version/>`   | 从配置得到的模块版本. 如果应用了 [versioning plugin](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/dokka-subprojects/plugin-versioning), 它会被替换为一个版本导航器. |
