import { z } from "zod";
export const loginschema = z.object({
  email: z
    .string({ required_error: "email is require" })
    .trim()
    .email({ message: "invalid email address" })
    .min(3, { message: "email must be at least 3 character" })
    .max(255, { messsage: "email more than 255 character" }),
  password: z
    .string({ required_error: "password is require" })
    .trim()
    .min(7, { message: "password must be at least 6 character" })
    .max(255, { messsage: "password more than 255 character" }),
});

export const signupschema = loginschema.extend({
  username: z
    .string({ required_error: "Name is require" })
    .trim()
    .min(3, { message: "username must be at least 3 character" })
    .max(255, { messsage: "username more than 255 character" }),

  role: z
    .enum(["user", "organizer", "admin"], {
      required_error: "Role is required",
      invalid_type_error: "Invalid role selected",
    })
    .default("user"), // If role is missing, default to "user"
});
