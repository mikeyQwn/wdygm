import { isBoolean } from "../wdygm.js";

class TF {
    #tcName;
    #error;

    constructor(tcName) {
        this.#tcName = tcName;
        this.#error = null;
    }

    name() {
        return this.#tcName;
    }

    error() {
        return this.#error;
    }

    assert(v, msg) {
        if (!!v) {
            return true;
        }
        this.#error = `assertion failed, expected: true, got ${v}`;
        if (msg) {
            this.#error += `. ${msg}`;
        }
        return false;
    }

    assertEq(a, b, msg) {
        if (a == b) {
            return true;
        }
        this.#error = `assertion failed, left = ${a}, right = ${b}`;
        if (msg) {
            this.#error += `. ${msg}`;
        }
        return false;
    }
}

function runTests() {
    const tests = [testIsBoolean];
    for (let i = 0; i < tests.length; ++i) {
        const testFn = tests[i];
        const tf = new TF(testFn.name);
        const isOk = testFn(tf);
        if (isOk) {
            console.log(`Test "${tf.name()}" passed`);
        } else {
            console.log(`Test "${tf.name()}" failed, error: ${tf.error()}`);
        }
    }
}

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testIsBoolean(tf) {
    const cases = [
        [true, true],
        [false, true],
        ["hello", false],
        [{}, false],
        [Boolean(), true],
        [Boolean(false), true],
    ];

    for (const [input, expected] of cases) {
        const got = isBoolean(input);
        if (!tf.assertEq(got, expected, `Input = ${input}`)) {
            return false;
        }
    }

    return true;
}

runTests();
