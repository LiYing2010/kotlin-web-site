---
type: doc
layout: reference
category:
title: "KSP 示例程序"
---

# KSP 示例程序

最终更新: {{ site.data.releases.latestDocDate }}

## 得到所有成员函数

```kotlin
fun KSClassDeclaration.getDeclaredFunctions(): List<KSFunctionDeclaration> =
    declarations.filterIsInstance<KSFunctionDeclaration>()
```

## 检查一个类或函数是否为 local

```kotlin
fun KSDeclaration.isLocal(): Boolean =
    parentDeclaration != null && parentDeclaration !is KSClassDeclaration
```

## 查找类型别名指向的实际的类或接口声明

```kotlin
fun KSTypeAlias.findActualType(): KSClassDeclaration {
    val resolvedType = this.type.resolve().declaration
    return if (resolvedType is KSTypeAlias) {
        resolvedType.findActualType()
    } else {
        resolvedType as KSClassDeclaration
    }
}
```

## 在源代码文件的注解中查找被压制(Suppressed)的名称

```kotlin
// @file:kotlin.Suppress("Example1", "Example2")
fun KSFile.suppressedNames(): List<String> {
    val ignoredNames = mutableListOf<String>()
    annotations.filter {
        it.shortName.asString() == "Suppress" && it.annotationType.resolve()?.declaration?.qualifiedName?.asString() == "kotlin.Suppress"
    }.forEach {
        val argValues: List<String> = it.arguments.flatMap { it.value }
        ignoredNames.addAll(argValues)
    }
    return ignoredNames
}
```
