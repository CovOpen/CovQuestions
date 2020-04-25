import { md5 } from "./utility";

test("md5", () => {
  expect(md5("test")).toBe("098f6bcd4621d373cade4e832627b4f6");
});
