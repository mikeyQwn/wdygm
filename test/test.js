import * as w from "../wdygm.js";

class TF {
    #tcName;
    /**
     * @type {string=}
     */
    #error;

    /**
     * @param {string} tcName
     */
    constructor(tcName) {
        this.#tcName = tcName;
        this.#error = undefined;
    }

    name() {
        return this.#tcName;
    }

    error() {
        return this.#error;
    }

    /**
     * @param {boolean} v
     * @param {string} [msg]
     */
    assert(v, msg) {
        if (!!v) {
            return;
        }
        this.#error = `assertion failed, expected: true, got ${v}`;
        if (msg) {
            this.#error += `. ${msg}`;
        }

        throw null;
    }

    /**
     * @param {any} a
     * @param {any} b
     * @param {string} [msg]
     */
    assertEq(a, b, msg) {
        if (a == b) {
            return;
        }
        this.#error = `assertion failed, left = ${a}, right = ${b}`;
        if (msg) {
            this.#error += `. ${msg}`;
        }

        throw null;
    }
}

function runTests() {
    const tests = [testBoolean, testNumber, testString, testArray, testOr];
    for (let i = 0; i < tests.length; ++i) {
        const testFn = tests[i];
        const tf = new TF(testFn.name);
        try {
            testFn(tf);
            console.log(`Test "${tf.name()}" passed`);
        } catch (e) {
            if (tf.error()) {
                console.log(`Test "${tf.name()}" failed, error: ${tf.error()}`);
            } else {
                console.log(
                    `Test "${tf.name()}" threw, unexpected error: ${e}`,
                );
            }
        }
    }
}

///////////// Tests begin here /////////////

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testBoolean(tf) {
    const cases = [
        [true, true],
        [false, true],
        ["hello", false],
        [{}, false],
        [Boolean(), true],
        [Boolean(false), true],
    ];

    for (const [input, expected] of cases) {
        const s = w.boolean();
        const got = s.validate(input);
        tf.assertEq(got, expected, `Input = ${input}`);
    }

    return true;
}

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testNumber(tf) {
    const cases = [
        [true, false],
        [0o123, true],
        [0, true],
        [1, true],
        [-1, true],
        [1.2, true],
    ];

    for (const [input, expected] of cases) {
        const s = w.number();
        const got = s.validate(input);
        tf.assertEq(got, expected, `Input = ${input}`);
    }

    return true;
}

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testString(tf) {
    const cases = [
        [true, false],
        ["", true],
        ["hello", true],
        [{}, false],
        ["true", true],
        [Boolean(false), false],
    ];

    for (const [input, expected] of cases) {
        const s = w.string();
        const got = s.validate(input);
        tf.assertEq(got, expected, `Input = ${input}`);
    }

    return true;
}

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testArray(tf) {
    /**
     * @type [any, w.Schema<any>, boolean][]
     */
    const cases = [
        [true, w.number(), false],
        ["", w.number(), false],
        ["hello", w.number(), false],
        [{}, w.number(), false],
        ["true", w.number(), false],
        [Boolean(false), w.number(), false],
        [[1, 2], w.number(), true],
        [[], w.number(), true],
        [["foo", "bar", 2], w.string(), false],
        [["foo", "bar", "baz"], w.string(), true],
        [[[], ["foo", "bar"], ["bar", "baz"]], w.array(w.string()), true],
        [[[], ["foo", "bar"], [1, "baz"]], w.array(w.string()), false],
        [
            [[], ["foo", "bar"], [undefined, "baz"]],
            w.array(w.string().optional()),
            true,
        ],
    ];

    for (const [input, schema, expected] of cases) {
        const s = w.array(schema);
        const got = s.validate(input);
        tf.assertEq(got, expected, `Input = ${input}`);
    }

    return true;
}

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testOr(tf) {
    /**
     * @type [any, w.Schema<any>, boolean][]
     */
    const cases = [
        [true, w.number().or(w.string()), false],
        [42, w.number().or(w.string()), true],
        ["", w.number().or(w.string()), true],
        [undefined, w.number().or(w.undefined()), true],
        ["", w.number().or(w.undefined()), false],
    ];

    for (const [input, s, expected] of cases) {
        const got = s.validate(input);
        tf.assertEq(got, expected, `Input = ${input}`);
    }

    return true;
}

runTests();
