import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import "dotenv/config.js";
import User from "../../models/User.js";

const { DB_HOST, PORT } = process.env;

describe("test login route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  // afterEach(async () => {
  //   await User.deleteMany({});
  // });

  test("test login with correct data", async () => {
    const loginData = {
      //username: "Margo7",
      email: "Margosha4@gmail.com",
      password: "Margosha123",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);
    console.log(statusCode);
    console.log(body);

    const user = await User.findOne({ email: loginData.email });
    expect(user.email).toBe(loginData.email);
    expect(statusCode).toBe(200);
    expect(body.user.subscription).toBe(user.subscription);
    expect(body.user.email).toBe(loginData.email);
  });
});
