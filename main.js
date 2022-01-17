// Initialize Express
const express = require("express");
const app = express();

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

app.listen(80, () => {
	console.log(`Express server listening on port: 80`);
});

// Initialize NLP
const { NlpManager } = require("node-nlp");
console.log("Starting Chatbot ...");

const manager = new NlpManager({ languages: ["en"] });
manager.load();

// Initalize WebSocket
const { WebSocketServer } = require("ws");

const wss = new WebSocketServer({ port: 8000 });
console.log("Alice listening on port: 8000");

wss.on("connection", function connection(ws, req) {
	const ip = req.socket.remoteAddress;
	console.log(`Received connection from: ${ip}`);
	ws.send("Connection established successfully!");

	ws.on("message", async function message(data) {
		const response = await manager.process("en", String(data));
		if (!response.answer) {
			ws.send("Sadly, I'm still too dumb to understand that...");
		} else {
			ws.send(response.answer);
		}
	});

	ws.on("close", function close() {
		console.log("disconnected");
	});
});
