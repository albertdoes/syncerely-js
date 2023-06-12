"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("../main");
const should = require("should");
describe("createSyncer()", function () {
    it("should create a serializer", function () {
        const syncer = (0, main_1.createSyncer)();
        should(syncer).not.undefined();
    });
    describe(".addTask()", function () {
        it("should register a task", function (done) {
            const syncer = (0, main_1.createSyncer)();
            syncer.addTask((complete) => { complete(); done(); });
            syncer.run();
        });
    });
    describe(".onOver()", function () {
        it("should register an onOver callback", function (done) {
            const syncer = (0, main_1.createSyncer)();
            const i = [];
            syncer.addTask((complete) => { i.push("first"); complete(); });
            syncer.addTask((complete) => { i.push("second"); complete(); });
            syncer.addTask((complete) => { i.push("third"); complete(); });
            syncer.onOver(() => {
                should(i[0]).equal("first");
                should(i[1]).equal("second");
                should(i[2]).equal("third");
                done();
            });
            syncer.run();
        });
    });
    describe(".onPanic()", function () {
        it("should register an onPanic callback", function (done) {
            const syncer = (0, main_1.createSyncer)();
            const i = [];
            syncer.addTask((complete) => { i.push("first"); complete(); });
            syncer.addTask((complete) => { i.push("second"); complete(); });
            syncer.addTask((complete) => { i.push("third"); complete(); });
            syncer.addTask((complete) => { throw new Error(); complete(); });
            syncer.addTask((complete) => { i.push("fourth"); complete(); });
            syncer.addTask((complete) => { i.push("fifth"); complete(); });
            syncer.onPanic(() => {
                should(i[0]).equal("first");
                should(i[1]).equal("second");
                should(i[2]).equal("third");
                should(i[3]).undefined();
                should(i[4]).undefined();
                done();
            });
            syncer.run();
        });
    });
    describe(".run()", function () {
        it("should execute registered tasks in order", function (done) {
            const syncer = (0, main_1.createSyncer)();
            const i = [];
            syncer.addTask((complete) => { i.push("first"); complete(); });
            syncer.addTask((complete) => { i.push("second"); complete(); });
            syncer.addTask((complete) => { i.push("third"); complete(); });
            syncer.addTask((complete) => { i.push("fourth"); complete(); });
            syncer.addTask((complete) => { i.push("fifth"); complete(); });
            syncer.onOver(() => {
                should(i[0]).equal("first");
                should(i[1]).equal("second");
                should(i[2]).equal("third");
                should(i[3]).equal("fourth");
                should(i[4]).equal("fifth");
                done();
            });
            syncer.run();
        });
    });
});
