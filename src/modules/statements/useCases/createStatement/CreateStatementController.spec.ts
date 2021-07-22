import { Connection, createConnection } from "typeorm"
import request from "supertest";
import faker from "faker";
import { app } from "../../../../app";
import { FakerUser } from "../../../../shared/faker/FakerUser";

let connection: Connection
describe("Create Statement Controller", ()=>{

  beforeAll(async()=>{
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async()=>{
    await connection.close();
  });

  it("should be able to create a statement deposit", async ()=>{
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

    const response = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "cashback",
    }).set({
      authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
  })

  it("should be able to create a statement withdraw", async ()=>{
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

    await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "cashback",
    }).set({
      authorization: `Bearer ${token}`,
    });

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 100,
      description: "house",
    }).set({
      authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(201);
  })

  it("should not be able to create a statement withdraw without founds", async ()=>{
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

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 100,
      description: "house",
    }).set({
      authorization: `Bearer ${token}`,
    });

    expect(response.status).toBe(400);
  })

  it("should not be able to create a statement withdraw with unauthorized user", async ()=>{
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


    await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "cashback",
    }).set({
      authorization: `Bearer ${token}`,
    });

    const response = await request(app).post("/api/v1/statements/withdraw").send({
      amount: 100,
      description: "house",
    }).set({
      authorization: "invalidToken"
    });

    expect(response.status).toBe(401);
  })
})
