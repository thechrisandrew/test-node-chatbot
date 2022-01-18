const express = require("express");
const app = express();
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

const http = require("http");
const server = http.createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

const { NlpManager } = require("node-nlp");
console.log("Starting Chatbot ...");
const manager = new NlpManager({ languages: ["en"] });
manager.load();

// serve index.html
app.get("/", (req, res) => {
	res.render("index");
});

io.on("connection", (socket) => {
	var clientIp = socket.request.connection.remoteAddress;
	console.log(clientIp);
	socket.emit("message", "Connected Successfully");

	socket.on("message", async (data) => {
		const response = await manager.process("en", String(data));
		if (!response.answer) {
			socket.emit("message", "Sadly, I'm still too dumb to understand that...");
		} else {
			socket.emit("message", response.answer);
		}
	});
});

server.listen(3000, () => {
	console.log("Server listening on *:3000");
});
