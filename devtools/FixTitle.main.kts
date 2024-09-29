#!/usr/bin/env kotlin

@file:ScriptFileLocation("scriptFile")

import java.io.File
import kotlin.text.Charsets.UTF_8

val topFolder: File = scriptFile.absoluteFile.resolve("../..").normalize()
println("topFolder: $topFolder")

val topicsFolder: File = topFolder.absoluteFile.resolve("docs_zh/topics").normalize()
println("topicsFolder: $topicsFolder")

topicsFolder.walkTopDown().forEach { topicFile ->
    fixTitle(topicFile)
}

fun fixTitle(topicFile: File) {
    if (!topicFile.isFile) {
        return
    }

    if (topicFile.extension != "md") {
        return
    }

    val oldLines = topicFile.readLines(charset = UTF_8)

    val firstLine = oldLines.firstOrNull()
    if (firstLine.orEmpty().startsWith("[//]: #")) {
        return
    }

    val titlePrefix = "title:"
    val titleLine = oldLines.firstOrNull { it.startsWith(titlePrefix) }
    if (titleLine == null) {
        println("CAN NOT find title for ${topicFile.name}")
        return
    }
    val title = titleLine
        .removePrefix(titlePrefix)
        .trim(' ', '"')

    var idx = oldLines.indexOf(titleLine)

    val lastDocUpdateLine = oldLines.firstOrNull { it.startsWith("最终更新:") }
    if (lastDocUpdateLine != null) {
        idx = oldLines.indexOf(lastDocUpdateLine)
    }

    val newLines = listOf(
        "[//]: # (title: $title)",
        "",
        "最终更新: %latestDocDate%",
    ) + oldLines.drop(idx + 1)

    topicFile.writeText(
        newLines.joinToString("\n", postfix = "\n"),
        charset = UTF_8
    )
}
