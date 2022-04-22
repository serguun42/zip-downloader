import { readFileSync } from "node:fs";
import http from "node:http";
import https from "node:https";
import { ParseQuery, SafeParseURL } from "./util/urls.js";
import { stat } from "node:fs/promises";
import archiver from "archiver";


/** @type {Partial<import("./types/zipdownloaderconfig").ZipDownloaderConfig>} */
const CONFIG_DEFAULT = JSON.parse(readFileSync("./config/defaults/zip-downloader.json").toString());
/** @type {import("./types/zipdownloaderconfig").ZipDownloaderConfig} */
const CONFIG_USER = JSON.parse(readFileSync("./config/zip-downloader.json").toString());

/** @type {import("./types/zipdownloaderconfig").ZipDownloaderConfig} */
const config = { ...CONFIG_DEFAULT, ...CONFIG_USER };



if (!config.port) throw new Error("Define param <port>");
if (!config.host) throw new Error("Define param <host>");

if (config.https) {
	if (typeof config.https.cert !== "string")
		throw new Error("Param <https.cert> must be string. You can skip <https>");
	if (typeof config.https.key !== "string")
		throw new Error("Param <https.key> must be string. You can skip <https>");

	config.https.cert = readFileSync(config.https.cert);
	config.https.key = readFileSync(config.https.key);
}



/**
 * @param {import("http").IncomingMessage} req
 * @param {import("http").ServerResponse} res
 * @returns {void}
 */
function ServerHandle(req, res) {
	const queries = ParseQuery(SafeParseURL(req.url).search);
	/** @type {string} */
	const directoryPath = queries?.["path"];

	if (typeof directoryPath !== "string") {
		res.statusCode = 400;
		res.end("Set 'path' search param in URL.");
		return;
	}

	stat(directoryPath)
	.then((possibleDirectoryStat) => {
		if (!possibleDirectoryStat.isDirectory()) {
			res.statusCode = 500;
			res.end(`Not a directory\n\n${directoryPath}`);
			return Promise.resolve();
		}

		const directoryFineName = directoryPath.split(/(?:[/\\])/).filter((part) => !!part).pop();
		const zipStream = archiver("zip", {
			comment: directoryFineName,
			zlib: {
				level: 0
			}
		});

		res.setHeader("Content-Type", "application/zip");
		res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(directoryFineName + ".zip")}"`);

		zipStream.pipe(res);

		zipStream.on("error", (e) => {
			if (process.env.NODE_ENV === "development") console.warn(e);
			res.end();
		});

		zipStream.on("finish", () => res.end());

		zipStream.directory(directoryPath, false);

		zipStream.finalize();
	})
	.catch((e) => {
		if (process.env.NODE_ENV === "development") console.warn(e);

		res.statusCode = 500;
		res.end(`${e}\n\n${directoryPath}`);
	});
};


const server = config.https ? https.createServer(config.https, ServerHandle) : http.createServer(ServerHandle);
server.listen(config.port, config.host);
