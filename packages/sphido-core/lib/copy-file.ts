import { copyFile as copyFileAsync, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

/** * Copy file and create destination directory if not exists */
export async function copyFile(src: string, dest: string): Promise<void> {
	await mkdir(dirname(dest), { recursive: true });
	return copyFileAsync(src, dest);
}
