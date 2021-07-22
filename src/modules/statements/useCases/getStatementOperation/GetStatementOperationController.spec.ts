import { Connection, createConnection } from "typeorm"
import request from "supertest";
import { app } from "../../../../app";
import { FakerUser } from "../../../../shared/faker/FakerUser";

let connection: Connection

interface Text {
  id:string;
  user_id:string;
  description:string;
  amount:number;
  type:string;
  created_at:Date;
  updated_at:Date
}
describe("Get Statement Operation Controller", ()=>{
  beforeAll(async ()=>{
    connection = await createConnection()
    await connection.runMigrations();
  });

  afterAll(async ()=>{
    await connection.close();
  });


  it("should be able to get statement operation by id", async ()=>{

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

    const responseBody = await request(app).post("/api/v1/statements/deposit").send({
      amount: 100,
      description: "cashback",
    }).set({
      authorization: `Bearer ${token}`,
    });
    const {body} = responseBody;
    const response = await request(app).get(`/api/v1/statements/${body.id}`).set({
      authorization: `Bearer ${token}`,
    })

    expect(response.status).toBe(200);
  })
})
