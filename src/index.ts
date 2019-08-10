import { createConnection } from 'typeorm'
import { Server } from './app'
import { startWorkers } from './workers'
import { UserSeeding } from './seeds/user'

const startApp = async () => {
  try {
    const connection = await createConnection()
    const server = new Server([new UserSeeding(connection)])
    await server.start()
    setTimeout(() => startWorkers(), 3000)
  } catch (e) {
    console.log(e)
  }
}

startApp()
