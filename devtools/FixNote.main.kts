#!/usr/bin/env kotlin

@file:ScriptFileLocation("scriptFile")

import java.io.File
import kotlin.text.Charsets.UTF_8

val topFolder: File = scriptFile.absoluteFile.resolve("../..").normalize()
println("topFolder: $topFolder")

val topicsFolder: File = topFolder.absoluteFile.resolve("docs_zh/topics").normalize()
println("topicsFolder: $topicsFolder")

topicsFolder.walkTopDown().forEach { topicFile ->
    fixNote(topicFile)
}

fun fixNote(topicFile: File) {
    if (!topicFile.isFile) {
        return
    }

    if (topicFile.extension != "md") {
        return
    }

    val map = mapOf(
        "{:.tip}" to "> \n" +
            "{style=\"tip\"}",
        "{:.note}" to "> \n" +
            "{style=\"note\"}",
        "{:.warning}" to "> \n" +
            "{style=\"warning\"}",
    )

    val oldLines = topicFile.readLines(charset = UTF_8)

    val newLines = oldLines.map { line ->
        val note = line.trim()
        map[note] ?: line
    }

    topicFile.writeText(
        newLines.joinToString("\n", postfix = "\n"),
        charset = UTF_8
    )
}
