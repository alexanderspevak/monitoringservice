"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ControllerClass = /** @class */ (function () {
    function ControllerClass(service) {
        this.handleServerError = function (error, res) {
            res.status(500);
            res.send(error);
        };
        this.service = service;
    }
    return ControllerClass;
}());
exports.ControllerClass = ControllerClass;
//# sourceMappingURL=ControllerClass.js.map