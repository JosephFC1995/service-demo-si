const db = require("../config/index");
require("dotenv").config();
const {
	randomString,
	uploadFilesAWS,
	uploadFilesBitesAWS,
} = require("./Index.Controller");
const { Op } = db.Sequelize;
const { Users, UserRole, File } = db;
const moment = require("moment");

const exp = {};

exp.create = async (req, res) => {};

exp.findAll = async (req, res) => {};

exp.findOne = async (req, res) => {};

exp.update = (req, res) => {};

exp.delete = (req, res) => {};

/**
 * * Subida de archivos
 *
 * @param {body} req
 * @param {*} res
 */
exp.uploadFile = async (req, res) => {
	if (!req.body || Object.keys(req.body).length === 0) {
		return res.status(400).send({
			error: true,
			status: 400,
			message: "No se cargó ningún archivo en la base 64.",
			messageDeveloper: "No se cargó ningún archivo en la base 64.",
		});
	}
	const { body } = req;
	const { name, size, type, data } = body;
	let mimetype_split = type.split("/");
	let extension = mimetype_split[1];
	let new_name = randomString(50);
	let update_file_aws = await uploadFilesAWS(
		data,
		new_name + "_" + name + "_" + moment().toDate().getTime() + "." + extension,
		type
	);

	let newDataFile = {
		name:
			new_name +
			"_" +
			name +
			"_" +
			moment().toDate().getTime() +
			"." +
			extension,
		originalname: name,
		size: size,
		encoding: "7bit",
		truncated: 0,
		extension: extension,
		mimetype: type,
		path: update_file_aws.Location,
	};

	File.create(newDataFile)
		.then((file) => {
			res.json(file);
		})
		.catch((err) =>
			res.status(500).send({
				status: 500,
				message: "El archivo no pudo ser subido al servido",
				messageDeveloper: err,
			})
		);
};

/**
 * * Subida de archivos
 *
 * @param {body} req
 * @param {*} res
 */
exp.uploadFileBites = async (req, res) => {
	if (!req.files || Object.keys(req.files).length === 0) {
		return res.status(400).send({
			error: true,
			status: 400,
			message: "No se cargó ningún archivo",
			messageDeveloper: "No se cargó ningún archivo",
		});
	}
	if (!req.body || Object.keys(req.body).length === 0) {
		return res.status(400).send({
			error: true,
			status: 400,
			message: "No se esta enviando datos del video.",
			messageDeveloper: "No se cargó  datos del video.",
		});
	}
	let { name, size, type } = req.body;
	let { video } = req.files;
	let { data, encoding, truncated } = video;
	let mimetype_split = type.split("/");
	let extension = mimetype_split[1];
	let new_name = randomString(50);
	console.log("===Enviando al servidor de S3");
	let update_file_aws = await uploadFilesBitesAWS(
		data,
		new_name +
			"_" +
			name.split(".").slice(0, -1).join(".") +
			"_" +
			moment().toDate().getTime() +
			"." +
			extension,
		type
	);
	console.log("===Envio correcto al servidor de S3");
	let newDataFile = {
		name:
			new_name +
			"_" +
			name.split(".").slice(0, -1).join(".") +
			"_" +
			moment().toDate().getTime() +
			"." +
			extension,
		originalname: name,
		size: size,
		encoding: encoding,
		truncated: truncated,
		extension: extension,
		mimetype: type,
		path: update_file_aws.Location,
	};
	console.log("===Guardando datos al servidor de datos");
	File.create(newDataFile)
		.then((file) => {
			res.json(file);
		})
		.catch((err) =>
			res.status(500).send({
				status: 500,
				message: "El archivo no pudo ser subido al servido",
				messageDeveloper: err,
			})
		);
};

module.exports = exp;
