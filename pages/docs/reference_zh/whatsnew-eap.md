---
type: doc
layout: reference
category:
title: "Kotlin 1.7.20-RC 版中的新功能"
---

# Kotlin 1.7.20-RC 版中的新功能

最终更新: {{ site.data.releases.latestDocDate }}


## 如何更新到 Kotlin 1.7.20-RC

从 IntelliJ IDEA 2022.2.1, Android Studio Dolphin (2021.3.1), 和 Android Studio Electric Eel (2022.1.1) 开始,
IDE 支持 Kotlin 1.7.20-RC.

你可以通过以下任何一种方式安装 Kotlin 1.7.20-RC:

* 如果你使用 _Early Access Preview_ 更新频道
  IDE 会在 1.7.20-RC 可用时, 自动建议更新到 1.7.20-RC.
* 如果你使用 _Stable_ 更新频道,
  你可以在你的 IDE 中选择 **Tools** \| **Kotlin** \| **Configure Kotlin Plugin Updates**, 将更新频道修改为 _Early Access Preview_.
  然后你就可以安装最新的预览版本了. 详情请参见 [这些文档](install-eap-plugin.html).

安装 1.7.20-RC 之后, 不要忘记在你的构建脚本中 [修改 Kotlin 版本](configure-build-for-eap.html) 到 1.7.20-RC.
