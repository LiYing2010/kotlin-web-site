[//]: # (title: All-open 编译器插件)

最终更新: %latestDocDate%

Kotlin 的类和成员默认都是 `final` 的, 但有些框架和库, 比如 Spring AOP, 需要类是 `open` 的, 因此造成一些不便.
`all-open` 编译器插件会调整 Kotlin 类, 以这些框架的需求,
它会将标记了特定注解的类及其成员变为 open , 而不需要在代码中明确标记 `open` 关键字.

比如, 当你使用 Spring 时, 你不需要所有的类都变为 open, 只需要标注了特定注解的类, 比如 `@Configuration` 或 `@Service`.
`all-open` 插件允许你指定这样的注解.

Kotlin 为 `all-open` 插件提供了 Gradle 和 Maven 支持, 并带有完整的 IDE 集成.

> 对于 Spring, 你可以使用 [`kotlin-spring` 编译器插件](#spring-support).
>
{style="note"}

## Gradle

在你的 `build.gradle(.kts)` 文件中添加插件:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.allopen") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.allopen" version "%kotlinVersion%"
}
```

</tab>
</tabs>

然后指定需要将类变为 open 的注解:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

</tab>
</tabs>

如果类 (或它的任何超类) 标注了 `com.my.Annotation` 注解, 那么类本身和它的成员都会变为 open.

对元注解(meta-annotation)同样有效:

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // all-open 插件也会将这个类变为 open
```

`MyFrameworkAnnotation` 标注了 all-open 元注解 `com.my.Annotation`, 因此它也成为一个 all-open 注解.

## Maven

在你的 `pom.xml` 文件中添加插件:

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- 或者使用 "spring", 支持 Spring -->
            <plugin>all-open</plugin>
        </compilerPlugins>

        <pluginOptions>
            <!-- 每个注解放在单独的行 -->
            <option>all-open:annotation=com.my.Annotation</option>
            <option>all-open:annotation=com.their.AnotherAnnotation</option>
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-allopen</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

关于 all-open 注解的工作方式, 详情请参见 [Gradle 小节](#gradle).

## Spring 支持 {id="spring-support"}

如果你使用 Spring, 你可以启用 `kotlin-spring` 编译器插件, 而不必手动指定 Spring 注解.
`kotlin-spring` 是对 `all-open` 的一个上层封装, 它的工作方式完全相同.

在你的 `build.gradle(.kts)` 文件中添加 `spring` 插件:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    id("org.jetbrains.kotlin.plugin.spring") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.spring" version "%kotlinVersion%"
}
```

</tab>
</tabs>

在 Maven 中, `spring` 插件由 `kotlin-maven-allopen` 插件依赖项提供, 因此在你的`pom.xml` 文件中要这样启用它:

```xml
<compilerPlugins>
    <plugin>spring</plugin>
</compilerPlugins>

<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-allopen</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

这个插件指定了以下注解:
* [`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
* [`@Async`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html)
* [`@Transactional`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html)
* [`@Cacheable`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html)
* [`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html)

得益于元注解功能, 由注解 [`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html),
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html),
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html),
[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
或 [`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
标注的类, 都会自动变为 open, 因为这些注解都标注了元注解
[`@Component`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html).

当然, 你也可以在同一个项目内同时使用 `kotlin-allopen` 和 `kotlin-spring`.

> 如果你使用 [start.spring.io](https://start.spring.io/#!language=kotlin) 服务生成项目模板,
> `kotlin-spring` 插件默认会被启用.
>
{style="note"}

## 命令行编译器

All-open 编译器插件的 JAR 文件 存在于 Kotlin 编译器的二进制发布包中.
你可以使用 `-Xplugin` kotlinc 选项指定它的 JAR 文件路径, 来添加这个插件:

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

可以使用 `annotation` 插件选项直接指定 all-open 注解, 或者启用 _预设置(preset)_:

```bash
# 插件选项格式是: "-P plugin:<plugin id>:<key>=<value>".
# 选项可以重复.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

`all-open` 插件可以使用的预设置是: `spring`, `micronaut`, 和 `quarkus`.
