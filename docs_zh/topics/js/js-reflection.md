[//]: # (title: Kotlin/JS 的反射(Reflection))

Kotlin/JS 只对 Kotlin [反射 API](reflection.md) 提供有限的支持.
目前仅支持以下 API:

* [类引用(class reference)](reflection.md#class-references) (`::class`)
* [`KType` 和 `typeof()`](#ktype-and-typeof)
* [`KClass` 和 `createInstance()`](#kclass-and-createinstance)

## 类引用(class reference) {id="class-references"}

`::class` 语法返回一个对象实例的类引用, 一个指定的类型的类引用.
在 Kotlin/JS 中, `::class` 表达式的值是
[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/)
的一个简化版实现, 它只支持:
* 成员函数 [simpleName](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/simple-name.html)
和 [isInstance()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/is-instance.html).
* 扩展函数 [cast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/cast.html)
和 [safeCast()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/safe-cast.html).

除此之外, 你还可以使用 [KClass.js](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/js.html)
来获取某个类的 [JsClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.js/-js-class/index.html) 实例.
`JsClass` 的实例本身是一个指向构造函数的引用.
因此可以用来与那些需要用到构造函数引用的 JS 函数互操作.

## KType 与 typeOf() {id="ktype-and-typeof"}

[`typeof()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/type-of.html) 函数
对一个指定的类型 创建 [`KType`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-type/) 实例.
Kotlin/JS 完全支持 `KType` API, 但 Java 专有的部分除外.

## KClass 与 createInstance() {id="kclass-and-createinstance"}

[KClass](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect/-k-class/) 接口的
[`createInstance()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.reflect.full/create-instance.html)
函数创建指定的类的一个新实例, 可以用来在运行期得到一个 Kotlin 类的引用.

## 示例 {id="example"}

下面是 Kotlin/JS 中反射的使用示例.

```kotlin
open class Shape
class Rectangle : Shape()

inline fun <reified T> accessReifiedTypeArg() =
    println(typeOf<T>().toString())

fun main() {
    val s = Shape()
    val r = Rectangle()

    println(r::class.simpleName) // 输出结果为 "Rectangle"
    println(Shape::class.simpleName) // 输出结果为 "Shape"
    println(Shape::class.js.name) // 输出结果为 "Shape"

    println(Shape::class.isInstance(r)) // 输出结果为 "true"
    println(Rectangle::class.isInstance(s)) // 输出结果为 "false"
    val rShape = Shape::class.cast(r) // 将 Rectangle "r" 转换为 Shape

    accessReifiedTypeArg<Rectangle>() // 通过 typeOf() 访问类型. 输出结果为 "Rectangle"
}
```
