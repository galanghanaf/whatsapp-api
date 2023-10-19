const fs = require("fs");

fs.rmSync(".wwebjs_auth", { recursive: true });
fs.rmSync(".wwebjs_cache", { recursive: true });
console.log("This client was successfully destroyed!");
