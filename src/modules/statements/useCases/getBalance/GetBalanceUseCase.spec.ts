import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";


let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository
let getBalanceUseCase: GetBalanceUseCase
let usersRepositoryInMemory: InMemoryUsersRepository

describe("Show User Profile Use Case", () =>{
  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getBalanceUseCase = new GetBalanceUseCase(statementsRepositoryInMemory, usersRepositoryInMemory);
  });

  it("should be able to get user's balance", async ()=>{
    const newUser:ICreateUserDTO = {
      name:"User name test",
      email:"user.email@test.com",
      password:"passwordTest",
    }
    const user = await createUserUseCase.execute(newUser);
    const balance = await getBalanceUseCase.execute({user_id: user.id as string })

    expect(balance).toHaveProperty("statement")

  });

  it("should not be able to get a non exists user's balance", async ()=>{


    expect(async ()=>{
    await getBalanceUseCase.execute({user_id: "non exists user" })
    }).rejects.toBeInstanceOf(GetBalanceError)

  });
})
