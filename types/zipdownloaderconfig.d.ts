/** Use https serving instead of http. If not set, http applies. */
export type HTTPSOptions = {
	/** Path to certificate file */
	cert: string;
	/** Path to key file */
	key: string;
};

export interface ZipDownloaderConfig {
	/**
	 * Zip Downloader server's port.
	 * @default 80
	 */
	port?: number;
	/**
	 * Zip Downloader server's host.
	 * @default "0.0.0.0"
	 */
	host?: string;
	/**
	 * Allowed paths to be zipped and sent
	 * (e.g.: with `"paths": ["/mnt/shareable", "/opt/data"]`
	 * everything under _/mnt/shareable_ and _/opt/data_ can be downloaded)
	 * @default []
	 */
	paths?: string[];
	/**
	 * Use https serving instead of http. If not set, http applies.
	 * @default null
	 */
	https?: HTTPSOptions;
}
