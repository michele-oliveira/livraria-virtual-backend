import { Get, JsonController } from "routing-controllers";

@JsonController("/users")
export class UsersController {
  @Get("/teste")
  teste() {
    return {
      ok: true
    }
  }
}
