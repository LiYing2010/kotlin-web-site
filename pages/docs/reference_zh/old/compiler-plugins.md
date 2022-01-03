---
type: doc
layout: reference
title: "编译器插件"
---

# 编译器插件

* [All-open 编译器插件](#all-open-compiler-plugin)
* [No-arg 编译器插件](#no-arg-compiler-plugin)
* [SAM-with-receiver 编译器插件](#sam-with-receiver-compiler-plugin)
* [`Parcelable` 实现代码生成器](#parcelable-implementations-generator)

## All-open 编译器插件

Kotlin 默认会将类及其成员定义为 `final` 的, 而某些框架或库要求类为 `open`, 比如 Spring AOP, 因此导致使用这些框架或库时的不便.
*all-open* 编译器插件可以帮助 Kotlin 满足这些框架或库的要求, 如果类添加了某个特定的注解,
插件会将这个类以及它的成员变为 `open`, 而不必明确地标记 `open` 关键字.

比如, 当使用 Spring 时, 你不需要所有的类都是 `open` 的, 而只需要添加了特定注解的类为 `open`, 比如 `@Configuration` 注解, 或 `@Service` 注解.
*all-open* 插件可以指定这些注解.

对 *all-open* 插件, 我们提供 Gradle 和 Maven 的支持, 以及完全的 IDE 支持.

注意: 对于 Spring, 你可以使用 `kotlin-spring` 编译器插件(详情请 [参见下文](compiler-plugins.html#spring-support)).

### 在 Gradle 中使用

将插件 artifact 添加到编译脚本的依赖项目中, 然后应用插件:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-allopen"
```

</div>

或者, 你也可以使用 `plugins` 代码段来应用这个插件:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.allopen" version "{{ site.data.releases.latest.version }}"
}
```

</div>

然后指定将哪些注解标注的类变为 `open`:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
allOpen {
    annotation("com.my.Annotation")
    // annotations("com.another.Annotation", "com.third.Annotation")
}
```

</div>

如果类 (或者它的任何一个超类) 标注了 `com.my.Annotation` 注解, 那么类本身, 以及它的所有成员都会变为 `open` 的.

对于元注解(meta-annotation)也有效:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // 这个类将会变为 open
```

</div>

由于 `MyFrameworkAnnotation` 被标注了 all-open 的元注解(meta-annotation) `com.my.Annotation`, 因此它也会成为一个 all-open 注解.

### 在 Maven 中使用

下面是在 Maven 中使用 all-open 插件的方法:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

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

</div>

关于 all-open 注解工作原理的详细信息, 请参照上文的 "在 Gradle 中使用" 小节.

### Spring 支持

如果你使用 Spring, 你可以使用 *kotlin-spring* 编译器插件, 而不必手动指定 Spring 注解.
*kotlin-spring* 是在 *all-open* 之上的一层封装, 工作方式完全相同.

与 all-open 一样, 你需要将 *kotlin-spring* 插件添加到编译脚本的依赖项目中:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-spring" // 而不是使用 "kotlin-allopen"
```

</div>

或者使用 Gradle plugin DSL 语法:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.spring" version "{{ site.data.releases.latest.version }}"
}
```

</div>

在 Maven 中, `spring` 插件由 `kotlin-maven-allopen` 插件依赖项提供,
因此如果需要启用它, 需要添加以下设定:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<configuration>
    <compilerPlugins>
        <plugin>spring</plugin>
    </compilerPlugins>
</configuration>

<dependencies>
    <dependency>
        <groupId>org.jetbrains.kotlin</groupId>
        <artifactId>kotlin-maven-allopen</artifactId>
        <version>${kotlin.version}</version>
    </dependency>
</dependencies>
```

</div>

这个 plugin 将会指定以下注解:
[`@Component`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html),
[`@Async`](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html),
[`@Transactional`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html),
[`@Cacheable`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html),
以及
[`@SpringBootTest`](https://docs.spring.io/spring-boot/docs/current/api/org/springframework/boot/test/context/SpringBootTest.html).

得益于元注解的支持, 使用
[`@Configuration`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/context/annotation/Configuration.html),
[`@Controller`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Controller.html),
[`@RestController`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/web/bind/annotation/RestController.html),
[`@Service`](https://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/stereotype/Service.html)
或
[`@Repository`](https://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Repository.html)
标注的类, 会自动变为 `open`, 因为这些注解被标注了
[`@Component`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html)
注解.

当然, 你也可以在同一个工程中同时使用 `kotlin-allopen` 和 `kotlin-spring` 插件.

注意, 如果你使用了 [start.spring.io](http://start.spring.io/#!language=kotlin) 服务生成的项目模板, 那么 `kotlin-spring` 插件默认会打开.

### 在命令行中使用

All-open 编译器插件随 Kotlin 编译器的二进制发布版一同发布.
编译时, 你可以添加这个插件, 方法是使用 kotlinc 的 `Xplugin` 编译选项, 指定它的 JAR 文件路径:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
-Xplugin=$KOTLIN_HOME/lib/allopen-compiler-plugin.jar
```

</div>

你可以直接指定 all-open 注解, 使用插件的 `annotation` 选项, 或者使用"预先设定"的 all-open 注解.
all-open 目前唯一可用的预选设定是 `spring`.

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
# 插件选项的格式是: "-P plugin:<plugin id>:<key>=<value>".
# 选项可以重复.

-P plugin:org.jetbrains.kotlin.allopen:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.allopen:preset=spring
```

</div>

## No-arg 编译器插件

*no-arg* 编译器插件会为标注了特定注解的类产生一个额外的无参数的构造器.

自动产生的构造器是合成的(synthetic), 因此在 Java 或 Kotlin 中不能直接调用它, 但可以通过反射来调用.

这个功能使得 Java Persistence API (JPA) 可以创建一个类的实例, 即使从 Kotlin 或 Java 的角度看来,这个类并不存在 0 个参数的构造器
(关于 `kotlin-jpa` 插件, 请参见 [下文](compiler-plugins.html#jpa-support)).

### 在 Gradle 中使用

使用方法与 all-open 插件很类似.

你需要添加插件, 指定要对类产生无参数构造器的注解列表.

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-noarg"
```

</div>

或者使用 Gradle plugin DSL 语法:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.noarg" version "{{ site.data.releases.latest.version }}"
}
```

</div>

然后指定要对类产生无参数构造器的注解列表:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

</div>

如果你希望插件在合成的构造器中执行初始化逻辑, 可以打开 `invokeInitializers` 选项.
从 Kotlin 1.1.3-2 版开始, 这个选项默认是关闭的, 因为存在 bug:
[`KT-18667`](https://youtrack.jetbrains.com/issue/KT-18667)
和
[`KT-18668`](https://youtrack.jetbrains.com/issue/KT-18668), 我们会在未来的版本中解决这些 bug.

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
noArg {
    invokeInitializers = true
}
```

</div>

### 在 Maven 中使用

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <!-- 或者使用 "jpa", 支持 JPA -->
            <plugin>no-arg</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>no-arg:annotation=com.my.Annotation</option>
            <!-- 在合成的构造器中, 调用实例的初始化逻辑 -->
            <!-- <option>no-arg:invokeInitializers=true</option> -->
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-noarg</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

</div>

### JPA 支持

*kotlin-spring* 是在 *all-open* 之上的封装, 与此类似, *kotlin-jpa* 是在 *no-arg* 之上的封装.
这个插件会将
[`@Entity`](http://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html),
[`@Embeddable`](http://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html),
以及 [`@MappedSuperclass`](https://docs.oracle.com/javaee/7/api/javax/persistence/MappedSuperclass.html)
注解指定为 *no-arg* 注解.
在 Gradle 中, 你需要添加以下代码:

<div class="sample" markdown="1" theme="idea" mode="groovy">

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-jpa"
```

</div>

或者使用 Gradle plugin DSL 语法:

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.jpa" version "{{ site.data.releases.latest.version }}"
}
```

</div>

在 Maven 中, 需要启用 `jpa` 插件:

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<compilerPlugins>
    <plugin>jpa</plugin>
</compilerPlugins>
```

</div>

### 在命令行中使用

与 *all-open* 类似, 你需要将这个插件的 JAR 文件添加到编译器的插件类路径中, 然后指定 *no-arg* 注解, 或者使用预先设定的注解:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
-Xplugin=$KOTLIN_HOME/lib/noarg-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.noarg:annotation=com.my.Annotation
-P plugin:org.jetbrains.kotlin.noarg:preset=jpa
```

</div>


## SAM-with-receiver 编译器插件

*sam-with-receiver* 编译器插件, 可以将被注解的 Java "单个抽象方法" (SAM: Single Abstract Method) 的第一个参数, 转换为 Kotlin 中的接受者.
只有当 SAM 接口被当作 Kotlin 的 Lambda 表达式来传递时, 这个转换才起作用.
对 SAM 方法调用适配, 以及 SAM 实例构造都是如此 (详情请参见 [SAM 转换](java-interop.html#sam-conversions)).

示例如下:

<div class="sample" markdown="1" theme="idea" mode="java">

```java
public @interface SamWithReceiver {}

@SamWithReceiver
public interface TaskRunner {
    void run(Task task);
}
```

</div>

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun test(context: TaskContext) {
    val runner = TaskRunner {
        // 这里的 'this' 是一个 'Task' 的实例

        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

</div>

### 在 Gradle 中使用

这个插件的使用方法与 all-open 和 no-arg 插件基本相同, 区别是 sam-with-receiver 插件没有内建的默认设定, 因此你要指定需要特别处理的注解列表.

<div class="sample" markdown="1" theme="idea" mode="groovy">

```groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-sam-with-receiver:$kotlin_version"
    }
}

apply plugin: "kotlin-sam-with-receiver"
```

</div>

然后指定 SAM-with-receiver 注解列表:

<div class="sample" markdown="1" theme="idea"  mode="groovy">

```groovy
samWithReceiver {
    annotation("com.my.SamWithReceiver")
}
```

</div>

### 在 Maven 中使用

<div class="sample" markdown="1" theme="idea" mode="xml" auto-indent="false">

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>${kotlin.version}</version>

    <configuration>
        <compilerPlugins>
            <plugin>sam-with-receiver</plugin>
        </compilerPlugins>

        <pluginOptions>
            <option>
                sam-with-receiver:annotation=com.my.SamWithReceiver
            </option>
        </pluginOptions>
    </configuration>

    <dependencies>
        <dependency>
            <groupId>org.jetbrains.kotlin</groupId>
            <artifactId>kotlin-maven-sam-with-receiver</artifactId>
            <version>${kotlin.version}</version>
        </dependency>
    </dependencies>
</plugin>
```

</div>

### 在命令行中使用

只需要将插件的 JAR 文件添加到编译器的类路径, 然后指定 sam-with-receiver 注解列表:

<div class="sample" markdown="1" theme="idea" mode="shell">

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```

</div>

## `Parcelable` 实现代码生成器

`kotlin-parcelize` 编译器插件提供了一个 [`Parcelable`](https://developer.android.com/reference/android/os/Parcelable) 实现代码生成器.
关于如何使用这个代码生成器, 请参见 [Android 文档](https://developer.android.com/kotlin/parcelize).
