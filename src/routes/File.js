// Users.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const {
		uploadFile,
		uploadFileBites,
	} = require("../api/controllers/File.Controller");

	app.post("/upload/video", uploadFile);
	app.post("/upload/video-bites", uploadFileBites);

	return app;
})();
