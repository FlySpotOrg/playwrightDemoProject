import { Credentials } from "../types/types";
import * as dotenv from "dotenv";

dotenv.config();

export const admin: Credentials = {
  username: process.env.ADMIN_USERNAME,
  password: process.env.ADMIN_PASSWORD,
};

export const environments = {
  uat: {
    applications: {
      neevadmin: {
        baseURL: "https://automationintesting.online",
        users: {
          admin: { username: "admin", password: "password" },
          user: { username: "user", password: "password" }
        }
      },
      compass: {
        baseURL: "https://automationintesting.online",
        users: {
          admin: { username: "admin", password: "password" }
        }
      }
    }
  },
  dev: {
    applications: {
      neevadmin: {
        baseURL: "https://automationintesting.online",
        users: {
          admin: { username: "admin", password: "password" }
        }
      }
    }
  }
};