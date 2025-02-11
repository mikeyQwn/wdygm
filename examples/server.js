import * as http from "http";

const port = 8080;

const serverSystemInfo = {
    isUp: true,
    os: "Ubuntu 19.04 x86_64",
    host: "GA-MA770-UD3",
    deviceInfo: {
        uptimeMinutes: 15,
        packageCount: 2169,
        cpu: "AMD Phenom II",
    },
};

http.createServer(async (_req, res) => {
    res.writeHead(200);
    res.write(JSON.stringify(serverSystemInfo));
    res.end();
})
    .listen(port)
    .on("listening", () => {
        console.log(`http server is listening on port: ${port}`);
    });
