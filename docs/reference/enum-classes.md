---
type: doc
layout: reference
category: "Syntax"
title: "枚举类"
---

# 枚举类

枚举类最基本的用法, 就是实现类型安全的枚举值:

``` kotlin
enum class Direction {
    NORTH, SOUTH, WEST, EAST
}
```

每个枚举常数都是一个对象. 枚举常数之间用逗号分隔.

## 初始化

由于每个枚举值都是枚举类的一个实例, 因此枚举值可以初始化:

``` kotlin
enum class Color(val rgb: Int) {
        RED(0xFF0000),
        GREEN(0x00FF00),
        BLUE(0x0000FF)
}
```

## 匿名类

枚举常数也可以定义它自己的匿名类:

``` kotlin
enum class ProtocolState {
    WAITING {
        override fun signal() = TALKING
    },

    TALKING {
        override fun signal() = WAITING
    };

    abstract fun signal(): ProtocolState
}
```

枚举常数的匿名类可以有各自的方法, 还可以覆盖基类的方法. 注意, 与 Java 中一样, 如果枚举类中定义了任何成员, 你需要用分号将枚举常数的定义与枚举类的成员定义分隔开.

## 使用枚举常数

与 Java 中一样, Kotlin 中的枚举类拥有编译器添加的方法, 可以列出枚举类中定义的所有枚举常数值, 可以通过枚举常数值的名称字符串得到对应的枚举常数值. 这些方法的签名如下(这里假设枚举类名称为 `EnumClass`):

``` kotlin
EnumClass.valueOf(value: String): EnumClass
EnumClass.values(): Array<EnumClass>
```

如果给定的名称不能匹配枚举类中定义的任何一个枚举常数值, `valueOf()` 方法会抛出 `IllegalArgumentException` 异常.

每个枚举常数值都拥有属性, 可以取得它的名称, 以及它在枚举类中声明的顺序:

``` kotlin
val name: String
val ordinal: Int
```

枚举常数值还实现了 [Comparable](/api/latest/jvm/stdlib/kotlin/-comparable/index.html) 接口, 枚举常数值之间比较时, 会使用枚举常数值在枚举类中声明的顺序作为自己的大小顺序.
