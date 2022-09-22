---
type: doc
layout: reference
category:
title: "在命令行运行 KSP"
---

# 在命令行运行 KSP

最终更新: {{ site.data.releases.latestDocDate }}

KSP 是一个 Kotlin 编译器 plugin, 需要与 Kotlin 编译器一起运行. 请下载并解压缩它们.

```bash
#!/bin/bash

# Kotlin 编译器
wget https://github.com/JetBrains/kotlin/releases/download/v{{ site.data.releases.kspSupportedKotlinVersion }}/kotlin-compiler-{{ site.data.releases.kspSupportedKotlinVersion }}.zip
unzip kotlin-compiler-{{ site.data.releases.kspSupportedKotlinVersion }}.zip

# KSP
wget https://github.com/google/ksp/releases/download/{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}/artifacts.zip
unzip artifacts.zip
```

要和 `kotlinc` 一起运行 KSP, 请向 `kotlinc` 传递 `-Xplugin` 选项.

```bash
-Xplugin=/path/to/symbol-processing-cmdline-{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}.jar
```

这与 `symbol-processing-{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}.jar` 不同,
它专门用于在 Gradle 中运行时和 `kotlin-compiler-embeddable` 一起使用.
而命令行的 `kotlinc` 则需要 `symbol-processing-cmdline-{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}.jar`.

你还需要 API jar.

```bash
-Xplugin=/path/to/symbol-processing-api-{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}.jar
```

完整的示例如下:

```bash
#!/bin/bash

KSP_PLUGIN_ID=com.google.devtools.ksp.symbol-processing
KSP_PLUGIN_OPT=plugin:$KSP_PLUGIN_ID

KSP_PLUGIN_JAR=./com/google/devtools/ksp/symbol-processing-cmdline/{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}/symbol-processing-cmdline-{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}.jar
KSP_API_JAR=./com/google/devtools/ksp/symbol-processing-api/{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}/symbol-processing-api-{{ site.data.releases.kspSupportedKotlinVersion }}-{{ site.data.releases.kspVersion }}.jar
KOTLINC=./kotlinc/bin/kotlinc

AP=/path/to/your-processor.jar

mkdir out
$KOTLINC \
        -Xplugin=$KSP_PLUGIN_JAR \
        -Xplugin=$KSP_API_JAR \
        -Xallow-no-source-files \
        -P $KSP_PLUGIN_OPT:apclasspath=$AP \
        -P $KSP_PLUGIN_OPT:projectBaseDir=. \
        -P $KSP_PLUGIN_OPT:classOutputDir=./out \
        -P $KSP_PLUGIN_OPT:javaOutputDir=./out \
        -P $KSP_PLUGIN_OPT:kotlinOutputDir=./out \
        -P $KSP_PLUGIN_OPT:resourceOutputDir=./out \
        -P $KSP_PLUGIN_OPT:kspOutputDir=./out \
        -P $KSP_PLUGIN_OPT:cachesDir=./out \
        -P $KSP_PLUGIN_OPT:incremental=false \
        -P $KSP_PLUGIN_OPT:apoption=key1=value1 \
        -P $KSP_PLUGIN_OPT:apoption=key2=value2 \
        $*
```
