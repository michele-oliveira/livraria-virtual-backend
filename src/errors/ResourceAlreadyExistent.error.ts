import { HttpError } from "routing-controllers";

export default class ResourceAlreadyExistent extends HttpError {
  constructor(message: string) {
    super(409, message);
    this.name = "ResourceAlreadyExistent";
  }
}
