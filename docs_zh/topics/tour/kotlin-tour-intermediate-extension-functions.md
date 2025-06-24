[//]: # (title: 中级教程: 扩展函数)

<tldr>
    <p><img src="icon-1.svg" width="20" alt="First step" /> <strong>扩展函数</strong><br />
        <img src="icon-2-todo.svg" width="20" alt="Second step" /> <a href="kotlin-tour-intermediate-scope-functions.md">作用域函数</a><br />
        <img src="icon-3-todo.svg" width="20" alt="Third step" /> <a href="kotlin-tour-intermediate-lambdas-receiver.md">带接受者的 Lambda 表达式</a><br />
        <img src="icon-4-todo.svg" width="20" alt="Fourth step" /> <a href="kotlin-tour-intermediate-classes-interfaces.md">类与接口</a><br />
        <img src="icon-5-todo.svg" width="20" alt="Fifth step" /> <a href="kotlin-tour-intermediate-objects.md">对象</a><br />
        <img src="icon-6-todo.svg" width="20" alt="Sixth step" /> <a href="kotlin-tour-intermediate-open-special-classes.md">开放类与特殊类</a><br />
        <img src="icon-7-todo.svg" width="20" alt="Seventh step" /> <a href="kotlin-tour-intermediate-properties.md">属性</a><br />
        <img src="icon-8-todo.svg" width="20" alt="Eighth step" /> <a href="kotlin-tour-intermediate-null-safety.md">Null 值安全性</a><br />
        <img src="icon-9-todo.svg" width="20" alt="Ninth step" /> <a href="kotlin-tour-intermediate-libraries-and-apis.md">库与 API</a></p>
</tldr>

在这一章中, 你将探索一些特殊的 Kotlin 函数, 它们能够让你的代码更加简洁, 更加易读.
学习这些函数能够如何帮助你使用高效的设计模式, 将你的项目提升到更高水平.

## 扩展函数 {id="extension-functions"}

在软件开发中, 你经常需要修改一个程序的行为, 但又不能修改原来的源代码.
例如, 在你的项目中, 你可能想要向一个来自第三方库的类添加额外的功能.

扩展函数让你能够向一个类扩展额外的功能. 你可以通过调用一个类的成员函数同样的方式来调用扩展函数.

在介绍扩展函数的语法之前, 你需要理解术语 **接受者类型(Receiver Type)** 和 **接受者对象(Receiver Object)**.

接受者对象(Receiver Object)是指函数对哪个对象调用. 换句话说, 接受者就是共享信息的来源.

![发送者和接受者的示例](receiver-highlight.png){width="500"}

在这个示例中, `main()` 函数调用 [`.first()`](https://kotlinlang.org/api/core/kotlin-stdlib/kotlin.collections/first.html) 函数.
`.first()` 函数 **对** `readOnlyShapes` 变量调用, 因此 `readOnlyShapes` 变量就是接受者.

接受者对象有 **类型**, 因此编译器能够知道函数在什么时候能够使用.

这个示例使用标准库的 `.first()` 函数来返回列表中的第一个元素.
要创建你自己的扩展函数, 请写下你想要扩展的类名称, 之后是一个 `.` 号, 之后是你的函数名称.
后面是函数声明的其余部分, 包括它的参数和返回类型.

例如:

```kotlin
fun String.bold(): String = "<b>$this</b>"

fun main() {
    // "hello" 是接受者对象
    println("hello".bold())
    // 输出结果为: <b>hello</b>
}
```
{kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-function"}

在这个示例中:

* `String` 是被扩展的类, 也叫做接受者类型.
* `bold` 是扩展函数的名称.
* `.bold()` 扩展函数的返回类型是 `String`.
* `"hello"`, 一个 `String` 实例, 是接受者对象.
* 在函数的 body 部, 访问接受者对象时使用了 [关键字](keyword-reference.md): `this`.
* 使用了字符串模板 (`$`) 来访问 `this` 的值.
* `.bold()` 扩展函数接受一个字符串, 并将它包含在 `<b>` HTML 元素内返回, 用于显示粗体文字.

## 面向扩展的设计 {id="extension-oriented-design"}

你可以在任何地方定义扩展函数, 因此可以创建面向扩展的设计.
这样的设计将核心功能与便利但并非必须的功能分离开, 让你的代码易于阅读和维护.

一个很好的例子是 Ktor 库的 [`HttpClient`](https://api.ktor.io/ktor-client/ktor-client-core/io.ktor.client/-http-client/index.html) 类, 它帮助你执行网络请求.
它的核心功能是单个函数 `request()`, 它的参数是一个 HTTP 请求需要的所有信息 :

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        // 网络代码
    }
}
```
{validate="false"}

在实际运用中, 最常用的 HTTP 请求是 GET 或 POST 请求. 库为这些常见的使用场景提供更短的名称是很合理的.
但是, 不需要编写新的网络代码, 只需要特定的请求调用.
换句话说, 这些请求很适用定义为单独的 `.get()` 和 `.post()` 扩展函数:

```kotlin
fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())
fun HttpClient.post(url: String): HttpResponse = request("POST", url, emptyMap())
```
{validate="false"}

这些 `.get()` 和 `.post()` 函数使用正确的 HTTP 方法调用 `request()` 函数, 因此你就不必自己调用了.
这些函数简化了你的代码, 让代码更加易于理解:

```kotlin
class HttpClient {
    fun request(method: String, url: String, headers: Map<String, String>): HttpResponse {
        println("Requesting $method to $url with headers: $headers")
        return HttpResponse("Response from $url")
    }
}

fun HttpClient.get(url: String): HttpResponse = request("GET", url, emptyMap())

fun main() {
    val client = HttpClient()

    // 直接使用 request(), 发起 GET 请求
    val getResponseWithMember = client.request("GET", "https://example.com", emptyMap())

    // 使用 get() 扩展函数, 发起 GET 请求
    val getResponseWithExtension = client.get("https://example.com")
}
```
{validate="false"}

在 Kotlin 的 [标准库](https://kotlinlang.org/api/latest/jvm/stdlib/) 和其他库中, 大量使用了这种面向扩展的方案.
例如, `String` 类有很多 [扩展函数](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-string/#extension-functions) 帮助你处理字符串.

关于扩展函数, 详情请参见 [扩展](extensions.md).

## 实际练习 {id="practice"}

### 习题 1 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-1"}

编写一个扩展函数, 名为 `isPositive`, 接受一个整数参数, 判断它是不是正数.

|---|---|
```kotlin
fun Int.// 请在这里编写你的代码

fun main() {
    println(1.isPositive())
    // 输出结果为: true
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-1"}

|---|---|
```kotlin
fun Int.isPositive(): Boolean = this > 0

fun main() {
    println(1.isPositive())
    // 输出结果为: true
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-extension-functions-solution-1"}

### 习题 2 {initial-collapse-state="collapsed" collapsible="true" id="extension-functions-exercise-2"}

编写一个扩展函数, 名为 `toLowercaseString`, 接受一个字符串参数, 返回它的小写形式.

<deflist collapsible="true">
    <def title="提示">
        使用 <code>String</code> 类型的 <a href="https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.text/lowercase.html"> <code>.lowercase()</code>
        </a> 函数.
    </def>
</deflist>

|---|---|
```kotlin
fun // 请在这里编写你的代码

fun main() {
    println("Hello World!".toLowercaseString())
    // 输出结果为: hello world!
}
```
{validate="false" kotlin-runnable="true" kotlin-min-compiler-version="1.3" id="kotlin-tour-extension-functions-exercise-2"}

|---|---|
```kotlin
fun String.toLowercaseString(): String = this.lowercase()

fun main() {
    println("Hello World!".toLowercaseString())
    // 输出结果为: hello world!
}
```
{initial-collapse-state="collapsed" collapsible="true" collapsed-title="参考答案" id="kotlin-tour-extension-functions-solution-2"}

## 下一步 {id="next-step"}

[中级教程: 作用域函数](kotlin-tour-intermediate-scope-functions.md)
