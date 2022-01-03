---
type: doc
layout: reference
category:
title: "教程 - 在同一个项目中混合使用 Java 和 Kotlin"
---

# 教程 - 在同一个项目中混合使用 Java 和 Kotlin

本页面最终更新: 2021/12/01

Kotlin 对 Java 的交互功能提供了一级支持, 现代化的 IDE 还使得这个功能更加便利.
本教程中, 你将会学习在 IntelliJ IDEA 如何在同一个项目内同时使用 Kotlin 和 Java 代码.
关于在 IntelliJ IDEA 中如何启动一个新的 Kotlin 项目, 请参见 [Kotlin/JVM 入门](jvm-get-started.html).

## 向既有的 Kotlin 项目添加 Java 源代码

向 Kotlin 项目添加 Java 类非常简单. 你只需要创建一个新的 Java 文件.
在你的项目内选择一个目录或包, 然后选择菜单 **File** | **New** | **Java Class**, 或者使用快捷键 **Alt + Insert**/**Cmd + N**.

<img src="/assets/docs/images/tutorials/mixing-java-kotlin-intellij/new-java-class.png" alt="添加新的 Java 类" width="400"/>

如果你已经有了 Java 类, 你可以直接将它们复制到项目目录内.

然后你就可以在 Kotlin 代码中使用 Java 类, 或者反过来, 不需要其它任何工作.

比如, 添加下面的 Java 类:

``` java
public class Customer {

    private String name;

    public Customer(String s){
        name = s;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void placeOrder() {
        System.out.println("A new order is placed by " + name);
    }
}
```

下面在 Kotlin 代码中使用这个类, 就象使用 Kotlin 中的其他类型一样.

```kotlin
val customer = Customer("Phase")
println(customer.name)
println(customer.placeOrder())
```

## 向既有的 Java 项目添加 Kotlin 源代码

向既有的 Java 项目添加 Kotlin 源代码, 方法基本相同.

<img src="/assets/docs/images/tutorials/mixing-java-kotlin-intellij/new-kotlin-file.png" alt="添加新的 Kotlin 类" width="400"/>

如果这是你第一次向这个项目添加 Kotlin 文件, IntelliJ IDEA 会提示你添加需要的 Kotlin 运行时库.
对于 Java 项目, 请将 Kotlin 运行时库配置为一个 **Kotlin Java Module**.

下一步是决定要配置哪个模块 (如果项目存在多个模块),
以及是将运行时库添加到项目, 还是使用由当前 Kotlin plugin 提供的库.

<img src="/assets/docs/images/tutorials/mixing-java-kotlin-intellij/bundling-kotlin-option.png" alt="绑定 Kotlin 运行时库" width="600"/>

你也可以从菜单 **Tools** | **Kotlin** | **Configure Kotlin in Project** 手动打开 Kotlin 运行时库配置.

## 使用 J2K 将既有的 Java 文件转换为 Kotlin

Kotlin plugin 还带有一个 Java 到 Kotlin 的转换器 (_J2K_), 它可以将 Java 文件自动转换为 Kotlin.
要对一个源代码文件使用 J2K, 请在它的弹出菜单中, 或在 IntelliJ IDEA 的 **Code** 菜单中,
点击 **Convert Java File to Kotlin File**.

<img src="/assets/docs/images/tutorials/mixing-java-kotlin-intellij/convert-java-to-kotlin.png" alt="将 Java 文件转换为 Kotlin" width="500"/>

转换器并不保证完全正确, 但它确实能将绝大部分样板代码从 Java 正确的转换为 Kotlin.
有时会需要进行一些手动的修正.
