type Over = () => void;
type Panic = (err: Error) => boolean | void;
type Interceptor = (args: Status) => void;
type Task = (complete: () => void) => void;

type SyncerCore = {
    worries: Task[],
    loop?: any,
    over?: Over,
    panic?: Panic,
    interceptor?: Interceptor,
}

type Status = {
    isResolved: boolean,
    index: number,
    roundLeft: number,
}

type Syncer = {
    isResolved(detail?: boolean): boolean | Status;
    reset(): void,
    run(for_?: number, every?: number): void;
    addTask(task: Task): void;
    onOver: (callback: Over) => void;
    onPanic: (callback: Panic) => void;
}

/*------------------------------------------------*/

function createSyncer() {
    const SYNCER_CORE: SyncerCore = {
        worries: [],
        loop: undefined,
        over: undefined,
        panic: undefined,
        interceptor: undefined,
    };

    const STATUS: Status = {
        isResolved: true,
        index: -1,
        roundLeft: 1,
    };

    function singularIteration() {
        SYNCER_CORE.interceptor && SYNCER_CORE.interceptor(STATUS);
        if(!STATUS.isResolved) return
        
        STATUS.index += 1;
        if(STATUS.index === SYNCER_CORE.worries.length) STATUS.roundLeft -= 1;
        if(STATUS.roundLeft === 0) return end();
        STATUS.index %= SYNCER_CORE.worries.length;
        STATUS.isResolved = false;
        
        try { SYNCER_CORE.worries[STATUS.index](() => { STATUS.isResolved = true; }); }
        catch(err) { return end(err as Error) };
    }

    function end(err?: Error) {
        if(!err && SYNCER_CORE.over) {
            SYNCER_CORE.over();
        } else if(err && SYNCER_CORE.panic && SYNCER_CORE.panic(err)) {
            STATUS.isResolved = true;
            return;
        }
        clearInterval(SYNCER_CORE.loop);
    }

    return {
        isResolved(detail?: boolean) {
            return detail ? STATUS : STATUS.isResolved;
        },
        addTask(task: Task) { SYNCER_CORE.worries.push(task); },
        run(repeat?: number, every?: number) {
            if(repeat) STATUS.roundLeft = repeat;
            every ??= 0;
            SYNCER_CORE.loop = setInterval(singularIteration, every);
        },
        onOver(callback: Over) { SYNCER_CORE.over = callback; },
        onPanic(callback: Panic) { SYNCER_CORE.panic = callback; },
        intercept(interceptor: Interceptor) { SYNCER_CORE.interceptor = interceptor; }
    }
}

const Syncer = createSyncer;

export type {
    Task,
    Over,
    Panic,
    Interceptor,
    Status,
}
export { createSyncer, Syncer };