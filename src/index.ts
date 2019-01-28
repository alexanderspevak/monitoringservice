import { createConnection } from "typeorm";
import {startServer} from './app'
import {startWorkers} from './workers'

createConnection().then(connection => {
    startServer(connection)
    startWorkers()
})