---
type: doc
layout: reference
category: "Tools"
title: "关键字与操作符"
---

# 关键字(Keyword)与操作符(Operator)

最终更新: {{ site.data.releases.latestDocDate }}

## 硬关键字(Hard Keyword)

以下符号始终会被解释为关键字, 不能用作标识符(identifiers):

 * `as`
      - 用于 [类型转换](typecasts.html#unsafe-cast-operator).
      - [为 import 指定一个别名](packages.html#imports).
 * `as?` 用于 [安全的类型转换](typecasts.html#safe-nullable-cast-operator).
 * `break` [结束一个循环](returns.html).
 * `class` 声明一个 [类](classes.html).
 * `continue` [跳转到最内层循环的下一次执行](returns.html).
 * `do` 开始一个 [do/while 循环](control-flow.html#while-loops) (条件判定在后的循环).
 * `else` 定义 [if 表达式](control-flow.html#if-expression) 的一个分支, 这个分支在条件为 false 时执行.
 * `false` 指定 [布尔类型](booleans.html) 的 'false' 值.
 * `for` 开始一个 [for 循环](control-flow.html#for-loops).
 * `fun` 声明一个 [函数](functions.html).
 * `if` 开始一个 [if 表达式](control-flow.html#if-expression).
 * `in`
     - 指定 [for 循环](control-flow.html#for-loops) 的迭代对象.
     - 用作中缀操作符, 判断一个值是否在 [一个值范围](ranges.html) 之内,
       或者是否属于一个集合, 或者是否属于其他
       [定义了 'contains' 方法](operator-overloading.html#in-operator)
       的实体.
     - 在 [when 表达式](control-flow.html#when-expression) 中做同样的判断.
     - 将一个类型参数标记为 [反向类型变异](generics.html#declaration-site-variance).
 * `!in`
     - 用作操作符, 判断一个值是否 **不属于** [一个值范围](ranges.html),
       或者是否 **不属于** 一个集合, 或者是否 **不属于** 其他
       [定义了 'contains' 方法](operator-overloading.html#in-operator)
       的实体.
     - 在 [when 表达式](control-flow.html#when-expression) 中做同样的判断.
 * `interface` 声明一个 [接口](interfaces.html).
 * `is`
     - 判断 [一个值是不是某个类型](typecasts.html#is-and-is-operators).
     - 在 [when 表达式](control-flow.html#when-expression) 中做同样的判断.
 * `!is`
     - 判断 [一个值是否**不是**某个类型](typecasts.html#is-and-is-operators).
     - 在 [when 表达式](control-flow.html#when-expression) 中做同样的判断.
 * `null` 是一个常数, 表示一个不指向任何对象的引用.
 * `object` [同时声明一个类和它的对象实例](object-declarations.html).
 * `package` 指定 [当前源代码文件的包](packages.html).
 * `return` [从最内层的函数或匿名函数中返回](returns.html).  
 * `super`
     - [引用一个方法或属性在超类中的实现](inheritance.html#calling-the-superclass-implementation).
     - [在次级构造器中调用超类构造器](classes.html#inheritance).
 * `this`
     - 引用 [当前接受者](this-expressions.html).
     - [在次级构造器中调用同一个类的另一个构造器](classes.html#constructors).
 * `throw` [抛出一个异常](exceptions.html).
 * `true` 指定 [布尔类型](booleans.html) 的 'true' 值.
 * `try` [开始一个异常处理代码段](exceptions.html).
 * `typealias` 声明一个 [类型别名](type-aliases.html).
 * `typeof` 保留, 将来使用.
 * `val` 声明一个只读的 [属性](properties.html), 或者一个只读的 [局部变量](basic-syntax.html#defining-variables).
 * `var` 声明一个可变的 [属性](properties.html), 或者一个可变的 [局部变量](basic-syntax.html#defining-variables).
 * `when` 开始一个 [when 表达式](control-flow.html#when-expression) (执行其中一个分支).
 * `while` 开始一个 [while 循环](control-flow.html#while-loops) (条件判定在前的循环).

## 软关键字(Soft Keyword)

以下符号在适当的场合下可以是关键字,
在其他场合可以用作标识符:

 * `by`
     - [将一个接口的实现委托给另一个对象](delegation.html).
     - [将一个属性的访问器函数实现委托给另一个对象](delegated-properties.html).
 * `catch` 开始一个 [处理特定的异常类型](exceptions.html) 的代码段.
 * `constructor` 声明一个 [主构造器, 或次级构造器](classes.html#constructors).
 * `delegate` 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `dynamic` 在 Kotlin/JS 代码中引用一个 [动态类型](dynamic-type.html).
 * `field` 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `file` 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `finally` 开始一个 [try 代码段结束时始终会被执行](exceptions.html) 的代码段.
 * `get`
     - 声明 [属性的取值方法](properties.html#getters-and-setters).
     - 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `import` [从另一个包中将一个声明导入到当前源代码文件](packages.html).
 * `init` 开始一个 [初始化代码段](classes.html#constructors).
 * `param` 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `property` 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `receiver` 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `set`
     - 声明 [属性的设值方法](properties.html#getters-and-setters).
     - 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `setparam` 用作一种 [注解的使用目标(target)](annotations.html#annotation-use-site-targets).
 * `value` 与 `class` 关键字一起使用, 声明一个 [内联类(inline class)](inline-classes.html).
 * `where` 指定 [泛型类型参数的约束](generics.html#upper-bounds).

## 标识符关键字(Modifier Keyword)

以下符号在声明的标识符列表中用做关键字,
在其他场合可以用作标识符:

 * `abstract` 将一个类或一个成员标注为 [抽象元素](classes.html#abstract-classes).
 * `actual` 在 [跨平台项目](multiplatform/multiplatform.html) 中, 表示某个特定平台上的具体实现.
 * `annotation` 声明一个 [注解类](annotations.html).
 * `companion` 声明一个 [同伴对象](object-declarations.html#companion-objects).
 * `const` 将一个属性标注为 [编译期常数值](properties.html#compile-time-constants).
 * `crossinline` 禁止 [传递给内联函数的 lambda 表达式中的非局部的返回](inline-functions.html#non-local-returns).
 * `data` 指示编译器, [为类生成常用的成员函数](data-classes.html).
 * `enum` 声明一个 [枚举类](enum-classes.html).
 * `expect` 标注一个 [与平台相关的声明](multiplatform.html), 在各个平台模块中, 需要存在对应的具体实现.
 * `external` 标注一个声明在 Kotlin 代码之外 (可以通过 [JNI](java-interop.html#using-jni-with-kotlin) 实现,
    或者用 [JavaScript](js-interop.html#external-modifier) 实现).
 * `final` 禁止 [覆盖成员](inheritance.html#overriding-methods).
 * `infix` 允许使用 [中缀标记法](functions.html#infix-notation) 来调用函数.
 * `inline` 告诉编译器 [将函数以及传递给函数的 lambda 表达式内联到函数的调用处](inline-functions.html).
 * `inner` 允许在 [嵌套内](nested-classes.html) 中引用外部类的实例.
 * `internal` 将一个声明标注为 [只在当前模块中可以访问](visibility-modifiers.html).
 * `lateinit` 允许 [在构造器之外初始化非 null 的属性](properties.html#late-initialized-properties-and-variables).
 * `noinline` 关闭 [对传递给内联函数的 lambda 表达式的内联](inline-functions.html#noinline).
 * `open` 允许 [继承类, 或者覆盖成员](classes.html#inheritance).
 * `operator` 将函数标记为 [操作符重载, 或实现一个规约](operator-overloading.html).
 * `out` 将类型参数标记为 [协变的](generics.html#declaration-site-variance).
 * `override` 将成员标记为 [对超类成员的覆盖](inheritance.html#overriding-methods).
 * `private` 将声明标记为 [只在当前类中, 或当前源代码文件中可以访问](visibility-modifiers.html).
 * `protected` 将声明标记为 [只在当前类, 以及它的子类中可以访问](visibility-modifiers.html).
 * `public` 将声明标记为 [在任何位置都可以访问](visibility-modifiers.html).
 * `reified` 将内联函数的类型参数标记为 [在运行时刻可以访问](inline-functions.html#reified-type-parameters).
 * `sealed` 声明一个 [封闭类](sealed-classes.html) (子类受到限制的类).
 * `suspend` 将函数, 或 lambda 表达式, 标注为挂起函数, 或挂起lambda 表达式
    (可在 [协程](coroutines-overview.html) 中使用).
 * `tailrec` 将一个函数标注为 [尾递归](functions.html#tail-recursive-functions)
    (允许编译器用迭代来代替递归).
 * `vararg` 允许 [对某个参数传递可变数量的参数值](functions.html#variable-number-of-arguments-varargs).

## 特殊标识符

以下表述符在特定情况下由编译器定义,
在其他场合可以用作通常的标识符:

 * `field` 在属性访问函数的内部,
    用来引用 [属性的后端域变量](properties.html#backing-fields).
 * `it` 在 lambda 表达式内部,
    用来 [引用 lambda 表达式的隐含参数](lambdas.html#it-implicit-name-of-a-single-parameter).

## 操作符与特殊符号

Kotlin 支持以下操作符与特殊符号:

 * `+`, `-`, `*`, `/`, `%` - 算数运算符
     - `*` 也被用来 [向一个不定数量参数传递数组](functions.html#variable-number-of-arguments-varargs).
 * `=`
     - 赋值操作符.
     - 用来指定 [参数的默认值](functions.html#default-arguments).
 * `+=`, `-=`, `*=`, `/=`, `%=` - [计算并赋值](operator-overloading.html#augmented-assignments).
 * `++`, `--` - [递增与递减操作符](operator-overloading.html#increments-and-decrements).
 * `&&`, `||`, `!` - '与', '或', '非' 逻辑运算符 (用于位运算, 使用对应的 [中缀函数](numbers.html#operations-on-numbers)).
 * `==`, `!=` - [相等和不等比较操作符](operator-overloading.html#equality-and-inequality-operators)
    (对非基本类型, 会翻译为对 `equals()` 函数的调用).
 * `===`, `!==` - [引用相等比较操作符](equality.html#referential-equality).
 * `<`, `>`, `<=`, `>=` - [比较操作符](operator-overloading.html#comparison-operators)
    (对非基本类型, 会翻译为对 `compareTo()` 函数的调用).
 * `[`, `]` - [下标访问操作符](operator-overloading.html#indexed-access-operator)
    (会翻译为对 `get` 和 `set` 函数的调用).
 * `!!` [断言一个表达式的值不为 null](null-safety.html#the-operator).
 * `?.` 执行一个 [安全调用](null-safety.html#safe-calls) (如果接受者不为 null, 则调用一个方法, 或调用一个属性的访问函数).
 * `?:` 如果这个运算符左侧的表达式值为 null, 则返回右侧的表达式值(也就是 [elvis 操作符](null-safety.html#elvis-operator)).
 * `::` 创建一个 [成员的引用](reflection.html#function-references), 或者一个 [类引用](reflection.html#class-references).
 * `..`, `..<` 创建 [值范围](ranges.html).
 * `:` 在声明中, 用作名称与类型之间的分隔符.
 * `?` 将一个类型标记为 [可为 null](null-safety.html#nullable-types-and-non-nullable-types).
 * `->`
     - 在 [lambda 表达式](lambdas.html#lambda-expression-syntax) 中, 用作参数与函数体之间的分隔符.
     - 在 [函数类型](lambdas.html#function-types) 中, 用作参数与返回类型之间的分隔符.
     - 在 [when 表达式](control-flow.html#when-expression) 的分支中, 用作分支条件与分支体之间的分隔符.
 * `@`
    - 引入一个 [注解](annotations.html#usage).
    - 定义, 或者引用一个 [循环标签](returns.html#break-and-continue-labels).
    - 定义, 或者引用一个 [lambda 表达式标签](returns.html#return-to-labels).
    - 引用一个 [外层范围的 'this' 表达式](this-expressions.html#qualified-this).
    - 引用一个 [外部类的超类](inheritance.html#calling-the-superclass-implementation).
 * `;` 用于在同一行中分隔多条语句.
 * `$` 在 [字符串模板](strings.html#string-templates) 中引用变量或表达式.
 * `_`
     - 在 [lambda 表达式](lambdas.html#underscore-for-unused-variables) 中代替未使用的参数.
     - 在 [解构声明](destructuring-declarations.html#underscore-for-unused-variables) 中代替未使用的参数.

关于操作符优先顺序, 请参见 Kotlin 语法中的 [这一章节](https://kotlinlang.org/docs/reference/grammar.html#expressions) .
