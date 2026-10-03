[//]: # (title: 多轮(Multiple Round)处理)

KSP 支持多轮(Multiple Round)处理, 也就是通过多个轮次处理文件.
每一轮处理的输出都会用作后续轮次的额外输入.

要使用多轮处理, 请从 `SymbolProcessor.process()` 以 `List<KSAnnotated>` 形式返回延迟符号.
KSP 会在下一轮处理这些符号.

要延迟处理无效的符号, 请使用 `KSAnnotated.validate()` 过滤它们, 例如:

```kotlin
override fun process(resolver: Resolver): List<KSAnnotated> {
    val symbols = resolver.getSymbolsWithAnnotation("com.example.annotation.Builder")
    val result = symbols.filter { !it.validate() }
    symbols
        .filter { it is KSClassDeclaration && it.validate() }
        .map { it.accept(BuilderVisitor(), Unit) }
    return result
}
```

当一整轮没有生成新的文件, 那么多轮处理会结束.
如果仍有延迟符号未被处理, KSP 会为每个仍有延迟符号的处理器输出错误日志.

## 将符号延迟到下一轮 {id="deferring-symbols-to-the-next-round"}

如果处理器需要其他处理器提供额外信息, 可以将符号延迟到后续的轮次.
在得到需要的信息之前, 处理器可以跨多个轮次继续延迟这个符号.
得到信息之后, 处理器就可以处理这个符号.

只有在以下条件下才延迟符号:

* 在处理符号之前, 还需要额外的信息.

* 符号来自源代码.

    > 绝不要延迟来自 classpath 的符号. KSP 会自动过滤 classpath 符号.
    >
    {style="note"}

例如, 如果处理器为带注解的类生成构建器, 可能需要所有的构造器参数类型都解析为具体类型.
在第 1 轮中, 某个参数类型可能还无法解析.
在之后的轮次中, 随着其他文件的生成, 这个类型可能变得可以解析. 这时, 处理器就可以处理这个类了.

## 校验符号 {id="validating-symbols"}

校验是判断是否应该将符号延迟到后续轮次的一种便捷方式. 处理器应该定义清楚, 正确处理符号需要哪些信息.

> 校验通常需要类型解析, 而类型解析可能成本较高. 请只检查处理符号所必需的信息.
>
{style="tip"}

默认的校验行为不一定适合所有使用场景.
要自定义校验, 请使用 `KSValidateVisitor`, 并提供一个 `predicate` Lambda 表达式, 选择要校验的符号.

实现自定义校验时, 请使用 `KSType.isError` 判断类型是否有效.
如果 `isError` 为 `true`, 表示 KSP 无法解析该类型. 可以根据这个信息决定是否将处理延迟到后续轮次.

## 访问文件和符号 {id="accessing-files-and-symbols"}

新生成的文件和已有文件, 都可以通过 `Resolver` 访问.

KSP 提供了两个访问文件的 API:

* `Resolver.getAllFiles()`, 返回一个列表, 包含已有文件和新生成的文件.

* `Resolver.getNewFiles()`, 只返回上一轮生成的文件.

请将 `Resolver.getSymbolsWithAnnotation()` 用作获取相关符号的主要入口.

在每一轮中, `Resolver.getSymbolsWithAnnotation()` 只返回新生成文件中的符号, 以及上一轮延迟处理的符号.
这样可以避免不必要的重复处理.

## 创建处理器实例 {id="processor-instantiation"}

KSP 只创建一次处理器实例. 你可以在处理器实例中保存信息, 并在多个轮次中重复使用.

但是, 并不是所有的 KSP 符号都能跨轮次重复使用. 当处理器生成新文件时, 符号解析结果可能发生变化, 影响先前解析的符号的有效性.

> 只使用当前轮次传给处理器的 `Resolver` 实例. 不要保存 `Resolver` 并在不同轮次中重复使用.
>
{style="note"}

## 错误和异常处理 {id="error-and-exception-handling"}

### 错误 {id="errors"}

处理器可以调用 `KSPLogger.error()` 报告错误.

处理器报告错误时, KSP 会调用 `SymbolProcessor.onError()`, 而不是 `SymbolProcessor.finish()`.
当前轮次完成后, 处理过程会停止.

在当前轮次中, 其他处理器仍会正常处理. 当所有处理器完成当前轮次后, KSP 才会处理错误.

### 异常 {id="exceptions"}

KSP 会区分由 KSP 抛出的异常和由处理器抛出的异常.
两种异常都会立即终止处理, 并通过 `KSPLogger` 记录为错误.

> 如果异常由 KSP 抛出, 请将其报告给 KSP 开发者进行调查.
> 请在 [KSP 问题跟踪器](https://github.com/google/ksp/issues) 中创建 issue.
>
{style="note"}

在发生错误或异常的轮次结束时, KSP 会对所有处理器调用 `SymbolProcessor.onError()`.
`SymbolProcessor` 为 `onError()` 提供了默认的空实现.
可以覆盖这个方法, 实现自定义的错误处理逻辑.
