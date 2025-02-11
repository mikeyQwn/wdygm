import * as http from "http";
import * as w from "../wdygm.js";

const port = 8080;

const systemInfoSchema = w.object({
    isUp: w.boolean(),
    os: w.string(),
    host: w.string(),
    deviceInfo: w.object({
        uptimeMinutes: w.number(),
        packageCount: w.number(),
        cpu: w.string(),
    }),
});

http.get(`http://127.0.0.1:${port}`, async (res) => {
    res.readableHighWaterMark;
    res.setEncoding("utf8");
    let rawData = "";
    res.on("data", (chunk) => {
        rawData += chunk;
    });
    res.on("end", () => {
        try {
            const parsedData = JSON.parse(rawData);
            console.log(parsedData);
            const systemInfo = systemInfoSchema.validateThrowing(parsedData);
            console.log(`Parsed host: ${systemInfo.host}`);
            console.log(`Parsed isUp: ${systemInfo.isUp}`);
            console.log(`Parsed deviceInfo.cpu: ${systemInfo.deviceInfo.cpu}`);
        } catch (e) {
            console.error(e);
        }
    });
});
