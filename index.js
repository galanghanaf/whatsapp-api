require("dotenv").config();
const qrcode = require("qrcode-terminal");
const express = require("express");
const bodyParser = require("body-parser");
const { Client, LocalAuth } = require("whatsapp-web.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static("public"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.listen(port, () => {
  console.log(`Server listening on the port::${port}`);
});

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "user",
  }),
  puppeteer: {
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  },
});

client.on("qr", (qr) => {
  console.log("QR RECEIVED", qr);
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (msg) => {
  if (msg.body == "!ping") {
    msg.reply("pong");
  }
});

client.initialize();

async function send(sendNumber, sendMessage) {
  // add "@c.us" at the end of the number.
  // Sending message.
  client.sendMessage(sendNumber + "@c.us", sendMessage);
}

app.post("/send", (req, res) => {
  const sendMessage = req.body;
  send(sendMessage.phone.toString(), sendMessage.message.toString());
  res.send("Success send message to " + sendMessage.phone.toString());
  console.log("Success send message to " + sendMessage.phone.toString());
});
