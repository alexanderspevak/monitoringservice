
// Reference mocha-typescript's global definitions:
/// <reference path="../node_modules/mocha-typescript/globals.d.ts" />
import * as chai from 'chai';


const expect = chai.expect
chai.use(require('chai-http'))
var requester = chai.request('http://localhost:8080')


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

let id: number;
describe('CRUD endpoints', async () => {
    await it("create endpoint without authorization,should be 401", () => {
        return requester.post('/createendpoint')
            .send({
                name: 'yahoo',
                url: 'yahoo.com',
                monitoredInterval: 10,
            })
            .then((res) => {
                expect(res).to.have.status(401)
            })
    })

    await it("create endpoint with authorization,should be 200", async () => {
        return await requester.post('/createendpoint')
            .set("accesstoken", "dcb20f8a-5657-4f1b-9f7f-ce65739b359e")
            .send({
                name: 'yahoo',
                url: 'www.yahoo.com',
                monitoredInterval: 15,
            })
            .then((res) => {
                id = res.body.id
                expect(res).to.have.status(200)
                expect(res).to.be.json
                expect(res.body).to.have.property('name', 'yahoo')
                expect(res.body).to.have.property('url', 'www.yahoo.com')
                expect(res.body).to.have.property('monitoredInterval', 15)
            })
            .catch(err=>console.log(err))
    });

    await it("update endpoint with authorization,should be 200", () => {
        return requester.put('/updateendpoint')
            .send({
                id: id,
                name: 'yahoo',
                url: 'www.yahoo.com',
                monitoredInterval: 20
            })
            .set("accesstoken", "dcb20f8a-5657-4f1b-9f7f-ce65739b359e")
            .then((res) => {
                expect(res).to.have.status(200)
                expect(res.body).to.be.json
                expect(res.body).to.have.property('monitoredInterval', 20)
            })
            .catch(err=>console.log(err))
    })

    await it("update endpoint with bad authorization,should be 400", () => {
        return requester.put('/updateendpoint')
            .set("accesstoken", "93f39e2f-80de-4033-99ee-249d92736a25")
            .send({
                name: 'yahoo',
                url: 'www.yahoo.com',
                monitoredInterval: 15,
                id: id
            })
            .then((res) => {
                expect(res).to.have.status(400)
                expect(res.body).to.have.property('monitoredInterval', 15)
            })
            .catch(err=>console.log(err))
    })

    await it("delete created endpoint with bad authorization,should be 400", () => {
        return requester.del(`/deleteendpoint?=${id + ""}`)
            .set("accesstoken", "93f39e2f-80de-4033-99ee-249d92736a25")
            .send({
                id: id
            })
            .then((res) => {
                expect(res).to.have.status(400)
            })
            .catch(err=>console.log(err))
    })

    await it("delete created endpoint with  authorization,should be 200", () => {
        return requester.del(`/deleteendpoint?id=${id}`)
            .set("accesstoken", "dcb20f8a-5657-4f1b-9f7f-ce65739b359e")
            .send({
                id: id
            })
            .then((res) => {
                expect(res).to.have.status(200)
            })
           .catch(err=>console.log('deleteendpoint',err))
    })

})
