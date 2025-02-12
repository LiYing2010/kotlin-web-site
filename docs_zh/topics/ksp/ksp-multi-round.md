[//]: # (title: 多轮(Multiple Round)处理)

KSP 支持 _多轮(Multiple Round)处理_, 也就是通过多次步骤处理文件.
因此前一轮处理的输出可以供后一轮处理作为额外的输入.

## 对你的处理器的变更 {id="changes-to-your-processor"}

为了使用多轮处理, `SymbolProcessor.process()` 函数需要对无效的符号返回延迟(deferred)符号列表 (`List<KSAnnotated>`).
请使用 `KSAnnotated.validate()` 来过滤无效的符号, 让它们延迟到下一轮.

以下示例代码演示如何使用有效性检查, 来延迟无效的符号:

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

## 多轮处理的行为 {id="multiple-round-behavior"}

### 将符号延迟到下一轮处理 {id="deferring-symbols-to-the-next-round"}

处理器可以将特定符号的处理延迟到下一轮. 如果符号被延迟, 代表处理器在等待其他的处理器来提供更多的信息.
它可以根据需要继续延迟这个符号.
一旦另一个处理器提供了需要的信息, 处理器就可以处理被延迟的符号了.
处理器应该只延迟那些缺乏必要信息的无效符号.
因此, 处理器 **不应该** 延迟来自 classpath 的符号, KSP 也会过滤掉来自源代码以外的任何被延迟的符号.

比如, 一个处理器创建一个构建器 为一个被注解的类, 可能需要它的构造函数的所有参数类型都是有效的 (也就是说解析到一个具体的类型).
在第 1 轮中, 其中 1 个类型无法解析.
然后在第 2 轮中, 由于有了第 1 轮生成的文件, 这个类型可以解析了.

### 校验符号 {id="validating-symbols"}

决定符号是否应该延迟的一个便利方法是进行校验. 一个处理器应该知道为了正确的处理符号需要哪些信息.
注意, 校验通常需要类型解析, 类型解析的代价可能很高, 因此我们推荐只检查必须的信息.
继续上面的例子, 对于构建器处理器来说, 一个理想的校验只检查被注解的符号的构造函数的所有已解析的参数类型是否包含 `isError == false`.

KSP 提供一个默认校验工具. 详情请参见 [高级内容](#advanced) 小节.

### 终止条件 {id="termination-condition"}

当一整轮处理不再生成新的文件, 此时多轮处理会终止.
当终止条件达到时, 如果还存在未处理的延迟符号, KSP 会对每个带有未处理的延迟符号的处理器, 向 log 输出一个错误信息.

### 在每一轮中可以访问的文件 {id="files-accessible-at-each-round"}

新生成的文件和已经存在的文件都可以通过一个 `Resolver` 访问.
KSP 提供 2 个 API来访问文件: `Resolver.getAllFiles()` 和 `Resolver.getNewFiles()`.
`getAllFiles()` 返回一个组合的 List, 包含已经存在的文件和新生成的文件,
而 `getNewFiles()` 只返回新生成的文件.

### 改为使用 getSymbolsAnnotatedWith() {id="changes-to-getsymbolsannotatedwith"}

为了避免对符号不必要的重新处理, `getSymbolsAnnotatedWith()` 只返回在新生成的文件中发现的符号,
以及在最后一轮处理中被延迟的符号.

### 创建处理器实例 {id="processor-instantiating"}

一个处理器实例只创建一次, 因此你可以在处理器对象中保存信息, 供下一轮使用.

### 不同轮之间的信息一致性 {id="information-consistent-cross-rounds"}

所有的 KSP 符号都不能在不同轮之间重复使用, 因为前一轮生成的结果有可能导致解析结果发生改变.
但是, 由于 KSP 不允许修改已经存在的代码, 有些信息应该还是可以重复使用的, 比如一个符号的名称字符串值.
总结, 处理器可以保存前一轮的信息, 但需要记住, 在后续的轮中这些信息可能会无效.

### 错误和异常处理 {id="error-and-exception-handling"}

如果发生了错误 (由处理器调用 `KSPLogger.error()` 来定义) 或异常, 处理在当前轮完毕之后会停止.
所有的处理器 会调用 `onError()` 方法, 而且 **不会** 调用 `finish()` 方法.

注意, 即使发生了错误, 其他处理器还会对这一轮继续正常的处理.
因此错误处理会发生在处理对这一轮完毕之后.

对于异常, KSP 会尝试区分来自 KSP 的异常和来自处理器的异常.
异常会导致处理立即终止, 并且会在 KSPLogger 中作为错误输出到 log.
来自 KSP 的异常应该报告给 KSP 开发者, 进行进一步调查.
在发生异常或错误的轮结束后, 所有的处理器将会调用 `onError()` 函数, 执行它们自己的错误处理.

在 `SymbolProcessor` 接口中, KSP 为 `onError()` 提供一个默认的无操作(no-op) 实现.
你可以覆盖这个方法, 提供你自己的错误处理逻辑.

## 高级内容 {id="advanced"}

### 校验的默认行为 {id="default-behavior-for-validation"}

KSP 提供的默认校验逻辑, 会对被校验的符号所属的封闭范围(Enclosing Scope)之内的所有直接可到达(directly reachable)符号进行验证.
默认校验会检查 封闭范围中的引用是否是否可解析到一个具体的类型, 但不会递归深入被引用的类型, 对其进行校验.

### 编写你自己的校验逻辑 {id="write-your-own-validation-logic"}

默认的校验行为可能不适用于情况. 你可以参考 `KSValidateVisitor` 编写你自己的校验逻辑,
方法是提供自定义的 `predicate` Lambda 表达式, 它会被 `KSValidateVisitor` 用来过滤需要被检查的符号.
