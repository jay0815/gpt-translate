import { join } from 'node:path'
import { cwd } from 'node:process'
import { Low } from 'lowdb'
import { I18nJson, JSONFile } from '../adapter/json.js'

const main = async () => {
    const _dirname = cwd();

    const file = join(_dirname, 'src', 'db', 'en.json')

    const adapter = new JSONFile(file)
    const defaultData = {} as I18nJson;
    const db = new Low(adapter, defaultData)

    await db.read()
    db.data.close = 'hello world';

    await db.write();
    await db.read();
}

main();