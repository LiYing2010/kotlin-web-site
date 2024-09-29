[//]: # (title: 为 Kotlin Multiplatform 设置编译目标)

最终更新: %latestDocDate%

可以在使用 [项目向导](https://kmp.jetbrains.com/) 创建项目时添加编译目标.
如果之后再需要添加编译目标, 可以使用对 [支持的平台](multiplatform-dsl-reference.md#targets) 预设置的编译目标来手工添加.

更多详情请参见 [编译目标的额外设置](multiplatform-dsl-reference.md#common-target-configuration).

```kotlin
kotlin {
    jvm() // 使用默认名称 'jvm' 创建 JVM 编译目标

    linuxX64() {
        /* 这里可以对 'linux' 编译目标指定额外设置 */
    }
}
```

每个编译目标可以有一个或多个 [编译任务](multiplatform-configure-compilations.md).
除了用于测试和产品的默认的编译任务之外, 你还可以 [创建自定义的编译任务](multiplatform-configure-compilations.md#create-a-custom-compilation).

## 对一个平台区分多个编译目标 {id="distinguish-several-targets-for-one-platform"}

在一个跨平台库中, 对一个平台可以有多个编译目标. 比如, 这些编译目标可以提供相同的 API, 但在运行时使用不同的库, 比如不同的测试框架, 不同的日志库.
对这样的跨平台库的依赖可能会解析失败, 因为不清楚应该选择哪个编译目标.

为解决这个问题, 需要在库的开发者和使用者端同时对编译目标标记一个自定义的属性, 供 Gradle 在解析依赖项目时使用.

比如, 假设有一个测试库, 在两个编译目标中支持 JUnit 和 TestNG. 库的作者需要在两个编译目标中添加一个属性, 如下:

<tabs group="build-script">
<tab title="Kotlin" group-key="kotlin">

```kotlin
val testFrameworkAttribute = Attribute.of("com.example.testFramework", String::class.java)

kotlin {
    jvm("junit") {
        attributes.attribute(testFrameworkAttribute, "junit")
    }
    jvm("testng") {
        attributes.attribute(testFrameworkAttribute, "testng")
    }
}
```

</tab>
<tab title="Groovy" group-key="groovy">

```groovy
def testFrameworkAttribute = Attribute.of('com.example.testFramework', String)

kotlin {
    jvm('junit') {
        attributes.attribute(testFrameworkAttribute, 'junit')
    }
    jvm('testng') {
        attributes.attribute(testFrameworkAttribute, 'testng')
    }
}
```

</tab>
</tabs>

库的使用者编译目标如果出现依赖项目的歧义, 就需要对他的编译目标添加这个属性来解决歧义.
