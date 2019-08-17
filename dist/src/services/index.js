"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MonitoredEndpointService_1 = require("./MonitoredEndpointService");
exports.monitoredEndpointService = MonitoredEndpointService_1.monitoredEndpointService;
exports.MonitoredEndpointService = MonitoredEndpointService_1.MonitoredEndpointService;
var MonitoringResultService_1 = require("./MonitoringResultService");
exports.monitoringResultService = MonitoringResultService_1.monitoringResultService;
exports.MonitoringResultService = MonitoringResultService_1.MonitoringResultService;
var Service_1 = require("./Service");
exports.Service = Service_1.Service;
var setRepositories = function () {
    MonitoredEndpointService_1.monitoredEndpointService.setRepository();
    MonitoringResultService_1.monitoringResultService.setRepository();
};
exports.setRepositories = setRepositories;
//# sourceMappingURL=index.js.map