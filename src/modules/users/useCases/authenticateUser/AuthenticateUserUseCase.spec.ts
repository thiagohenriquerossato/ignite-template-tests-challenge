import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let createUserUseCase: CreateUserUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase

describe("Authenticate user",()=>{
  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory);
  });

  it("should be able to authenticate an user",async ()=>{
    const user:ICreateUserDTO = {
      name:"User name test",
      email:"user.email@test.com",
      password:"passwordTest",
    };

    await createUserUseCase.execute(user)

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password,
    })

    expect(result).toHaveProperty("token")
  });

  it("should not be able to authenticate an user with incorrect password",async ()=>{

    expect(async ()=>{
      const user:ICreateUserDTO = {
        name:"User name test",
        email:"user.email@test.com",
        password:"passwordTest",
      };

      await createUserUseCase.execute(user)

      const result = await authenticateUserUseCase.execute({
        email: user.email,
        password: "wrong password ",
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })
})
