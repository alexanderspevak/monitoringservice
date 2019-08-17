"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var class_validator_1 = require("class-validator");
var MonitoredEndpoint_1 = require("./MonitoredEndpoint");
var User = /** @class */ (function () {
    function User() {
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        tslib_1.__metadata("design:type", Number)
    ], User.prototype, "id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ unique: true }),
        tslib_1.__metadata("design:type", String)
    ], User.prototype, "userName", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ unique: true }),
        class_validator_1.IsEmail(),
        tslib_1.__metadata("design:type", String)
    ], User.prototype, "email", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ unique: true }),
        tslib_1.__metadata("design:type", String)
    ], User.prototype, "accessToken", void 0);
    tslib_1.__decorate([
        typeorm_1.OneToMany(function (type) { return MonitoredEndpoint_1.MonitoredEndpoint; }, function (monitoredEndPoint) { return monitoredEndPoint.user; }),
        tslib_1.__metadata("design:type", Array)
    ], User.prototype, "monitoredEndPoints", void 0);
    User = tslib_1.__decorate([
        typeorm_1.Entity()
    ], User);
    return User;
}());
exports.User = User;
//# sourceMappingURL=User.js.map