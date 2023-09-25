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
      token: "jfhfdcgxfgchjghklkjhgfcdxfxdfcghj",
      user: { email: "margosha@gmail.com", subscription: "starter" },
    };
    const { statusCode, body } = await request(app)
      .post("api/users/login")
      .send(loginData);
    expect(statusCode).toBe(200);
    expect(body.user.email).toBe(loginData.user.email);
    expect(body.user.subscription).toBe(loginData.user.subscription);
    expect(body.token).toBe(loginData.token);

    const user = await User.findOne({ email: loginData.user.email });
  });
});
