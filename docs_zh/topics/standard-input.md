[//]: # (title: 标准输入(Standard Input))

> Java Scanner 是一个慢速的工具. 只有在你需要它提供的某种功能时, 才应该使用它.
> 否则, 通常应该使用 Kotlin 的 `readln()` 函数来 [读取标准输入](basic-syntax.md#read-from-the-standard-input).
>
{style="note"}

要读取标准输入(Standard Input), Java 提供了 `Scanner` 类. Kotlin 提供了两种主要的方法来读取标准输入:
`Scanner` 类, 类似于 Java, 以及 `readln()` 函数.

## 使用 Java Scanner 读取标准输入 {id="read-from-the-standard-input-with-java-scanner"}

在 Java 中, 通常通过 `System.in` 对象来访问标准输入. 你需要导入 `Scanner` 类,
创建一个对象, 然后使用 `.nextLine()` 和 `.nextInt()` 等方法来读取不同的数据类型:

```java
//Java 实现
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        // 从输入读取单行. 例如: Hi there!
        System.out.print("Enter a line: ");
        String line = scanner.nextLine();
        System.out.println("You entered: " + line);
        // 输出结果为: You entered: Hi there!

        // 读取一个整数. 例如: 08081990
        System.out.print("Enter an integer: ");
        int number = scanner.nextInt();
        System.out.println("You entered: " + number);
        // 输出结果为: You entered: 08081990

        scanner.close();
    }
}
```

### 在 Kotlin 中使用 Java Scanner {id="use-java-scanner-in-kotlin"}

由于 Kotlin 能够与 Java 库交互, 在 Kotlin 代码中你可以直接访问 Java Scanner.

要在 Kotlin 中使用 Java Scanner, 你需要导入 `Scanner` 类, 并初始化它,
传入一个 `System.in` 对象作为参数, 表示标准输入流, 并指定如何读取数据.
你可以使用 [可用的读取方法](https://docs.oracle.com/javase/8/docs/api/java/util/Scanner.html) 来从字符串中读取各种值,
例如 `.nextLine()`, `.next()`, 和 `.nextInt()`:

```kotlin
// 导入 Java Scanner
import java.util.Scanner

fun main() {
    // 初始化 Scanner
    val scanner = Scanner(System.`in`)

    // 读取整个字符串行. 例如: "Hello, Kotlin"
    val line = scanner.nextLine()
    print(line)
    // 输出结果为: Hello, Kotlin

    // 读取单个字符串. 例如: "Hello"
    val string = scanner.next()
    print(string)
    // 输出结果为: Hello

    // 读取一个数值. 例如: 123
    val num = scanner.nextInt()
    print(num)
    // 输出结果为: 123
}
```

使用 Java Scanner 的其它有用的读取输入的方法有 `.hasNext()`, `.useDelimiter()`, 和 `.close()`:

* `.hasNext()`
  方法检查输入中是否还有更多可读取的数据.
  如果存在更多数据, 它会返回布尔值 `true`, 如果输入中没有更多数据, 返回 `false`.

* `.useDelimiter()`
  方法设置读取输入元素时的分隔符. 分隔符默认为空格, 但你也可以指定使用其它字符.
  例如, `.useDelimiter(",")` 会从输入中读取逗号分隔的元素.

* `.close()`
  方法关闭与 Scanner 关联的输入流, 之后就不能再使用 Scanner 读取输入了.

> 当你使用完毕 Java Scanner 时, 一定要使用 `.close()` 方法.
> 关闭 Java Scanner 会释放它消耗的资源, 并确保程序动作正确.
>
{style="note"}

## 使用 readln() 读取标准输入 {id="read-from-the-standard-input-with-readln"}

在 Kotlin 中, 除了 Java Scanner 之外, 你还可以使用 `readln()` 函数. 这是读取输入的最直接的方式.
这个函数从标准输入读取一行文字, 并返回为一个字符串:

```kotlin
// 读取一个字符串. 例如: Charlotte
val name = readln()

// 读取一个字符串, 并转换为整数. 例如: 43
val age = readln().toInt()

println("Hello, $name! You are $age years old.")
// 输出结果为: Hello, Charlotte! You are 43 years old.
```

更多详情请参见 [读取标准输入](read-standard-input.md).
