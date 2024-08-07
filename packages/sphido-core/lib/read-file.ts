import { readFile as readFileAsync } from "node:fs/promises";

/** * Read file content as string */
export async function readFile(path: string): Promise<string> {
	return readFileAsync(path, "utf8");
}
