"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var MonitoredEndpoint_1 = require("./MonitoredEndpoint");
var MonitoringResult = /** @class */ (function () {
    function MonitoringResult() {
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        tslib_1.__metadata("design:type", Number)
    ], MonitoringResult.prototype, "id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", Number)
    ], MonitoringResult.prototype, "httpCode", void 0);
    tslib_1.__decorate([
        typeorm_1.CreateDateColumn(),
        tslib_1.__metadata("design:type", Date)
    ], MonitoringResult.prototype, "dateOfCheck", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ type: 'longtext' }),
        tslib_1.__metadata("design:type", String)
    ], MonitoringResult.prototype, "payload", void 0);
    tslib_1.__decorate([
        typeorm_1.ManyToOne(function (type) { return MonitoredEndpoint_1.MonitoredEndpoint; }, function (monitoredEndPoint) { return monitoredEndPoint.monitoringResult; }, { nullable: false, onDelete: 'CASCADE' }),
        tslib_1.__metadata("design:type", MonitoredEndpoint_1.MonitoredEndpoint)
    ], MonitoringResult.prototype, "monitoredEndPoint", void 0);
    MonitoringResult = tslib_1.__decorate([
        typeorm_1.Entity()
    ], MonitoringResult);
    return MonitoringResult;
}());
exports.MonitoringResult = MonitoringResult;
//# sourceMappingURL=MonitoringResult.js.map