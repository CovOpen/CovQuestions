import { expectEx } from "./common";

describe("Date conversion", () => {
  expectEx('12345 convert_to_date_string "YYYY.MM.DD"', {
    convert_to_date_string: [12345, "YYYY.MM.DD"],
  });

  expectEx('q_contact_date convert_to_date_string "YYYY.MM.DD"', {
    convert_to_date_string: [{ var: "q_contact_date" }, "YYYY.MM.DD"],
  });

  expectEx('q_contact_date + v_two_days convert_to_date_string "YYYY.MM.DD"', {
    convert_to_date_string: [{ "+": [{ var: "q_contact_date" }, { var: "v_two_days" }] }, "YYYY.MM.DD"],
  });
});
