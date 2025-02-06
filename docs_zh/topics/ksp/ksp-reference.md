[//]: # (title: 针对 Java 注解处理器开发者的参考文档)

## 程序元素 {id="program-elements"}

| **Java**               | **KSP 中的类似功能**                               | **注意事项**       |
|------------------------|----------------------------------------------|----------------|
| `AnnotationMirror`     | `KSAnnotation`                               |                |
| `AnnotationValue`      | `KSValueArguments`                           |                |
| `Element`              | `KSDeclaration` / `KSDeclarationContainer`   |                |
| `ExecutableElement`    | `KSFunctionDeclaration`                      |                |
| `PackageElement`       | `KSFile`                                     | KSP 不将包建模为程序元素 |
| `Parameterizable`      | `KSDeclaration`                              |                |
| `QualifiedNameable`    | `KSDeclaration`                              |                |
| `TypeElement`          | `KSClassDeclaration`                         |                |
| `TypeParameterElement` | `KSTypeParameter`                            |                |
| `VariableElement`      | `KSValueParameter` / `KSPropertyDeclaration` |                |

## 类型 {id="types"}

KSP 要求明确解析类型, 因此在解析之前, Java 中的有些功能只能通过 `KSType` 和对应的元素得到.

| **Java**           | **KSP 中的类似功能**                     | **注意事项**                                                             |
|--------------------|------------------------------------|----------------------------------------------------------------------|
| `ArrayType`        | `KSBuiltIns.arrayType`             |                                                                      |
| `DeclaredType`     | `KSType` / `KSClassifierReference` |                                                                      |
| `ErrorType`        | `KSType.isError`                   |                                                                      |
| `ExecutableType`   | `KSType` / `KSCallableReference`   |                                                                      |
| `IntersectionType` | `KSType` / `KSTypeParameter`       |                                                                      |
| `NoType`           | `KSType.isError`                   | KSP 中没有这样的功能                                                         |
| `NullType`         |                                    | KSP 中没有这样的功能                                                         |
| `PrimitiveType`    | `KSBuiltIns`                       | 与 Java 中的基本类型不完全相同                                                   |
| `ReferenceType`    | `KSTypeReference`                  |                                                                      |
| `TypeMirror`       | `KSType`                           |                                                                      |
| `TypeVariable`     | `KSTypeParameter`                  |                                                                      |
| `UnionType`        | 没有这样的功能                            | Kotlin 的 每个 catch 代码段只有 1 个类型. 即使对 Java 注解处理器来说, `UnionType` 也是不可访问的 |
| `WildcardType`     | `KSType` / `KSTypeArgument`        |                                                                      |

## 杂项 {id="misc"}

| **Java**                       | **KSP 中的类似功能**                | **注意事项**                                                       |
|--------------------------------|-------------------------------|----------------------------------------------------------------|
| `Name`                         | `KSName`                      |                                                                |
| `ElementKind`                  | `ClassKind` / `FunctionKind`  |                                                                |
| `Modifier`                     | `Modifier`                    |                                                                |
| `NestingKind`                  | `ClassKind` / `FunctionKind`  |                                                                |
| `AnnotationValueVisitor`       |                               |                                                                |
| `ElementVisitor`               | `KSVisitor`                   |                                                                |
| `AnnotatedConstruct`           | `KSAnnotated`                 |                                                                |
| `TypeVisitor`                  |                               |                                                                |
| `TypeKind`                     | `KSBuiltIns`                  | 有些可以在 builtin 中得到, 其他通过 `KSClassDeclaration` 得到 `DeclaredType` |
| `ElementFilter`                | `Collection.filterIsInstance` |                                                                |
| `ElementKindVisitor`           | `KSVisitor`                   |                                                                |
| `ElementScanner`               | `KSTopDownVisitor`            |                                                                |
| `SimpleAnnotationValueVisitor` |                               | KSP 中不需要                                                       |
| `SimpleElementVisitor`         | `KSVisitor`                   |                                                                |
| `SimpleTypeVisitor`            |                               |                                                                |
| `TypeKindVisitor`              |                               |                                                                |
| `Types`                        | `Resolver` / `utils`          | 有些 `utils` 也被集成在符号接口中                                          |
| `Elements`                     | `Resolver` / `utils`          |                                                                |

## 细节 {id="details"}

这部分介绍 KSP 怎样提供 Java 注解处理 API 的功能.

### AnnotationMirror {id="annotationmirror"}

| **Java**            | **KSP 中的同等功能**                |
|---------------------|-------------------------------|
| `getAnnotationType` | `ksAnnotation.annotationType` |
| `getElementValues`  | `ksAnnotation.arguments`      |

### AnnotationValue {id="annotationvalue"}

| **Java**   | **KSP 中的同等功能**          |
|------------|-------------------------|
| `getValue` | `ksValueArgument.value` |

### Element {id="element"}

| **Java**               | **KSP 中的同等功能**                                                         |
|------------------------|------------------------------------------------------------------------|
| `asType`               | `ksClassDeclaration.asType(...)` 只对 `KSClassDeclaration` 有效. 需要提供类型参数. |
| `getAnnotation`        | 未实现                                                                    |
| `getAnnotationMirrors` | `ksDeclaration.annotations`                                            |
| `getEnclosedElements`  | `ksDeclarationContainer.declarations`                                  |
| `getEnclosingElements` | `ksDeclaration.parentDeclaration`                                      |
| `getKind`              | 通过 `ClassKind` 或 `FunctionKind` 进行类型检查和转换                              |
| `getModifiers`         | `ksDeclaration.modifiers`                                              |
| `getSimpleName`        | `ksDeclaration.simpleName`                                             |

### ExecutableElement {id="executableelement"}

| **Java**            | **KSP 中的同等功能**                                         |
|---------------------|--------------------------------------------------------|
| `getDefaultValue`   | 未实现                                                    |
| `getParameters`     | `ksFunctionDeclaration.parameters`                     |
| `getReceiverType`   | `ksFunctionDeclaration.parentDeclaration`              |
| `getReturnType`     | `ksFunctionDeclaration.returnType`                     |
| `getSimpleName`     | `ksFunctionDeclaration.simpleName`                     |
| `getThrownTypes`    | Kotlin 中不需要                                            |
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters`                 |
| `isDefault`         | 检查父类型是不是接口                                             |
| `isVarArgs`         | `ksFunctionDeclaration.parameters.any { it.isVarArg }` |

### Parameterizable {id="parameterizable"}

| **Java**            | **KSP 中的同等功能**                         |
|---------------------|----------------------------------------|
| `getTypeParameters` | `ksFunctionDeclaration.typeParameters` |

### QualifiedNameable {id="qualifiednameable"}

| **Java**           | **KSP 中的同等功能**                |
|--------------------|-------------------------------|
| `getQualifiedName` | `ksDeclaration.qualifiedName` |

### TypeElement {id="typeelement"}

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 中的同等功能</b></td>
    </tr>
    <tr>
        <td><code>getEnclosedElements</code></td>
        <td><code>ksClassDeclaration.declarations</code></td>
    </tr>
    <tr>
        <td><code>getEnclosingElement</code></td>
        <td><code>ksClassDeclaration.parentDeclaration</code></td>
    </tr>
    <tr>
        <td><code>getInterfaces</code></td>
<td>

```kotlin
// 不需要类型解析也应该能够实现
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.INTERFACE } <br>
```

</td>
    </tr>
    <tr>
        <td><code>getNestingKind</code></td>
        <td>Check <code>KSClassDeclaration.parentDeclaration</code> 和 <code>inner</code> 修饰符</td>
    </tr>
    <tr>
        <td><code>getQualifiedName</code></td>
        <td><code>ksClassDeclaration.qualifiedName</code></td>
    </tr>
    <tr>
        <td><code>getSimpleName</code></td>
        <td><code>ksClassDeclaration.simpleName</code></td>
    </tr>
    <tr>
        <td><code>getSuperclass</code></td>
<td>

```kotlin
// 不需要类型解析也应该能够实现
ksClassDeclaration.superTypes
    .map { it.resolve() }
    .filter { (it?.declaration as? KSClassDeclaration)?.classKind == ClassKind.CLASS }
```

</td>
    </tr>
    <tr>
        <td><code>getTypeParameters</code></td>
        <td><code>ksClassDeclaration.typeParameters</code></td>
    </tr>
</table>

### TypeParameterElement {id="typeparameterelement"}

| **Java**              | **KSP 中的同等功能**                      |
|-----------------------|-------------------------------------|
| `getBounds`           | `ksTypeParameter.bounds`            |
| `getEnclosingElement` | `ksTypeParameter.parentDeclaration` |
| `getGenericElement`   | `ksTypeParameter.parentDeclaration` |

### VariableElement {id="variableelement"}

| **Java**              | **KSP 中的同等功能**                       |
|-----------------------|--------------------------------------|
| `getConstantValue`    | 未实现                                  |
| `getEnclosingElement` | `ksValueParameter.parentDeclaration` |
| `getSimpleName`       | `ksValueParameter.simpleName`        |

### ArrayType {id="arraytype"}

| **Java**           | **KSP 中的同等功能**             |
|--------------------|----------------------------|
| `getComponentType` | `ksType.arguments.first()` |

### DeclaredType {id="declaredtype"}

| **Java**           | **KSP 中的同等功能**                         |
|--------------------|----------------------------------------|
| `asElement`        | `ksType.declaration`                   |
| `getEnclosingType` | `ksType.declaration.parentDeclaration` |
| `getTypeArguments` | `ksType.arguments`                     |

### ExecutableType {id="executabletype"}

> 函数的 `KSType` 只是一个签名, 由 `FunctionN<R, T1, T2, ..., TN>` 群表达.
>
{style="note"}

| **Java**            | **KSP 中的同等功能**                                                                          |
|---------------------|-----------------------------------------------------------------------------------------|
| `getParameterTypes` | `ksType.declaration.typeParameters`, `ksFunctionDeclaration.parameters.map { it.type }` |
| `getReceiverType`   | `ksFunctionDeclaration.parentDeclaration.asType(...)`                                   |
| `getReturnType`     | `ksType.declaration.typeParameters.last()`                                              |
| `getThrownTypes`    | Kotlin 中不需要                                                                             |
| `getTypeVariables`  | `ksFunctionDeclaration.typeParameters`                                                  |

### IntersectionType {id="intersectiontype"}

| **Java**    | **KSP 中的同等功能**           |
|-------------|--------------------------|
| `getBounds` | `ksTypeParameter.bounds` |

### TypeMirror {id="typemirror"}

| **Java**  | **KSP 中的同等功能**                                             |
|-----------|------------------------------------------------------------|
| `getKind` | 对于基本类型, `Unit`, 与 `KSBuiltIns` 中的类型比较, 其他情况使用 DeclaredType |

### TypeVariable {id="typevariable"}

| **Java**        | **KSP 中的同等功能**                           |
|-----------------|------------------------------------------|
| `asElement`     | `ksType.declaration`                     |
| `getLowerBound` | 未决定. 只存在 capture, 并且需要明确的边界检查时, 才需要这个功能. |
| `getUpperBound` | `ksTypeParameter.bounds`                 |

### WildcardType {id="wildcardtype"}

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 中的同等功能</b></td>
    </tr>
    <tr>
        <td><code>getExtendsBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.COVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
    <tr>
        <td><code>getSuperBound</code></td>
<td>

```kotlin
if (ksTypeArgument.variance == Variance.CONTRAVARIANT) ksTypeArgument.type else null
```

</td>
    </tr>
</table>

### Elements {id="elements"}

<table>
    <tr>
        <td><b>Java</b></td>
        <td><b>KSP 中的同等功能</b></td>
    </tr>
    <tr>
        <td><code>getAllAnnotationMirrors</code></td>
        <td><code>KSDeclarations.annotations</code></td>
    </tr>
    <tr>
        <td><code>getAllMembers</code></td>
        <td><code>getAllFunctions</code>, <code>getAllProperties</code> 未实现</td>
    </tr>
    <tr>
        <td><code>getBinaryName</code></td>
        <td>未决定, 参见 <a href="https://docs.oracle.com/javase/specs/jls/se13/html/jls-13.html#jls-13.1">Java Specification</a></td>
    </tr>
    <tr>
        <td><code>getConstantExpression</code></td>
        <td>常数值, 而不是表达式</td>
    </tr>
    <tr>
        <td><code>getDocComment</code></td>
        <td>未实现</td>
    </tr>
    <tr>
        <td><code>getElementValuesWithDefaults</code></td>
        <td>未实现</td>
    </tr>
    <tr>
        <td><code>getName</code></td>
        <td><code>resolver.getKSNameFromString</code></td>
    </tr>
    <tr>
        <td><code>getPackageElement</code></td>
        <td>不支持包, 但可以取得包信息. KSP 中不能对包进行操作.</td>
    </tr>
    <tr>
        <td><code>getPackageOf</code></td>
        <td>不支持包</td>
    </tr>
    <tr>
        <td><code>getTypeElement</code></td>
        <td><code>Resolver.getClassDeclarationByName</code></td>
    </tr>
    <tr>
        <td><code>hides</code></td>
        <td>未实现</td>
    </tr>
    <tr>
        <td><code>isDeprecated</code></td>
<td>

```kotlin
KsDeclaration.annotations.any {
    it.annotationType.resolve()!!.declaration.qualifiedName!!.asString() == Deprecated::class.qualifiedName
}
```

</td>
    </tr>
    <tr>
        <td><code>overrides</code></td>
        <td><code>KSFunctionDeclaration.overrides</code> / <code>KSPropertyDeclaration.overrides</code> (各个类的成员函数)</td>
    </tr>
    <tr>
        <td><code>printElements</code></td>
        <td>KSP 对大多数类有基本的 <code>toString()</code> 实现</td>
    </tr>
</table>

### Types {id="type-operations"}

| **Java**           | **KSP 中的同等功能**                                                                       |
|--------------------|--------------------------------------------------------------------------------------|
| `asElement`        | `ksType.declaration`                                                                 |
| `asMemberOf`       | `resolver.asMemberOf`                                                                |
| `boxedClass`       | 不需要                                                                                  |
| `capture`          | 未决定                                                                                  |
| `contains`         | `KSType.isAssignableFrom`                                                            |
| `directSuperTypes` | `(ksType.declaration as KSClassDeclaration).superTypes`                              |
| `erasure`          | `ksType.starProjection()`                                                            |
| `getArrayType`     | `ksBuiltIns.arrayType.replace(...)`                                                  |
| `getDeclaredType`  | `ksClassDeclaration.asType`                                                          |
| `getNoType`        | `ksBuiltIns.nothingType` / `null`                                                    |
| `getNullType`      | 根据上下文确定, 可能可以使用 `KSType.markNullable`                                                |
| `getPrimitiveType` | 不需要, 检查 `KSBuiltins`                                                                 |
| `getWildcardType`  | 在需要 `KSTypeArgument` 的地方使用 `Variance`                                                |
| `isAssignable`     | `ksType.isAssignableFrom`                                                            |
| `isSameType`       | `ksType.equals`                                                                      |
| `isSubsignature`   | `functionTypeA == functionTypeB` / `functionTypeA == functionTypeB.starProjection()` |
| `isSubtype`        | `ksType.isAssignableFrom`                                                            |
| `unboxedType`      | 不需要                                                                                  |
