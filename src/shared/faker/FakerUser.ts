import faker from "faker";

export class FakerUser {
  name: string;

  email: string;

  password: string;

  constructor(){
    this.name = faker.name.firstName();
    this.email = faker.internet.email();
    this.password = "randomPass";
  }
}
