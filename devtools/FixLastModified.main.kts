#!/usr/bin/env kotlin

@file:ScriptFileLocation("scriptFile")

import java.io.File
import java.text.SimpleDateFormat
import java.util.*
import kotlin.text.Charsets.UTF_8

val topFolder: File = scriptFile.absoluteFile.resolve("../..").normalize()
println("topFolder: $topFolder")

val buildFolder: File = topFolder.absoluteFile.resolve("build").normalize()
println("buildFolder: $buildFolder")

val today = Date()
val dateStr = SimpleDateFormat("yyyy/MM/dd").format(today)
val oldHtmlCode = "<div class=\"last-modified\">[^<]*</div>".toRegex()
val newHtmlCode = "<div class=\"last-modified\">$dateStr</div>"

buildFolder.walkTopDown().forEach { htmlFile ->
    fixLastModified(htmlFile)
}

fun fixLastModified(htmlFile: File) {
    if (!htmlFile.isFile) {
        return
    }

    if (htmlFile.extension != "html") {
        return
    }

    val oldText = htmlFile.readText(charset = UTF_8)
    val newText = oldHtmlCode.replace(oldText, newHtmlCode)

    htmlFile.writeText(newText, charset = UTF_8)
}
