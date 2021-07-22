import { Connection, createConnection } from "typeorm"
import request from "supertest";
import { app } from "../../../../app";
import { FakerUser } from "../../../../shared/faker/FakerUser";

let connection: Connection
describe("Create User Controller", ()=>{
  beforeAll(async ()=>{
    connection = await createConnection()
    await connection.dropDatabase();
    await connection.runMigrations();
  });

  afterAll(async ()=>{
    await connection.close();
  });


  it("should be able to create a new user", async ()=>{
    const user = new FakerUser();

    const response = await request(app).post("/api/v1/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    })
    expect(response.status).toBe(201);
  })
})
