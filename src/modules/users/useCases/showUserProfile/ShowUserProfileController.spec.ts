
import { Connection, createConnection } from "typeorm"
import request from "supertest";
import { app } from "../../../../app";
import { FakerUser } from "../../../../shared/faker/FakerUser";

let connection: Connection
describe("show User Profile Controller", ()=>{
  beforeAll(async ()=>{
    connection = await createConnection()
    await connection.runMigrations();
  });

  afterAll(async ()=>{
    await connection.close();
  });


  it("should be able to show an user profile", async ()=>{
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
    const { token } = responseToken.body;

    const response =  await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(200);
  });

  it("should not be able to show an user profile with a invalid token", async ()=>{


    const response =  await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: 'Bearer anInvalidToken',
    });

    expect(response.status).toBe(401);
  })
})
