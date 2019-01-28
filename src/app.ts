import "reflect-metadata";
import * as restify from 'restify'
import { createConnection } from "typeorm";
import { seeding } from './seeds';
import { userRouter, monitoredEndPointRouter, monitoringResultRouter } from './routes'

export const startServer = (connection) => {
    seeding(connection)
    const server = restify.createServer()
    server.use(restify.plugins.acceptParser(server.acceptable));
    server.use(restify.plugins.queryParser());
    server.use(restify.plugins.bodyParser());
    server.pre(restify.plugins.pre.sanitizePath());
    server.listen(8080, () => {
        console.log('%s listening at %s', server.name, server.url);
        userRouter.applyRoutes(server)
        monitoredEndPointRouter.applyRoutes(server)
        monitoringResultRouter.applyRoutes(server)
        server.get('/', (req: restify.Request, res: restify.Response, next: restify.Next): void => {
            res.send('<p> Hello </p>')
        })
    })
}









