---
type: doc
layout: reference
title: "使用 Ant"
description: "This tutorial walks you through different scenarios when using Ant for building applications that contain Kotlin code"
---

# 使用 Ant

## 安装 Ant Task

Kotlin 提供了 3 个 Ant Task:

* kotlinc: 面向 JVM 的 Kotlin 编译器;
* kotlin2js: 面向 JavaScript 的 Kotlin 编译器;
* withKotlin: 使用标准的 *javac* Ant Task 来编译 Kotlin 代码.

这些 Task 定义在 *kotlin-ant.jar* 库文件内, 这个库文件位于 [Kotlin 编译器]({{site.data.releases.latest.url}}) 的 *lib* 文件夹内.
需要的 Ant 版本是 1.8.2 以上.

## 面向 JVM, 编译纯 Kotlin 代码

如果工程内只包含 Kotlin 源代码, 这种情况下最简单的编译方法是使用 *kotlinc* Task:

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea">

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc src="hello.kt" output="hello.jar"/>
    </target>
</project>
```

</div>

这里的 `${kotlin.lib}` 指向 Kotlin standalone 编译器解压缩后的文件夹.

## 面向 JVM, 编译包含多个根目录的纯 Kotlin 代码

如果工程中包含多个源代码根目录, 可以使用 *src* 元素来定义源代码路径:

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea" data-highlight-only>

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlinc output="hello.jar">
            <src path="root1"/>
            <src path="root2"/>
        </kotlinc>
    </target>
</project>
```

</div>

## 面向 JVM, 编译 Kotlin 和 Java 的混合代码

如果工程包含 Kotlin 和 Java 的混合代码, 这时尽管也能够使用 *kotlinc*,
但为了避免重复指定 Task 参数, 推荐使用 *withKotlin* Task:

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea" data-highlight-only>

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <delete dir="classes" failonerror="false"/>
        <mkdir dir="classes"/>
        <javac destdir="classes" includeAntRuntime="false" srcdir="src">
            <withKotlin/>
        </javac>
        <jar destfile="hello.jar">
            <fileset dir="classes"/>
        </jar>
    </target>
</project>
```

</div>

还可以通过 `moduleName` 属性来指定被编译的模块名称:

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea" data-highlight-only>

```xml
<withKotlin moduleName="myModule"/>
```

</div>


## 面向 JavaScript, 编译单个源代码文件夹

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea" data-highlight-only>

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js"/>
    </target>
</project>
```

</div>

## 面向 JavaScript, 使用 Prefix, PostFix 和 sourcemap 选项

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea" data-highlight-only>

```xml
<project name="Ant Task Test" default="build">
    <taskdef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <kotlin2js src="root1" output="out.js" outputPrefix="prefix" outputPostfix="postfix" sourcemap="true"/>
    </target>
</project>
```

</div>

## 面向 JavaScript, 编译单个源代码文件夹, 使用 metaInfo 选项

如果你希望将编译结果当作一个 Kotlin/JavaScript 库发布, 可以使用 `metaInfo` 选项.
如果 `metaInfo` 设值为 `true`, 那么编译时会额外创建带二进制元数据(binary metadata)的 JS 文件.
这个文件需要与编译结果一起发布:

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea" data-highlight-only>

```xml
<project name="Ant Task Test" default="build">
    <typedef resource="org/jetbrains/kotlin/ant/antlib.xml" classpath="${kotlin.lib}/kotlin-ant.jar"/>

    <target name="build">
        <!-- 会创建 out.meta.js 文件, 其中包含二进制元数据(binary metadata) -->
        <kotlin2js src="root1" output="out.js" metaInfo="true"/>
    </target>
</project>
```

</div>

## 参照

完整的 Ant Task 元素和属性一览表如下:

### kotlinc 和 kotlin2js 的共通属性

|  名称 |    说明     |  是否必须  |   默认值      |
|------|-------------|----------|---------------|
| `src`  | 需要编译的 Kotlin 源代码文件或源代码目录 | 是 |  |
| `nowarn` | 屏蔽编译时的警告信息 | 否 | false |
| `noStdlib` | 不要将 Kotlin 标准库包含在 classpath 内 | 否 | false |
| `failOnError` | 如果编译过程中检测到错误, 是否让整个构建过程失败 | 否 | true |

### kotlinc 独有的属性

|  名称 |    说明     |  是否必须  |   默认值      |
|------|-------------|----------|---------------|
| `output`  | 编译输出的目标目录, 或目标 .jar 文件名 | 是 |  |
| `classpath`  | 编译时的 class path 值 | 否 |  |
| `classpathref`  | 编译时的 class path 参照 | 否 |  |
| `includeRuntime`  | 当 `output` 是 .jar 文件时, 是否将 Kotlin 运行库包含在这个 jar 内 | 否 | true  |
| `moduleName` | 被编译的模块名称 | 否 | 编译目标的名称(如果有指定), 或工程名称 |


### kotlin2js 独有的属性

|  名称 |    说明     |  是否必须 |
|------|-------------|----------|
| `output`  | 编译输出的目标文件 | 是 |
| `libraries`  | Kotlin 库文件路径 | No |
| `outputPrefix`  | 生成 JavaScript 文件时使用的前缀 | 否 |
| `outputSuffix` | 生成 JavaScript 文件时使用的后缀 | 否 |
| `sourcemap`  | 是否生成 sourcemap 文件 | 否 |
| `metaInfo`  | 是否生成带二进制描述符(binary descriptor)的元数据(metadata)文件 | 否 |
| `main`  | 编译器是否生成对 main 函数的调用代码 | 否 |

### 指定编译参数

如果需要指定自定义的编译参数, 可以使用 `<compilerarg>` 元素的 `value` 或 `line` 属性.
这个元素可以放在 `<kotlinc>`, `<kotlin2js>`, 以及 `<withKotlin>` 任务元素之内, 示例如下:

<div class="sample" markdown="1" mode="xml" auto-indent="false" theme="idea" data-highlight-only>

```xml
<kotlinc src="${test.data}/hello.kt" output="${temp}/hello.jar">
    <compilerarg value="-Xno-inline"/>
    <compilerarg line="-Xno-call-assertions -Xno-param-assertions"/>
    <compilerarg value="-Xno-optimize"/>
</kotlinc>
```

</div>

运行 `kotlinc -help` 命令, 可以看到参数的完整列表.
