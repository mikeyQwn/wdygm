# Wdygm

What did you give me?

### About

This is pure JavaScript library that is intended to be used to validate data and narrow down it's type using jsdoc

### Usage

Simply copy the library file `wdygm.js` in your project

To validate an object:

```js
// This object may be anything, with the most
// common source being JSON.parse() output
const obj = {
    foo: "hello",
    bar: {
        fiz: "string",
        buzz: 42,
    },
};

// Define a schema for an object that we're expecting
const schema = w.object({
    foo: w.string(),
    bar: w.object({
        fiz: w.string(),
        buzz: w.number(),
    }),
});

if (schema.validate(obj)) {
    // Note that obj's type is narrowed, to be of schema type
    console.log("obj is valid");
} else {
    console.log("obj is not valid");
}

// Throwing alternative

// `validateThrowing` returns the object with narrowed type or throws a validation error
const validatedObj = schema.validateThrowing(obj);
```

### Examples

An http server example is located in the `examples` directory

### Testing

Tests are located in `test/test.js` file and are run with `node test/test.js`
