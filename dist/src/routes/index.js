"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify_router_1 = require("restify-router");
var controllers_1 = require("../controllers");
exports.router = new restify_router_1.Router();
exports.router.use(function (request, response, next) {
    response.header('Content-Type', 'application/json');
    next();
});
exports.router.use(controllers_1.loginMiddleWare);
exports.router.get('/monitoringresults', controllers_1.monitoringResultController.getMonitoredResults);
exports.router.get('/endpoints', controllers_1.monitoredEndpointController.showEndpoints);
exports.router.post('/createendpoint', controllers_1.monitoredEndpointController.saveEndpoint);
exports.router.put('/updateendpoint', controllers_1.monitoredEndpointController.updateEndpoint);
exports.router.del('/deleteendpoint', controllers_1.monitoredEndpointController.deleteEndpoint);
exports.router.get('/users', function (req, res) {
    res.send('hello users');
});
//# sourceMappingURL=index.js.map