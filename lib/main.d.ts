type Over = () => void;
type Panic = (err: Error) => boolean | void;
type Interceptor = (args: Status) => void;
type Task = (complete: () => void) => void;
type Status = {
    isResolved: boolean;
    index: number;
    roundLeft: number;
};
type Syncer = {
    isResolved(detail?: boolean): boolean | Status;
    reset(): void;
    run(for_?: number, every?: number): void;
    addTask(task: Task): void;
    onOver: (callback: Over) => void;
    onPanic: (callback: Panic) => void;
};
declare function createSyncer(): {
    isResolved(detail?: boolean): boolean | Status;
    addTask(task: Task): void;
    run(repeat?: number, every?: number): void;
    onOver(callback: Over): void;
    onPanic(callback: Panic): void;
    intercept(interceptor: Interceptor): void;
};
declare const Syncer: typeof createSyncer;
export type { Task, Over, Panic, Interceptor, Status, };
export { createSyncer, Syncer };
