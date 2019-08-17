"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify_router_1 = require("restify-router");
var controllers_1 = require("../controllers");
exports.monitoredEndPointRouter = new restify_router_1.Router();
exports.monitoredEndPointRouter.use(controllers_1.loginMiddleWare);
exports.monitoredEndPointRouter.get('/endpoints', controllers_1.monitoredEndpointController.showEndpoints);
exports.monitoredEndPointRouter.post('/createendpoint', controllers_1.monitoredEndpointController.saveEndpoint);
exports.monitoredEndPointRouter.put('/updateendpoint', controllers_1.monitoredEndpointController.updateEndpoint);
exports.monitoredEndPointRouter.del('/deleteendpoint', controllers_1.monitoredEndpointController.deleteEndpoint);
//# sourceMappingURL=monitoredEndPoint.js.map