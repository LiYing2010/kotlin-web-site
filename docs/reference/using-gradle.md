---
type: doc
layout: reference
title: "使用 Gradle"
---

# 使用 Gradle

要使用 Gradle 编译 Kotlin 代码, 你需要 [设值 *kotlin-gradle* plugin](#plugin-and-versions), 将它 [应用](#targeting-the-jvm) 到你的工程, 然后 [添加 *kotlin-stdlib* 依赖](#configuring-dependencies). 在 IntelliJ IDEA 中, 在 Project action 内选择 Tools -> Kotlin -> Configure Kotlin 也可以自动完成这些操作.

## Plugin 与版本 Versions

*kotlin-gradle-plugin* 可以用来编译 Kotlin 源代码和模块.

使用的 Kotlin 版本通常定义为 *kotlin_version* 属性:

``` groovy
buildscript {
   ext.kotlin_version = '<version to use>'

   repositories {
     mavenCentral()
   }

   dependencies {
     classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
   }
}
```

下表是 Kotlin 的 Release 版本名称与版本号之间的对应关系:

<table>
<thead>
<tr>
  <th>Milestone</th>
  <th>Version</th>
</tr>
</thead>
<tbody>
{% for entry in site.data.releases.list %}
<tr>
  <td>{{ entry.milestone }}</td>
  <td>{{ entry.version }}</td>
</tr>
{% endfor %}
</tbody>
</table>

## 编译到 JVM 平台

要编译到 JVM 平台, 需要应用(apply) Kotlin plugin:

``` groovy
apply plugin: "kotlin"
```

Kotlin 源代码可以与 Java 源代码共存在同一个文件夹下, 也可以放在不同的文件夹下. 默认的约定是使用不同的文件夹:

``` groovy
project
    - src
        - main (root)
            - kotlin
            - java
```

如果不使用默认约定的文件夹结构, 那么需要修改相应的 *sourceSets* 属性:

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
    main.java.srcDirs += 'src/main/myJava'
}
```

## 编译到 JavaScript

编译到 JavaScript 时, 需要应用(apply)另一个 plugin:

``` groovy
apply plugin: "kotlin2js"
```

这个 plugin 只能编译 Kotlin 源代码文件, 因此推荐将 Kotlin 和 Java 源代码文件放在不同的文件夹内(如果工程内包含 Java 文件的话). 与编译到 JVM 平台时一样, 如果不使用默认约定的文件夹结构, 我们需要使用 *sourceSets* 来指定文件夹目录:

``` groovy
sourceSets {
    main.kotlin.srcDirs += 'src/main/myKotlin'
}
```

如果希望创建一个可重复使用的 JavaScript 库, 请使用 `kotlinOptions.metaInfo` 生成一个带二进制描述符(binary descriptor)的 JS 文件.
这个文件需要与与编译结果一起发布.

``` groovy
compileKotlin2Js {
	kotlinOptions.metaInfo = true
}
```


## 编译到 Android

Android 的 Gradle 模型与通常的 Gradle 略有区别, 因此如果我们想要编译一个使用 Kotlin 语言开发的 Android 工程, 就需要使用 *kotlin-android* plugin 而不是 *kotlin* plugin:

``` groovy
buildscript {
    ...
}
apply plugin: 'com.android.application'
apply plugin: 'kotlin-android'
```

### Android Studio

如果使用 Android Studio, 需要在 android 之下添加以下内容:

``` groovy
android {
  ...

  sourceSets {
    main.java.srcDirs += 'src/main/kotlin'
  }
}
```

这些设置告诉 Android Studio, kotlin 目录是一个源代码根目录, 因此当工程模型装载进入 IDE 时, 就可以正确地识别这个目录.



## 配置依赖

除了上文讲到的 kotlin-gradle-plugin 依赖之外, 你还需要添加 Kotlin 标准库的依赖:

``` groovy
buildscript {
   ext.kotlin_version = '<version to use>'
  repositories {
    mavenCentral()
  }
  dependencies {
    classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
  }
}

apply plugin: "kotlin" // 编译到 JavaScript 时, 应该是 apply plugin: "kotlin2js" 

repositories {
  mavenCentral()
}

dependencies {
  compile "org.jetbrains.kotlin:kotlin-stdlib:$kotlin_version"
}
```

如果你的工程使用 Kotlin 的反射功能或测试功能, 那么还需要添加相应的依赖:

``` groovy
compile "org.jetbrains.kotlin:kotlin-reflect:$kotlin_version"
testCompile "org.jetbrains.kotlin:kotlin-test:$kotlin_version"
```


## OSGi

关于对 OSGi 的支持, 请参见 [Kotlin 与 OSGi](kotlin-osgi.html).

## 示例

[Kotlin 代码仓库](https://github.com/jetbrains/kotlin) 中包含以下示例:

* [Kotlin](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/hello-world)
* [Java 代码与 Kotlin 代码的混合](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/mixed-java-kotlin-hello-world)
* [Android](https://github.com/JetBrains/kotlin-examples/tree/master/gradle/android-mixed-java-kotlin-project)
* [JavaScript](https://github.com/JetBrains/kotlin/tree/master/libraries/tools/kotlin-gradle-plugin/src/test/resources/testProject/kotlin2JsProject)
