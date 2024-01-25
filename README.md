# zip-downloader

Make a server to download local folders as zip.

Used as extension for [Pretty Autoindex](https://github.com/serguun42/zip-downloader) – standalone Node.js addition to refine autoindex pages in nginx.

## Hot to

1. Install [Node.js](https://nodejs.org/) – `npm` included
2. Install necessary dependencies – `npm i --production`
3. [Edit zip-downloader config file](#config) as you need
4. Edit [pm2 config](./config/pm2.production.json) if necessary
5. Start zip-downloader – `npm run production`

Later you'll need only the last step to spin up server.

To stop zip-downloader run – `npm run stop` or `pm2 delete zip-downloader`.

## Development

1. Install all dependencies – `npm i`
2. Edit [nodemon config](./config/nodemon.dev.json)
3. Run in watch mode – `npm run dev`

## Config

Main config located at [`config/zip-downloader.json`](./config/zip-downloader.json).
See [Typescript Declaration File](./types/zipdownloaderconfig.d.ts) for it (same as content below).

#### ZipDownloaderConfig

| parameter | description                                                                                                                                                     | type                            | default     |
| --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ----------- |
| `port`    | Zip Downloader server's port.                                                                                                                                   | `number`                        | `80`        |
| `host`    | Zip Downloader server's host.                                                                                                                                   | `string`                        | `"0.0.0.0"` |
| `paths`   | Allowed paths to be zipped and sent (e.g.: with `"paths": ["/mnt/shareable", "/opt/data"]` everything under _/mnt/shareable_ and _/opt/data_ can be downloaded) | `string[]`                      | `[]`        |
| `https`   | Use https serving instead of http. If not set, http applies.                                                                                                    | [`HTTPSOptions`](#httpsoptions) | `null`      |

#### HTTPSOptions

Use https serving instead of http. If not set, http applies.

| parameter | description              | type     | default                           |
| --------- | ------------------------ | -------- | --------------------------------- |
| `cert`    | Path to certificate file | `string` | **Required** (if `https` enabled) |
| `key`     | Path to key file         | `string` | **Required** (if `https` enabled) |

### [BSL-1.0 License](./LICENSE)
