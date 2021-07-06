import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"
import { ICreateUserDTO } from "./ICreateUserDTO";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository

describe("Create User Use Case", () =>{
  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to create a new user", async()=>{
    const newUser:ICreateUserDTO = {
      name:"User name test",
      email:"user.email@test.com",
      password:"passwordTest",
    }

    const user = await createUserUseCase.execute({
      name: newUser.name,
      email: newUser.email,
      password:newUser.password
    });
    expect(user).toHaveProperty("id")
  });

  it("should not be able to create a new user with email exists", async()=>{

    expect(async ()=>{
      const newUser = {
        name:"User name test",
        email:"user.email@test.com",
        password:"passwordTest",
      }

      await createUserUseCase.execute({
        name: newUser.name,
        email: newUser.email,
        password:newUser.password
      });
      await createUserUseCase.execute({
        name: newUser.name,
        email: newUser.email,
        password:newUser.password
      });
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
