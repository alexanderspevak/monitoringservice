import { createConnection } from "typeorm";
import {startServer} from './app'
import {startWorkers} from './workers'
require('dotenv').config()

createConnection().then(connection => {
    startServer(connection)
    process.nextTick(_=>startWorkers())
})