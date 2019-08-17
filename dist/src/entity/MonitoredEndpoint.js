"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var typeorm_1 = require("typeorm");
var User_1 = require("./User");
var MonitoringResult_1 = require("./MonitoringResult");
var class_validator_1 = require("class-validator");
var IsUrl = /** @class */ (function () {
    function IsUrl() {
    }
    IsUrl.prototype.validate = function (url, args) {
        var pattern = new RegExp('^(https?:\\/\\/)?' +
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' +
            '((\\d{1,3}\\.){3}\\d{1,3}))' +
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' +
            '(\\?[;&amp;a-z\\d%_.~+=-]*)?' +
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(url);
    };
    IsUrl.prototype.defaultMessage = function (args) {
        return 'Url is not valid';
    };
    IsUrl = tslib_1.__decorate([
        class_validator_1.ValidatorConstraint({ name: 'isUrl', async: false })
    ], IsUrl);
    return IsUrl;
}());
var MonitoredEndpoint = /** @class */ (function () {
    function MonitoredEndpoint() {
    }
    tslib_1.__decorate([
        typeorm_1.PrimaryGeneratedColumn(),
        tslib_1.__metadata("design:type", Number)
    ], MonitoredEndpoint.prototype, "id", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        tslib_1.__metadata("design:type", String)
    ], MonitoredEndpoint.prototype, "name", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        class_validator_1.Validate(IsUrl),
        tslib_1.__metadata("design:type", String)
    ], MonitoredEndpoint.prototype, "url", void 0);
    tslib_1.__decorate([
        typeorm_1.Column(),
        class_validator_1.Max(60),
        class_validator_1.Min(5),
        tslib_1.__metadata("design:type", Number)
    ], MonitoredEndpoint.prototype, "monitoredInterval", void 0);
    tslib_1.__decorate([
        typeorm_1.CreateDateColumn(),
        tslib_1.__metadata("design:type", Date)
    ], MonitoredEndpoint.prototype, "dateOfCreation", void 0);
    tslib_1.__decorate([
        typeorm_1.Column({ nullable: true }),
        tslib_1.__metadata("design:type", Date)
    ], MonitoredEndpoint.prototype, "dateOfLastCheck", void 0);
    tslib_1.__decorate([
        typeorm_1.ManyToOne(function (type) { return User_1.User; }, function (user) { return user.monitoredEndPoints; }, { nullable: false, onDelete: 'CASCADE' }),
        tslib_1.__metadata("design:type", Object)
    ], MonitoredEndpoint.prototype, "user", void 0);
    tslib_1.__decorate([
        typeorm_1.OneToMany(function (type) { return MonitoringResult_1.MonitoringResult; }, function (monitoringResult) { return monitoringResult.monitoredEndPoint; }),
        tslib_1.__metadata("design:type", Array)
    ], MonitoredEndpoint.prototype, "monitoringResult", void 0);
    MonitoredEndpoint = tslib_1.__decorate([
        typeorm_1.Unique(['user', 'url']),
        typeorm_1.Entity()
    ], MonitoredEndpoint);
    return MonitoredEndpoint;
}());
exports.MonitoredEndpoint = MonitoredEndpoint;
//# sourceMappingURL=MonitoredEndpoint.js.map