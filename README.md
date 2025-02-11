# Wdygm

What did you give me?

### About

This is pure js library that is intended to be used to validate/narrow down data using jsdoc

### Usage

Simply copy the library file `wdygm.js` in your project

To validate an object:

```js
// This object may be antything, with the most
// common source being JSON.parse() output
const obj = {
    foo: "hello",
    bar: {
        fiz: "string",
        buzz: 42,
    },
};

// Define a schema of inteneded object
const schema = w.object({
    foo: w.string(),
    bar: w.object({
        fiz: w.string(),
        buzz: w.number(),
    }),
});

if (schema.validate(obj)) {
    // Take note that obj type is narrowed, to be of schema type
    console.log("obj is valid");
} else {
    console.log("obj is not valid");
}

// Throwing alternative

// Validate throwing returns the object with narrowed type or throws a validation error
const validatedObj = schema.validateThrowing(obj);
```

### Examples

An http server example is located in the `examples` directory

### Testing

Tests are located in `test/test.js` file and are run with `node test/test.js`
