[//]: # (title: 教程 - 映射 C 语言的函数指针(Function Pointer))

<tldr>
    <p>这是 <strong>Kotlin 与 C 映射</strong> 教程系列的第 3 部分. 在继续阅读之前, 请确认你完成了之前的教程.</p>
    <p><img src="icon-1-done.svg" width="20" alt="First step"/> <a href="mapping-primitive-data-types-from-c.md">映射 C 语言的基本数据类型</a><br/>
        <img src="icon-2-done.svg" width="20" alt="Second step"/> <a href="mapping-struct-union-types-from-c.md">映射 C 语言的结构(Struct)和联合(Union)类型</a><br/>
        <img src="icon-3.svg" width="20" alt="Third step"/> <strong>映射 C 语言的函数指针(Function Pointer)</strong><br/>
        <img src="icon-4-todo.svg" width="20" alt="Fourth step"/> <a href="mapping-strings-from-c.md">映射 C 语言的字符串</a><br/>
    </p>
</tldr>

> C 库导入是 [实验性功能](components-stability.md#stability-levels-explained).
> cinterop 工具从 C 库生成的所有 Kotlin 声明都应该标注 `@ExperimentalForeignApi` 注解.
>
> Kotlin/Native 自带的原生平台库 (例如 Foundation, UIKit, 和 POSIX),
> 只对一部分 API 需要使用者明确同意(Opt-in).
>
{style="warning"}

我们来看看在 Kotlin/Native 中可以访问 C 的哪些函数指针,
并研究 Kotlin/Native 和 [跨平台](gradle-configure-project.md#targeting-multiple-platforms) Gradle 构建的与 C 互操作相关的高级使用场景.

在本教程中, 你将:

- [学习如何将 Kotlin 函数作为一个 C 函数指针传递](#pass-kotlin-function-as-a-c-function-pointer)
- [在 Kotlin 中使用 C 函数指针](#use-the-c-function-pointer-from-kotlin)

## 映射来自 C 的函数指针类型 {id="mapping-function-pointer-types-from-c"}

为了理解 Kotlin 和 C 之间的映射, 我们来声明 2 个函数:
第一个函数接受一个函数指针作为参数, 另一个函数返回一个函数指针.

在 [这个教程系列的第 1 部分](mapping-primitive-data-types-from-c.md) 中, 你已经创建了一个 C 库, 以及必要的文件.
在这个教程中, 更新 `interop.def` 文件中 `---` 分割行之后的声明:

```c
---

int myFun(int i) {
    return i+1;
}

typedef int (*MyFun)(int);

void accept_fun(MyFun f) {
    f(42);
}

MyFun supply_fun() {
    return myFun;
}
```

这个 `interop.def` 文件提供了所有需要的内容, 可以用来编译, 运行, 或在 IDE 中打开应用程序.

## 查看为 C 库生成的 Kotlin API {id="inspect-generated-kotlin-apis-for-a-c-library"}

我们来看看 C 的函数指针如何映射到 Kotlin/Native 中, 并更新你的项目:

1. 在 `src/nativeMain/kotlin` 中, 将你在 [上一篇教程](mapping-struct-union-types-from-c.md) 中创建的 `hello.kt` 文件,
   更新为以下内容:

   ```kotlin
   import interop.*
   import kotlinx.cinterop.ExperimentalForeignApi

   @OptIn(ExperimentalForeignApi::class)
   fun main() {
       println("Hello Kotlin/Native!")

       accept_fun(/* fix me*/)
       val useMe = supply_fun()
   }
   ```

2. 通过 IntelliJ IDEA 的 [Go to declaration](https://www.jetbrains.com/help/rider/Navigation_and_Search__Go_to_Declaration.html)
   命令 (<shortcut>Cmd + B</shortcut>/<shortcut>Ctrl + B</shortcut>) 可以跳转到为 C 函数生成的 API:

   ```kotlin
   fun myFun(i: kotlin.Int): kotlin.Int
   fun accept_fun(f: kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */)
   fun supply_fun(): kotlinx.cinterop.CPointer<kotlinx.cinterop.CFunction<(kotlin.Int) -> kotlin.Int>>? /* from: interop.MyFun? */
   ```

你可以看到, C 函数指针在 Kotlin 中使用 `CPointer<CFunction<...>>` 来表达.
`accept_fun()` 函数接受一个可选的函数指针作为参数, `supply_fun()` 函数则返回一个函数指针.

`CFunction<(Int) -> Int>` 表示函数签名, `CPointer<CFunction<...>>?` 表示一个可为 null 的函数指针.
对所有的 `CPointer<CFunction<...>>` 类型, 有一个 `invoke` 操作符扩展函数,
因此你可以象通常的 Kotlin 函数一样调用任何函数指针.

## 将 Kotlin 函数作为 C 函数指针传递 {id="pass-kotlin-function-as-a-c-function-pointer"}

下面来试验在 Kotlin 代码中使用 C 函数.
调用 `accept_fun()` 函数, 并传递一个指向 Kotlin Lambda 表达式的 C 函数指针:

```kotlin
import interop.*
import kotlinx.cinterop.staticCFunction
import kotlinx.cinterop.ExperimentalForeignApi

@OptIn(ExperimentalForeignApi::class)
fun myFun() {
    accept_fun(staticCFunction<Int, Int> { it + 1 })
}
```

这个调用使用 Kotlin/Native 的 `staticCFunction {}` 帮助函数, 将一个 Kotlin Lambda 表达式函数封装为一个 C 函数指针.
它只允许使用无绑定(unbound), 并且无捕获(non-capturing)的 Lambda 表达式函数.
比如, 函数不能捕获局部变量, 只能使用全局可见的声明.

要保证函数不抛出任何异常.
从 `staticCFunction {}` 之内抛出异常将会导致不确定的副作用.

## 在 Kotlin 中使用 C 函数指针 {id="use-the-c-function-pointer-from-kotlin"}

下一步是调用从 `supply_fun()` 返回得到的 C 函数指针:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.invoke

@OptIn(ExperimentalForeignApi::class)
fun myFun2() {
    val functionFromC = supply_fun() ?: error("No function is returned")

    functionFromC(42)
}
```

Kotlin 将函数指针返回类型转换为一个可为 null 的 `CPointer<CFunction<>` 对象.
在调用函数指针之前, 你首先需要明确检查是否为 `null`, 所以在上面的示例代码中使用了 [Elvis 操作符](null-safety.md) 进行这种检查.
cinterop 工具允许你象通常的 Kotlin 函数那样调用一个 C 函数指针: `functionFromC(42)`.

## 更新 Kotlin 代码 {id="update-kotlin-code"}

你已经看到了所有的定义, 请在你的项目中试试吧.
`hello.kt` 文件中的最终代码大致如下:

```kotlin
import interop.*
import kotlinx.cinterop.ExperimentalForeignApi
import kotlinx.cinterop.invoke
import kotlinx.cinterop.staticCFunction

@OptIn(ExperimentalForeignApi::class)
fun main() {
    println("Hello Kotlin/Native!")

    val cFunctionPointer = staticCFunction<Int, Int> { it + 1 }
    accept_fun(cFunctionPointer)

    val funFromC = supply_fun() ?: error("No function is returned")
    funFromC(42)
}
```

为了验证是否一切正确, 请 [在你的 IDE 中](native-get-started.md#build-and-run-the-application) 运行 `runDebugExecutableNative` Gradle task,
或使用以下命令, 运行代码:

```bash
./gradlew runDebugExecutableNative
```

## 下一步 {id="next-step"}

在这个教程系列的下一部分, 你将学习在 Kotlin 和 C 之间如何映射字符串:

**[继续下一部分](mapping-strings-from-c.md)**

### 参见 {id="see-also"}

更多详情请参见 [与 C 代码交互](native-c-interop.md) 文档, 其中包含更多高级场景.
