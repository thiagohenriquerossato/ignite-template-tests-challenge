import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase ;
let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository

describe("Show User Profile Use Case", () =>{
  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory);
  });
  it("should be able to show profile user", async ()=>{
    const newUser:ICreateUserDTO = {
      name:"User name test",
      email:"user.email@test.com",
      password:"passwordTest",
    }
    const user = await createUserUseCase.execute(newUser);

    const profile = await showUserProfileUseCase.execute(user.id as string)
    expect(profile).toHaveProperty("name")
  })

  it("should not be able to show a non exists profile user", async ()=>{

    expect(async ()=>{
      const newUser:ICreateUserDTO = {
        name:"User name test",
        email:"user.email@test.com",
        password:"passwordTest",
      }
      const user = await createUserUseCase.execute(newUser);

      const profile = await showUserProfileUseCase.execute("Non exists ID")
    }).rejects.toBeInstanceOf(ShowUserProfileError)
  })

})
