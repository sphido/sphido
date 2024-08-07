import { mkdir, writeFile as writeFileAsync } from "node:fs/promises";
import { dirname } from "node:path";

/** * Write content to the file and create directory if not exists */
export async function writeFile(file: string, content: string): Promise<void> {
	await mkdir(dirname(file), { recursive: true });
	return writeFileAsync(file, content);
}
