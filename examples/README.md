# Client server example

In this exmaple, an server is created at 127.0.0.1:8080. The server always returns serverSystemInfo object's JSON representation

Client receives the object, validates it and logs details to console. Note that the `systemInfo` variable correctly infers type of the object.

### Usage

To run the example, start the server first:

```bash
node server.js
```

With the server running, run the client and watch the script output

```bash
node client.js
```
