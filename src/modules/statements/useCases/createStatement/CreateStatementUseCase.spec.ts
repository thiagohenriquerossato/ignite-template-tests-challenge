import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
import { ICreateStatementDTO } from "./ICreateStatementDTO";


let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let usersRepositoryInMemory: InMemoryUsersRepository;

describe("Show User Profile Use Case", () =>{
  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory,statementsRepositoryInMemory);
  });

  it("should be able to deposit on user's account ", async ()=>{
    const newUser:ICreateUserDTO = {
      name:"User name test",
      email:"user.email@test.com",
      password:"passwordTest",
    }
    const user = await createUserUseCase.execute(newUser);

    const operation: ICreateStatementDTO = {
      user_id: user.id!,
      type: "deposit" as any,
      amount: 100,
      description: "description test",
    }
    const balance = await createStatementUseCase.execute(operation)
    expect(balance).toHaveProperty("id")

  });

  it("should not be able to get a non exists user's balance", async ()=>{


    expect(async ()=>{
    await createStatementUseCase.execute({
      user_id: "non exists ID",
      type: "deposit" as any,
      amount: 100,
      description: "description test",
    })
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)

  });

  it("should be able do a withdraw in an user's account", async ()=>{

    const newUser:ICreateUserDTO = {
      name:"User name test",
      email:"user.email@test.com",
      password:"passwordTest",
    }
    const user = await createUserUseCase.execute(newUser);

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: "deposit" as any,
      amount: 100,
      description: "description test",
    })

    const balance = await createStatementUseCase.execute({
      user_id: user.id!,
      type: "withdraw" as any,
      amount: 100,
      description: "description test",
    })

    expect(balance).toHaveProperty("id")
  });

  it("should not be able do a withdraw in an user's account with insufficient funds", async ()=>{

    const newUser:ICreateUserDTO = {
      name:"User name test",
      email:"user.email@test.com",
      password:"passwordTest",
    }
    const user = await createUserUseCase.execute(newUser);

    await createStatementUseCase.execute({
      user_id: user.id!,
      type: "deposit" as any,
      amount: 50,
      description: "description test",
    })

    expect(async ()=>{
      await createStatementUseCase.execute({
        user_id: user.id!,
        type: "withdraw" as any,
        amount: 100,
        description: "description test",
      })
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds)
  });
})
