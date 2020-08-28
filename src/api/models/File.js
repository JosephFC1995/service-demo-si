"use strict";

module.exports = (sequelize, DataTypes) => {
	const File = sequelize.define(
		"File",
		{
			name: {
				type: DataTypes.STRING,
				required: true,
			},
			originalname: {
				type: DataTypes.STRING,
				required: true,
			},
			path: {
				type: DataTypes.STRING,
				required: true,
			},
			encoding: {
				type: DataTypes.STRING,
				required: true,
			},
			truncated: {
				type: DataTypes.STRING,
				required: true,
			},
			extension: {
				type: DataTypes.STRING,
				required: true,
			},
			mimetype: {
				type: DataTypes.STRING,
				required: true,
			},
			size: {
				type: DataTypes.DOUBLE,
				required: true,
			},
		},
		{
			freezeTableName: false,
			tableName: "File",
		}
	);

	return File;
};
