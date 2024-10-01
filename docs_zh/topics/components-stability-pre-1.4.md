[//]: # (title: Kotlin 各部分组件的稳定性 (1.4 版以前))

最终更新: %latestDocDate%

根据组件演进速度的不同, 可能存在几种不同的稳定性模式:
<a name="moving-fast"></a>
*   **快速变化 (Moving fast, MF)**:
    即使在 [增量发布](kotlin-evolution.md#feature-releases-and-incremental-releases) 之间也不保证任何兼容性,
    可能在没有警告的情况下增加, 删除, 或改变任何功能.

*   **包括新功能的增量发布 (Additions in Incremental Releases, AIR)**:
    在增量发布时可能增加新的功能, 尽量避免删除或改变功能, 如果确实需要, 应该在之前的增量发布时提前公告.

*   **稳定的增量发布 (Stable Incremental Releases, SIR)**:
    增量发布保证完全兼容, 只进行代码优化和 bug 修正.
    任何其他变化都应该通过 [功能发布](kotlin-evolution.md#feature-releases-and-incremental-releases) 来进行.

<a name="fully-stable"></a>
*   **完全稳定 (Fully Stable, FS)**: 增量发布保证完全兼容, 只进行代码优化和 bug 修正. 功能发布保证向后兼容.

对于同一个组件, 源代码和二进制发布版可以有不同的稳定模式, 例如, 源代码可以比二进制版更早到达完全稳定状态, 或者反过来.

只对那些达到了完全稳定 (Fully Stable, FS) 的组件, 才完全适用 [Kotlin 演进政策](kotlin-evolution.md) 的条款.
在此之后的一切导致不兼容的变更, 都必须经过 Kotlin 语言委员会的审批.

| **     组件     **    | ** 进入该状态的版本 ** | ** 源代码稳定性 ** | ** 二进制发布版稳定性 ** |
|---------------------|----------------|--------------|-----------------|
| Kotlin/JVM          | 1.0            | FS           | FS              |
| kotlin 标准库 (JVM)    | 1.0            | FS           | FS              |
| KDoc 语法             | 1.0            | FS           | N/A             |
| 协程                  | 1.3            | FS           | FS              |
| kotlin 反射 (JVM)     | 1.0            | SIR          | SIR             |
| Kotlin/JS           | 1.1            | AIR          | MF              |
| Kotlin/Native       | 1.3            | AIR          | MF              |
| Kotlin 脚本 (*.kts)   | 1.2            | AIR          | MF              |
| dokka               | 0.1            | MF           | N/A             |
| Kotlin 脚本 API       | 1.2            | MF           | MF              |
| 编译器插件 API           | 1.0            | MF           | MF              |
| 序列化                 | 1.3            | MF           | MF              |
| 跨平台项目               | 1.2            | MF           | MF              |
| 内联类                 | 1.3            | MF           | MF              |
| 无符号数运算              | 1.3            | MF           | MF              |
| **所有其他实验性功能的默认稳定性** | N/A            | **MF**       | **MF**          |
