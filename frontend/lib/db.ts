import { Low } from "lowdb"
import { JSONFile } from "lowdb/node"
import path from "path"

type Endpoint = {
  method: string
  path: string
  description: string
  mockResponse: any
}

type Mock = {
  id: string
  createdAt: string
  schema: string
  endpoints: Endpoint[]
}

type Data = {
  mocks: Mock[]
}

const file = path.join(process.cwd(), "data/db.json")
const adapter = new JSONFile<Data>(file)
const defaultData: Data = { mocks: [] }
const db = new Low<Data>(adapter, defaultData)

export async function getDb() {
  await db.read()
  db.data ||= defaultData
  return db
}

export type { Mock, Endpoint }