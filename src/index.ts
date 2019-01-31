import { createConnection } from "typeorm";
import {startServer} from './app'
import {startWorkers} from './workers'


createConnection().then(connection => {
    startWorkers()
     startServer(connection)
})
.catch(err=>{
    console.log(err)
})