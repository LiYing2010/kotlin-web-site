[//]: # (title: Java 和 Kotlin 中的字符串)
[//]: # (description: 学习如何将 Java 字符串迁移到 Kotlin 字符串. 这篇向导讨论 Java StringBuilder, 字符串拼接和切分, 多行字符串, 流, 以及其它问题.)

这篇向导通过示例程序演示如何在 Java 和 Kotlin 中进行通常的字符串处理.
将会帮助你从 Java 迁移到 Kotlin, 并以 Kotlin 的方式来编写代码.

## 拼接字符串 {id="concatenate-strings"}

在 Java 中, 你可以通过以下方式实现:

```java
// Java
String name = "Joe";
System.out.println("Hello, " + name);
System.out.println("Your name is " + name.length() + " characters long");
```
{id="concatenate-strings-java"}

在 Kotlin 中, 可以在变量名称之前使用 `$` 符号, 将这个变量的值添加到你的字符串之内:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val name = "Joe"
    println("Hello, $name")
    println("Your name is ${name.length} characters long")
//sampleEnd
}
```
{kotlin-runnable="true" id="concatenate-strings-kotlin"}

你可以在字符串内添加复杂表达式的值, 方法是将表达式用括号括起, 比如 `${name.length}` .
详情请参见 [字符串模板](strings.md#string-templates).

## 构建一个字符串 {id="build-a-string"}

在 Java 中, 你可以使用 [StringBuilder](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/StringBuilder.html):

```java
// Java
StringBuilder countDown = new StringBuilder();
for (int i = 5; i > 0; i--) {
    countDown.append(i);
    countDown.append("\n");
}
System.out.println(countDown);
```
{id="build-string-java"}

在 Kotlin 中, 请使用 [buildString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/build-string.html) –
一个 [内联函数](inline-functions.md), 参数是一个 Lambda 表达式, 其中包含创建字符串的代码:

```kotlin
fun main() {
//sampleStart
       // Kotlin
       val countDown = buildString {
           for (i in 5 downTo 1) {
               append(i)
               appendLine()
           }
       }
       println(countDown)
//sampleEnd
}
```
{kotlin-runnable="true" id="build-string-kotlin"}

在 `buildString` 的内部, 它使用 Java 中相同的 `StringBuilder` 类,
在 [Lambda 表达式](lambdas.md#function-literals-with-receiver) 内, 你通过隐含的 `this` 访问它.

更多详情请参见 [Lambda 表达式的编码规约](coding-conventions.md#lambdas).

## 通过集合中的元素创建一个字符串 {id="create-a-string-from-collection-items"}

在 Java 中, 你可以使用 [Stream API](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/stream/package-summary.html)
来过滤, 变换, 并收集元素:

```java
// Java
List<Integer> numbers = List.of(1, 2, 3, 4, 5, 6);
String invertedOddNumbers = numbers
        .stream()
        .filter(it -> it % 2 != 0)
        .map(it -> -it)
        .map(Object::toString)
        .collect(Collectors.joining("; "));
System.out.println(invertedOddNumbers);
```
{id="create-string-from-collection-java"}

在 Kotlin 中, 请使用 [joinToString()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/join-to-string.html) 函数,
Kotlin 对所有的 List 都定义了这个函数:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val numbers = listOf(1, 2, 3, 4, 5, 6)
    val invertedOddNumbers = numbers
        .filter { it % 2 != 0 }
        .joinToString(separator = ";") {"${-it}"}
    println(invertedOddNumbers)
//sampleEnd
}
```
{kotlin-runnable="true"  id="create-string-from-collection-kotlin"}

> 在 Java 中, 如果想要在分隔符与后续元素之间插入空格, 你需要在分隔符中明确的加入空格.
>
{style="note"}

详情请参见 [joinToString()](collection-transformations.md#string-representation) 的使用方法.

## 当字符串为空白时设置默认值 {id="set-default-value-if-the-string-is-blank"}

在 Java 中, 你可以使用 [三元运算符(Ternary Operator)](https://en.wikipedia.org/wiki/%3F:):

```java
// Java
public void defaultValueIfStringIsBlank() {
    String nameValue = getName();
    String name = nameValue.isBlank() ? "John Doe" : nameValue;
    System.out.println(name);
}

public String getName() {
    Random rand = new Random();
    return rand.nextBoolean() ? "" : "David";
}
```
{id="set-default-value-if-blank-java"}

Kotlin 提供了内联函数 [ifBlank()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/if-blank.html),
它接受一个默认值作为参数:

```kotlin
// Kotlin
import kotlin.random.Random

//sampleStart
fun main() {
    val name = getName().ifBlank { "John Doe" }
    println(name)
}

fun getName(): String =
    if (Random.nextBoolean()) "" else "David"
//sampleEnd
```
{kotlin-runnable="true" id="set-default-value-if-blank-kotlin"}

## 替换一个字符串的最首字符和最末字符 {id="replace-characters-at-the-beginning-and-end-of-a-string"}

在 Java 中, 你可以使用
[replaceAll()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#replaceAll(java.lang.String,java.lang.String))
函数.
在这里 `replaceAll()` 函数接受正规表达式 `^##` 与 `##$`,
分别定义以 `##` 开始和以 `##` 结束的字符串:

```java
// Java
String input = "##place##holder##";
String result = input.replaceAll("^##|##$", "");
System.out.println(result);
```
{id="replace-characters-java"}

在 Kotlin 中, 请使用 [removeSurrounding()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/remove-surrounding.html)
函数, 使用 `##` 作为:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "##place##holder##"
    val result = input.removeSurrounding("##")
    println(result)
//sampleEnd
}
```
{kotlin-runnable="true" id="replace-characters-kotlin"}

## 查找与替换 {id="replace-occurrences"}

在 Java 中, 你可以使用 [Pattern](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Pattern.html)
和 [Matcher](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/util/regex/Matcher.html) 类,
比如, 要混淆某些数据:

```java
// Java
String input = "login: Pokemon5, password: 1q2w3e4r5t";
Pattern pattern = Pattern.compile("\\w*\\d+\\w*");
Matcher matcher = pattern.matcher(input);
String replacementResult = matcher.replaceAll(it -> "xxx");
System.out.println("Initial input: '" + input + "'");
System.out.println("Anonymized input: '" + replacementResult + "'");
```
{id="replace-occurrences-java"}

在 Kotlin 中, 你可以使用 [Regex](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/-regex/) 类,
它可以简化正规表达式的相关操作.
此外, 可以使用 [多行字符串(Multiline String)](strings.md#multiline-strings) 来减少反斜杠的数量,
简化正规表达式的书写:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val regex = Regex("""\w*\d+\w*""") // 多行字符串
    val input = "login: Pokemon5, password: 1q2w3e4r5t"
    val replacementResult = regex.replace(input, replacement = "xxx")
    println("Initial input: '$input'")
    println("Anonymized input: '$replacementResult'")
//sampleEnd
}
```
{kotlin-runnable="true" id="replace-occurrences-kotlin"}

## 字符串切分 {id="split-a-string"}

在 Java 中, 要使用句号字符 (`.`)切分一个字符串, 你需要使用转义 (`\\`).
因为 `String` 类的 [split()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#split(java.lang.String))
函数接受一个正规表达式作为参数:

```java
// Java
System.out.println(Arrays.toString("Sometimes.text.should.be.split".split("\\.")));
```
{id="split-string-java"}

在 Kotlin 中, 请使用 Kotlin 函数 [split()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/split.html),
它接受可变数量的分隔符作为参数:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    println("Sometimes.text.should.be.split".split("."))
//sampleEnd
}
```
{kotlin-runnable="true" id="split-string-kotlin"}

如果你需要使用正规表达式切分字符串, 请使用 `split()` 函数接受 `Regex` 作为参数的重载版本.

## 获取子字符串 {id="take-a-substring"}

在 Java 中, 你可以使用 [substring()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#substring(int)) 函数,
它接受一个起始字符下标作为参数, 从这个位置开始获取子字符串.
要获取这个字符之后的子字符串, 你需要对下标加 1:

```java
// Java
String input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42";
String answer = input.substring(input.indexOf("?") + 1);
System.out.println(answer);
```
{id="take-substring-java"}

在 Kotlin 中, 请使用 [substringAfter()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/substring-after.html) 函数,
想要获取某个字符之后的子字符串时, 不需要计算下标:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "What is the answer to the Ultimate Question of Life, the Universe, and Everything? 42"
    val answer = input.substringAfter("?")
    println(answer)
//sampleEnd
}
```
{kotlin-runnable="true" id="take-substring-kotlin"}

此外, 你还可以获取某个字符最后一次出现位置之后的子字符串:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val input = "To be, or not to be, that is the question."
    val question = input.substringAfterLast(",")
    println(question)
//sampleEnd
}
```
{kotlin-runnable="true" id="take-substring-after-last-kotlin"}

## 使用多行字符串 {id="use-multiline-strings"}

在 Java 15 之前, 有几种方法创建多行字符串. 比如, 使用 `String` 类的
[join()](https://docs.oracle.com/en/java/javase/11/docs/api/java.base/java/lang/String.html#join(java.lang.CharSequence,java.lang.CharSequence...))
函数:

```java
// Java
String lineSeparator = System.getProperty("line.separator");
String result = String.join(lineSeparator,
       "Kotlin",
       "Java");
System.out.println(result);
```
{id="join-strings-11-java"}

在 Java 15 中, 有了 [文本块(Text Block)](https://docs.oracle.com/en/java/javase/15/text-blocks/index.html) 功能.
但需要记住: 如果你打印一个多行字符串, 而且三重引号出现在下一行,
那么会存在一个额外的空行:

```java
// Java
String result = """
    Kotlin
       Java
    """;
System.out.println(result);
```
{id="join-strings-15-java"}

输出结果是:

![Java 15 的多行字符串输出](java-15-multiline-output.png){width=700}

如果你将三重引号放在最后一个词的同一行, 那么这个差别会消失.

在 Kotlin 中, 你可以对引号放在新行的字符串进行格式化, 输出中不会存在额外的空行.
每行的最左侧字符标识这一行的起始.
与 Java 的区别是, Java 会自动删除缩进字符, 而在 Kotlin 中你需要明确的删除:

```kotlin
fun main() {
//sampleStart
    // Kotlin
    val result = """
        Kotlin
           Java
    """.trimIndent()
    println(result)
//sampleEnd
}
```
{kotlin-runnable="true" id="join-strings-kotlin"}

输出结果是:

![Kotlin 的多行字符串输出](kotlin-multiline-output.png){width=700}

如果要输出额外的空行, 你需要在你的多行字符串中明确的添加这个空行.

在 Kotlin 中, 你也可以使用 [trimMargin()](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/trim-margin.html) 函数
修改缩进:

```kotlin
// Kotlin
fun main() {
    val result = """
       #  Kotlin
       #  Java
   """.trimMargin("#")
    println(result)
}
```
{kotlin-runnable="true" id="join-strings-trim-margin-kotlin"}

详情请参见 [多行字符串](coding-conventions.md#strings).

## 下一步做什么? {id="what-s-next"}

* 学习 [Kotlin 惯用法](idioms.md).
* 学习如何使用 [Java 到 Kotlin 的转换器](mixing-java-kotlin-intellij.md#converting-an-existing-java-file-to-kotlin-with-j2k),
  将既有的 Java 代码转换为 Kotlin .

如果你有喜欢的惯用法, 欢迎提交一个 pull request, 共享给大家.
