
// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />
import * as chai from 'chai'
const expect = chai.expect


chai.use(require('chai-http'))
var requester = chai.request('http://localhost:8080/').keepOpen()

describe('get endpoints', async () => {
   await it("get endpoints without authorization,should be 401", () => {
        return requester.get('/endpoints')
            .then((res) => {
                expect(res).to.have.status(401)

            })
    })
    it("get endpoints with authorization,should be 200", () => {
        return requester.get('/endpoints')
            .set("accesstoken", "dcb20f8a-5657-4f1b-9f7f-ce65739b359e")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res).to.be.json
            })
    })
})