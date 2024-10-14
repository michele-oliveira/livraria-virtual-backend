import { BookFilesDTO } from "../../interfaces/dto";

export type BookFilesNames = {
  [K in keyof BookFilesDTO]: string;
};
