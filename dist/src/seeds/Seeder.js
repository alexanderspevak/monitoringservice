"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var Seeder = /** @class */ (function () {
    function Seeder() {
        this.seeds = [];
    }
    Seeder.prototype.saveSeeds = function () {
        var _this = this;
        return Promise.all(this.seeds.map(function (seed) { return tslib_1.__awaiter(_this, void 0, void 0, function () {
            var savedSeed;
            return tslib_1.__generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.repository.findOne(seed)];
                    case 1:
                        savedSeed = _a.sent();
                        if (!!savedSeed) return [3 /*break*/, 3];
                        return [4 /*yield*/, this.repository.save(seed)];
                    case 2:
                        savedSeed = _a.sent();
                        _a.label = 3;
                    case 3: return [2 /*return*/, savedSeed];
                }
            });
        }); }));
    };
    return Seeder;
}());
exports.Seeder = Seeder;
//# sourceMappingURL=Seeder.js.map