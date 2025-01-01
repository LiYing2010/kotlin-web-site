[//]: # (title: Maven)

要为基于 Maven 的项目生成文档, 你可以使用 Maven plugin for Dokka.

> 与 [Gradle plugin for Dokka](dokka-gradle.md) 相比, Maven plugin 只包括基本的功能, 不支持多模块构建.
>
{style="note"}

你可以访问我们的
[Maven 示例](https://github.com/Kotlin/dokka/tree/%dokkaVersion%/examples/maven) 项目,
实际接触一下 Dokka, 看看它如何对 Maven 项目进行配置.

## 应用 Dokka {id="apply-dokka"}

要应用 Dokka, 你需要在你的 POM 文件的 `plugins` 部分添加 `dokka-maven-plugin`:

```xml
<build>
    <plugins>
        <plugin>
            <groupId>org.jetbrains.dokka</groupId>
            <artifactId>dokka-maven-plugin</artifactId>
            <version>%dokkaVersion%</version>
            <executions>
                <execution>
                    <phase>pre-site</phase>
                    <goals>
                        <goal>dokka</goal>
                    </goals>
                </execution>
            </executions>
        </plugin>
    </plugins>
</build>
```

## 生成文档 {id="generate-documentation"}

Maven plugin 提供了以下 goal:

| **Goal**      | **描述**                                                 |
|---------------|--------------------------------------------------------|
| `dokka:dokka` | 通过应用的 Dokka plugin 生成文档. 默认使用 [HTML](dokka-html.md) 格式. |

### 试验性功能 {id="experimental"}

| **Goal**           | **描述**                                                      |
|--------------------|-------------------------------------------------------------|
| `dokka:javadoc`    | 生成文档, 使用 [Javadoc](dokka-javadoc.md) 格式.                    |
| `dokka:javadocJar` | 生成包含文档的 `javadoc.jar` 文件, 使用 [Javadoc](dokka-javadoc.md) 格式. |

### 其他输出格式 {id="other-output-formats"}

Maven plugin for Dokka 默认使用 [HTML](dokka-html.md) 输出格式构建文档.

其他所有输出格式都以 [Dokka plugin](dokka-plugins.md) 的形式实现.
要使用你需要的格式来生成文档, 你需要在配置中以 Dokka plugin 的形式添加这种格式.

例如, 要使用试验性的 [GFM](dokka-markdown.md#gfm) 格式, 你需要添加 `gfm-plugin` artifact:

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <dokkaPlugins>
            <plugin>
                <groupId>org.jetbrains.dokka</groupId>
                <artifactId>gfm-plugin</artifactId>
                <version>%dokkaVersion%</version>
            </plugin>
        </dokkaPlugins>
    </configuration>
</plugin>
```

使用这个配置, 运行 `dokka:dokka` goal 会生成 GFM 格式的文档.

关于 Dokka plugin, 更多详情请参见 [Dokka plugin](dokka-plugins.md).

## 构建 javadoc.jar {id="build-javadoc-jar"}

如果你想要将你的库发布到仓库, 你可能需要提供一个 `javadoc.jar` 文件, 其中包含你的库的 API 参考文档.

例如, 如果你想要发布到 [Maven Central](https://central.sonatype.org/),
你 [必须](https://central.sonatype.org/publish/requirements/) 和你的项目一起提供一个 `javadoc.jar`.
但是, 并不是所有的仓库都有这样的规则.

与 [Gradle plugin for Dokka](dokka-gradle.md#build-javadoc-jar) 不同, Maven plugin 包括直接可以使用的 `dokka:javadocJar` goal.
默认情况下, 它使用 [Javadoc](dokka-javadoc.md) 输出格式, 在`target` 文件夹生成文档.

如果你对内建的 goal 不满意, 或者想要自定义输出
(例如, 你想要使用 [HTML](dokka-html.md) 格式而不是 Javadoc 来生成文档),
可以使用以下配置添加 Maven JAR plugin:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.3.0</version>
    <executions>
        <execution>
            <goals>
                <goal>test-jar</goal>
            </goals>
        </execution>
        <execution>
            <id>dokka-jar</id>
            <phase>package</phase>
            <goals>
                <goal>jar</goal>
            </goals>
            <configuration>
                <classifier>dokka</classifier>
                <classesDirectory>${project.build.directory}/dokka</classesDirectory>
                <skipIfEmpty>true</skipIfEmpty>
            </configuration>
        </execution>
    </executions>
</plugin>
```

文档, 以及包含文档的 `.jar` 包, 现在通过运行 `dokka:dokka` 和 `jar:jar@dokka-jar` goal 来生成:

```bash
mvn dokka:dokka jar:jar@dokka-jar
```

> 如果你将你的库发布到 Maven Central, 你可以使用 [javadoc.io](https://javadoc.io/) 之类的服务,
> 免费托管你的库的 API 文档, 而且不需要任何设置. 它直接从 `javadoc.jar` 得到文档页面.
> 它可以很好的显示 HTML 格式文档, 参见 [这个示例](https://javadoc.io/doc/com.trib3/server/latest/index.html).
>
{style="tip"}

## 配置示例 {id="configuration-example"}

Maven 的 plugin 配置代码库可以用来配置 Dokka.

下面是一个基本配置的示例, 它只修改你的文档的输出位置:

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    ...
    <configuration>
        <outputDir>${project.basedir}/target/documentation/dokka</outputDir>
    </configuration>
</plugin>
```

## 配置选项 {id="configuration-options"}

Dokka 有很多配置选项, 可以用来定制你和你的读者的体验.

下面是对每个配置小节的一些示例和详细解释.
在本章的最后, 你还可以看到一个示例, 它使用了 [所有的配置选项](#complete-configuration).

### 一般配置 {id="general-configuration"}

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PROTECTED</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <!-- 参见其它章节 -->
        </sourceLinks>
        <externalDocumentationLinks>
            <!-- 参见其它章节 -->
        </externalDocumentationLinks>
        <perPackageOptions>
            <!-- 参见其它章节 -->
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="skip">
        <p>
            是否跳过文档生成.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="moduleName">
        <p>
            用来引用项目/模块的显示名称. 这个名称会用于目录, 导航, 日志, 等等.
        </p>
        <p>
            默认值: <code>{project.artifactId}</code>
        </p>
    </def>
    <def title="outputDir">
        <p>
            文档生成的目录, 无论哪种格式.
        </p>
        <p>
            默认值: <code>{project.basedir}/target/dokka</code>
        </p>
    </def>
    <def title="failOnWarning">
        <p>
            如果 Dokka 输出警告或错误, 是否让文档生成任务失败.
            进程首先会等待所有的错误和警告输出完毕.
        </p>
        <p>
            这个设置可以与 <code>reportUndocumented</code> 选项配合工作.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="suppressObviousFunctions">
        <p>
            是否禁止输出那些显而易见的函数.
        </p>
        <p>
            满足以下条件的函数, 会被认为是显而易见的函数:</p>
            <list>
                <li>
                    继承自 <code>kotlin.Any</code>, <code>Kotlin.Enum</code>, <code>java.lang.Object</code> 或 <code>java.lang.Enum</code>,
                    例如 <code>equals</code>, <code>hashCode</code>, <code>toString</code>.
                </li>
                <li>
                    合成(由编译器生成的)函数, 而且没有任何文档,
                    例如 <code>dataClass.componentN</code> 或 <code>dataClass.copy</code>.
                </li>
            </list>
        <p>
            默认值: <code>true</code>
        </p>
    </def>
    <def title="suppressInheritedMembers">
        <p>
            是否禁止输出在指定的类中继承得到的而且没有显式覆盖的成员.
        </p>
        <p>
            注意: 这个选项可以禁止输出 <code>equals</code>/<code>hashCode</code>/<code>toString</code> 之类的函数,
            但不能禁止输出 <code>dataClass.componentN</code> 和 <code>dataClass.copy</code> 之类的合成函数.
            对合成函数, 请使用 <code>suppressObviousFunctions</code> 选项.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="offlineMode">
        <p>
            是否通过你的网络来解析远程的文件/链接.
        </p>
        <p>
            包括用来生成外部文档链接的包列表.
            例如, 可以让来自标准库的类成为文档中可以点击的链接.
        </p>
        <p>
            将这个选项设置为 <code>true</code>, 某些情况下可以显著提高构建速度, 但也会降低文档质量和用户体验.
            例如, 可以不解析来自你的依赖项的类/成员的链接, 包括标准库.
        </p>
        <p>
            注意: 你可以将已取得的文件缓存到本地, 并通过本地路径提供给 Dokka.
            参见 <code>externalDocumentationLinks</code> 小节.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="sourceDirectories">
        <p>
            需要分析并生成文档的源代码根目录.
            允许的输入是目录和单独的 <code>.kt</code> / <code>.java</code> 文件.
        </p>
        <p>
            默认值: <code>{project.compileSourceRoots}</code>
        </p>
    </def>
    <def title="documentedVisibilities">
        <p>
            这个选项设置需要生成文档的可见度修饰符.
        </p>
        <p>
            如果你想要对 <code>protected</code>/<code>internal</code>/<code>private</code> 声明生成文档,
            以及如果你想要排除 <code>public</code> 声明, 只为 internal API 生成文档,
            这个选项会很有用.
        </p>
        <p>
            可以对每个包为单位进行配置.
        </p>
        <p>
            默认值: <code>PUBLIC</code>
        </p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的、无文档的声明输出警告,
            这是指经过 <code>documentedVisibilities</code> 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.
        </p>
        <p>
            这个设置可以与 <code>failOnWarning</code> 选项配合工作.
        </p>
        <p>
            这个设置可以在包级覆盖.
        </p>
        <p>默认值: <code>false</code></p>
    </def>
    <def title="skipDeprecated">
        <p>
            是否对标注了 <code>@Deprecated</code> 注解的声明生成文档.
        </p>
        <p>
            这个设置可以在包级覆盖.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="skipEmptyPackages">
        <p>
            是否跳过经各种过滤器过滤之后不包含可见声明的包.
        </p>
        <p>
            例如, 如果 <code>skipDeprecated</code> 设置为 <code>true</code>, 而且你的包中只包含已废弃的声明, 那么这个包会被认为是空的.
        </p>
        <p>
            默认值: <code>true</code>
        </p>
    </def>
    <def title="suppressedFiles">
        <p>
            需要禁止输出的目录或单独的文件, 意思是说, 对于来自这些目录和文件的声明, 不会生成文档.
        </p>
    </def>
    <def title="jdkVersion">
        <p>
            在为 Java 类型生成外部文档链接时使用的 JDK 版本.
        </p>
        <p>
            例如, 如果你在某些 public 声明的签名中使用了 <code>java.util.UUID</code>,
            而且这个选项设置为 <code>8</code>, Dokka 会为它生成一个指向
            <a href="https://docs.oracle.com/javase/8/docs/api/java/util/UUID.html">JDK 8 Javadocs</a>
            的外部文档链接.
        </p>
        <p>
            默认值: JDK 8
        </p>
    </def>
    <def title="languageVersion">
        <p>
            设置代码分析和 <a href="kotlin-doc.md#sample-identifier">@sample</a> 环境时使用的
            <a href="compatibility-modes.md">Kotlin 语言版本</a>.
        </p>
        <p>
            默认情况下, 会使用 Dokka 的内嵌编译器所能够使用的最新的语言版本.
        </p>
    </def>
    <def title="apiVersion">
        <p>
            设置代码分析和 <a href="kotlin-doc.md#sample-identifier">@sample</a> 环境时使用的
            <a href="compatibility-modes.md">Kotlin API 版本</a>.
        </p>
        <p>
            默认情况下, 从 <code>languageVersion</code> 推断得到.
        </p>
    </def>
    <def title="noStdlibLink">
        <p>
            是否生成指向 Kotlin 标准库的 API 参考文档的外部文档链接.
        </p>
        <p>
            注意: 当 <code>noStdLibLink</code> 设置为 <code>false</code> 时, <b>会</b> 生成链接.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="noJdkLink">
        <p>
            是否生成指向 JDK 的 Javadoc 的外部文档链接.
        </p>
        <p>
            JDK Javadoc 版本会通过 <code>jdkVersion</code> 选项决定.
        </p>
        <p>
            注意: 当 <code>noJdkLink</code> 设置为 <code>false</code> 时, <b>会</b> 生成链接.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="includes" id="includes">
        <p>
            包含 <a href="dokka-module-and-package-docs.md">模块和包文档</a> 的 Markdown 文件列表.
        </p>
        <p>
            指定的文件的内容会被解析, 并嵌入到文档内, 作为模块和包的描述文档.
        </p>
    </def>
    <def title="classpath">
        <p>
            用于代码分析和交互式示例的类路径.
        </p>
        <p>
            如果来自依赖项的某些类型无法自动的解析/查找, 这个选项会很有用.
            这个选项可以接受 <code>.jar</code> 和 <code>.klib</code> 文件.
        </p>
        <p>
            默认值: <code>{project.compileClasspathElements}</code>
        </p>
    </def>
    <def title="samples">
        <p>
            目录或文件的列表, 其中包含通过
            <a href="kotlin-doc.md#sample-identifier">@sample KDoc tag.</a>
            引用的示例函数.
        </p>
    </def>
</deflist>

### 源代码链接配置 {id="source-link-configuration"}

`sourceLinks` 配置块可以用来为每个签名添加 `source` 链接, 链接地址是带有特定代码行的 `url`. (代码行可以通过 `lineSuffix` 进行配置).

这样可以帮助读者找到每个声明的源代码.

例如, 请参见 `kotlinx.coroutines` 中
[`count()`](https://kotlinlang.org/api/kotlinx.coroutines/kotlinx-coroutines-core/kotlinx.coroutines.flow/count.html)
函数的文档.

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="path">
        <p>
            本地源代码目录的路径. 必须是从当前模块根目录开始的相对路径.
        </p>
        <p>
            注意: 只允许使用 Unix 风格路径, Windows 风格路径会产生错误.
        </p>
    </def>
    <def title="url">
        <p>
            可以由文档读者访问的源代码托管服务 URL, 例如 GitHub, GitLab, Bitbucket, 等等.
            这个 URL 用来生成声明的源代码链接.
        </p>
    </def>
    <def title="lineSuffix">
        <p>
            向 URL 添加的源代码行数后缀. 这样可以帮助读者, 不仅能够导航到文件, 而且是声明所在的确定的行数.
        </p>
        <p>
            行数本身会添加到后缀之后. 例如, 如果这个选项设置为 <code>#L</code>, 行数是 10,
            那么最后的 URL 后缀会是 <code>#L10</code>.
        </p>
        <p>
            各种常用的源代码托管服务的行数后缀是:</p>
            <list>
            <li>GitHub: <code>#L</code></li>
            <li>GitLab: <code>#L</code></li>
            <li>Bitbucket: <code>#lines-</code></li>
            </list>
    </def>
</deflist>

### 外部文档链接配置 {id="external-documentation-links-configuration"}

`externalDocumentationLinks` 配置块可以创建链接, 指向你的依赖项的外部文档.

例如, 如果你使用来自 `kotlinx.serialization` 的类型, 默认情况下, 在你的文档中这些类型不是可点击的链接, 因为无法解析这些类型.
但是, 由于 `kotlinx.serialization` 的 API 参考文档是使用 Dokka 构建的, 而且
[发布到了 kotlinlang.org](https://kotlinlang.org/api/kotlinx.serialization/),
因此你可以对它配置外部文档链接.
然后就可以让 Dokka 对来自这个库的类型生成链接, 让它们成功的解析, 并在文档中成为可点击的链接.

默认情况下, 已经配置了对 Kotlin 标准库和 JDK 的外部文档链接.

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/kotlinx.serialization/</url>
                <packageListUrl>file:/${project.basedir}/serialization.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="url">
        <p>
            链接到的文档的根 URL. 最末尾 <b>必须</b> 包含斜线.
        </p>
        <p>
            Dokka 会尽量对给定的 URL 自动寻找 <code>package-list</code>, 并将声明链接到一起.
        </p>
        <p>
            如果自动解析失败, 或者如果你想要使用本地缓存的文件, 请考虑设置 <code>packageListUrl</code> 选项.
        </p>
    </def>
    <def title="packageListUrl">
        <p>
            <code>package-list</code> 的确切位置.
            这是对 Dokka 自动解析的一个替代手段.
        </p>
        <p>
            包列表包含关于文档和项目自身的信息, 例如模块和包的名称.
        </p>
        <p>
            也可以使用本地缓存的文件, 以避免发生网络访问.
        </p>
    </def>
</deflist>

### 包选项 {id="package-options"}

`perPackageOptions` 配置块可以对指定的包设置一些选项, 包通过 `matchingRegex` 来匹配.

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>
```

<deflist collapsible="true">
    <def title="matchingRegex">
        <p>
            用来匹配包的正规表达式.
        </p>
        <p>
            默认值: <code>.*</code>
        </p>
 </def>
    <def title="suppress">
        <p>
            在生成文档时, 是否应该跳过这个包.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="documentedVisibilities">
        <p>
            应该生成文档的可见度标识符集合.
        </p>
        <p>
            如果你想要对这个包内的 <code>protected</code>/<code>internal</code>/<code>private</code> 声明生成文档,
            以及如果你想要排除 <code>public</code> 声明, 只为 internal API 生成文档,
            这个选项可以很有用.
        </p>
        <p>
            默认值: <code>PUBLIC</code>
        </p>
    </def>
    <def title="skipDeprecated">
        <p>
            是否对标注了 <code>@Deprecated</code> 注解的声明生成文档.
        </p>
        <p>
            这个选项可以在项目/模块级设置.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
    <def title="reportUndocumented">
        <p>
            是否对可见的、无文档的声明输出警告,
            这是指经过 <code>documentedVisibilities</code> 和其他过滤器过滤之后, 需要输出文档, 但没有 KDocs 的声明.
        </p>
        <p>
            这个设置可以与 <code>failOnWarning</code> 选项配合工作.
        </p>
        <p>
            默认值: <code>false</code>
        </p>
    </def>
</deflist>

### 完整的配置 {id="complete-configuration"}

下面的例子中, 你可以看到同时使用了所有的配置选项.

```xml
<plugin>
    <groupId>org.jetbrains.dokka</groupId>
    <artifactId>dokka-maven-plugin</artifactId>
    <!--  ...  -->
    <configuration>
        <skip>false</skip>
        <moduleName>${project.artifactId}</moduleName>
        <outputDir>${project.basedir}/target/documentation</outputDir>
        <failOnWarning>false</failOnWarning>
        <suppressObviousFunctions>true</suppressObviousFunctions>
        <suppressInheritedMembers>false</suppressInheritedMembers>
        <offlineMode>false</offlineMode>
        <sourceDirectories>
            <dir>${project.basedir}/src</dir>
        </sourceDirectories>
        <documentedVisibilities>
            <visibility>PUBLIC</visibility>
            <visibility>PRIVATE</visibility>
            <visibility>PROTECTED</visibility>
            <visibility>INTERNAL</visibility>
            <visibility>PACKAGE</visibility>
        </documentedVisibilities>
        <reportUndocumented>false</reportUndocumented>
        <skipDeprecated>false</skipDeprecated>
        <skipEmptyPackages>true</skipEmptyPackages>
        <suppressedFiles>
            <file>/path/to/dir</file>
            <file>/path/to/file</file>
        </suppressedFiles>
        <jdkVersion>8</jdkVersion>
        <languageVersion>1.7</languageVersion>
        <apiVersion>1.7</apiVersion>
        <noStdlibLink>false</noStdlibLink>
        <noJdkLink>false</noJdkLink>
        <includes>
            <include>packages.md</include>
            <include>extra.md</include>
        </includes>
        <classpath>${project.compileClasspathElements}</classpath>
        <samples>
            <dir>${project.basedir}/samples</dir>
        </samples>
        <sourceLinks>
            <link>
                <path>src</path>
                <url>https://github.com/kotlin/dokka/tree/master/src</url>
                <lineSuffix>#L</lineSuffix>
            </link>
        </sourceLinks>
        <externalDocumentationLinks>
            <link>
                <url>https://kotlinlang.org/api/latest/jvm/stdlib/</url>
                <packageListUrl>file:/${project.basedir}/stdlib.package.list</packageListUrl>
            </link>
        </externalDocumentationLinks>
        <perPackageOptions>
            <packageOptions>
                <matchingRegex>.*api.*</matchingRegex>
                <suppress>false</suppress>
                <reportUndocumented>false</reportUndocumented>
                <skipDeprecated>false</skipDeprecated>
                <documentedVisibilities>
                    <visibility>PUBLIC</visibility>
                    <visibility>PRIVATE</visibility>
                    <visibility>PROTECTED</visibility>
                    <visibility>INTERNAL</visibility>
                    <visibility>PACKAGE</visibility>
                </documentedVisibilities>
            </packageOptions>
        </perPackageOptions>
    </configuration>
</plugin>
```
