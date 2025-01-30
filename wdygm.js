// Wdygm library source code starts here
//
// For more context, visit github.com/mikeyQwn/wdygm

/**
 * @template T
 */
export class Schema {
    /**
     * @param {Schema<T>["validate"]} fn
     */
    constructor(fn) {
        this.validate = fn;
    }
    /**
     * @param {unknown} v
     * @return {v is T}
     */
    validate(v) {
        v;
        return false;
    }

    /**
     * @param {unknown} v
     * @returns T
     */
    validate_throwing(v) {
        if (!this.validate(v)) {
            throw "validation error";
        }
        return v;
    }

    /**
     * @template U
     * @param {Schema<U>} other
     * @returns {Schema<T | U>}
     */
    or(other) {
        return new Schema(
            /** @type {Schema<T | U>["validate"]} */
            (v) => {
                return this.validate(v) || other.validate(v);
            },
        );
    }

    /**
     * @returns {Schema<T | undefined>}
     */
    optional() {
        return this.or(undefined());
    }
}

/**
 * @template T
 * @param {Schema<T>} s
 * @returns {Schema<T[]>}
 */
export function array(s) {
    /** @type {Schema<T[]>["validate"]} */
    const validator = (v) => {
        if (!Array.isArray(v)) {
            return false;
        }

        for (const el of v) {
            if (!s.validate(el)) {
                return false;
            }
        }

        return true;
    };

    return new Schema(validator);
}

/** @returns {Schema<boolean>} */
export function boolean() {
    return new Schema(
        /** @type {Schema<boolean>["validate"]} */
        (v) => {
            return typeof v === "boolean";
        },
    );
}

/** @returns {Schema<number>} */
export function number() {
    return new Schema(
        /** @type {Schema<number>["validate"]} */
        (v) => {
            return typeof v === "number";
        },
    );
}

/** @returns {Schema<string>} */
export function string() {
    return new Schema(
        /** @type {Schema<string>["validate"]} */
        (v) => {
            return typeof v === "string";
        },
    );
}

/** @returns {Schema<undefined>} */
export function undefined() {
    return new Schema(
        /** @type {Schema<undefined>["validate"]} */
        (v) => {
            return typeof v === "undefined";
        },
    );
}

// Wdygm library source code ends here
