// Users.js
module.exports = (function () {
	"use strict";
	const app = require("express").Router();
	const c_file = require("../api/controllers/File.Controller");

	app.post("/upload/video", c_file.uploadFile);

	return app;
})();
