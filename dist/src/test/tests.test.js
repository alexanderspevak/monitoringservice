"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var request_1 = require("./request");
describe('get endpoints', function () {
    it('get endpoints without authorization,should be 401', function () { return tslib_1.__awaiter(_this, void 0, void 0, function () {
        var res;
        return tslib_1.__generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, request_1.request('')];
                case 1:
                    res = _a.sent();
                    console.log('response is this', res);
                    return [2 /*return*/];
            }
        });
    }); });
});
// it('get endpoints with authorization,should be 200', () => {
//   return requester.get('/endpoints')
//     .set('accesstoken', 'dcb20f8a-5657-4f1b-9f7f-ce65739b359e')
//     .then((res) => {
//       expect(res).to.have.status(200)
//       expect(res).to.be.json
//     })
// })
// let id: number
// describe('CRUD endpoints', async () => {
//   await it('create endpoint without authorization,should be 401', () => {
//     return requester.post('/createendpoint')
//       .send({
//         name: 'yahoo',
//         url: 'yahoo.com',
//         monitoredInterval: 10,
//       })
//       .then((res) => {
//         expect(res).to.have.status(401)
//       })
//   })
//
//   await it('create endpoint with authorization,should be 200', async () => {
//     return await requester.post('/createendpoint')
//       .set('accesstoken', 'dcb20f8a-5657-4f1b-9f7f-ce65739b359e')
//       .send({
//         name: 'yahoo',
//         url: 'www.yahoo.com',
//         monitoredInterval: 15,
//       })
//       .then((res) => {
//         id = res.body.id
//         expect(res).to.have.status(200)
//         expect(res).to.be.json
//         expect(res.body).to.have.property('name', 'yahoo')
//         expect(res.body).to.have.property('url', 'www.yahoo.com')
//         expect(res.body).to.have.property('monitoredInterval', 15)
//       })
//       .catch(err=>console.log(err))
//   });
//
//   await it('update endpoint with authorization,should be 200', () => {
//     return requester.put('/updateendpoint')
//       .send({
//         id: id,
//         name: 'yahoo',
//         url: 'www.yahoo.com',
//         monitoredInterval: 20
//       })
//       .set('accesstoken', 'dcb20f8a-5657-4f1b-9f7f-ce65739b359e')
//       .then((res) => {
//         expect(res).to.have.status(200)
//         expect(res.body).to.be.json
//         expect(res.body).to.have.property('monitoredInterval', 20)
//       })
//       .catch(err=>console.log(err))
//   })
//
//   await it('update endpoint with bad authorization,should be 400', () => {
//     return requester.put('/updateendpoint')
//       .set('accesstoken', '93f39e2f-80de-4033-99ee-249d92736a25')
//       .send({
//         name: 'yahoo',
//         url: 'www.yahoo.com',
//         monitoredInterval: 15,
//         id: id
//       })
//       .then((res) => {
//         expect(res).to.have.status(400)
//         expect(res.body).to.have.property('monitoredInterval', 15)
//       })
//       .catch(err => console.log(err))
//   })
//
//   await it('delete created endpoint with bad authorization,should be 400', () => {
//     return requester.del(`/deleteendpoint?=${id}`)
//       .set('accesstoken', '93f39e2f-80de-4033-99ee-249d92736a25')
//       .send({
//         id: id
//       })
//       .then((res) => {
//         expect(res).to.have.status(400)
//       })
//       .catch(err=>console.log(err))
//   })
//
//   await it('delete created endpoint with  authorization,should be 200', () => {
//     return requester.del(`/deleteendpoint?id=${id}`)
//       .set('accesstoken', 'dcb20f8a-5657-4f1b-9f7f-ce65739b359e')
//       .send({
//         id: id
//       })
//       .then((res) => {
//         expect(res).to.have.status(200)
//       })
//       .catch((err) => console.log('deleteendpoint',err))
//   })
//
// })
//# sourceMappingURL=tests.test.js.map