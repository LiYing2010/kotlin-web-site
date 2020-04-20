---
type: doc
layout: reference
category: Basics
title: 编码规约
---

# 编码规约

本章介绍 Kotlin 语言目前的编码风格.

* [源代码组织](#source-code-organization)
* [命名规约](#naming-rules)
* [代码格式化](#formatting)
* [文档注释](#documentation-comments)
* [避免冗余的结构](#avoiding-redundant-constructs)
* [各种语言特性的惯用法](#idiomatic-use-of-language-features)
* [针对库开发的编码规约](#coding-conventions-for-libraries)

### 在 IDE 中应用本编码规约

如果要按照本编码规约来配置 IntelliJ 的代码格式化规则, 请安装 Kotlin plugin 1.2.20 或更高版本,
进入菜单 Settings | Editor | Code Style | Kotlin, 点击右上方的 "Set from..." 链接,
然后在菜单中选择 "Predefined style / Kotlin style guide".

如果要验证你的代码是否已经按照本编码规约格式化完成, 可以进入代码检查的设置,
然后启用 "Kotlin | Style issues | File is not formatted according to project settings" 检查项目.
对于本编码规约中提到的其他问题 (比如命名规约), 相应的检查项目默认已经启用了.

## 源代码组织

### 目录结构

在混合语言项目中, Kotlin 源代码文件应该与 Java 源代码文件放在相同的源代码根目录下, 并且遵循相同的目录结构
(每个文件应该保存在它的 package 语句对应的目录之下).

在纯 Kotlin 语言的项目中, 建议源代码文件的目录结构遵循包的结构, 但省略共通的源代码根目录
(比如, 如果项目内的所有源代码都在 "org.example.kotlin" 包及其子包之下, 那么 "org.example.kotlin" 包对应的文件应该直接保存到源代码的根目录下,
而 "org.example.kotlin.foo.bar" 包下的文件应该保存在源代码根目录下的 "foo/bar" 子目录下).

### 源代码文件名

如果 Kotlin 源代码文件只包含单个类 (以及相关的顶级声明), 那么源代码文件的名称应该与类名相同, 再加上 .kt 扩展名.
如果源代码文件包含多个类, 或者只包含顶级声明, 请选择一个能够描述文件所包含内容的名称, 用这个名称作为源代码文件名.
文件名如果包含多个单词, 请使用驼峰式大小写, 并将首字母大写(比如 `ProcessDeclarations.kt`).

文件的名称应该描述其中包含的代码的功能. 因此, 应该避免在文件名中使用无意义的单词, 比如 "Util".

### 源代码文件的组织

如果多个声明 (类, 顶级函数, 或顶级属性) 在语义上相互之间相关密切, 并且文件大小合理(不超过几百行的规模), 那么我们鼓励将这些放在同一个 Kotlin 源代码文件中.

尤其是, 当为类定义扩展函数时, 如果与到这个类的所有使用者都有关系, 那么应该将它们放在与类本身相同的源代码文件内.
如果定义的扩展函数, 只对特定的使用者有意义, 请将它们放在这个使用者的代码之后. 不要仅仅为了 "保存 Foo 类的所有扩展函数" 而创建一个单独的源代码文件.

### 类的布局

通常来说, 类的内容按以下顺序排列:

- 属性声明, 以及初始化代码端
- 次构造器
- 方法声明
- 同伴对象

请不要将方法声明按照字母顺序排列, 也不要按照可见度顺序排列, 也不要将常规方法与扩展方法分开.
相反, 要将关系紧密的代码放在一起, 以便让他人从上到下阅读代码时, 能够理解代码的逻辑含义.
你应该选择一个排序原则(将逻辑含义上比较顶层的代码在前, 或者反过来), 然后在所有的代码中都遵循相同的原则.

将嵌套类放在使用它的代码之后. 如果嵌套类是为了供外部使用, 没有被类内部的代码使用, 那么请将它放在最后, 放在同伴对象之后.

### 接口实现类的布局

实现一个接口时, 将实现类中的成员方法顺序, 保持与接口中的声明顺序一致(如果需要的话, 中间可以插入被实现方法用到的其它私有方法)

### 重载方法的布局

将同一个类中的同名重载方法放在一起.

## 命名规约

Kotlin 遵循 Java 的命名规约. 具体来说:

包名称总是使用小写字母, 并且不使用下划线(`org.example.myproject`).
通常不鼓励使用多个单词的名称, 但如果的确需要, 你可以将多个单词直接连接在一起, 或者使用驼峰式大小写(`org.example.myProject`).

类和对象的名称以大写字母开头, 并且使用驼峰式大小写:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
open class DeclarationProcessor { ... }

object EmptyDeclarationProcessor : DeclarationProcessor() { ... }
```

</div>

### 函数名称

函数, 属性, 以及局部变量的名称以小写字母开头, 并且使用驼峰式大小写, 而且不使用下划线:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun processDeclarations() { ... }
var declarationCount = ...
```

</div>

例外情况: 用于创建类实例的工厂函数, 可以使用与它创建的类相同的名称:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
abstract class Foo { ... }

class FooImpl : Foo { ... }

fun Foo(): Foo { return FooImpl(...) }
```

</div>

#### 测试方法名称

在测试代码中 (而且仅仅在测试代码中), 可以使用用反引号括起的, 带空格的方法名. (注意, 这样的方法名目前在 Android 运行环境下不支持.)
测试代码中的方法名, 也允许使用下划线.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class MyTestCase {
     @Test fun `ensure everything works`() { ... }

     @Test fun ensureEverythingWorks_onAndroid() { ... }
}
```

</div>

### 属性名称

对于常数 (标记了 `const` 的属性, 或者不存在自定义的 `get` 函数顶级的 `val` 属性, 或对象的 `val` 属性, 并且其值是深层不可变数据), 应该使用下划线分隔的大写名称:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
const val MAX_COUNT = 8
val USER_NAME_FIELD = "UserName"
```

</div>

顶级属性, 或对象属性, 如果它的值是对象, 或者包含可变的数据, 那么应该使用通常的驼峰式大小写名称:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val mutableCollection: MutableSet<String> = HashSet()
```

</div>

如果属性指向单体对象, 那么可以使用与 `object` 声明相同的命名方式:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
val PersonComparator: Comparator<Person> = ...
```

</div>

对于枚举常数, 可以使用下划线分隔的大写名称(`enum class Color { RED, GREEN }`), 也可以使用大写字母开头的驼峰式大小写名称, 由你的具体用法来决定.

#### 后端属性名称

如果类拥有两个属性, 它们在概念上是相同的, 但其中一个是公开 API 的一部分, 而另一个属于内部的实现细节, 此时请使用下划线作为私有属性名的前缀:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class C {
    private val _elementList = mutableListOf<Element>()

    val elementList: List<Element>
         get() = _elementList
}
```

</div>

### 选择好的名称

类的名称通常使用名词, 或名词短语, 要能够解释这个类 _是_ 什么: `List`, `PersonReader`.

方法名称通常使用动词, 或动词短语, 说明这个方法 _做_ 什么: `close`, `readPersons`.
方法名称还应该能够说明这个方法是变更这个对象, 或者还是返回一个新的实例.
比如 `sort` 是对集合(collection)本身的内容排序, 而 `sorted` 则是返回这个集合的一个副本, 其中包含排序后内容.

名称应该解释清楚这个类或方法的目的是什么, 因此最好在命名时避免使用含义不清的词语(`Manager`, `Wrapper` 等等).

在名称中使用缩写字母时, 如果缩写字母只包含两个字母, 请将它们全部大写 (比如 `IOStream`);
如果超过两个字母, 请将首字母大写, 其他字母小写 (比如 `XmlFormatter`, `HttpInputStream`).


## 代码格式化

大多数情况下, Kotlin 遵循 Java 的编码规范.

缩进时使用 4 个空格. 不要使用 tab.

对于大括号, 请将开括号放在结构开始处的行末, 将闭括号放在单独的一行, 与它所属的结构缩进到同样的位置.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if (elements != null) {
    for (element in elements) {
        // ...
    }
}
```

</div>

(注意: 在 Kotlin 中, 分号是可以省略的, 因此折行很重要. 语言设计时预想使用 Java 风格的大括号,
如果你使用不同的格式化风格, 你的代码执行时的行为可能会与你预想的不同.)

### 水平空格

二元运算符前后应该加入空格 (`a + b`). 例外情况是: 不要在 "值范围" 运算符前后加入空格 (`0..i`).

一元运算符前后不要加入空格 (`a++`)

流程控制关键字(`if`, `when`, `for` 以及 `while`) 以及对应的开括号之间, 要加入空格.

对于主构造器声明, 方法声明, 以及方法调用, 不要在开括号之前加入空格.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class A(val x: Int)

fun foo(x: Int) { ... }

fun bar() {
    foo(1)
}
```

</div>

不要在 `(`, `[` 之后加入空格, 也不要在 `]`, `)` 之前加入空格.

不要在 `.` 或 `?.` 前后加入空格: `foo.bar().filter { it > 2 }.joinToString()`, `foo?.bar()`

在 `//` 之后加入空格: `// This is a comment`

对于用来表示类型参数的尖括号, 不要在它前后加入空格: `class Map<K, V> { ... }`

不要在 `::` 前后加入空格: `Foo::class`, `String::length`

对于用来表示可空类型的 `?`, 不要在它之前加入空格: `String?`

一般来说, 不要进行任何形式的水平对其. 如果将一个标识符改为不同长度的名称, 不应该影响到它的任何声明, 以及任何使用的格式.

### 冒号

以下情况, 要在 `:` 之前加入空格:

  * 用作类型与父类型之间的分隔符时;
  * 委托给超类的构造器, 或者委托给同一个类的另一个构造器时;
  * 用在 `object` 关键字之后时.

如果 `:` 用作某个声明与它的类型之间的分隔符时, 不要它前面加入空格.

在 `:` 之后, 一定要加入一个空格.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
abstract class Foo<out T : Any> : IFoo {
    abstract fun foo(a: Int): T
}

class FooImpl : Foo() {
    constructor(x: String) : this(x) { ... }

    val x = object : IFoo { ... }
}
```

</div>

### 类头部格式化

如果类的主构造器只有少量参数, 可以写成单独的一行:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(id: Int, name: String)
```

</div>

如果类的头部很长, 应该调整代码格式, 将主构造器(primary constructor)的每一个参数放在单独的行中, 并对其缩进. 同时, 闭括号也应放在新的一行.
如果我们用到了类的继承, 那么对超类构造器的调用, 以及实现的接口的列表, 应该与闭括号放在同一行内:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name) { ... }
```

</div>

对于多个接口的情况, 对超类构造器的调用应该放在最前, 然后将每个接口放在单独的行中:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
class Person(
    id: Int,
    name: String,
    surname: String
) : Human(id, name),
    KotlinMaker { ... }
```

</div>

如果类的父类型列表很长, 请在冒号之后换行, 并将所有的父类型名称缩进到同样的位置:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne
{
    fun foo() { ... }
}
```

</div>

当类头部很长时, 为了将类头部和类主体部分更清楚地分隔开, 可以在类头部之后加入一个空行(如上面的例子所示), 也可以将大括号放在单独的一行:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
class MyFavouriteVeryLongClassHolder :
    MyLongHolder<MyFavouriteVeryLongClass>(),
    SomeOtherInterface,
    AndAnotherOne {

    fun foo() { ... }
}
```

</div>

对构造器的参数, 使用通常的缩进(4 个空格).

> 原因: 这是为了让主构造器中声明的属性, 与类主体部分声明的属性的缩进保持一致.

### 修饰符

如果一个声明带有多个修饰符, 修饰符一定要按照下面的顺序排列:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
public / protected / private / internal
expect / actual
final / open / abstract / sealed / const
external
override
lateinit
tailrec
vararg
suspend
inner
enum / annotation
companion
inline
infix
operator
data
```

</div>

所有的注解要放在修饰符之前:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Named("Foo")
private val foo: Foo
```

</div>

除非你在开发一个库, 否则应该省略多余的修饰符(比如 `public`).

### 注解格式化

注解通常放在它修饰的声明之前, 放在单独的行中, 使用相同的缩进:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Target(AnnotationTarget.PROPERTY)
annotation class JsonExclude
```

</div>

无参数的注解可以放在同一行中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@JsonExclude @JvmField
var x: String
```

</div>

无参数的单个注解可以与它修饰的声明放在同一行中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
@Test fun foo() { ... }
```

</div>

### 文件注解

文件注解放在文件注释之后(如果存在的话), 在 `package` 语句之前, 与 `package` 语句之间用空行隔开 (为了强调注解的对象是文件, 而不是包).

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
/** License, copyright and whatever */
@file:JvmName("FooBar")

package foo.bar
```

</div>

### 函数格式化

如果函数签名无法排列在一行之内, 请使用下面的语法:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun longMethodName(
    argument: ArgumentType = defaultValue,
    argument2: AnotherArgumentType
): ReturnType {
    // body
}
```

</div>

函数参数使用通常的缩进(4 个空格).

> 原因: 这是为了与构造器参数保持一致

如果函数体只包含单独的一个表达式, 应当使用表达式函数体.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo(): Int {     // 这是不好的风格
    return 1
}

fun foo() = 1        // 这是好的风格
```

</div>

### 表达式体格式化

如果函数体表达式太长, 无法与函数声明放在同一行之内, 那么应该将 `=` 符号放在第一行.
表达式函数体放在下一行, 缩进 4 个空格.

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
fun f(x: String) =
    x.length
```

</div>

### 属性格式化

对于简单的只读属性, 应该使用单行格式:

<div class="sample" markdown="1" theme="idea" data-highlight-only >

```kotlin
val isEmpty: Boolean get() = size == 0
```

</div>

对更复杂一些的属性, 一定要将 `get` 和 `set` 关键字放在单独的行:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val foo: String
    get() { ... }
```

</div>

对于带有初始化器(initializer)的属性, 如果初始化器很长, 请在等号之后换行, 然后对初始化器缩进 4 个空格:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
private val defaultCharset: Charset? =
    EncodingRegistry.getInstance().getDefaultCharsetForPropertiesFiles(file)
```

</div>

### 控制流语句的格式化

如果 `if` 或 `when` 语句的条件部分有多行代码, 一定要将主体部分用大括号括起.
将条件部分的每一个子句, 从语句开始的位置缩进 4 个空格.
将条件部分的闭括号, 与主体部分的开括号一起, 放在单独一行:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
if (!component.isSyncing &&
    !hasAnyKotlinRuntimeInScope(module)
) {
    return createKotlinNotConfiguredPanel(module)
}
```

</div>

> 原因: 这是为了将条件部分与主体部分对其, 并且分隔清楚

将 `else`, `catch`, `finally` 关键字, 以及 do/while 循环语句的 `while` 关键字, 与它之后的开括号放在同一行中:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
if (condition) {
    // body
} else {
    // else part
}

try {
    // body
} finally {
    // cleanup
}
```

</div>

在 `when` 语句中, 如果一个条件分支包含了多行语句, 应该将它与临近的条件分支用空行分隔开:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
private fun parsePropertyValue(propName: String, token: Token) {
    when (token) {
        is Token.ValueToken ->
            callback.visitValue(propName, token.value)

        Token.LBRACE -> { // ...
        }
    }
}
```

</div>

对于比较短的分支, 与条件部分放在同一行中, 不用大括号.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (foo) {
    true -> bar() // 这是比较好的风格
    false -> { baz() } // 这是不好的风格
}
```

</div>


### 方法调用的格式化

如果参数列表很长, 请在开括号之后换行. 参数缩进 4 个空格.
关系紧密的多个参数放在同一行中.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
drawSquare(
    x = 10, y = 10,
    width = 100, height = 100,
    fill = true
)
```

</div>

在 `=` 前后加入空格, 将参数名与参数值分隔开.

### 链式调用(chained call)的换行

对链式调用(chained call)换行时, 将 `.` 字符或 `?.` 操作符放在下一行, 使用单倍缩进:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
val anchor = owner
    ?.firstChild!!
    .siblings(forward = true)
    .dropWhile { it is PsiComment || it is PsiWhiteSpace }
```

</div>

链式调用中的第一个调用, 在它之前通常应该换行, 但如果能让代码更合理, 也可以省略换行.

### Lambda 表达式格式化

在 Lambda 表达式中, 在大括号前后应该加入空格, 分隔参数与表达式体的箭头前后也要加入空格.
如果一个函数调用可以接受单个 Lambda 表达式作为参数, 那么 Lambda 表达式应该尽可能写到函数调用的圆括号之外.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
list.filter { it > 10 }
```

</div>

如果为 Lambda 表达式指定标签, 请不要在标签与表达式体的开括号之间加入空格:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo() {
    ints.forEach lit@{
        // ...
    }
}
```

</div>

在多行的 Lambda 表达式中声明参数名称时, 请将参数名放在第一行, 后面放箭头, 然后换行:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
appendCommaSeparated(properties) { prop ->
    val propertyValue = prop.get(obj)  // ...
}
```

</div>

如果参数列表太长, 无法放在一行之内, 请将箭头放在单独的一行:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
foo {
   context: Context,
   environment: Env
   ->
   context.configureEnv(environment)
}
```

</div>

## 文档注释

对于比较长的文档注释, 请将开头的 `/**` 放在单独的行, 后面的每一行都用星号开始:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
/**
 * 这是一段文档注释,
 * 其中包含多行.
 */
```

</div>

比较短的注释可以放在一行之内:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
/** 这是一段比较短的文档注释. */
```

</div>

通常来说, 不要使用 `@param` 和 `@return` 标记. 相反, 对参数和返回值的描述应该直接合并到文档注释之内, 在提到参数的地方应该添加链接.
只有参数或返回值需要很长的解释, 无法写在文档注释中, 这时才应该使用 `@param` 和 `@return` 标记.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 不要写这样的注释:

/**
 * 对于给定的数值, 返回其绝对值.
 * @param number 需要返回绝对值的对象数值.
 * @return 绝对值.
 */
fun abs(number: Int) = ...

// 应该这样:

/**
 * 对于给定的 [number], 返回其绝对值.
 */
fun abs(number: Int) = ...
```

</div>

## 避免冗余的结构

通常来说, 如果 Kotlin 代码中的某个语法结构是可省略的, 并且被 IDE 标记显示为可省略的, 那么你就应该在代码中省略这部分.
不要仅仅"为了解释清楚", 就在代码中留下不必须的语法元素.

### Unit

如果函数的返回值为 Unit 类型, 那么返回值的类型声明应当省略:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun foo() { // 此处省略了 ": Unit"

}
```

</div>

### 分号

尽可能省略分号.

### 字符串模板

向字符串模板中插入简单变量时, 不要使用大括号. 只有对比较长的表达式, 才应该使用大括号.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
println("$name has ${children.size} children")
```

</div>


## 各种语言特性的惯用法

### 数据的不可变性

尽量使用不可变的数据, 而不是可变的数据.
如果局部变量或属性的值在初始化之后不再变更, 尽量将它们声明为 `val`, 而不是 `var`.

对于内容不发生变化的集合, 一定要使用不可变的集合接口(`Collection`, `List`, `Set`, `Map`) 来声明.
当使用工厂方法创建集合类型时, 一定要尽可能使用返回不可变集合类型的函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 这是不好的风格: 对于内容不再变化的值, 使用了可变的集合类型
fun validateValue(actualValue: String, allowedValues: HashSet<String>) { ... }

// 这是比较好的风格: 改用了不可变的集合类型
fun validateValue(actualValue: String, allowedValues: Set<String>) { ... }

// 这是不好的风格: arrayListOf() 的返回类型为 ArrayList<T>, 这是一个可变的集合类型
val allowedValues = arrayListOf("a", "b", "c")

// 这是比较好的风格: listOf() 的返回类系为 List<T>
val allowedValues = listOf("a", "b", "c")
```

</div>

### 参数默认值

尽可能使用带默认值的参数来声明函数, 而不是声明多个不同参数的重载函数.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
// 不好的风格
fun foo() = foo("a")
fun foo(a: String) { ... }

// 比较好的风格
fun foo(a: String = "a") { ... }
```

</div>

### 类型别名

如果你的某个函数类型, 或者某个带类型参数的类型, 在代码中多次用到, 那么应该尽量为它定义一个类型别名:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
typealias MouseClickHandler = (Any, MouseEvent) -> Unit
typealias PersonIndex = Map<String, Person>
```

</div>

### Lambda 表达式参数

在比较短, 而且没有嵌套的 Lambda 表达式, 建议使用 `it` 规约, 而不要明确声明参数.
在有参数的嵌套 Lambda 表达式中, 参数一定要明确声明.


### 在 Lambda 表达式中返回

不要在 Lambda 表达式中使用多个带标签的返回. 应该考虑重构你的 Lambda 表达式, 使它只有一个退出点.
如果无法做到, 或者代码不够清晰, 那么可以考虑把 Lambda 改为一个匿名函数.

在 Lambda 表达式中, 不要使用带标签的返回值为最后一条语句.

### 命名参数

如果一个方法接受同一种基本类型的多个参数, 或者如果参数为 `Boolean` 类型,
除非通过代码的上下文, 可以非常清楚地确定所有参数的含义, 否则此时应该使用命名参数语法.

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
drawSquare(x = 10, y = 10, width = 100, height = 100, fill = true)
```

</div>

### 使用条件语句

尽量使用 `try`, `if` 以及 `when` 的表达式形式. 示例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
return if (x) foo() else bar()

return when(x) {
    0 -> "zero"
    else -> "nonzero"
}
```

</div>

上面的写法比下面的代码要好:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
if (x)
    return foo()
else
    return bar()

when(x) {
    0 -> return "zero"
    else -> return "nonzero"
}    
```

</div>

### `if` vs `when`

对于二元的条件分支, 尽量使用 `if` 而不是 `when`. 比如, 下面的代码是不好的:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
when (x) {
    null -> ...
    else -> ...
}
```

</div>

应该改用 `if (x == null) ... else ...`

如果存在三个或更多的条件分支, 尽量使用 `when`.

### 在条件中使用可为空的 `Boolean` 值

如果需要在条件语句中使用可为空的 `Boolean`, 请使用 `if (value == true)` 或者 `if (value == false)` 进行判断.

### 使用循环

尽量使用高阶函数(`filter`, `map` 等等.) 来进行循环处理. 例外情况: `forEach` (应该尽量使用通常的 `for` 循环,
除非 `forEach` 函数的接受者对象可能为空, 或者 `forEach` 是一个很长的链式调用的一部分).

应该使用多个高阶函数组成的复杂表达式, 还是应该使用一个循环语句, 选择之前应该理解这两种操作各自的代价, 并且注意考虑性能问题.

### 在数值范围上循环

如果数值范围是一个开区间(不包含其末尾元素), 那么应该使用 `until` 函数进行循环:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
for (i in 0..n - 1) { ... }  // 不好的风格
for (i in 0 until n) { ... }  // 比较好的风格
```

</div>

### 使用字符串

尽量使用字符串模板来进行字符串拼接.

尽量使用多行字符串, 而不是在通常的字符串字面值中使用内嵌的 `\n` 转义符.

关于多行字符串中缩进的维护, 如果结果字符串内部不需要任何缩进, 应该使用 `trimIndent` 函数,
如果字符串内部需要缩进, 应该使用 `trimMargin` 函数:

<div class="sample" markdown="1" theme="idea" data-highlight-only auto-indent="false">

```kotlin
assertEquals(
    """
    Foo
    Bar
    """.trimIndent(),
    value
)

val a = """if(a > 1) {
          |    return a
          |}""".trimMargin()
```

</div>

### 函数 vs 属性

有些情况下, 无参数的函数可以与只读属性相互替代.
虽然它们在语义上是相似的, 但从编程风格上的角度看, 存在一些规约来决定在什么时候应该使用函数, 什么时候应该使用属性.

当以下条件成立时, 应该选择使用只读属性, 而不是使用函数:

* 不会抛出异常
* 计算过程消费的资源不多(或者在初次运行时缓存了计算结果)
* 对象状态没有发生变化时, 多次调用会返回相同的结果

### 使用扩展函数

应该尽量多的使用扩展函数. 如果你的某个函数主要是为某个对象服务, 应该考虑将它转变为这个对象的一个扩展函数.
为了尽量减小 API 污染, 应该将扩展函数的可见度尽量限制在合理的程度.
如果需要, 尽量使用局部扩展函数, 成员扩展函数, 或者可见度为 private 的顶级扩展函数.

### 使用中缀函数

如果一个函数服务于两个参数, 而且这两个参数的角色很类似, 只有这种情况下才应该将函数声明为中缀函数. 好的例子比如: `and`, `to`, `zip`.
坏的例子比如: `add`.

如果方法会变更它的接受者对象, 那么不应该将它声明为中缀方法.

### 工厂函数

如果你为一个类声明一个工厂方法, 请不要使用与类相同的名称. 尽量使用一个不同的名称, 解释清楚工厂函数的行为有什么不同之处.
只有当工厂函数的确实不存在什么特殊意义的时候, 这时你才可以使用与类相同的名称作为函数名.

示例:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Point(val x: Double, val y: Double) {
    companion object {
        fun fromPolar(angle: Double, radius: Double) = Point(...)
    }
}
```

</div>

如果某个对象拥有多个不同参数的重载构造器, 这些构造器不会调用超类中的不同的构造器,
而且无法缩减成带默认值参数的单个构造器, 这时应该将这些构造器改为工厂函数.

### 平台数据类型

对于 public 的函数或方法, 如果返回一个平台类型的表达式, 那么应该明确声明它在 Kotlin 中的类型:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun apiCall(): String = MyJavaApi.getProperty("name")
```

</div>

(包级或者类级的)任何属性, 如果使用平台类型的表达式进行初始化, 那么应该明确声明它在 Kotlin 中的类型:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
class Person {
    val name: String = MyJavaApi.getProperty("name")
}
```

</div>

局部变量值, 如果使用平台类型的表达式进行初始化, 那么可以为它声明类型, 也可以省略:

<div class="sample" markdown="1" theme="idea" data-highlight-only>

```kotlin
fun main() {
    val name = MyJavaApi.getProperty("name")
    println(name)
}
```

</div>

### 使用范围函数 apply/with/run/also/let

Kotlin 提供了一系列函数, 用来在某个指定的对象上下文中执行一段代码, 这些函数包括: `let`, `run`, `with`, `apply`, 以及 `also`.
对于具体的问题, 应该如何选择正确的作用域函数, 详情请参见 [作用域函数(Scope Function)](scope-functions.html).


## 针对库开发的编码规约

开发库时, 为了保证 API 的稳定性, 建议还要遵守以下规约:

 * 始终明确指定成员的可见度 (以免不小心将某个声明暴露成 public API)
 * 始终明确指定函数的返回类型, 以及属性类型 (以免修改实现代码时, 不小心改变了返回类型)
 * 对所有的 public 成员编写 KDoc 文档注释 (这是为了对库生成文档), 例外情况是, 方法或属性的覆盖不需要提供新的注释
