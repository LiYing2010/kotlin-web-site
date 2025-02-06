[//]: # (title: SAM-with-receiver 编译器插件)

*sam-with-receiver* 编译器插件可以将带注解的 Java "single abstract method" (SAM) 接口方法的第一个参数变成 Kotlin 中的接受者.
只有在使用 SAM 适配器(Adapter) 和 SAM 构造器(Constructor), 将 Kotlin Lambda 表达式作为 SAM 接口传递时, 这个变换才有效.
 (详情请参见 [SAM 变换文档](java-interop.md#sam-conversions)).

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

## Gradle {id="gradle"}

使用方法与 [all-open](all-open-plugin.md) 插件和 [no-arg](no-arg-plugin.md) 插件相同,
区别是 sam-with-receiver 没有任何预定义, 因此你需要自己指定需要特别处理的注解.

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
plugins {
    kotlin("plugin.sam.with.receiver") version "%kotlinVersion%"
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
plugins {
    id "org.jetbrains.kotlin.plugin.sam.with.receiver" version "%kotlinVersion%"
}
```

</tab>
</tabs>

然后指定需要特别处理的 SAM-with-receiver 注解:

```groovy
samWithReceiver {
    annotation("com.my.SamWithReceiver")
}
```

## Maven {id="maven"}

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

## 命令行编译器 {id="command-line-compiler"}

将插件的 JAR 文件添加到编译器的插件 classpath, 并指定需要处理的 sam-with-receiver 注解:

```bash
-Xplugin=$KOTLIN_HOME/lib/sam-with-receiver-compiler-plugin.jar
-P plugin:org.jetbrains.kotlin.samWithReceiver:annotation=com.my.SamWithReceiver
```
