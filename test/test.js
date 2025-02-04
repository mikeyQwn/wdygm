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
    const tests = [
        testBoolean,
        testNumber,
        testString,
        testArray,
        testOr,
        testObject,
    ];
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
        ["true", true, true],
        ["false", false, true],
        ["string", "hello", false],
        ["empty object", {}, false],
        ["empty constructor", Boolean(), true],
        ["constructor with param", Boolean(false), true],
    ];

    for (const [tcName, input, expected] of cases) {
        const s = w.boolean();
        const got = s.validate(input);
        tf.assertEq(got, expected, `Testcase = ${tcName} Input = ${input}`);
    }

    return true;
}

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testNumber(tf) {
    const cases = [
        ["boolean", true, false],
        ["number", 0o123, true],
        ["zero", 0, true],
        ["one", 1, true],
        ["negative", -1, true],
        ["float", 1.2, true],
        ["bigint", 1n, false],
    ];

    for (const [tcName, input, expected] of cases) {
        const s = w.number();
        const got = s.validate(input);
        tf.assertEq(got, expected, `Testcase = ${tcName} Input = ${input}`);
    }

    return true;
}

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testString(tf) {
    const cases = [
        ["boolean", true, false],
        ["empty string", "", true],
        ["non-empty string", "hello", true],
        ["empty object", {}, false],
        ["false boolean", Boolean(false), false],
    ];

    for (const [tcName, input, expected] of cases) {
        const s = w.string();
        const got = s.validate(input);
        tf.assertEq(got, expected, `Testcase = ${tcName} Input = ${input}`);
    }

    return true;
}

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testArray(tf) {
    /**
     * @type [string, any, w.Schema<any>, boolean][]
     */
    const cases = [
        ["boolean", true, w.number(), false],
        ["empty string", "", w.number(), false],
        ["non-empty string", "hello", w.number(), false],
        ["empty object", {}, w.number(), false],
        ["string", "true", w.number(), false],
        ["false boolean", Boolean(false), w.number(), false],
        ["number array", [1, 2], w.number(), true],
        ["empty array", [], w.number(), true],
        ["mixed type array", ["foo", "bar", 2], w.string(), false],
        ["string array", ["foo", "bar", "baz"], w.string(), true],
        [
            "2d array with empty rows",
            [[], ["foo", "bar"], ["bar", "baz"]],
            w.array(w.string()),
            true,
        ],
        [
            "2d array with mixed types",
            [[], ["foo", "bar"], [1, "baz"]],
            w.array(w.string()),
            false,
        ],
        [
            "mixed type array with undefined",
            [[], ["foo", "bar"], [undefined, "baz"]],
            w.array(w.string().optional()),
            true,
        ],
    ];

    for (const [tcName, input, schema, expected] of cases) {
        const s = w.array(schema);
        const got = s.validate(input);
        tf.assertEq(got, expected, `Testcase = ${tcName} Input = ${input}`);
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

/**
 * @param {TF} tf
 * @return {boolean}
 */
function testObject(tf) {
    /**
     * @type [any, w.Schema<any>, boolean][]
     */
    const cases = [
        [
            { hello: "asdkj", world: 42 },
            w.object({
                hello: w.string(),
                world: w.number(),
            }),
            true,
        ],
        [
            { hello: "asdkj", world: "dklj" },
            w.object({
                hello: w.string(),
                world: w.number(),
            }),
            false,
        ],
        [
            { foo: "asdkj" },
            w.object({
                hello: w.string(),
            }),
            false,
        ],
        [
            { foo: "asdkj" },
            w.object({
                foo: w.string(),
            }),
            true,
        ],
        [
            {
                foo: "string",
                bar: {
                    fiz: "foo",
                    buzz: 42,
                },
            },
            w.object({
                foo: w.string(),
                bar: w.object({
                    fiz: w.string(),
                    buzz: w.number(),
                }),
            }),
            true,
        ],
    ];

    for (const [input, s, expected] of cases) {
        const got = s.validate(input);
        tf.assertEq(got, expected, `Input = ${JSON.stringify(input)}`);
    }

    return true;
}

runTests();
