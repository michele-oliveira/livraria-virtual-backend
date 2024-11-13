import { createHash } from "crypto";
import {
  createReadStream,
  existsSync,
  readdirSync,
  unlink,
  unlinkSync,
} from "fs";
import path from "path";

export const getPublicImageUrl = (imageName: string) =>
  `${process.env.APP_URL}/images/${imageName}`;

export const getPublicBookFileUrl = (bookFileName: string) =>
  `${process.env.APP_URL}/book_files/${bookFileName}`;

export const generateFileHash = (filePath: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const hash = createHash("sha256");
    const stream = createReadStream(filePath);

    stream.on("data", (data) => hash.update(data));
    stream.on("end", () => resolve(hash.digest("hex")));
    stream.on("error", (err) => reject(err));
  });
};

export const compareFiles = async (
  filePath1: string,
  filePath2: string
): Promise<boolean> => {
  const hash1 = await generateFileHash(filePath1);
  const hash2 = await generateFileHash(filePath2);
  return hash1 === hash2;
};

export const deleteFile = (filePath: string) => {
  if (filePath && existsSync(filePath)) {
    unlink(filePath, (err) => {
      if (err) {
        console.error(`Error while deleting file ${filePath}`, err);
      }
    });
  }
};

export const getFilesInDirectory = (directory: string): string[] =>
  readdirSync(directory);

export const removeMultipleFilesFromDirectory = (
  baseDir: string,
  filenames: string[]
) => {
  filenames.forEach((filename) => {
    const file = path.join(baseDir, filename);
    unlinkSync(file);
  });
};
