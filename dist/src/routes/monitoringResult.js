"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var restify_router_1 = require("restify-router");
var controllers_1 = require("../controllers");
exports.monitoringResultRouter = new restify_router_1.Router();
exports.monitoringResultRouter.use(controllers_1.loginMiddleWare);
exports.monitoringResultRouter.get('/monitoringresults', controllers_1.monitoringResultController.getMonitoredResults);
//# sourceMappingURL=monitoringResult.js.map