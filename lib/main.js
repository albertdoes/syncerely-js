"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Syncer = exports.createSyncer = void 0;
/*------------------------------------------------*/
function createSyncer() {
    const SYNCER_CORE = {
        worries: [],
        loop: undefined,
        over: undefined,
        panic: undefined,
        interceptor: undefined,
    };
    const STATUS = {
        isResolved: true,
        index: -1,
        roundLeft: 1,
    };
    function singularIteration() {
        SYNCER_CORE.interceptor && SYNCER_CORE.interceptor(STATUS);
        if (!STATUS.isResolved)
            return;
        STATUS.index += 1;
        if (STATUS.index === SYNCER_CORE.worries.length)
            STATUS.roundLeft -= 1;
        if (STATUS.roundLeft === 0)
            return end();
        STATUS.index %= SYNCER_CORE.worries.length;
        STATUS.isResolved = false;
        try {
            SYNCER_CORE.worries[STATUS.index](() => { STATUS.isResolved = true; });
        }
        catch (err) {
            return end(err);
        }
        ;
    }
    function end(err) {
        if (!err && SYNCER_CORE.over) {
            SYNCER_CORE.over();
        }
        else if (err && SYNCER_CORE.panic && SYNCER_CORE.panic(err)) {
            STATUS.isResolved = true;
            return;
        }
        clearInterval(SYNCER_CORE.loop);
    }
    return {
        isResolved(detail) {
            return detail ? STATUS : STATUS.isResolved;
        },
        addTask(task) { SYNCER_CORE.worries.push(task); },
        run(repeat, every) {
            if (repeat)
                STATUS.roundLeft = repeat;
            every !== null && every !== void 0 ? every : (every = 0);
            SYNCER_CORE.loop = setInterval(singularIteration, every);
        },
        onOver(callback) { SYNCER_CORE.over = callback; },
        onPanic(callback) { SYNCER_CORE.panic = callback; },
        intercept(interceptor) { SYNCER_CORE.interceptor = interceptor; }
    };
}
exports.createSyncer = createSyncer;
const Syncer = createSyncer;
exports.Syncer = Syncer;
