import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../users/useCases/createUser/ICreateUserDTO";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

interface IRequest {
  user_id: string;
  statement_id: string;
}

let createUserUseCase: CreateUserUseCase;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;
let usersRepositoryInMemory: InMemoryUsersRepository;
let createStatementUseCase: CreateStatementUseCase;

describe("Get Statement Operation Use Case", () =>{
  beforeEach(()=>{
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepositoryInMemory, statementsRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(usersRepositoryInMemory,statementsRepositoryInMemory);
  });

  it("should be able to get statement operation", async ()=>{
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
    const request:IRequest ={
      user_id: user.id!,
      statement_id:balance.id!
    }

    const statement = await getStatementOperationUseCase.execute(request)

    expect(statement).toHaveProperty("id");

  });

  it("should not be able to get a non existing statement operation", async ()=>{
    const newUser:ICreateUserDTO = {
      name:"User name test",
      email:"user.email@test.com",
      password:"passwordTest",
    }
    const user = await createUserUseCase.execute(newUser);

    const request:IRequest ={
      user_id: user.id!,
      statement_id:"Non Existing Operation"!
    }

    expect(async()=>{
      await getStatementOperationUseCase.execute(request)
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)

  });

  it("should not be able to get statement operation of a non existing user", async ()=>{
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
    const request:IRequest ={
      user_id: "Non Existing User",
      statement_id:balance.id!
    }

    expect(async()=>{
      await getStatementOperationUseCase.execute(request)
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  });
})
