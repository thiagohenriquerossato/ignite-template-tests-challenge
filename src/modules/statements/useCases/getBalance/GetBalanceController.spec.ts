import { Connection, createConnection } from "typeorm"
import request from "supertest";
import { app } from "../../../../app";
import { FakerUser } from "../../../../shared/faker/FakerUser";

let connection: Connection
describe("Get Balance Controller", ()=>{
  beforeAll(async ()=>{
    connection = await createConnection()
    await connection.runMigrations();
  });

  afterAll(async ()=>{
    await connection.close();
  });


  it("should be able to get balance of the user", async ()=>{

    const user = new FakerUser();

    await request(app).post("/api/v1/users").send({
      name: user.name,
      email: user.email,
      password: user.password,
    })

    const responseToken = await request(app).post("/api/v1/sessions").send({
      email: user.email,
      password: user.password
    })
    const {token} = responseToken.body

    const response = await request(app).get("/api/v1/statements/balance")
    .set({
      Authorization: `Bearer ${token}`,
    });
    expect(response.status).toBe(200);
  })

  it("should not be able to get balance of the user with no authentication", async ()=>{

    const response = await request(app).get("/api/v1/statements/balance")
    .set({
      Authorization: `invalidToken`,
    });
    expect(response.status).toBe(401);
  })
})
