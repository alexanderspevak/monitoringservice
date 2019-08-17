"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var config = require('config');
var http = require('http');
function request(url) {
    return new Promise(function (resolve) {
        var home = config.get('httpAddress');
        console.log('home', home);
        http.get({ path: "" + config.get('httpAddress') + url }, function (response) {
            console.log('response', response);
            var data = '';
            response.on('data', function (_data) { return (data += _data); });
            response.on('end', function () { return resolve(data); });
        });
    });
}
exports.request = request;
//# sourceMappingURL=request.js.map