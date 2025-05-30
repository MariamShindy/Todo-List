import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// Set up adapter for JSON file storage
const adapter = new JSONFile('db.json')

// Initialize LowDB with a default structure
const db = new Low(adapter, { tasks: [] }) 

await db.read()

await db.write()

export default db //Exporting the database instance
