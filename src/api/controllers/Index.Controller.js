"user strict";
const db = require("../config");
const exec_funtions = {};
const { File } = db;
require("dotenv").config();
const AWS = require("aws-sdk");
const moment = require("moment");
const fs = require("fs");

/**
 * * Generador de string en base al tamaño
 *
 * @param {*} length Integer
 * @returns
 */
exec_funtions.randomString = (length) => {
	var chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
	var string_length = length;
	var randomstring = "";
	for (var i = 0; i < string_length; i++) {
		var rnum = Math.floor(Math.random() * chars.length);
		randomstring += chars.substring(rnum, rnum + 1);
	}
	return randomstring;
};

/**
 * * Subir video a Amason
 *
 * @param {*} base64
 * @param {*} fileName
 * @param {*} type
 * @returns
 */
exec_funtions.uploadVideoAWS = (base64, fileName, type) => {
	// AWS
	const ID = process.env.AWS_ID;
	const SECRET = process.env.AWS_SECRET;
	const BUCKET_NAME = process.env.AWS_BUCKET_NAME;

	const s3 = new AWS.S3({
		accessKeyId: ID,
		secretAccessKey: SECRET,
	});

	const base64Data = new Buffer.from(
		base64.replace(/^data:video\/\w+;base64,/, ""),
		"base64"
	);

	const params = {
		Bucket: BUCKET_NAME,
		Key: "videos/" + fileName,
		Body: base64Data,
		ContentEncoding: "base64",
		ContentType: type,
		ACL: "public-read",
	};

	var reques_aws = s3.upload(params);
	var result = reques_aws.promise();
	return result.then(
		(data) => {
			return data;
		},
		(error) => {
			console.log(error);
		}
	);
};

module.exports = exec_funtions;
