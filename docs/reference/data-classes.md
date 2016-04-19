---
type: doc
layout: reference
category: "Classes and Objects"
title: "数据类"
---

# 数据类

我们经常会创建一些数据类, 什么功能也没有, 而仅仅用来保存数据. 在这些类中, 某些常见的功能经常可以由类中保存的数据内容即可自动推断得到. 在 Kotlin 中, 我们将这样的类称为 _数据类_, 通过 `data` 关键字标记:
 
``` kotlin
data class User(val name: String, val age: Int)
```

编译器会根据主构造器中声明的全部属性, 自动推断产生以下成员函数:
  
  * `equals()`/`hashCode()` 函数对, 
  * `toString()` 函数, 输出格式为 `"User(name=John, age=42)"`,
  * [`componentN()` 函数群](multi-declarations.html), 这些函数与类的属性对应, 函数名中的数字 1 到 N, 与属性的声明顺序一致,
  * `copy()` 函数 (详情见下文).
  
如果上述任意一个成员函数在类定义体中有明确的定义, 或者从基类继承得到, 那么这个成员函数不会自动生成.

为了保证自动生成的代码的行为一致, 并且有意义, 数据类必须满足以下所有要求:

  * 主构造器至少要有一个参数;
  * 主构造器的所有参数必须标记为 `val` 或 `var`;
  * 数据类不能是抽象类, open 类, 封闭(sealed)类, 或内部(inner)类;
  * 数据类不能继承自任何其他类(但可以实现接口).
  
> 在 JVM 上, 如果自动生成的类需要拥有一个无参数的构造器, 那么需要为所有的属性指定默认值
> (参见 [构造器](classes.html#constructors)).
>
> ``` kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```

## 对象复制
  
我们经常会需要复制一个对象, 然后修改它的 _一部分_ 属性, 但保持其他属性不变. 
这就是自动生成的 `copy()` 函数所要实现的功能. 对于前面示例中的 `User` 类, 自动生成的 `copy()` 函数的实现将会是下面这样:
     
``` kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)     
```     

有了这个函数, 我们可以编写下面这样的代码:

``` kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## 数据类中成员数据的解构

编译器会为数据类生成 _组件函数(Component function)_, 有了这些组件函数, 就可以在 [解构声明(destructuring declaration)](multi-declarations.html) 中使用数据类:

``` kotlin
val jane = User("Jane", 35) 
val (name, age) = jane
println("$name, $age years of age") // 打印结果将是 "Jane, 35 years of age"
```

## 标准库中的数据类

Kotlin 的标准库提供了 `Pair` 和 `Triple` 类可供使用. 但是, 大多数情况下, 使用有具体名称的数据了是一种更好的设计方式, 因为, 数据类可以为属性指定有含义的名称, 因此可以增加代码的可读性.
