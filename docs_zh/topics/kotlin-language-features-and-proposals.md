[//]: # (title: Kotlin 语言的功能特性与提案)
[//]: # (description: Learn about the lifecycle of Kotlin features. The page contains the full list of Kotlin language features and design proposals.)

JetBrains 根据 [Kotlin 语言演化原则](kotlin-evolution-principles.md), 以务实的设计为指导, 对 Kotlin 语言进行演进.

> 从 Kotlin 1.7.0 开始列出语言的功能特性提案.
> 
> 关于各个语言功能特性的状态, 详细的解释请参见
> [Kotlin evolution principles documentation](kotlin-evolution-principles.md#pre-stable-features).
> 
{style="note"}

<tabs>
<tab id="所有提案" title="All">

<!-- <include element-id="all-proposals" from="all-proposals.topic"/> -->

<snippet id="source">
<table style="header-column">

<!-- EXPLORATION AND DESIGN BLOCK -->

<tr filter="exploration-and-design">
<td width="200">

**探索与设计**

</td>
<td>

**Kotlin 静态成员与静态扩展**

* KEEP 提案: [statics.md](https://github.com/Kotlin/KEEP/blob/statics/proposals/statics.md)
* YouTrack issue: [KT-11968](https://youtrack.jetbrains.com/issue/KT-11968)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**集合的字面值**

* KEEP 提案: 未定义
* YouTrack issue: [KT-43871](https://youtrack.jetbrains.com/issue/KT-43871)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**用于错误和异常的联合类型(Union type)**

* KEEP 提案: 未定义
* YouTrack issue: [KT-68296](https://youtrack.jetbrains.com/issue/KT-68296)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**基于名称的解构**

* KEEP 提案: 未定义
* YouTrack issue: [KT-19627](https://youtrack.jetbrains.com/issue/KT-19627)

</td>
</tr>

<tr filter="exploration-and-design">
<td>

**探索与设计**

</td>
<td>

**支持不可变性(Immutability)**

* KEEP 备忘录: [immutability](https://github.com/Kotlin/KEEP/blob/master/notes/value-classes.md#immutability-and-value-classes)
* YouTrack issue: [KT-1179](https://youtrack.jetbrains.com/issue/KT-1179)

</td>
</tr>

<!-- END OF EXPLORATION AND DESIGN BLOCK -->

<!-- KEEP DISCUSSION BLOCK -->

<tr filter="keep">
<td width="200">

**KEEP 讨论**

</td>
<td>

**KMP Kotlin 到 Java 的直接实际化(direct actualization)**

* KEEP 提案: [kmp-kotlin-to-java-direct-actualization.md](https://github.com/Kotlin/KEEP/blob/kotlin-to-java-direct-actualization/proposals/kmp-kotlin-to-java-direct-actualization.md)
* YouTrack issue: [KT-67202](https://youtrack.jetbrains.com/issue/KT-67202)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**提高 KDoc 歧义链接解析的效率**

* KEEP 提案: [streamline-KDoc-ambiguity-references.md](https://github.com/Kotlin/KEEP/blob/kdoc/Streamline-KDoc-ambiguity-references/proposals/kdoc/streamline-KDoc-ambiguity-references.md)
* GitHub issues: [dokka/#3451](https://github.com/Kotlin/dokka/issues/3451), [dokka/#3179](https://github.com/Kotlin/dokka/issues/3179), [dokka/#3334](https://github.com/Kotlin/dokka/issues/3334)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**KDoc 中对扩展的链接的解析**

* KEEP 提案: [links-to-extensions.md](https://github.com/Kotlin/KEEP/blob/kdoc/extension-links/proposals/kdoc/links-to-extensions.md)
* GitHub issue: [dokka/#3555](https://github.com/Kotlin/dokka/issues/3555)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**Uuid**

* KEEP 提案: [uuid.md](https://github.com/Kotlin/KEEP/blob/uuid/proposals/stdlib/uuid.md)
* YouTrack issue: [KT-31880](https://youtrack.jetbrains.com/issue/KT-31880)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**改善使用预期类型时的解析**

* KEEP 提案: [improved-resolution-expected-type.md](https://github.com/Kotlin/KEEP/blob/improved-resolution-expected-type/proposals/improved-resolution-expected-type.md)
* YouTrack issue: [KT-16768](https://youtrack.jetbrains.com/issue/KT-16768)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**在 JVM 中公开装箱的内联值类(boxed inline value class)**

* KEEP 提案: [jvm-expose-boxed.md](https://github.com/Kotlin/KEEP/blob/jvm-expose-boxed/proposals/jvm-expose-boxed.md)
* YouTrack issue: [KT-28135](https://youtrack.jetbrains.com/issue/KT-28135)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**明确的后端域变量(Backing Field): 对同一个属性同时支持 `public` 和 `private` 类型**

* KEEP 提案: [explicit-backing-fields.md](https://github.com/Kotlin/KEEP/blob/explicit-backing-fields-re/proposals/explicit-backing-fields.md)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-14663)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**上下文参数: 支持依赖于上下文的声明**

* KEEP 提案: [context-parameters.md](https://github.com/Kotlin/KEEP/blob/context-parameters/proposals/context-parameters.md)
* YouTrack issue: [KT-14663](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**在带有判断对象的 when 语句中的保护条件(Guard Condition)**

* KEEP 提案: [guards.md](https://github.com/Kotlin/KEEP/blob/guards/proposals/guards.md)
* YouTrack issue: [KT-13626](https://youtrack.jetbrains.com/issue/KT-13626)
* 目标版本: 2.1.0

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**稳定 `@SubclassOptInRequired`**

* KEEP 提案: [subclass-opt-in-required.md](https://github.com/Kotlin/KEEP/blob/master/proposals/subclass-opt-in-required.md)
* YouTrack issue: [KT-54617](https://youtrack.jetbrains.com/issue/KT-54617)
* 目标版本: 2.1.0

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**多 `$` 插入: 改进字符串字面值中的 `$` 处理**

* KEEP 提案: [dollar-escape.md](https://github.com/Kotlin/KEEP/blob/master/proposals/dollar-escape.md)
* YouTrack issue: [KT-2425](https://youtrack.jetbrains.com/issue/KT-2425)
* 目标版本: 2.1.0

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**非局部的 `break` 和 `continue`**

* KEEP 提案: [break-continue-in-inline-lambdas.md](https://github.com/Kotlin/KEEP/blob/master/proposals/break-continue-in-inline-lambdas.md)
* YouTrack issue: [KT-1436](https://youtrack.jetbrains.com/issue/KT-1436)
* 目标版本: 2.1.0

</td>
</tr>

<tr filter="keep">
<td>

**KEEP 讨论**

</td>
<td>

**对 Java 合成属性的引用**

* KEEP 提案: [references-to-java-synthetic-properties.md](https://github.com/Kotlin/KEEP/blob/master/proposals/references-to-java-synthetic-properties.md)
* YouTrack issue: [KT-8575](https://youtrack.jetbrains.com/issue/KT-8575)
* 目标版本: 2.1.0

</td>
</tr>

<!-- END OF KEEP DISCUSSION BLOCK -->

<!-- IN PREVIEW BLOCK -->

<!-- the first td element should have the width="200" attribute -->

<!-- END OF IN PREVIEW BLOCK -->

<!-- STABLE BLOCK -->

<tr filter="stable">
<td width="200">

**稳定**

</td>
<td>

**`Enum.entries`: 对 `Enum.values()` 的性能更好的替代**

* KEEP 提案: [enum-entries.md](https://github.com/Kotlin/KEEP/blob/master/proposals/enum-entries.md)
* YouTrack issue: [KT-48872](https://youtrack.jetbrains.com/issue/KT-48872)
* 目标版本: 2.0.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定**

</td>
<td>

**数据对象**

* KEEP 提案: [data-objects.md](https://github.com/Kotlin/KEEP/blob/master/proposals/data-objects.md)
* YouTrack issue: [KT-4107](https://youtrack.jetbrains.com/issue/KT-4107)
* 目标版本: 1.9.0

</td>
</tr>

<tr filter="stable">
<td>

**稳定**

</td>
<td>

**RangeUntil 操作符 `..<`**

* KEEP 提案: [open-ended-ranges.md](https://github.com/kotlin/KEEP/blob/open-ended-ranges/proposals/open-ended-ranges.md)
* YouTrack issue: [KT-15613](https://youtrack.jetbrains.com/issue/KT-15613)
* 目标版本: 1.7.20

</td>
</tr>

<tr filter="stable">
<td>

**稳定**

</td>
<td>

**确定不为 null 的类型**

* KEEP 提案: [definitely-non-nullable-types.md](https://github.com/Kotlin/KEEP/blob/master/proposals/definitely-non-nullable-types.md)
* YouTrack issue: [KT-26245](https://youtrack.jetbrains.com/issue/KT-26245)
* 目标版本: 1.7.0

</td>
</tr>

<!-- END OF STABLE BLOCK -->

<!-- REVOKED BLOCK -->

<tr filter="revoked">
<td width="200">

**撤销**

</td>
<td>

**上下文接收者**

* KEEP 提案: [context-receivers.md](https://github.com/Kotlin/KEEP/blob/master/proposals/context-receivers.md)
* YouTrack issue: [KT-10468](https://youtrack.jetbrains.com/issue/KT-10468)

</td>
</tr>

</table>
</snippet>

<!-- END OF REVOKED BLOCK -->

</tab>

<tab id="exploration-and-design" title="探索与设计">

<include element-id="source" use-filter="empty,exploration-and-design" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="keep-preparation" title="KEEP 讨论">

<include element-id="source" use-filter="empty,keep" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="in-preview" title="预览中">

<include element-id="source" use-filter="empty,in-preview" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="stable" title="稳定">

<include element-id="source" use-filter="empty,stable" from="kotlin-language-features-and-proposals.md"/>

</tab>

<tab id="revoked" title="撤销">

<include element-id="source" use-filter="empty,revoked" from="kotlin-language-features-and-proposals.md"/>

</tab>
</tabs>
