import { createConnection } from "typeorm";
import { startServer } from './app'
import { startWorkers } from './workers'


createConnection().then(connection => {
    startServer(connection)
    setTimeout(() => startWorkers(), 3000)
})
    .catch(err => {
        console.log(err)
    })