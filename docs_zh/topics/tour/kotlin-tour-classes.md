[//]: # (title: 类)

最终更新: %latestDocDate%

<tldr>
    <p><img src="icon-1-done.svg" width="20" alt="第 1 步" /> <a href="kotlin-tour-hello-world.md">Hello world</a><br />
        <img src="icon-2-done.svg" width="20" alt="第 2 步" /> <a href="kotlin-tour-basic-types.md">基本类型</a><br />
        <img src="icon-3-done.svg" width="20" alt="第 3 步" /> <a href="kotlin-tour-collections.md">集合(Collection)</a><br />
        <img src="icon-4-done.svg" width="20" alt="第 4 步" /> <a href="kotlin-tour-control-flow.md">控制流</a><br />
        <img src="icon-5-done.svg" width="20" alt="第 5 步" /> <a href="kotlin-tour-functions.md">函数</a><br />
        <img src="icon-6.svg" width="20" alt="第 6 步" /> <strong>类</strong><br />
        <img src="icon-7-todo.svg" width="20" alt="第 7 步" /> <a href="kotlin-tour-null-safety.md">Null 值安全性</a></p>
</tldr>

Kotlin 通过类和对象支持面向对象的编程.
要在你的程序中存储数据, 对象是非常有用的. 类允许你为一个对象声明一组特性.
当你从一个类创建对象时, 你就可以节省时间和精力, 因为你不需要每次都声明这些特性.

要声明一个类, 请使用 `class` 关键字: 

```kotlin
class Customer
```

## 属性

可以在属性中声明一个类的对象的特性.
你可以为一个类声明属性:
* 放在类的名称之后的小括号 `()` 之内.
```kotlin
class Contact(val id: Int, var email: String)
```
* 放在大括号 `{}` 定义的类的 body 部之内.
```kotlin
class Contact(val id: Int, var email: String) {
    val category: String = ""
}
```

除非在类的实例创建之后需要修改属性的值, 否则我们推荐将属性声明为只读的 (`val`).

在小括号内声明属性时, 你可以不使用 `val` 或 `var`, 但在实例创建之后, 这样的属性将不可访问.

> * 包含在小括号 `()` 之内的内容称为 **类头部(Class Header)**.
> * 声明类的属性时, 你可以使用 [尾随逗号(Trailing Comma)](coding-conventions.md#trailing-commas).
>
{style="note"}

和函数参数一样, 类的属性可以有默认值:
```kotlin
class Contact(val id: Int, var email: String = "example@gmail.com") {
    val category: String = "work"
}
```

## 创建实例

要从一个类创建一个对象, 你需要使用 **构造器(Constructor)**, 声明一个类的 **实例**.

默认情况下, Kotlin 会使用类头部(Class Header)中声明的参数, 自动创建一个构造器.

例如:
```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-class-create-instance"}

在上面的示例中:
* `Contact` 是一个类.
* `contact` 是 `Contact` 类的一个实例.
* `id` 和 `email` 是属性.
* `id` 和 `email` 和默认构造器一起, 用来创建 `contact`.

Kotlin 类可以有多个构造器, 包括你自己定义的构造器.
关于如何声明多个构造器, 详情请参见 [构造器](classes.md#constructors).

## 访问属性

要访问一个实例的属性, 请在实例名称之后加上点号 `.`, 然后写上属性名称:

```kotlin
class Contact(val id: Int, var email: String)

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    
    // 打印属性的值: email
    println(contact.email)           
    // mary@gmail.com

    // 更新属性的值: email
    contact.email = "jane@gmail.com"
    
    // 打印属性的新值: email
    println(contact.email)           
    // 输出结果为 jane@gmail.com
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-access-property"}

> 要把属性的值拼接为字符串的一部分, 你可以使用字符串模板 (`$`).
> 例如:
> ```kotlin
> println("Their email address is: ${contact.email}")
> ```
>
{style="tip"}

## 成员函数

除了声明属性作为一个对象的特性之外, 你还可以通过成员函数来定义一个对象的行为.

在 Kotlin 中, 成员函数必须在类的 body 部之内声明.
要调用一个实例上的成员函数,
请在实例名称之后加上点号 `.`, 然后写上函数名称.
例如:

```kotlin
class Contact(val id: Int, var email: String) {
    fun printId() {
        println(id)
    }
}

fun main() {
    val contact = Contact(1, "mary@gmail.com")
    // 调用成员函数 printId()
    contact.printId()           
    // 输出结果为 1
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-member-function"}

## 数据类

Kotlin 有 **数据类(Data Class)**, 非常适合于存储数据.
数据类有和普通类一样的功能, 但它们还自动带有一些额外的成员函数.
这些成员函数可以将实例打印为易于阅读的字符串输出, 比较类的实例, 复制实例, 等等等等.
由于这些函数是自动存在的, 因此你不必耗费时间为每个类编写相同的样板代码(Boilerplate Code).

要声明一个数据类, 请使用关键字 `data`:
```kotlin
data class User(val name: String, val id: Int)
```

数据类的预先定义的成员函数中, 最有用的是:

| **函数**             | **描述**                         |
|--------------------|--------------------------------|
| `.toString()`      | 将类实例和它的属性打印为一个易于阅读的字符串.        |
| `.equals()` 或 `==` | 比较一个类的实例.                      |
| `.copy()`          | 创建一个类的实例, 从另一个实例复制, 一部分属性可以不同. |

关于这些函数的使用示例, 请参见以下小节:
* [打印为字符串](#print-as-string)
* [比较实例](#compare-instances)
* [复制实例](#copy-instance)

### 打印为字符串 {id="print-as-string"}

要将一个类的实例打印为易于阅读的字符串, 你可以明确调用 `.toString()` 函数,
或使用打印函数(`println()` 和 `print()`), 这些函数会自动为你调用 `.toString()`:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    val user = User("Alex", 1)
    
    //sampleStart
    // 自动使用 toString() 函数, 让输出结果易于阅读
    println(user)            
    // 输出结果为 User(name=Alex, id=1)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-print-string"}

这个功能在调试程序或创建 log 时, 非常有用.

### 比较实例 {id="compare-instances"}

要比较数据类的实例, 请使用相等比较操作符 `==`:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // 比较 user 和 second user
    println("user == secondUser: ${user == secondUser}") 
    // 输出结果为 user == secondUser: true
    
    // 比较 user 和 third user
    println("user == thirdUser: ${user == thirdUser}")   
    // 输出结果为 user == thirdUser: false
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-compare-instances"}

### 复制实例 {id="copy-instance"}

要对一个数据类的实例创建一个完全相同的复制, 请对这个实例调用 `.copy()` 函数.

要对一个数据类的实例创建一个复制, **并且** 改变一部分属性, 请对这个实例调用 `.copy()` 函数,
**并** 加上要替换的属性值, 作为函数的参数.

例如:

```kotlin
data class User(val name: String, val id: Int)

fun main() {
    //sampleStart
    val user = User("Alex", 1)
    val secondUser = User("Alex", 1)
    val thirdUser = User("Max", 2)

    // 创建 user 的完全相同的复制
    println(user.copy())       
    // 输出结果为 User(name=Alex, id=1)

    // 创建 user 的复制, 但使用另一个 name: "Max"
    println(user.copy("Max"))  
    // 输出结果为 User(name=Max, id=1)

    // 创建 user 的复制, 但使用另一个 id: 3
    println(user.copy(id = 3)) 
    // 输出结果为 User(name=Alex, id=3)
    //sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-data-classes-copy-instance"}

创建一个实例的复制, 要比修改原来的实例更加安全,
因为你对复制品所做的任何操作, 不会影响到依赖于原来那个实例的其他代码.

关于数据类, 更多详情请参见 [数据类](data-classes.md).

本教程的最后一章是介绍 Kotlin 的 [Null 值安全性](kotlin-tour-null-safety.md).

## 实际练习

### 习题 1 {collapsible="true"}

定义一个数据类 `Employee`, 带有两个属性: 一个是姓名, 一个是工资.
请确保工资的属性是可变的, 否则你在年底就不可能涨工资了!
主函数演示你如何使用这个数据类.

|---|---|
```kotlin
// 在这里编写你的代码

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-1"}

|---|---|
```kotlin
data class Employee(val name: String, var salary: Int)

fun main() {
    val emp = Employee("Mary", 20)
    println(emp)
    emp.salary += 10
    println(emp)
}
```
{collapsible="true" collapsed-title="参考答案" id="kotlin-tour-classes-solution-1"}

### 习题 2 {collapsible="true"}

为了测试你的代码, 你需要一个生成器, 它能够创建随机的员工数据.
定义一个类, 其中包括可用的姓名的固定列表 (包含在类的 body 部之内),
还可以指定工资的最小值和最大值 (包含在类头部之内).
这次也一样, 主函数演示你如何使用这个类.

<deflist collapsible="true" id="kotlin-tour-classes-exercise-2-hint-1">
    <def title="提示">
        List 有一个名为 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/random.html"><code>.random()</code></a> 的扩展函数,
        它返回 List 内的一个随机元素.
    </def>
</deflist>

<deflist collapsible="true" id="kotlin-tour-classes-exercise-2-hint-2">
    <def title="提示">
        <code>Random.nextInt(from = ..., until = ...)</code> 返回给你一个随机的 <code>Int</code> 值, 它在指定的上下限值之内.
    </def>
</deflist>

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

// 在这里编写你的代码

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-classes-exercise-2"}

|---|---|
```kotlin
import kotlin.random.Random

data class Employee(val name: String, var salary: Int)

class RandomEmployeeGenerator(var minSalary: Int, var maxSalary: Int) {
    val names = listOf("John", "Mary", "Ann", "Paul", "Jack", "Elizabeth")
    fun generateEmployee() =
        Employee(names.random(),
            Random.nextInt(from = minSalary, until = maxSalary))
}

fun main() {
    val empGen = RandomEmployeeGenerator(10, 30)
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    println(empGen.generateEmployee())
    empGen.minSalary = 50
    empGen.maxSalary = 100
    println(empGen.generateEmployee())
}
```
{collapsible="true" collapsed-title="参考答案" id="kotlin-tour-classes-solution-2"}

## 下一步

[Null 值安全性](kotlin-tour-null-safety.md)
