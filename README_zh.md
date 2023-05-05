# gpt-translate

使用 OpenAI GPT API 的简单翻译应用

## 系统设计

### 关系

> 创建一个中文索引 JSON 文件，存储所有翻译文本，并通过读取该文件来检查是否存在相应的翻译。

```typescript

/**
 * 核心
 **/

type Lang = string;

interface IndexJsonFile {
    [copyWriting: string]?: {
        lang: Lang;
        index: number;
    }[];
}

/**
 * 应用和文案之间的关系
 **/

interface AppCWsFile {
    [app: string]?: keyof IndexJsonFile[];
}

```

### 文案

> 考虑到 Steno 的性能限制，将特定语言拆分为小于 100MB 的文件，拆分规则为 {language}-{index}.json。

```typescript

type CN = string;
type I18n = string;

/**
 * 文件结构
 * 
 * 文件名：{I18n}-{index}.json
 * 
 **/

interface CopyWritingFile {
    [text: CN]?: I18n;
}

```

### 完整的翻译逻辑链路

```mermaid
graph LR
    Input(输入待翻译的文本列表)--> Check(检查待翻译的文本是否存在) 
    Check --> Exist(存在) --> Ignore[忽略]
    Check --> NotExist(不存在) --> GPT(AI翻译)
    GPT --> LangChain(根据预制Prompt生成请求文本) --> Parser(解析API返回格式)
    Parser --> Write[写入JSON]
```

### 完整的生成 I18n 文件的逻辑链路

```mermaid
graph LR
    Input(输入应用名称)--> GetCWs(获取当前应用下的所有文案) 
    GetCWs --> GetCWsFile(获取所有文案的对应存储文件) 
    GetCWsFile --> Set(根据语言 + 索引进行去重)
    Set --> GetFileHandler(获取对应文件的 handler) --> Temp(创建临时文件夹)
    Temp --> Group(根据语言生成I18n文件)
    Group --> Group
    Group --> Send(回传Temp下的文件给客户端)
    Send --> End[清理Temp]
``` 