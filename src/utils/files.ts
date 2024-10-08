import { existsSync, unlink } from "fs";

export const getPublicImageUrl = (imageName: string) =>
  `${process.env.APP_URL}/images/${imageName}`;

export const deleteFile = (filePath: string) => {
  if (filePath && existsSync(filePath)) {
    unlink(filePath, (err) => {
      if (err) {
        console.error(`Error while deliting file ${filePath}`, err);
      }
    });
  }
};
