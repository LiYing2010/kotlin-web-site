[//]: # (title: 打包你的 Maven 应用程序)

要使用 Maven 打包你的 Kotlin 应用程序, 你可以创建标准的 JAR 文件, 或者创建一个包含所有依赖项的自包含 (fat) JAR 文件.
将你的应用程序打包之后, 就可以分发它, 并在任何安装了 Java 运行环境(Java Runtime Environment, JRE) 的机器上运行它.

## 创建 JAR 文件 {id="create-jar-files"}

要创建一个小的 JAR 文件, 其中只包含你的模块中的代码,
请在你的 Maven `pom.xml` 文件的 `<build><plugins>` 中, 添加以下代码,
其中 `main.class` 是一个属性, 指向 Kotlin 或 Java 的 main class:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-jar-plugin</artifactId>
    <version>3.5.0</version>
    <configuration>
        <archive>
            <manifest>
                <addClasspath>true</addClasspath>
                <mainClass>${main.class}</mainClass>
            </manifest>
        </archive>
    </configuration>
</plugin>
```

## 创建自包含的 JAR 文件 {id="create-self-contained-jar-files"}

要创建一个自包含的 JAR 文件, 其中包含你的模块中的代码, 以及它的所有依赖项,
请在你的 Maven `pom.xml` 文件的 `<build><plugins>` 中, 添加以下代码,
其中 `main.class` 是一个属性, 指向 Kotlin 或 Java 的 main class:

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-assembly-plugin</artifactId>
    <version>3.8.0</version>
    <executions>
        <execution>
            <id>make-assembly</id>
            <phase>package</phase>
            <goals> <goal>single</goal> </goals>
            <configuration>
                <archive>
                    <manifest>
                        <mainClass>${main.class}</mainClass>
                    </manifest>
                </archive>
                <descriptorRefs>
                    <descriptorRef>jar-with-dependencies</descriptorRef>
                </descriptorRefs>
            </configuration>
        </execution>
    </executions>
</plugin>
```

编译产生的自包含的 JAR 文件, 可以直接传递给一个 JRE, 然后就可以运行你的应用程序了:

``` bash
java -jar target/mymodule-0.0.1-SNAPSHOT-jar-with-dependencies.jar
```
