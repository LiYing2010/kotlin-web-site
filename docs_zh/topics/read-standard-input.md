[//]: # (title: 读取标准输入)

请使用 `readln()` 函数从标准输入(Standard Input)读取数据.
这个函数将整个行读取为字符串.

```kotlin
// 读取用户的输入, 并保存到一个变量中. 例如: Hi there!
val myInput = readln()

println(myInput)
// 输出结果为: Hi there!

// 读取并带音用户的输入, 不保存在变量中. 例如: Hi, Kotlin!
println(readln())
// 输出结果为: Hi, Kotlin!
```

要使用字符串之外的数据类型, 你可以使用转换函数对输入进行类型转换,
例如 `.toInt()`, `.toLong()`, `.toDouble()`, `.toFloat()`, 或 `.toBoolean()`.
可以读取多个不同数据类型的输入, 并将每个输入保存到一个变量中:

```kotlin
// 将输入从字符串转换为整数值. 例如: 12
val myNumber = readln().toInt()
println(myNumber)
// 输出结果为: 12

// 将输入从字符串转换为 Double 值. 例如: 345 
val myDouble = readln().toDouble()
println(myDouble)
// 输出结果为: 345.0

// 将输入从字符串转换为 Boolean 值. 例如: true
val myBoolean = readln().toBoolean()
println(myBoolean)
// 输出结果为: true
```

这些转换函数会假定用户输入的是目标数据类型的正确格式.
例如, 使用 `.toInt()` 将 "hello" 转换为整数, 会导致一个异常, 因为函数期待的输入字符串应该是数字.

要读取分隔符号分隔的多个输入元素, 请使用 `.split()` 函数, 并指定分隔符.
下面的代码演示如何从标准输入读取, 并按照分隔符将输入切分为一组元素的 List, 再将 List 中的各个元素转换为指定的类型:

```kotlin
// 读取输入, 假定元素以空格分隔, 并转换为整数. 例如: 1 2 3 
val numbers = readln().split(' ').map { it.toInt() }
println(numbers)
// 输出结果为: [1, 2, 3]

// 读取输入, 假定元素以逗号分隔, 并转换为 Double. 例如: 4,5,6
val doubles = readln().split(',').map { it.toDouble() }
println(doubles)
// 输出结果为: [4.0, 5.0, 6.0]
```

> 关于在 Kotlin/JVM 中读取用户输入的另一种方式, 请参见 [使用 Java Scanner 读取标准输入](standard-input.md).
>
{style="note"}

## 以安全的方式处理标准输入

你可以使用 `.toIntOrNull()` 函数, 以安全的方式将用户输入从字符串转换为整数.
如果转换成功, 这个函数返回一个整数. 但是, 如果输入不是一个有效的整数, 它会返回 `null`:

```kotlin
// 如果输入无效, 返回 null. 例如: Hello!
val wrongInt = readln().toIntOrNull()
println(wrongInt)
// 输出结果为: null

// 将有效的输入从字符串转换为整数. 例如: 13
val correctInt = readln().toIntOrNull()
println(correctInt)
// 输出结果为: 13
```

`readlnOrNull()` 函数也有助于安全的处理用户输入.
`readlnOrNull()` 函数会读取标准输入, 如果遇到输入结束, 这个函数会返回 null, 而 `readln()` 对这样的情况会抛出异常.
