# **Syncer**

`v1.0.0`

A minimal library for serializing (a)synchronous tasks.

---

## **Installation**

```bash
> npm i syncer
```

---

## **Usage**

`syncer` provides the following interfaces:

- [`createSyncer()`](#createSyncer)

---

First, import `syncer`:

```typescript
import * as syncer from "syncer";
import { functionInDemand } from "syncer",

var syncer = require("syncer");
```

---

<h3 id="createSyncer">
    <strong>createSyncer()</strong>
</h3>

Creates a serializer:

```typescript
const syncer = createSyncer();
```

A `Task` is a function that accepts a `complete()` `void` function as the sole argument and call it somewhere. Calling the function is mandatory.

```typescript
function task1(complete) {
    // some arbitrary actions
    console.log("task one finished.")
    complete();
}

function task2(complete) {
    new Promise((resolve, reject) => {
        // some arbitrary actions
    }).then((val) => {
        // some arbitrary actions
        console.log("task two finished.")
        complete();
    });
}

function task3(complete) { throw new Error(); }

function task4(complete) { console.log("task four finished."); };
```

Adds a task to the queue:

```typescript
syncer.addTask(task1);
syncer.addTask(task2);
syncer.addTask(task3);
syncer.addTask(task4);
```

`onOver()` can be called with a void function with no parameter to be invoked at the end of the task queue when all the task are executed without any exceptions.

Sets an `onOver()` handler:

```typescript
syncer.onOver(() => { console.log("All finished.") });
```

Similarly, `onPanic()` can be called with a void function with **one** `Error` parameter to be invoked when an exception arises. When an exception arises, `syncer` calls `onPanic()` and exits the queue by default. To continue to the next task, the handler should return `true`.

Sets an `onPanic()` handler:

```typescript
syncer.onPanic((err) => { console.log("Just panicked!"); });
```

Another method `intercept()` is available for monitoring purposes. The function passed to the `intercept()` receives `Syncer.Status` type object, which contains the following values:

- `isResolved` - `boolean` : states whether any task is resolved,
- `index` - `number` : the index of the task that the serializer is waiting to be resolved or that has just been resolved,
- `roundLeft` - `number` : the number of times left to run the whole queue in repeat.

```typescript
syncer.intercept((status) => {
    console.log(`
        We are at task ${status.index}\n
        that is ${
            status.isResolved
            ? "" : "being"
        } resolved.
        ${status.roundLeft} round(s) remaining.
    `);
});
```

Call `run()` to start executing the tasks in order. It accepts two parameters:

- `repeat`(optional) - `number` : the number of times the whole sequence should be run. Pass `Infinity` to run the queue repeatedly forever. (default: `1`),
- `every`(optional) - `number` : delay between two consecutive iterations. `Syncer` uses `setInterval()` to loop over and wait for a task to be resolved and call the next task. This is the second parameter of that internal `setInterval()` (default: `0`)

Runs the serialized tasks in order:

```typescript
syncer.run();
```

```
> We are at task -1 that is resolved. 1 round(s) remaining.
> We are at task 0 that is being resolved. 1 round(s) remaining.
...
> "task one finished."
> We are at task 0 that is resolved. 1 round(s) remaining.
> We are at task 1 that is being resolved. 1 round(s) remaining.
...
> "task two finished."
> We are at task 1 that is resolved. 1 round(s) remaining.
> We are at task 2 that is being resolved. 1 round(s) remaining.
...
> "Just panicked!"
> [nothing about task four gets printed because the queue was terminated and we didn't return true in onPanic()]
```

---

## **License**

The core files of the library are covered by MIT license.

All rights reserved. © 2023 Sai Aung Kyaw Htet

Dev-dependencies are covered by respective licenses and all the credits and copyrights go to respective authors.