---
type: doc
layout: reference
category:
title: "Kotlin plugin 的发布版本"
---

# Kotlin plugin 的发布版本

最终更新: {{ site.data.releases.latestDocDate }}

 [IntelliJ Kotlin plugin](https://plugins.jetbrains.com/plugin/6954-kotlin) 的发布周期与 [IntelliJ IDEA](https://www.jetbrains.com/idea/) 相同.
为了加快新功能的测试和发布速度, plugin 和 IDEA 平台已经移动到了相同的代码库, 并同时发布.
Kotlin 则会根据 [发布周期](https://blog.jetbrains.com/kotlin/2020/10/new-release-cadence-for-kotlin-and-the-intellij-kotlin-plugin/) 独立发布.

Kotlin 和 Kotlin plugin 拥有各自不同的功能:
* Kotlin 的发布版本包括语言, 编译器, 以及标准库的功能.
* Kotlin plugin 的发布版本只包括与 IDE 相关的功能. 比如, 代码格式化和调试工具.

这个变化也会影响 Kotlin plugin 的版本号. plugin 的发布版本现在使用 IntelliJ IDEA 相同的版本号.

## 更新到新的发布版本

一旦出现了新的发布版本, IntelliJ IDEA 和 Android Studio 会建议更新到这个版本. 如果你接受更新建议, 它会自动更新 Kotlin plugin 到最新版.
你可以通过菜单 **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates** 查看 Kotlin plugin 版本 .

如果你迁移到新的功能发布版, Kotlin plugin 的迁移工具可以帮助你进行迁移.

## 发布版详细信息

下表列出了最新的 Kotlin plugin 发布版的详细信息: 

<table>
<tr>
  <th>
    发布版
  </th>
  <th>
    主要更新
  </th>
</tr>

<tr>
  <td>
    <b> 2022.3 </b> <br/>
    发布日期: 2022/11/30
  </td>
  <td>
    <li> 支持 Kotlin 1.7.20 的功能特性 </li>
    <li> 针对 Kotlin 的 IDE 性能改进 </li>
    <br/>
    详情请参见: 
    <li> <a href="https://www.jetbrains.com/idea/whatsnew/2022-3/">IntelliJ IDEA 2022.3 的新功能</a> </li>
  </td>
</tr>

<tr>
  <td>
    <b> 2022.2 </b> <br/> 
    发布日期: 2022/07/26
  </td>
  <td>
    <li> 调试器中的数据流(Data Flow)分析功能 </li>
    <li> 修正了编译器版本不匹配导致的本地与 CI 构建中的不一致 </li>
    <li> IDE 性能改进 </li>
    <br/>
    详情请参见: 
    <li> <a href="https://www.jetbrains.com/idea/whatsnew/2022-2/">IntelliJ IDEA 2022.2 的新功能</a> </li>
  </td>
</tr>

<tr>
  <td>
    <b> 2022.1 </b> <br/> 
    发布日期: 2022/04/12
  </td>
  <td>
    <li> 调试器改进 </li> 
    <li> IDE 性能改进 </li>
    <li> 集成 <a href="https://github.com/Kotlin/kotlinx-kover">Kover plugin</a> </li>
    <br/>
    详情请参见: 
    <li> <a href="https://www.jetbrains.com/idea/whatsnew/2022-1/">IntelliJ IDEA 2022.1 的新功能</a> </li>
  </td>
</tr>

<tr>
  <td>
    <b> 2021.3 </b> <br/> 
    发布日期: 2021/11/30  
  </td>
  <td>
    <li> 更好的调试体验 </li> 
    <li> 性能改进 </li>
    <li> 代码编辑器的内联提示 </li>
    <li> 新的代码重构功能, 变量查看功能(Inspection)和代码意图(Intention)功能的改进 </li>
    <br/>
    详情请参见: 
    <li> <a href="https://www.jetbrains.com/idea/whatsnew/2021-3/">IntelliJ IDEA 2021.3 的新功能</a> </li>
  </td>
</tr>

<tr>
  <td>
    <b> 2021.2 </b> <br/> 
    发布日期: 2021/07/27
  </td>
  <td>
    <li> 性能改进 </li> 
    <li> 更好的调试体验 </li>
    <li> 支持远程开发 </li>
    <br/>
    详情请参见: 
    <li> <a href="https://www.jetbrains.com/idea/whatsnew/2021-2/">IntelliJ IDEA 2021.2 的新功能</a> </li>
  </td>
</tr>

<tr>
  <td>
    <b> 2021.1 </b> <br/>
    发布日期: 2021/04/07
  </td>
  <td>
    <li> 性能改进 </li> 
    <li> 调试过程中计算自定义的 get 方法</li>
    <li> 改进了修改方法签名的代码重构功能</li>
    <li> 对类型参数的代码完成</li>
    <li> Kotlin 类的 UML 图</li>
    <br/>
    详情请参见:
    <li> <a href="https://www.jetbrains.com/idea/whatsnew/2021-1/">IntelliJ IDEA 2021.1 的新功能</a> </li>
  </td>
</tr>

<tr>
  <td>
    <b> 2020.3 </b> <br/>
    发布日期: 2020/12/01
  </td>
  <td>
    <li> 新类型的 inline 代码重构 </li>
    <li> 结构化的查找替换</li>
    <li> 支持编辑器配置</li>
    <li> 针对 Jetpack Compose for Desktop 的项目模板</li>
    <br/>
    详情请参见:
    <li> <a href="https://blog.jetbrains.com/idea/2020/12/intellij-idea-2020-3/">IntelliJ IDEA 2020.3 发布公告博文</a> </li>
  </td>
</tr>
</table>
