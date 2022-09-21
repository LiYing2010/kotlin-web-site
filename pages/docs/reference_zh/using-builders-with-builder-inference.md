---
type: doc
layout: reference
category:
title: "通过构建器类型推断(Builder Type Inference)使用构建器"
---

# 通过构建器类型推断(Builder Type Inference)使用构建器

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 支持 _构建器类型推断(Builder Type Inference)_ (或者叫构建器推断),
当你使用泛型构建器时, 这个功能可以很有用.
它能够帮助编译器, 通过构建器的 Lambda 表达式参数内的其它调用的类型信息, 推断出构建器调用的类型参数.

请参考下面的示例程序中对
[`buildMap()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-map.html)
的使用:

```kotlin
fun addEntryToMap(baseMap: Map<String, Number>, additionalEntry: Pair<String, Int>?) {
   val myMap = buildMap {
       putAll(baseMap)
       if (additionalEntry != null) {
           put(additionalEntry.first, additionalEntry.second)
       }
   }
}
```

这里没有足够的类型信息来通过通常的方式推断类型参数, 但构建器推断能够分析 Lambda 表达式参数内的函数调用.
根据 `putAll()` 和 `put()` 调用的类型信息, 编译器可以自动将 `buildMap()` 调用的类型参数推断为 `String` 和 `Number`.
使用泛型构建器时, 构建器推断功能允许我们省略类型参数.

## 编写你自己的构建器

### 启用构建器推断的要求条件

> 在 Kotlin 1.7.0 以前, 对一个构建器函数启用构建器推断, 需要添加编译器选项 `-Xenable-builder-inference`.
> 在 1.7.0 中, 这个选项会默认启用.
{:.note}

要对你自己的构建器使用构建器推断, 请确认它的声明有一个构建器 Lambda 表达式参数, 类型为带接受者的函数类型.
对接受者类型还有 2 个要求:

1. 它应该使用构建器推断需要推断的那个类型参数. 比如:
   ```kotlin
   fun <V> buildList(builder: MutableList<V>.() -> Unit) { ... }
   ```
   
   > 注意, 直接传递类型参数的类型, 比如 `fun <T> myBuilder(builder: T.() -> Unit)`, 目前还不支持.
   {:.note}

2. 它应该提供 public 成员函数, 或扩展函数, 签名中包含对应的类型参数. 比如:
   ```kotlin
   class ItemHolder<T> {
       private val items = mutableListOf<T>()

       fun addItem(x: T) {
           items.add(x)
       }

       fun getLastItem(): T? = items.lastOrNull()
   }
   
   fun <T> ItemHolder<T>.addAllItems(xs: List<T>) {
       xs.forEach { addItem(it) }
   }

   fun <T> itemHolderBuilder(builder: ItemHolder<T>.() -> Unit): ItemHolder<T> = 
       ItemHolder<T>().apply(builder)

   fun test(s: String) {
       val itemHolder1 = itemHolderBuilder { // itemHolder1 的类型是 ItemHolder<String>
           addItem(s)
       }
       val itemHolder2 = itemHolderBuilder { // itemHolder2 的类型是 ItemHolder<String>
           addAllItems(listOf(s)) 
       }
       val itemHolder3 = itemHolderBuilder { // itemHolder3 的类型是 ItemHolder<String?>
           val lastItem: String? = getLastItem()
           // ...
       }
   }
   ```

### 支持的功能

构建器推断支持以下功能: 
* 推断多个类型参数
  ```kotlin
  fun <K, V> myBuilder(builder: MutableMap<K, V>.() -> Unit): Map<K, V> { ... }
  ```
* 推断一个调用之内, 相互依赖的多个构建器 Lambda 表达式的类型参数
  ```kotlin
  fun <K, V> myBuilder(
      listBuilder: MutableList<V>.() -> Unit,
      mapBuilder: MutableMap<K, V>.() -> Unit
  ): Pair<List<V>, Map<K, V>> =
      mutableListOf<V>().apply(listBuilder) to mutableMapOf<K, V>().apply(mapBuilder)
  
  fun main() {
      val result = myBuilder(
          { add(1) },
          { put("key", 2) }
      )
      // result 的类型是 Pair<List<Int>, Map<String, Int>>
  }
  ```
* 推断 Lambda 表达式的参数或返回类型中出现的类型参数 
  ```kotlin
  fun <K, V> myBuilder1(
      mapBuilder: MutableMap<K, V>.() -> K
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder() }
  
  fun <K, V> myBuilder2(
      mapBuilder: MutableMap<K, V>.(K) -> Unit
  ): Map<K, V> = mutableMapOf<K, V>().apply { mapBuilder(2 as K) }
  
  fun main() {
      // result1 推断得到的类型是 Map<Long, String> 
      val result1 = myBuilder1 {
          put(1L, "value")
          2
      }
      val result2 = myBuilder2 {
          put(1, "value 1")
          // 你可以将 `it` 用作 "推迟类型变量" 类型
          // 详情请参见以下章节
          put(it, "value 2")
      }
  }
  ```

## 构建器推断的工作原理

### 推迟类型变量(Postponed Type Variable)

构建器推断使用 _推迟类型变量(Postponed Type Variable)_, 在构建器推断分析时, 它出现在构建器的 Lambda 表达式之内.
一个推迟类型变量的类型是类型参数中的一个, 具体类型还在推断过程中.
编译器使用它来收集类型参数的类型信息.

我们来看看下面示例中的 [`buildList()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/build-list.html):

```kotlin
val result = buildList {
    val x = get(0)
}
```

这里 `x` 的类型是推迟类型变量: `get()` 调用返回一个类型 `E` 的值, 但 `E` 自身还未确定.
在这个时刻, 还不知道 `E` 的确定类型.

当一个推迟类型变量的值关联到一个确定的类型, 构建器推断会收集这个信息, 在构建器推断分析结束后, 推断对应的类型参数的结果类型.
比如:

```kotlin
val result = buildList {
    val x = get(0)
    val y: String = x
} // result 的类型推断为 List<String>
```

在推迟类型变量赋值给一个 `String` 类型变量之后, 构建器推断得到信息, `x` 是 `String` 的子类型.
这个赋值是构建器 Lambda 表达式内的最后一条语句, 因此构建器推断分析结束, 结果是将类型参数 `E` 推断为 `String`.

注意, 你总是可以将推迟类型变量作为接受者, 调用 `equals()`, `hashCode()`, 和 `toString()` 函数.

### 向构建器推断结果贡献信息

构建器推断可以收集不同种类的类型信息, 这些信息都会贡献到分析结果.
它会考虑以下信息:
* 对 Lambda 表达式的接受者, 使用类型参数的类型调用方法
  ```kotlin
  val result = buildList {
      // 根据传递的 "value" 参数, 类型参数被推断为 String 
      add("value")
  } // result 的类型被推断为 List<String>
  ```
* 对返回类型参数类型的调用, 指定期望的类型 
  ```kotlin
  val result = buildList {
      // 根据期待的类型, 类型参数被推断为 Float 
      val x: Float = get(0)
  } // result 的类型被推断为 List<Float>
  ```
  ```kotlin
  class Foo<T> {
      val items = mutableListOf<T>()
  }

  fun <K> myBuilder(builder: Foo<K>.() -> Unit): Foo<K> = Foo<K>().apply(builder)

  fun main() {
      val result = myBuilder {
          val x: List<CharSequence> = items
          // ...
      } // result 的类型被推断为 Foo<CharSequence>
  }
  ```
* 向期待确定类型的方法传递推迟类型变量的类型
  ```kotlin
  fun takeMyLong(x: Long) { ... }

  fun String.isMoreThat3() = length > 3

  fun takeListOfStrings(x: List<String>) { ... }

  fun main() {
      val result1 = buildList {
          val x = get(0)
          takeMyLong(x)
      } // result1 的类型为 List<Long>

      val result2 = buildList {
          val x = get(0)
          val isLong = x.isMoreThat3()
      // ...
      } // result2 的类型为 List<String>
  
      val result3 = buildList {
          takeListOfStrings(this)
      } // result3 的类型为 List<String>
  }
  ```
* 取得一个指向 Lambda 表达式接受者的成员的可调用的引用 
  ```kotlin
  fun main() {
      val result = buildList {
          val x: KFunction1<Int, Float> = ::get
      } // result 的类型为 List<Float>
  }
  ```
  ```kotlin
  fun takeFunction(x: KFunction1<Int, Float>) { ... }

  fun main() {
      val result = buildList {
          takeFunction(::get)
      } // result 的类型为 List<Float>
  }
  ```

在分析结束后, 构建器推断考虑收集的所有类型信息, 尝试合并这些信息得到结果类型. 请看下面的示例.

```kotlin
val result = buildList { // 开始推断推迟类型变量 E
    // 认为 E 是 Number 或 Number 的一个子类型
    val n: Number? = getOrNull(0)
    // 认为 E 是 Int 或 Int 的一个超类型
    add(1)
    // E 被推断为 Int
} // result 的类型为 List<Int>
```

结果类型是与分析过程中收集到的类型信息对应的最具体的类型.
如果给定的类型信息是发生矛盾, 无法合并, 编译器会报告错误.

注意, 只有在通常的类型推断无法推断类型参数时, Kotlin 编译器才会使用构建器推断.
也就是说, 你可以在构建器 Lambda 表达式之外贡献类型信息, 那么就不需要构建器推断分析了. 请看下面的示例:

```kotlin
fun someMap() = mutableMapOf<CharSequence, String>()

fun <E> MutableMap<E, String>.f(x: MutableMap<E, String>) { ... }

fun main() {
    val x: Map<in String, String> = buildMap {
        put("", "")
        f(someMap()) // 类型不匹配 (要求 String 类型, 但实际是 CharSequence 类型)
    }
}
```

这里会出现类型不匹配, 因为在构建器 Lambda 表达式之外指定了期待的 Map 类型. 
编译器会使用固定的接受者类型 `Map<in String, String>` 来分析 Lambda 表达式内的所有的语句.
