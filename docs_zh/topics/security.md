[//]: # (title: 安全性)

我们尽力保证我们的产品不存在安全性漏洞. 为了减少发生安全性漏洞的风险, 请遵守以下原则:

* 总是使用 Kotlin 的最新发布版. 为了安全性目的, 我们将发布版公布到 [Maven Central](https://central.sonatype.com/search?q=g:org.jetbrains.kotlin),
使用以下 PGP key:

  * Key ID: **kt-a@jetbrains.com**
  * Fingerprint: **2FBA 29D0 8D2E 25EE 84C1 32C3 0729 A0AF F899 9A87**
  * Key size: **RSA 3072**

* 对你的应用程序的依赖项使用最新版. 如果你需要使用一个依赖项的特定版本, 请定期检查是否发现了新的安全性漏洞.
你可以遵照 [GitHub 的安全性指南](https://docs.github.com/en/code-security),
或在 [CVE 数据库](https://cve.mitre.org/cgi-bin/cvekey.cgi?keyword=kotlin) 中查阅已知的安全性漏洞.

从 Kotlin 2.4.0 开始, Kotlin 的 JVM 标准库对每个发布版本线提供 18 个月的支持周期.
语言发布版 (2._x_._0_) 以及后续的工具发布版 (2._x_._20_) 属于同一个发布版本线 (2._x_).
关于我们如何处理 JVM 标准库中的安全漏洞, 详情请参见 [标准库的安全性支持](releases.md#standard-library-security-support).

我们始终希望能收到你发现的任何安全性问题的报告.
要报告你在 Kotlin 中发现的安全性漏洞, 请直接在我们的 [问题追踪系统](https://youtrack.jetbrains.com/newIssue?project=KT&c=Type%20Security%20Problem) 中提交一条消息,
或者向我们发送 [email](mailto:security@jetbrains.org).

关于我们对安全性问题的负责任的披露流程(Responsible Disclosure Process),
详情请参见 [JetBrains 协调披露政策(Coordinated Disclosure Policy)](https://www.jetbrains.com/legal/docs/terms/coordinated-disclosure/).
