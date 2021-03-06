"use strict";

require("dotenv").config();
const express = require("express"),
	bodyParser = require("body-parser"),
	cookieParser = require("cookie-parser"),
	morgan = require("morgan"),
	app = express(),
	router = express.Router(),
	jwt = require("express-jwt"),
	consola = require("consola"),
	cors = require("cors"),
	fs = require("fs"),
	fileUpload = require("express-fileupload");
var unless = require("express-unless");

const port = process.env.SERVER_PORT ? process.env.SERVER_PORT : 5000;

app.disable("x-powered-by");
app.use(morgan("combined"));
// default options
app.use(
	fileUpload({
		limits: { fileSize: 100 * 1024 * 1024 },
	})
);
app.use(bodyParser.json({ limit: "100mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
app.use(cookieParser());
app.use(cors());

const TOKEN_ROUTE = process.env.TOKEN_ROUTE;
// var publicFolder = express.static(__dirname + "/public");
// publicFolder.unless = unless;
// app.use(publicFolder.unless({ method: "OPTIONS" }));

app.use(
	jwt({
		secret: TOKEN_ROUTE,
	}).unless({
		path: [
			"/",
			"/uploads/*",
			"/file/upload/video",
			"/file/upload/video-bites",
			"/api/v1/file/upload/video",
			"/api/v1/file/upload/video-bites",
			"/robots.txt",
			"/favicon.ico",
		],
	})
);

fs.readdirSync(__dirname + "/src/routes")
	.filter((file) => {
		return (
			file.indexOf(".") !== 0 && file.slice(-3) === ".js" && file !== "index.js"
		);
	})
	.forEach((file) => {
		router.use(
			"/" + file.slice(0, -3).toLowerCase(),
			require(__dirname + "/src/routes/" + file)
		);
	});

app.get("/", (req, res) => {
	return res.json({
		error: true,
		code: 403,
		detail: "No cuentas con los accesos requeridos",
	});
});

app.use("/api/v1", router);

app.listen(port, () => {
	consola.ready({
		message: `🚀 El servidor está corriendo en el puerto 5000. Visita http://localhost:${port}`,
		badge: true,
	});
});

module.exports = app;
