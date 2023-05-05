# gpt-translate

Simple Translate App with OpenAI gpt api 

## System Design

### Relation

> Create a Chinese index JSON file that stores all translated texts, and check if a corresponding translation exists by reading this file

```typescript

/**
 * core
 **/

type Lang = string;

interface IndexJsonFile {
    [copyWriting: string]?: {
        lang: Lang;
        index: number;
    }[];
}

/**
 * Relationship between application and copywriting
 **/

interface AppCWsFile {
    [app: string]?: keyof IndexJsonFile[];
}

```

### CopyWriting
> Considering the performance limitations of Steno, split specific languages into files less than 100MB, with the split rule as {language}-{index}.json

```typescript

type CN = string;
type I18n = string;

/**
 * file structure
 * 
 * fileName: {I18n}-{index}.json
 * 
 **/

interface CopyWritingFile {
    [text: CN]?: I18n;
}

```

### Complete logical chain for Translate

```mermaid
graph LR
    Input(Input the list of text to be translated)--> Check(Check if the text to be translated exists) 
    Check --> Exist(Exists) --> Ignore[Ignore]
    Check --> NotExist(Not exists) --> GPT(AI Translation)
    GPT --> LangChain(Generate the request text based on the pre-built Prompt) --> Parser(Parse the API response format)
    Parser --> Write[Write to JSON]
```

### Complete logical chain for Generator I18n File

```mermaid
graph LR
    Input(Input the application name)--> GetCWs(Get all copywritings under the current application) 
    GetCWs --> GetCWsFile(Get the corresponding storage file of all copywritings) 
    GetCWsFile --> Set(Deduplicate based on language and index)
    Set --> GetFileHandler(Get the handler of the corresponding file) --> Temp(Create a temporary folder)
    Temp --> Group(Generate I18n files based on language)
    Group --> Group
    Group --> Send(Send files under Temp back to the client)
    Send --> End[Clean up Temp]
```