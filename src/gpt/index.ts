import { PromptTemplate } from "langchain";
import { OpenAI } from "langchain/llms/openai";

const model = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 0.9 });

// 以下内容以|为分割,将其翻译为zh-CN, en-US, id-ID语言
// """应付商家分润-VAT税费|应付商家分润-PPH23|JSON 格式|不是合法的 Json 格式|仅在该账户为线下结算使用时,才需填写此id,用于发起tin类OA流程|长度限制999|业务场景|清介完成时闫|清分失败原因|清分结果|费用方向|费用金额|敢值范国为-∞0-100"""
// 以JSON格式返回, 具体返回格式如下:
// en-US: {
//     "应付商家分润": "VAT",
// }

const GPT = async (copywriting: string[], language: string[]) => {
    const template = `
    以下内容以|为分割,将其翻译为{language}语言
    """{copywriting}"""
    以JSON格式返回, 具体返回格式如下:
    en-US: {
        "应付商家分润": "VAT",
    }
    `;
    const prompt = new PromptTemplate({
        template: template,
        inputVariables: ["language", "copywriting"],
    });
    const question = await prompt.format({ copywriting: copywriting.join("|"), language: language.join(",") });
    const res = await model.call(question);
    console.log(res)
    return res;
}

export default GPT;