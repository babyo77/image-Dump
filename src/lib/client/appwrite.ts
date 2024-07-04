import { Client, Account, Databases } from "appwrite";
export const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.PROJECT_ID || "");

export const account = new Account(client);
export const database = new Databases(client);
