import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";

const { DB_HOST_TEST, PORT } = process.env;

describe("test singup route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  test("test singup with correct data", async () => {
    const singUpData = {
      username: "Margo7",
      email: "Margosha7@gmail.com",
      password: "Margosha12345",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/register")
      .send(singUpData);
    console.log(statusCode);
    console.log(body);
    expect(statusCode).toBe(201);
    expect(body.user.username).toBe(singUpData.username);
    expect(body.user.email).toBe(singUpData.email);

    const user = await User.findOne({ email: singUpData.email });
    expect(user.email).toBe(singUpData.email);
  });
});
