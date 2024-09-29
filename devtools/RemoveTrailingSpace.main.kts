#!/usr/bin/env kotlin

@file:ScriptFileLocation("scriptFile")

import java.io.File
import kotlin.text.Charsets.UTF_8

val topFolder: File = scriptFile.absoluteFile.resolve("../..").normalize()
println("topFolder: $topFolder")

val topicsFolder: File = topFolder.absoluteFile.resolve("docs_zh/topics").normalize()
println("topicsFolder: $topicsFolder")

topicsFolder.walkTopDown().forEach { topicFile ->
    removeTrailingSpace(topicFile)
}

fun removeTrailingSpace(topicFile: File) {
    if (!topicFile.isFile) {
        return
    }

    if (topicFile.extension != "md") {
        return
    }

    val oldLines = topicFile.readLines(charset = UTF_8)

    val newLines = oldLines.map { line ->
        line.trimEnd()
    }

    topicFile.writeText(
        newLines.joinToString("\n", postfix = "\n"),
        charset = UTF_8
    )
}
