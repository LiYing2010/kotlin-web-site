[//]: # (title: 在 Kotlin 项目中使用注解处理器)

<tldr>

* 对以下情况, 请使用 **[kapt](kapt.md)**:
  * 你有一个 Maven 项目.
  * 你有一个 Gradle 项目, 但需要的 Java 注解处理器还不支持 KSP. [查看支持的库列表](ksp-overview.md#supported-libraries).
* 对以下情况, 请使用 **[KSP](ksp-overview.md)**:
  * 你有一个 Gradle 项目, 并且需要的 Java 注解处理器支持 KSP.
  * 你希望创建自己的注解处理器.

</tldr>

注解处理器在编译期间分析你的源代码, 以生成样板代码, 验证用法, 或生成其他构件(artifact).
Kotlin 支持两种方式来使用注解处理器:

* [kapt 编译器 plugin](#use-kapt-with-java-annotation-processors),
  工作方式是, 从 Kotlin 源代码生成桩(stub)文件, 然后在这些桩(stub)上运行 Java 注解处理器.
  这个额外的桩(stub)生成步骤会使构建时间变慢, 同时意味着 kapt 无法理解 Kotlin 特有的构造, 
  例如 [扩展函数](extensions.md) 或 [null 安全](null-safety.md).

  kapt 同时支持 Maven 和 Gradle. 推荐用于所有的 Maven 项目,
  以及那些使用尚未采用 KSP 的处理器库的 Gradle 项目, 例如 [MapStruct](https://mapstruct.org/).

* [KSP 框架](#use-ksp-in-gradle-projects),
  通过 Kotlin 优先的 API 直接读取 Kotlin 源代码, 不需要生成桩.
  它能够原生的理解 Kotlin 特有的功能, 构建速度比 kapt 更快.

  目前, KSP 只对 Gradle 提供官方支持.
  推荐用于编写自己的处理器, 以及与支持 KSP 的库 (例如 [Dagger](https://dagger.dev/)) 配合使用.

## 配合使用 kapt 与 Java 注解处理器 {id="use-kapt-with-java-annotation-processors"}

[kapt](kapt.md) 让你能够在 Kotlin 项目中使用既有的 Java 注解处理器, 不需要对处理器本身做任何修改.

下面的示例演示如何使用 [MapStruct](https://mapstruct.org/) 注解处理器.
MapStruct 会在编译期间生成 Java Bean 之间类型安全的 mapper 实现.

1. 在你的构建文件中, 应用 `kapt` plugin, 并将 MapStruct 添加到 `dependencies` 部分:

   <tabs group="build-tool">
   <tab title="Maven" group-key="maven">

   ```xml
   <properties>
       <kotlin.compiler.jvmTarget>11</kotlin.compiler.jvmTarget>
       <mapstruct.version>1.6.3</mapstruct.version>
   </properties>

   <dependencies>
       <dependency>
           <groupId>org.mapstruct</groupId>
           <artifactId>mapstruct</artifactId>
           <version>${mapstruct.version}</version>
       </dependency>
   </dependencies>

   <plugin>
       <groupId>org.jetbrains.kotlin</groupId>
       <artifactId>kotlin-maven-plugin</artifactId>
       <version>${kotlin.version}</version>
       <extensions>true</extensions>
       <executions>
           <execution>
               <id>kapt</id>
               <goals>
                   <goal>kapt</goal>
               </goals>
               <configuration>
                   <sourceDirs>
                       <sourceDir>src/main/kotlin</sourceDir>
                       <sourceDir>src/main/java</sourceDir>
                   </sourceDirs>
                   <aptMode>stubs</aptMode>
                   <annotationProcessorPaths>
                       <annotationProcessorPath>
                           <groupId>org.mapstruct</groupId>
                           <artifactId>mapstruct-processor</artifactId>
                           <version>${mapstruct.version}</version>
                       </annotationProcessorPath>
                   </annotationProcessorPaths>
               </configuration>
           </execution>
       </executions>
   </plugin>
   ```

   * 将来自 `kotlin-maven-plugin` 的 `kapt` goal 的执行, 添加到 `compile` 执行 **之前**.
   * 使用 `aptMode` 选项, 配置 [注解处理级别](kapt.md#use-in-maven).

   </tab>
   <tab title="Gradle Kotlin" group-key="kotlin">

   ```kotlin
   plugins {
       kotlin("kapt") version "%kotlinVersion%"
   }

   dependencies {
       implementation("org.mapstruct:mapstruct:1.6.3")
       kapt("org.mapstruct:mapstruct-processor:1.6.3")
   }
   ```

   </tab>
   <tab title="Gradle Groovy" group-key="groovy">

   ```groovy
   plugins {
       id "org.jetbrains.kotlin.kapt" version "%kotlinVersion%"
   }

   dependencies {
       implementation "org.mapstruct:mapstruct:1.6.3"
       kapt "org.mapstruct:mapstruct-processor:1.6.3"
   }
   ```

   </tab>
   </tabs>

2. 定义你的数据类和 mapper 接口:

   ```kotlin
   import org.mapstruct.Mapper
   import org.mapstruct.factory.Mappers

   data class UserDto(val id: Long, val firstName: String, val lastName: String)

   data class UserEntity(val id: Long, val firstName: String, val lastName: String)

   @Mapper
   interface UserMapper {
       fun toDto(entity: UserEntity): UserDto
       fun toEntity(dto: UserDto): UserEntity

       companion object : UserMapper by Mappers.getMapper(UserMapper::class.java)
   }
   ```

3. 构建项目. MapStruct 会在生成的源代码目录中生成 `UserMapperImpl` 类.
   使用 `UserMapper` 同伴对象来调用生成的实现:

   ```kotlin
   fun main() {
       val entity = UserEntity(id = 1L, firstName = "John", lastName = "Doe")
       val dto = UserMapper.toDto(entity)
       println(dto)
       // 输出结果为: UserDto(id=1, firstName=John, lastName=Doe)
   }
   ```

## 在 Gradle 项目中使用 KSP {id="use-ksp-in-gradle-projects"}

使用 [KSP](ksp-overview.md), 你可以在 Gradle 项目中使用既有的注解处理器,
也可以创建自己的处理器, 根据源代码中的注解来生成代码.

### 配合使用 KSP 与 Java 注解处理器 {id="use-ksp-with-java-annotation-processors"}

对于 Gradle 项目, 请将 KSP 与兼容的注解处理器配合使用.
KSP 比 kapt 更快, 并且能够原生理解 Kotlin 特有的功能.
请查看 [已支持 KSP 的库列表](ksp-overview.md#supported-libraries).

下面的示例演示如何使用 [Dagger](https://dagger.dev/), 这是一个编译期间依赖注入框架, 它根据依赖图生成连接代码.

1. 在你的 `build.gradle(.kts)` 文件中, 应用 KSP plugin, 并将 Dagger 添加到 `dependencies` 代码块:

   <tabs group="build-script">
   <tab title="Kotlin" group-key="kotlin">

   ```kotlin
   // build.gradle.kts

   plugins {
       kotlin("jvm") version "%kotlinVersion%"
       id("com.google.devtools.ksp") version "%kspVersion%"
   }

   dependencies {
       implementation("com.google.dagger:dagger:2.59.2")
       ksp("com.google.dagger:dagger-compiler:2.59.2")
   }
   ```

   </tab>
   <tab title="Groovy" group-key="groovy">

   ```groovy
   // build.gradle

   plugins {
       id 'org.jetbrains.kotlin.jvm' version '%kotlinVersion%'
       id 'com.google.devtools.ksp' version '%kspVersion%'
   }

   dependencies {
       implementation 'com.google.dagger:dagger:2.59.2'
       ksp 'com.google.dagger:dagger-compiler:2.59.2'
   }
   ```

   </tab>
   </tabs>

   > 要查找 KSP 的最新版本, 请查看 GitHub 上的 [Releases](https://github.com/google/ksp/releases) 页面.
   >
   {style="tip"}

2. 使用 Dagger 注解, 对你的 Kotlin 类进行标注:

   ```kotlin
   import javax.inject.Inject
   import javax.inject.Singleton
   import dagger.Component
   import dagger.Module
   import dagger.Provides

   @Singleton
   class UserRepository @Inject constructor() {
       fun getUser(): String = "John Doe"
   }

   @Module
   class AppModule {
       @Provides
       @Singleton
       fun provideUserRepository(): UserRepository = UserRepository()
   }

   @Singleton
   @Component(modules = [AppModule::class])
   interface AppComponent {
       fun userRepository(): UserRepository
   }
   ```

3. 构建项目. Dagger 会在 `build/generated/ksp` 目录中生成实现类, 例如 `DaggerAppComponent`.
   在你的代码中使用生成的类:

   ```kotlin
   fun main() {
       val appComponent = DaggerAppComponent.create()
       val userRepository = appComponent.userRepository()
       println("User: ${userRepository.getUser()}")
       // 输出结果为: User: John Doe
   }
   ```

关于 Dagger 对 KSP 的支持, 详情请参见它的 [文档](https://dagger.dev/dev-guide/ksp.html).

### 创建你自己的注解处理器 {id="create-your-own-annotation-processor"}

你可以使用 KSP API 编写自己的注解处理器, 在编译期间生成代码.
一个新的处理器需要 3 个模块:

* 一个 `annotation` 模块, 用于声明自定义注解.
* 一个 `processor` 模块, 用于实现 `SymbolProcessor` 和 `SymbolProcessorProvider` 工厂类.
  `SymbolProcessor` 包含主逻辑, `SymbolProcessorProvider` 创建处理器, 并在 `META-INF/services/` 路径下注册 provider.
* 一个 `app` 模块, 用于应用 KSP plugin, 依赖于处理器, 并使用注解.

关于完整的逐步说明, 请参见 [KSP 快速入门](ksp-quickstart.md#create-your-own-processor).

## 下一步做什么? {id="what-s-next"}

* [了解 kapt 配置](kapt.md)
* [开始使用 KSP](ksp-quickstart.md)
* [了解如何从 kapt 迁移到 KSP](ksp-kapt-migration.md)
