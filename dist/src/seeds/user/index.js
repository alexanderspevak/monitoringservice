"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var entity_1 = require("../../entity");
var seeds_1 = require("./seeds");
var Seeder_1 = require("../Seeder");
var UserSeeding = /** @class */ (function (_super) {
    tslib_1.__extends(UserSeeding, _super);
    function UserSeeding(connection) {
        var _this = _super.call(this) || this;
        _this.seeds = seeds_1.seeds;
        _this.repository = connection.getRepository(entity_1.User);
        return _this;
    }
    return UserSeeding;
}(Seeder_1.Seeder));
exports.UserSeeding = UserSeeding;
//# sourceMappingURL=index.js.map