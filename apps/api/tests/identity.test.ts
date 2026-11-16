import assert from "node:assert/strict";
import test from "node:test";
import { EDU_EMAIL_REGEX, registerHostSchema, registerGuestSchema } from "@quickattend/contracts";
import { PASSWORD_PATTERN } from "../src/config/security.js";

test("edu email regex validates valid school domains and rejects invalid ones", () => {
  assert.equal(EDU_EMAIL_REGEX.test("lecturer@hcmut.edu.vn"), true);
  assert.equal(EDU_EMAIL_REGEX.test("teacher@mit.edu"), true);
  assert.equal(EDU_EMAIL_REGEX.test("user@gmail.com"), false);
  assert.equal(EDU_EMAIL_REGEX.test("fake@edu.vn.attacker.com"), false);
});

test("password pattern enforces strong passwords", () => {
  const pattern = new RegExp(`^${PASSWORD_PATTERN}$`);
  assert.equal(pattern.test("QuickAttend@2026"), true);
  assert.equal(pattern.test("short1!"), false); // too short
  assert.equal(pattern.test("nocapitalletter1!"), false);
  assert.equal(pattern.test("NOSPECIAL1234"), false);
});

test("host registration schema validates edu email requirement", () => {
  const validHost = {
    fullName: "Nguyễn Văn Giảng",
    email: "nvgiang@hcmut.edu.vn",
    password: "Password@123",
  };
  assert.equal(registerHostSchema.safeParse(validHost).success, true);

  const invalidHost = {
    fullName: "Nguyễn Văn Giảng",
    email: "nvgiang@gmail.com",
    password: "Password@123",
  };
  assert.equal(registerHostSchema.safeParse(invalidHost).success, false);
});
