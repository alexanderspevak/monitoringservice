"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typeorm_1 = require("typeorm");
var Service = /** @class */ (function () {
    function Service(entity) {
        this.entity = entity;
    }
    Service.prototype.setRepository = function () {
        this.repository = typeorm_1.getRepository(this.entity);
    };
    return Service;
}());
exports.Service = Service;
//# sourceMappingURL=Service.js.map