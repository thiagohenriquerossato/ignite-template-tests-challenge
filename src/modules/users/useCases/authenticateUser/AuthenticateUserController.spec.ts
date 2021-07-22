import { Connection, createConnection } from "typeorm"
import request from "supertest";
import { app } from "../../../../app";
import { FakerUser } from "../../../../shared/faker/FakerUser";

let connection: Connection
describe("Authenticate User Controller", ()=>{
  beforeAll(async ()=>{
    connection = await createConnection()
    await connection.runMigrations();
  });

  afterAll(async ()=>{
    await connection.close();
  });


  it("should be able to authenticate an user", async ()=>{

    const user = new FakerUser();

    await request(app).post("/api/v1/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    })
    expect(response.body).toHaveProperty("token");
  })

  it("should be able to authenticate an user", async ()=>{
    const user = new FakerUser();

    await request(app).post("/api/v1/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    const response = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: "wrong password"
    })
    expect(response.status).toBe(401)
  })
})
