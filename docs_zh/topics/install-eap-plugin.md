[//]: # (title: 安装 Kotlin EAP Plugin)

<tldr>
    <p>最新的 Kotlin EAP 版本: <strong>%kotlinEapVersion%</strong></p>
    <p><a href="eap.md#build-details">查看 Kotlin EAP 版</a></p>
</tldr>

> 从 IntelliJ IDEA 2023.3 和 Android Studio Iguana (2023.2.1) Canary 15 开始, 不再需要单独设置 Kotlin plugin.
> 你只需要在你的构建脚本中 [修改 Kotlin 版本](configure-build-for-eap.md).
>
{style="note"}

请按照以下步骤来安装 IntelliJ IDEA 和 Android Studio 的 Kotlin Plugin 预览版.

1. 选择 **Tools** | **Kotlin** | **Configure Kotlin Plugin Updates**.

   ![选择 Kotlin Plugin 更新](idea-kotlin-plugin-updates.png)
   {width="600"}

2. 在 **Update channel** 列表中, 选择 **Early Access Preview** 频道.

    ![选择 EAP 更新频道](idea-kotlin-update-channel.png)
    {width="500"}

3. 点击 **Check again**. 会出现最新的 EAP 版本.

    ![安装 EAP 版](idea-latest-kotlin-eap.png)
    {width="500"}

   > 如果 Kotlin EAP plugin 找不到最新的 EAP 版本, 请检查你使用的是不是
   > [IntelliJ IDEA](https://www.jetbrains.com/help/idea/update.html) 或 [Android Studio](https://developer.android.com/studio/intro/update)
   > 的最新版本.
   >
   {style="note"}

4. 点击 **Install**.

如果你希望在 EAP 版安装之前已创建的项目中使用 EAP 版, 你需要 [为 EAP 版配置你的构建](configure-build-for-eap.md).

## 如果你遇到任何问题

* 到 [我们的问题追踪系统, YouTrack](https://kotl.in/issue) 报告问题.
* 到 [Kotlin Slack 的 #eap 频道](https://app.slack.com/client/T09229ZC6/C0KLZSCHF) 寻求帮助
  ([获得邀请](https://surveys.jetbrains.com/s3/kotlin-slack-sign-up)).
* 回退到最新的稳定版: 在菜单 **Tools | Kotlin | Configure Kotlin Plugin Updates** 中,
  选择 **Stable** 更新频道, 然后点击 **Install**.
