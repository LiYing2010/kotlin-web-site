---
type: doc
layout: reference
category:
title: "Kotlin 小技巧"
---

# Kotlin 小技巧

最终更新: {{ site.data.releases.latestDocDate }}

Kotlin 小技巧是一系列的短视频, Kotlin 开发组成员向你演示, 使用 Kotlin 编写代码时更加高效, 更加符合惯用法, 更加有趣的方式.

不要错过新的 Kotlin 小技巧视频, [订阅我们的 YouTube 频道](https://www.youtube.com/channel/UCP7uiEZIqci43m22KDl0sNw).

## Kotlin 中的 null + null

在 Kotlin 中执行 `null + null` 会发生什么情况, 返回结果是什么?
在我们最新的一个 Kotlin 小技巧视频中, Sebastian 将解开这个谜题. 此外, 他还会演示为什么我们不用害怕可为 null 的值: 

<iframe width="560" height="315" src="https://www.youtube.com/embed/wwplVknTza4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 去除集合中的重复元素

得到了一个包含重复元素的 Kotlin 集合吗? 需要只包含唯一元素的集合? 请看这个 Kotlin 小技巧视频, Sebastian 向你演示如何从你的 List 中删除重复元素, 或者转换为 Set: 

<iframe width="560" height="315" src="https://www.youtube.com/embed/ECOf0PeSANw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 挂起(Suspend)与内联(Inline) 之谜

为什么
[`repeat()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/repeat.html),
[`map()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/map.html)
和 [`filter()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.collections/filter.html)
之类的函数在它们的 Lambda 表达式参数中接受挂起函数,
尽管它们的方法签名并没有标记为与协程相关的?
在这一期的 Kotlin 小技巧视频中, Sebastian 会解开这个谜题: 与 inline 修饰符有关:

<iframe width="560" height="315" src="https://www.youtube.com/embed/R2395u7SdcI" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 使用完整限定名称(fully qualified name)解决声明的遮盖(Shadowing)问题

遮盖(Shadowing)是指在同一个作用域内出现 2 个相同名称的声明. 这时, 会使用哪一个?
在这一期的 Kotlin 小技巧视频中, Sebastian 向你演示一个简单的 Kotlin 技巧, 使用完整限定名称(fully qualified name), 来正确调用你需要的那个函数:

<iframe width="560" height="315" src="https://www.youtube.com/embed/mJRzF9WtCpU" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 在 Elvis 操作符中返回或抛出异常

[Elvis 操作符](null-safety.html#elvis-operator) 再次进入我们的视野!
Sebastian 向你解释为什么这个操作符使用那位著名歌手的名字来命名, 以及在 Kotlin 中如何使用 `?:` 进行返回, 或抛出异常.
幕后的神奇实现是什么呢? 请参见 [Nothing 类型](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin/-nothing.html).

<iframe width="560" height="315" src="https://www.youtube.com/embed/L8aFK7QrbA8" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 解构声明(Destructuring Declaration)

使用 Kotlin 中的 [解构声明(Destructuring Declaration)](destructuring-declarations.html), 你可以从单个对象一次性创建多个变量.
在这个视频中, Sebastian 向你演示各种可以解构的对象 – Pair, List, Maps, 等等. 你自己的对象又如何呢? Kotlin 的组件函数对此也提供了答案:

<iframe width="560" height="315" src="https://www.youtube.com/embed/zu1PUAvk_Lw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 可为 null 的值的操作符函数

在 Kotlin 中, 你可以对你的类覆盖操作符, 比如加和减, 并提供你自己的逻辑. 但如果你想要在操作符的左侧和右侧都允许 null 值, 这时该怎么办?
在这个视频中, Sebastian 解答了这个问题:

<iframe width="560" height="315" src="https://www.youtube.com/embed/x2bZJv8i0vw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 测量代码执行时间

请看 Sebastian 介绍 [`measureTimedValue()`](https://kotlinlang.org/api/latest/jvm/stdlib/kotlin.time/measure-timed-value.html) 函数, 学习如何测量你的代码的执行时间:

<iframe width="560" height="315" src="https://www.youtube.com/embed/j_LEcry7Pms" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 循环的改进

在这个视频中, Sebastian 会演示如何改进 [循环](control-flow.html#for-loops), 让你的代码更加易读, 易懂, 简洁:

<iframe width="560" height="315" src="https://www.youtube.com/embed/i-kyPp1qFBA" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 字符串

在这一期中, Kate Petrova 演示 3 个小技巧, 帮助你在 Kotlin 中处理 [字符串](strings.html):

<iframe width="560" height="315" src="https://www.youtube.com/embed/IL3RLKvWJF4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Elvis 操作符的复杂运用

在这个视频中, Sebastian 演示如何向 [Elvis 操作符](null-safety.html#elvis-operator) 添加更多逻辑, 比如对操作符右侧输出日志:

<iframe width="560" height="315" src="https://www.youtube.com/embed/L9wqYQ-fXaM" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## Kotlin 集合

在这一期中, Kate Petrova 演示 3 个小技巧, 帮助你处理 [Kotlin 集合](collections-overview.html):

<iframe width="560" height="315" src="https://www.youtube.com/embed/ApXbm1T_eI4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 下一步做什么?

* 在我们的 [YouTube 播放列表](https://youtube.com/playlist?list=PLlFc5cFwUnmyDrc-mwwAL9cYFkSHoHHz7) 中查看 Kotlin 小技巧的完整列表
* 学习如何编写 [针对常见问题的 Kotlin 惯用代码](idioms.html)
