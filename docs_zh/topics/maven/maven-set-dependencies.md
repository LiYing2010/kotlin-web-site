[//]: # (title: 在 Maven 项目中设置仓库和依赖项)

对于你的 Kotlin Maven 项目, 除默认的 Maven Central 仓库之外, 可以配置 Maven 查找 artifact 的位置,
还可以定义你的项目所依赖的库.

## 声明仓库 {id="declare-repositories"}

默认情况下, 所有 Maven 项目都可以使用 `mavenCentral` 仓库.
要访问其他仓库中的 artifact, 请在 `<repositories>` 节中, 为仓库名称指定自定义 ID 和 URL:

```xml
<repositories>
    <repository>
        <id>spring-repo</id>
        <url>https://repo.spring.io/release</url>
    </repository>
</repositories>
```

> 如果你在 Gradle 项目中将 `mavenLocal()` 声明为仓库, 在 Gradle 和 Maven 项目之间切换时可能会遇到问题.
> 详情请参见 [声明仓库](gradle-configure-project.md#declare-repositories).
>
{style="note"}

通常, 要添加对某个库的依赖项, 你应该在 `<dependencies>` 节中声明一个新的 `<dependency>` 条目:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-serialization-json</artifactId>
        <version>%serializationVersion%</version>
    </dependency>
</dependencies>
```

## 设置依赖项 {id="set-dependencies"}

### 对标准库的依赖项 {id="dependency-on-the-standard-library"}

Kotlin 有一个功能丰富的标准库, 可以在你的应用程序中使用.
你可以手动添加标准库的依赖项, 也可以启用 `<extensions>` 选项, 在缺少这个依赖项时自动配置.

#### 自动配置 {id="automatic-setup"}

你可以使用 Kotlin Maven 插件提供的 [`<extensions>` 选项](maven-configure-project.md#automatic-configuration), 这样就可以不必手动配置.
如果项目中没有定义 `kotlin-stdlib` 的依赖项, 它会自动添加这个依赖项.
例如, 当你创建新的 Kotlin Maven 项目, 或将 Kotlin 引入到现有的 Java Maven 项目时.

如果你已经声明了 `kotlin-stdlib` 依赖项, 例如使用了不同的版本, Kotlin Maven plugin 的 `<extensions>` 
不会覆盖它.

你也可以关闭标准库的自动添加. 方法是, 在 `<properties>` 节中添加以下内容:

```xml
<project>
    <properties>
        <kotlin.smart.defaults.enabled>false</kotlin.smart.defaults.enabled>
    </properties>
</project>
```

> 这个属性不仅会禁用标准库的自动添加, 还会禁用源代码根路径的注册.
> `<extensions>` 的其他功能不受影响.
>
{style="note"}

#### 手动配置 {id="manual-configuration"}

要手动将 Kotlin 标准库添加到你的项目, 请更新 `pom.xml` 文件中的 `dependencies` 节, 内容如下:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-stdlib</artifactId>
        <!-- 使用 <properties/> 中指定的 kotlin.version: -->
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

> 如果你的目标平台是 JDK 7 或 8, 并且使用的 Kotlin 版本早于:
> * 1.8, 请分别使用 `kotlin-stdlib-jdk7` 或 `kotlin-stdlib-jdk8`.
> * 1.2, 请分别使用 `kotlin-stdlib-jre7` 或 `kotlin-stdlib-jre8`.
>
{style="note"}

### 对测试库的依赖项 {id="dependencies-on-test-libraries"}

如果你的项目使用 [Kotlin 反射](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/),
或测试框架, 请添加相关的依赖项.
对反射库, 请使用 `kotlin-reflect`, 对测试库, 请使用 `kotlin-test` 和 `kotlin-test-junit5`:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-reflect</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-test-junit5</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

### 对 kotlinx 库的依赖项 {id="dependency-on-a-kotlinx-library"}

对 kotlinx 库, 你可以添加基础 artifact 名, 或带有 `-jvm` 后缀的 artifact 名.
请参考 [klibs.io](https://klibs.io/) 库的 README 文件.

例如, 添加 [`kotlinx.coroutines`](https://kotlinlang.org/api/kotlinx.coroutines/) 库的依赖项:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-coroutines-core</artifactId>
        <version>%coroutinesVersion%</version>
    </dependency>
</dependencies>
```

添加 [`kotlinx-datetime`](https://kotlinlang.org/api/kotlinx-datetime/) 库的依赖项:

```xml
<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlinx</groupId>
        <artifactId>kotlinx-datetime-jvm</artifactId>
        <version>%dateTimeVersion%</version>
    </dependency>
</dependencies>
```

### 使用 BOM 依赖机制 {id="use-bom-dependency-mechanism"}

要使用 Kotlin [物料清单 (Bill of Materials, BOM)](https://maven.apache.org/guides/introduction/introduction-to-dependency-mechanism.html#bill-of-materials-bom-poms),
请添加对 [`kotlin-bom`](https://mvnrepository.com/artifact/org.jetbrains.kotlin/kotlin-bom) 的依赖项:

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-bom</artifactId>
            <version>%kotlinVersion%</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

## 下一步做什么? {id="whats-next"}

[配置 Kotlin 编译器](maven-kotlin-compiler.md)
