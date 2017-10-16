---
type: doc
layout: reference
title: "编译器插件"
---

# 编译器插件

## All-open 编译器插件

Kotlin 默认会将类及其成员定义为 `final` 的, 而某些框架或库要求类为 `open`, 比如 Spring AOP, 因此导致使用这些框架或库时的不便.
`all-open` 编译器插件可以帮助 Kotlin 满足这些框架或库的要求, 如果类添加了某个特定的注解, 插件会将这个类以及它的成员变为 `open`, 而不必明确地标记 `open` 关键字.
比如, 当使用 Spring 时, 你不需要所有的类都是 `open` 的, 而只需要添加了特定注解的类为 `open`, 比如 `@Configuration` 注解, 或 `@Service` 注解.
`all-open` 插件可以指定这些注解.

对 all-open 插件, 我们提供 Gradle 和 Maven 的支持, 以及 IDE 支持.
对于 Spring, 你可以使用 `kotlin-spring` 编译器插件(详情请 [参见下文](compiler-plugins.html#kotlin-spring-compiler-plugin)).

### 如何使用 all-open 插件

在 `build.gradle` 中应用插件:

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-allopen"
```
或者, 如果你使用 Gradle plugin DSL 语法, 可以将它添加到 `plugins` 部分:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.allopen" version "{{ site.data.releases.latest.version }}"
}
```

然后指定将哪些注解标注的类变为 `open`:

```groovy
allOpen {
    annotation("com.my.Annotation")
}
```

如果类 (或者它的任何一个超类) 标注了 `com.my.Annotation` 注解, 那么类本身, 以及它的所有成员都会变为 `open` 的.

对于元注解(meta-annotation)也有效:

``` kotlin
@com.my.Annotation
annotation class MyFrameworkAnnotation

@MyFrameworkAnnotation
class MyClass // 这个类将会变为 open
```

`MyFrameworkAnnotation` 也会称为将类变为 `open` 的注解, 因为它被标注了 `com.my.Annotation` 注解.

下面是在 Maven 中使用 all-open 插件的方法:

``` xml
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


### Kotlin-spring 编译器注解

你不需要手动指定 Spring 注解, 只需要使用 `kotlin-spring` 插件即可, 这个插件可以根据 Spring 的要求自动地配置 all-open 插件:

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-allopen:$kotlin_version"
    }
}

apply plugin: "kotlin-spring"
```

或者使用 Gradle plugin DSL 语法:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.spring" version "{{ site.data.releases.latest.version }}"
}
```

Maven 中的使用示例与前面的示例类似.

这个 plugin 将会指定以下注解:
[`@Component`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/stereotype/Component.html), [`@Async`](http://docs.spring.io/spring/docs/current/javadoc-api/org/springframework/scheduling/annotation/Async.html), [`@Transactional`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/transaction/annotation/Transactional.html), [`@Cacheable`](http://docs.spring.io/spring-framework/docs/current/javadoc-api/org/springframework/cache/annotation/Cacheable.html).
得益于元注解的支持, 使用 `@Configuration`, `@Controller`, `@RestController`, `@Service` 或 `@Repository` 标注的类, 会自动变为 `open`, 因为这些注解被标注了 `@Component` 注解.

当然, 你也可以在同一个工程中同时使用 `kotlin-allopen` 和 `kotlin-spring` 插件.
注意, 如果你使用 [start.spring.io](http://start.spring.io/#!language=kotlin), 那么 `kotlin-spring` 插件默认会打开.


## No-arg 编译器插件

no-arg 编译器插件会为标注了特定注解的类产生一个额外的无参数的构造器.
自动产生的构造器是合成的(synthetic), 因此在 Java 或 Kotlin 中不能直接调用它, 但可以通过反射来调用.
这个功能使得 Java Persistence API (JPA) 可以创建 `data` 类的实例, 即使从 Kotlin 或 Java 的角度看来, `data` 类并不存在无参数的构造器(关于 `kotlin-jpa` 插件, 请参见 [下文](compiler-plugins.html#kotlin-jpa-compiler-plugin)).

### 如何使用 no-arg 插件

使用方法与 all-open 插件很类似.
你需要添加插件, 指定要对类产生无参数构造器的注解列表.

在 Gradle 中使用 no-arg 插件的方法:

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-noarg"
```

或者使用 Gradle plugin DSL 语法:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.noarg" version "{{ site.data.releases.latest.version }}"
}
```

然后指定注解:

```groovy
noArg {
    annotation("com.my.Annotation")
}
```

如果你希望插件在合成的构造器中执行初始化逻辑, 可以打开 `invokeInitializers` 选项. 从 Kotlin 1.1.3-2 版开始, 这个选项默认是关闭的, 因为存在 bug: [`KT-18667`](https://youtrack.jetbrains.com/issue/KT-18667) 和 [`KT-18668`](https://youtrack.jetbrains.com/issue/KT-18668), 我们会在未来的版本中解决这些 bug:

```groovy
noArg {
    invokeInitializers = true
}
```

在 Maven 中使用 no-arg 插件的方法:

``` xml
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

### Kotlin-jpa 编译器插件

这个插件会将 [`@Entity`](http://docs.oracle.com/javaee/7/api/javax/persistence/Entity.html)
和 [`@Embeddable`](http://docs.oracle.com/javaee/7/api/javax/persistence/Embeddable.html)
注解指定为需要为类产生无参数构造器的注解.
在 Gradle 中, 你需要添加以下代码:

``` groovy
buildscript {
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-noarg:$kotlin_version"
    }
}

apply plugin: "kotlin-jpa"
```

或者使用 Gradle plugin DSL 语法:

```groovy
plugins {
  id "org.jetbrains.kotlin.plugin.jpa" version "{{ site.data.releases.latest.version }}"
}
```

Maven 中的使用示例与前面的示例类似.
