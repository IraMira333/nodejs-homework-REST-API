import mongoose from "mongoose";
import request from "supertest";
import app from "../../app.js";
import User from "../../models/User.js";

const { DB_HOST_TEST, PORT } = process.env;

describe("test login route", () => {
  let server = null;
  beforeAll(async () => {
    await mongoose.connect(DB_HOST_TEST);
    server = app.listen(PORT);
  });

  afterAll(async () => {
    await mongoose.connection.close();
    server.close();
  });

  test("test login with correct data", async () => {
    const loginData = {
      token:
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1MGM0NjIxMTE3MjJhYzc5M2RhOTk3OCIsImlhdCI6MTY5NTY3NzEwOCwiZXhwIjoxNjk1NzU5OTA4fQ.pPIK0hBz1XDRXKNz47BPA8vLQhn99h8DBtFpSZOFrks",
      email: "Margosha4@gmail.com",
      password: "Margosha123",
      subscription: "starter",
    };
    const { statusCode, body } = await request(app)
      .post("/api/users/login")
      .send(loginData);
    console.log(statusCode);
    console.log(body);
    expect(statusCode).toBe(200);
    expect(body.user.email).toBe(loginData.email);
    expect(body.user.subscription).toBe(loginData.subscription);
    expect(body.token).toBe(loginData.token);

    const user = await User.findOne({ email: loginData.email });
    expect(user.email).toBe(loginData.email);
  });
});
