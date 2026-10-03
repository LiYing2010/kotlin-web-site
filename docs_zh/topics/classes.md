[//]: # (title: 类)

> 在创建类之前, 如果目的是存储数据, 请考虑使用 [数据类](data-classes.md).
> 或者, 也可以考虑使用 [扩展](extensions.md) 来扩展已有的类, 而不是从头创建一个新类.
>
{style="tip"}

与其他面向对象的语言一样, Kotlin 使用 _类(class)_ 来封装数据(属性)和行为(函数), 实现可重用的结构化代码.

类是对象的蓝图或模板, 可以通过 [构造器](#constructors-and-initializer-blocks) 来创建对象.
当你 [创建类的实例](#creating-instances) 时, 就是在根据这个蓝图构建一个具体的对象.

Kotlin 提供了简洁的语法来声明类. 要声明类, 请使用 `class` 关键字, 后面加上类名:

```kotlin
class Person { /*...*/ }
```

类的声明由以下几部分构成:
* **类头部(Class Header)**, 包括但不限于:
  * `class` 关键字
  * 类名
  * 类型参数(如果有的话)
  * [主构造器](#primary-constructor) (可选)
* **类体(Class Body)** (可选), 由大括号 `{}` 括起, 包含 **类的成员(Class Member)**, 例如:
  * [次级构造器(Secondary Constructor)](#secondary-constructors)
  * [初始化代码块](#initializer-blocks)
  * [函数](functions.md)
  * [属性](properties.md)
  * [嵌套类和内部类](nested-classes.md)
  * [对象声明](object-declarations.md)

类头部和 Body 部都可以省略到最简单的形式.
如果类没有 Body 部, 可以省略大括号 `{}`:

```kotlin
// 类有主构造器, 但没有 Body 部
class Person(val name: String, var age: Int)
```

下面示例声明了一个类, 带有类头部和 Body 部, 然后从它 [创建了一个实例](#creating-instances):

```kotlin
// Person 类, 有主构造器, 用于初始化 name 属性
class Person(val name: String) {
    // Body 部, 包含 age 属性
    var age: Int = 0
}

fun main() {
    // 调用构造器, 创建 Person 类的实例
    val person = Person("Alice")

    // 访问实例的属性
    println(person.name)
    // 输出结果为: Alice
    println(person.age)
    // 输出结果为: 0
}
```
{kotlin-runnable="true" id="class-with-header-and-body"}

## 创建实例 {id="creating-instances"}

当你使用类作为蓝图, 构建一个在程序中使用的实际对象时, 就创建了一个实例.

要创建类的实例, 请使用类名后加上括号 `()`, 类似于调用一个 [函数](functions.md):

```kotlin
// 创建 Person 类的实例
val anonymousUser = Person()
```

在 Kotlin 中, 可以通过以下方式创建实例:

* **不带参数** (`Person()`): 如果类中声明了默认值, 则使用默认值创建实例.
* **带参数** (`Person(value)`): 传入特定的值来创建实例.

你可以将创建的实例赋值给可变(`var`)或只读(`val`)的 [变量](basic-syntax.md#variables):

```kotlin
// 使用默认值创建实例, 并赋值给可变变量
var anonymousUser = Person()

// 传入特定的值创建实例, 并赋值给只读变量
val namedUser = Person("Joe")
```

可以在任何需要的地方创建实例: 在 [`main()` 函数](basic-syntax.md#program-entry-point) 内, 在其他函数内, 或在另一个类内.
此外, 也可以在另一个函数内创建实例, 然后从 `main()` 调用这个函数.

以下代码声明了一个 `Person` 类, 它有一个属性来存储姓名.
还演示了如何使用默认构造器的值和特定的值来创建实例:

```kotlin
// 类头部有一个主构造器, 用默认值初始化 name
class Person(val name: String = "Sebastian")

fun main() {
    // 使用构造器的默认值创建实例
    val anonymousUser = Person()

    // 传入特定的值创建实例
    val namedUser = Person("Joe")

    // 访问两个实例的 name 属性
    println(anonymousUser.name)
    // 输出结果为: Sebastian
    println(namedUser.name)
    // 输出结果为: Joe
}
```
{kotlin-runnable="true" id="create-instance-of-a-class"}

> 在 Kotlin 中, 与其他面向对象的编程语言不同, 创建类的实例时不需要 `new` 关键字.
>
{style="note"}

关于如何创建嵌套类, 内部类, 以及匿名内部类的实例, 请参见 [嵌套类](nested-classes.md) 章节.

## 构造器和初始化代码块 {id="constructors-and-initializer-blocks"}

当你创建类的实例时, 就会调用其中一个构造器.
Kotlin 中的类可以有一个 [_主构造器(Primary Constructor)_](#primary-constructor), 和一个或多个 [_次级构造器(Secondary Constructor)_](#secondary-constructors).

主构造器是初始化类的主要方式, 在类头部中声明.
次级构造器提供额外的初始化逻辑, 在 Body 部中声明.

主构造器和次级构造器都是可选的, 但类至少要有一个构造器.

### 主构造器 {id="primary-constructor"}

主构造器在 [创建实例](#creating-instances) 时设置实例的初始状态.

要声明主构造器, 请放在类头部的类名之后:

```kotlin
class Person constructor(name: String) { /*...*/ }
```

如果主构造器没有任何 [注解](annotations.md) 或 [可见度修饰符](visibility-modifiers.md#constructors),
可以省略 `constructor` 关键字:

```kotlin
class Person(name: String) { /*...*/ }
```

主构造器可以将参数声明为属性.
在参数名之前使用 `val` 关键字声明只读属性, 使用 `var` 关键字声明可变属性:

```kotlin
class Person(val name: String, var age: Int) { /*...*/ }
```

这些构造器参数属性作为实例的一部分存储, 可以从类的外部访问.

也可以声明不是属性的主构造器参数.
这些参数之前没有 `val` 或 `var`, 因此不存储在实例中, 只在 Body 部中可以访问:

```kotlin
// 主构造器参数, 同时也是属性
class PersonWithProperty(val name: String) {
    fun greet() {
        println("Hello, $name")
    }
}

// 主构造器参数, 只是参数(不作为属性存储)
class PersonWithAssignment(name: String) {
    // 必须赋值给属性, 才能在之后使用
    val displayName: String = name

    fun greet() {
        println("Hello, $displayName")
    }
}
```

在主构造器中声明的属性, 可以被类的 [成员函数](functions.md) 访问:

```kotlin
// 在主构造器中声明属性的类
class Person(val name: String, var age: Int) {
    // 成员函数, 访问类属性
    fun introduce(): String {
        return "Hi, I'm $name and I'm $age years old."
    }
}
```

也可以在主构造器中为属性指定默认值:

```kotlin
class Person(val name: String = "John", var age: Int = 30) { /*...*/ }
```

如果在 [创建实例](#creating-instances) 时没有传入值, 属性将使用默认值:

```kotlin
// 类的主构造器包含 name 和 age 的默认值
class Person(val name: String = "John", var age: Int = 30)

fun main() {
    // 使用默认值创建实例
    val person = Person()
    println("Name: ${person.name}, Age: ${person.age}")
    // 输出结果为: Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-primary-constructor"}

在 Body 部中, 可以直接使用主构造器参数, 初始化额外的类属性:

```kotlin
// 类的主构造器包含 name 和 age 的默认值
class Person(
    val name: String = "John",
    var age: Int = 30
) {
    // 使用主构造器参数, 初始化 description 属性
    val description: String = "Name: $name, Age: $age"
}

fun main() {
    // 创建 Person 类的实例
    val person = Person()
    // 访问 description 属性
    println(person.description)
    // 输出结果为: Name: John, Age: 30
}
```
{kotlin-runnable="true" id="class-with-default-values"}

与函数一样, 可以在构造器声明中使用 [尾随逗号](coding-conventions.md#trailing-commas):

```kotlin
class Person(
    val name: String,
    val lastName: String,
    var age: Int,
) { /*...*/ }
```

### 初始化代码块 {id="initializer-blocks"}

主构造器初始化类并设置属性.
大多数情况下, 使用简单的代码就能处理.

如果需要在 [创建实例](#creating-instances) 时执行更加复杂的操作,
请将这些逻辑放在 Body 部内的 _初始化代码块(Initializer Block)_ 中.
这些代码块在主构造器执行时运行.

使用 `init` 关键字后面加上大括号 `{}`, 来声明初始化代码块.
在大括号内编写你希望在初始化时运行的代码:

```kotlin
// 类的主构造器初始化 name 和 age
class Person(val name: String, var age: Int) {
    init {
        // 初始化代码块在创建实例时运行
        println("Person created: $name, age $age.")
    }
}

fun main() {
    // 创建 Person 类的实例
    Person("John", 30)
    // 输出结果为: Person created: John, age 30.
}
```
{kotlin-runnable="true" id="class-with-initializer-block"}

你可以根据需要添加任意数量的初始化代码块(`init {}`).
它们按照在 Body 部中出现的顺序运行, 与属性初始化代码一起执行:

```kotlin
//sampleStart
// 类的主构造器初始化 name 和 age
class Person(val name: String, var age: Int) {
    // 第一个初始化代码块
    init {
        // 创建实例时首先运行
        println("Person created: $name, age $age.")
    }

    // 第二个初始化代码块
    init {
        // 在第一个初始化代码块之后运行
        if (age < 18) {
            println("$name is a minor.")
        } else {
            println("$name is an adult.")
        }
    }
}

fun main() {
    // 创建 Person 类的实例
    Person("John", 30)
    // 输出结果为:
    // Person created: John, age 30.
    // John is an adult.
}
//sampleEnd
```
{kotlin-runnable="true" id="class-with-second-initializer-block"}

可以在初始化代码块中使用主构造器参数.
例如, 上面的代码中, 第一个和第二个初始化代码块都使用了主构造器的 `name` 和 `age` 参数.

`init` 代码块的一个常见的使用场景是数据校验.
例如, 通过调用 [`require` 函数](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin/require.html):

```kotlin
class Person(val age: Int) {
    init {
        require(age > 0) { "age must be positive" }
    }
}
```

### 次级构造器(secondary constructor) {id="secondary-constructors"}

在 Kotlin 中, 类除了主构造器之外, 还可以拥有额外的次级构造器.
在你需要多种方式初始化类时, 或在 [与 Java 互操作](java-to-kotlin-interop.md) 时, 次级构造器会很有用.

要声明次级构造器, 请在 Body 部内使用 `constructor` 关键字, 在括号 `()` 内添加构造器参数.
在大括号 `{}` 内添加构造器逻辑:

```kotlin
// 类头部有一个主构造器, 初始化 name 和 age
class Person(val name: String, var age: Int) {

    // 次级构造器, 接收 String 类型的 age, 并将其转换为 Int 类型
    constructor(name: String, age: String) : this(name, age.toIntOrNull() ?: 0) {
        println("$name created with converted age: ${this.age}")
    }
}

fun main() {
    // 使用次级构造器, 传入 String 类型的 age
    Person("Bob", "8")
    // 输出结果为: Bob created with converted age: 8
}
```
{kotlin-runnable="true" id="class-with-secondary-constructor"}

> 表达式 `age.toIntOrNull() ?: 0` 使用了 Elvis 操作符.
> 详情请参见 [null 值安全性](null-safety.md#elvis-operator).
>
{style="tip"}

在上面的代码中, 次级构造器通过 `this` 关键字委托给主构造器,
传入参数是 `name`, 和 `age` 转换为整数的值.

在 Kotlin 中, 次级构造器必须委托给主构造器.
这种委托确保了主构造器所有的初始化逻辑在次级构造器逻辑运行之前执行.

构造器委托可以是:
* **直接(Direct)** 委托, 次级构造器直接调用主构造器.
* **间接(Indirect)** 委托, 一个次级构造器调用另一个次级构造器, 后者再委托给主构造器.

下面的示例演示直接委托和间接委托的工作方式:

```kotlin
// 类头部有一个主构造器, 初始化 name 和 age
class Person(
    val name: String,
    var age: Int
) {
    // 直接委托给主构造器的次级构造器
    constructor(name: String) : this(name, 0) {
        println("Person created with default age: $age and name: $name.")
    }

    // 使用间接委托的次级构造器:
    // this("Bob") -> constructor(name: String) -> 主构造器
    constructor() : this("Bob") {
        println("New person created with default age: $age and name: $name.")
    }
}

fun main() {
    // 根据直接委托创建实例
    Person("Alice")
    // 输出结果为: Person created with default age: 0 and name: Alice.

    // 根据间接委托创建实例
    Person()
    // 输出结果为:
    // Person created with default age: 0 and name: Bob.
    // New person created with default age: 0 and name: Bob.
}
```
{kotlin-runnable="true" id="class-delegation"}

在含有初始化代码块(`init {}`)的类中, 这些代码块中的代码成为主构造器的一部分.
由于次级构造器首先委托给主构造器, 所有初始化代码块和属性初始化代码都会在次级构造器体之前运行.
即使类没有主构造器, 委托仍然会隐含地发生:

```kotlin
// 类头部没有主构造器
class Person {
    // 创建实例时, 初始化代码块运行
    init {
        // 在次级构造器之前运行
        println("1. First initializer block runs")
    }

    // 次级构造器, 接收整数参数
    constructor(i: Int) {
        // 在初始化代码块之后运行
        println("2. Person $i is created")
    }
}

fun main() {
    // 创建 Person 类的实例
    Person(1)
    // 输出结果为:
    // 1. First initializer block runs
    // 2. Person 1 created
}
```
{kotlin-runnable="true" id="class-delegation-sequence"}

### 没有构造器的类 {id="classes-without-constructors"}

没有声明任何构造器(主构造器或次级构造器)的类, 有一个隐含的无参数主构造器:

```kotlin
// 类没有明确的构造器
class Person {
    // 没有声明主构造器, 或次级构造器
}

fun main() {
    // 使用隐含的主构造器创建 Person 类的实例
    val person = Person()
}
```

这个隐含的主构造器的可见度是 public, 因此它可以从任何地方访问.
如果不希望你的类拥有 public 的构造器, 请声明一个空的主构造器, 使用默认值之外的可见度:

```kotlin
class Person private constructor() { /*...*/ }
```

> 在 JVM 中, 如果主构造器的所有参数都有默认值, 编译器会隐含地提供一个无参数构造器, 使用这些默认值.
>
> 这使得 Kotlin 更容易与各种库配合使用, 例如 [Jackson](https://github.com/FasterXML/jackson),
> 或 [Spring Data JPA](https://spring.io/projects/spring-data-jpa) 等等,
> 这些库通过无参数构造器来创建类的实例.
>
> 在下面的示例中, Kotlin 隐含地提供了一个无参数构造器 `Person()`, 使用默认值 `""`:
>
> ```kotlin
> class Person(val personName: String = "")
> ```
>
{style="note"}

## 继承 {id="inheritance"}

Kotlin 中的类继承, 可以从已有的类(称为基类)创建新的类(称为派生类), 继承基类的属性和函数, 同时添加或修改行为.

关于继承的层级结构, 以及如何使用 `open` 关键字, 详情请参见 [继承](inheritance.md) 章节.

## 抽象类 {id="abstract-classes"}

在 Kotlin 中, 抽象类是不能直接实例化的类. 它们被设计为由其他类继承, 由继承类来定义实际的行为.
这种行为称为 _实现(implementation)_.

抽象类可以声明抽象的属性和函数, 它们必须由子类实现.

抽象类也可以有构造器.
这些构造器初始化类属性, 并强制子类提供必要的参数.
使用 `abstract` 关键字声明抽象类:

```kotlin
abstract class Person(val name: String, val age: Int)
```

抽象类可以同时拥有抽象的成员和非抽象的成员(属性和函数).
要将成员声明为抽象的, 必须明确使用 `abstract` 关键字.

不需要对抽象类或函数标注 `open` 关键字, 因为它们默认就是可继承的.
关于 `open` 关键字, 详情请参见 [继承](inheritance.md#open-keyword).

抽象成员在抽象类中没有实现.
你需要在子类或继承类中, 通过 `override` 函数或属性来定义实现:

```kotlin
// 抽象类, 主构造器声明 name 和 age
abstract class Person(
    val name: String,
    val age: Int
) {
    // 抽象成员
    // 不提供实现, 必须由子类实现
    abstract fun introduce()

    // 非抽象成员(有实现)
    fun greet() {
        println("Hello, my name is $name.")
    }
}

// 子类, 为抽象成员提供实现
class Student(
    name: String,
    age: Int,
    val school: String
) : Person(name, age) {
    override fun introduce() {
        println("I am $name, $age years old, and I study at $school.")
    }
}

fun main() {
    // 创建 Student 类的实例
    val student = Student("Alice", 20, "Engineering University")

    // 调用非抽象成员
    student.greet()
    // 输出结果为: Hello, my name is Alice.

    // 调用被覆盖的抽象成员
    student.introduce()
    // 输出结果为: I am Alice, 20 years old, and I study at Engineering University.
}
```
{kotlin-runnable="true" id="abstract-class"}

## 同伴对象(Companion Object) {id="companion-objects"}

在 Kotlin 中, 每个类都可以有一个 [同伴对象](object-declarations.md#companion-objects).
同伴对象是一种对象声明, 可以使用类名访问其成员, 而不需要创建类的实例.

假如你需要编写一个函数, 可以在不创建类实例的情况下调用它, 但它在逻辑上仍与类紧密关联(例如工厂函数).
这种情况下, 你可以在类内的同伴 [对象声明](object-declarations.md) 中声明它:

```kotlin
// 类, 主构造器声明 name 属性
class Person(
    val name: String
) {
    // Body 部包含同伴对象
    companion object {
        fun createAnonymous() = Person("Anonymous")
    }
}

fun main() {
    // 在不创建类实例的情况下调用函数
    val anonymous = Person.createAnonymous()
    println(anonymous.name)
    // 输出结果为: Anonymous
}
```
{kotlin-runnable="true" id="class-with-companion-object"}

如果你在类中声明了同伴对象, 那么只需要使用类名作为限定符就可以访问同伴对象的成员.

详情请参见 [同伴对象](object-declarations.md#companion-objects).
