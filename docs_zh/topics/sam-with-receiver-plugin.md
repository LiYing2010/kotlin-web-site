---
type: doc
layout: reference
category:
title: "SAM-with-receiver 编译器插件"
---

# SAM-with-receiver 编译器插件

最终更新: {{ site.data.releases.latestDocDate }}

*sam-with-receiver* 编译器插件可以将带注解的 Java "single abstract method" (SAM) 接口方法的第一个参数变成 Kotlin 中的接受者.
只有在使用 SAM 适配器(Adapter) 和 SAM 构造器(Constructor), 将 Kotlin Lambda 表达式作为 SAM 接口传递时, 这个变换才有效.
 (详情请参见 [SAM 变换文档](jvm/java-interop.html#sam-conversions)).

下面是一段示例:

```java
public @interface SamWithReceiver {}

@SamWithReceiver
public interface TaskRunner {
    void run(Task task);
}
```

```kotlin
fun test(context: TaskContext) {
    val runner = TaskRunner {
        // 这里的 'this' 是一个 'Task' 实例

        println("$name is started")
        context.executeTask(this)
        println("$name is finished")
    }
}
```

## Gradle

使用方法与 [all-open](all-open-plugin.html) 插件和 [no-arg](no-arg-plugin.html) 插件相同,
区别是 sam-with-receiver 没有任何预定义, 因此你需要自己指定需要特别处理的注解.

<div class="multi-language-sample" data-lang="kotlin">
<div class="sample" markdown="1" mode="kotlin" theme="idea" data-lang="kotlin" data-highlight-only>

```kotlin
plugins {
    kotlin("plugin.sam.with.receiver") version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>

<div class="multi-language-sample" data-lang="groovy">
<div class="sample" markdown="1" mode="groovy" theme="idea" data-lang="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.sam.with.receiver" version "{{ site.data.releases.latest.version }}"
}
```

</div>
</div>


然后指定需要特别处理的 SAM-with-receiver 注解:

```groovy
samWithReceiver {
    annotation("com.my.SamWithReceiver")
}
```

## Maven

```xml
<plugin>
    <artifactId>kotlin-maven-plugin</artifactId>
    <groupId>org.jetbrains.kotlin</groupId>
    <version>{{ site.data.releases.latest.version }}</version>

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
            <version>{{ site.data.releases.latest.version }}</version>
        </dependency>
    </dependencies>
</plugin>
```

## 命令行编译器

将插件的 JAR 文件添加到编译器的插件 classpath, 并指定需要处理的 sam-with-receiver 注解:

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```
