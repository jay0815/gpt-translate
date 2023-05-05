import { Adapter, SyncAdapter } from 'lowdb';
import { AsyncFile, SyncFile } from './file.js';

export interface I18nJson {
  [key: string]: string;
}

export class JSONFile implements Adapter<I18nJson> {
  #adapter: AsyncFile

  constructor(filename: string) {
    this.#adapter = new AsyncFile(filename)
  }

  async read(): Promise<I18nJson | null> {
    const data = await this.#adapter.read()
    if (data === null) {
      return null
    } else {
      return JSON.parse(data) as I18nJson
    }
  }

  write(obj: I18nJson): Promise<void> {
    return this.#adapter.write(JSON.stringify(obj, null, 2))
  }
}

export class JSONFileSync implements SyncAdapter<I18nJson> {
  #adapter: SyncFile

  constructor(filename: string) {
    this.#adapter = new SyncFile(filename)
  }

  read(): I18nJson | null {
    const data = this.#adapter.read()
    if (data === null) {
      return null
    } else {
      return JSON.parse(data) as I18nJson
    }
  }

  write(obj: I18nJson): void {
    this.#adapter.write(JSON.stringify(obj, null, 2))
  }
}