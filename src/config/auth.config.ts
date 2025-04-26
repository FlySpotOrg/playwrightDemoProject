import { Credentials } from "../types/types";
import * as dotenv from "dotenv";

dotenv.config();

export const admin: Credentials = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};
