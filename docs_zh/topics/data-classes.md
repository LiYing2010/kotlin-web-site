[//]: # (title: 数据类(Data Class))

Kotlin 中数据类(Data Class)的主要用来保存数据.
对每个数据类, 编译器会自动生成一些额外的成员函数, 可以用来将对象输出为可读的格式, 比较对象实例, 复制对象实例, 等等.
数据类通过 `data`关键字标记:

```kotlin
data class User(val name: String, val age: Int)
```

编译器会根据主构造器中声明的全部属性, 自动推断产生以下成员函数:

* `equals()`/`hashCode()` 函数对.
* `toString()` 函数, 输出格式为 `"User(name=John, age=42)"`.
* [`componentN()` 函数群](destructuring-declarations.md),
  这些函数与类的属性对应, 函数名中的数字 1 到 N, 与属性的声明顺序一致.
* `copy()` 函数 (详情见下文).

为了保证自动生成的代码的行为一致, 并且有意义, 数据类必须满足以下所有要求:

* 主构造器必须有一个以上参数.
* 主构造器的所有参数必须标记为 `val` 或 `var`.
* 数据类不能是抽象类, open 类, 封闭(sealed)类, 或内部(inner)类.

此外, 考虑到成员函数继承的问题, 成员函数的生成遵循以下规则:

* 对于 `equals()`, `hashCode()` 或 `toString()` 函数, 如果在数据类的定义体中存在明确的实现,
  或在超类中存在 `final` 的实现, 那么这些成员函数不会自动生成, 而会使用已存在的实现.
* 如果超类存在 `open` 的 `componentN()` 函数, 并且返回一个兼容的数据类型,
  那么子类中对应的函数会自动生成, 并覆盖超类中的函数. 如果超类中的函数签名不一致,
  或者是 `final` 的, 导致子类无法覆盖, 则会报告编译错误.
* 不允许对 `componentN()` 和 `copy()` 函数提供明确的实现(译注, 这些函数必须由编译器自动生成).

数据类可以继承其他类 (示例请参见 [封闭类(Sealed class)](sealed-classes.md)).

> 在 JVM 平台, 如果自动生成的类需要拥有一个无参数的构造器, 那么需要为属性指定默认值
> (参见 [构造器](classes.md#constructors)):
>
> ```kotlin
> data class User(val name: String = "", val age: Int = 0)
> ```
>
{style="note"}

## 在类主体部声明的属性

编译器对自动生成的函数, 只使用主构造器中定义的属性.
如果想要在自动生成的函数实现中排除某个属性, 你可以将它声明在类的主体部:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
```

在下面的示例中, 在 `toString()`, `equals()`, `hashCode()`, 和 `copy()` 函数的实现中, 默认只使用了 `name` 属性,
而且只存在 1 个组件函数 `component1()`.
`age` 属性定义在类的 body 部, 因此被排除了.
所以, 两个 `Person` 对象拥有相同的 `name`, 不同的 `age` 值, 它们会被认为值相等.
因为 `equals()` 只计算主构造器中的属性:

```kotlin
data class Person(val name: String) {
    var age: Int = 0
}
fun main() {
//sampleStart
  val person1 = Person("John")
  val person2 = Person("John")
  person1.age = 10
  person2.age = 20

  println("person1 == person2: ${person1 == person2}")
  // 输出结果为 person1 == person2: true

  println("person1 with age ${person1.age}: ${person1}")
  // 输出结果为 person1 with age 10: Person(name=John)

  println("person2 with age ${person2.age}: ${person2}")
  // 输出结果为 person2 with age 20: Person(name=John)
//sampleEnd
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3"}

## 对象复制

使用 `copy()` 函数来复制对象, 可以修改 _一部分_ 属性值, 但保持其他属性不变.
对于前面示例中的 `User` 类, 函数的实现将会是下面这样:

```kotlin
fun copy(name: String = this.name, age: Int = this.age) = User(name, age)
```

因此你可以编写下面这样的代码:

```kotlin
val jack = User(name = "Jack", age = 1)
val olderJack = jack.copy(age = 2)
```

## 数据类中成员数据的解构

编译器会为数据类生成 _组件函数(Component function)_, 有了这些组件函数,
就可以在 [解构声明(destructuring declaration)](destructuring-declarations.md) 中使用数据类:

```kotlin
val jane = User("Jane", 35)
val (name, age) = jane
println("$name, $age years of age")
// 输出结果为 Jane, 35 years of age
```

## 标准库中的数据类

Kotlin 的标准库提供了 `Pair` 和 `Triple` 类可供使用.
但大多数情况下, 使用有具体名称的数据类是一种更好的设计方式,
因为, 数据类可以为属性指定有含义的名称, 因此可以让代码更加易读.
