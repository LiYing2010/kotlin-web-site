#!/usr/bin/env kotlin

@file:ScriptFileLocation("scriptFile")

import java.io.File
import kotlin.text.Charsets.UTF_8

val topFolder: File = scriptFile.absoluteFile.resolve("../..").normalize()
println("topFolder: $topFolder")

val topicsFolder: File = topFolder.absoluteFile.resolve("docs_zh/topics").normalize()
println("topicsFolder: $topicsFolder")

topicsFolder.walkTopDown().forEach { topicFile ->
    removeLatestDocDate(topicFile)
}

fun removeLatestDocDate(topicFile: File) {
    if (!topicFile.isFile) {
        return
    }

    if (topicFile.extension != "md") {
        return
    }

    val lines = topicFile.readLines(charset = UTF_8)
        .toMutableList()

    val idx = lines.indexOf("最终更新: %latestDocDate%")
    if (idx > -1) {
        lines.removeAt(idx)
        if (lines[idx] == "") {
            lines.removeAt(idx)
        }

        topicFile.writeText(
            lines.joinToString("\n", postfix = "\n"),
            charset = UTF_8
        )
    }
}
