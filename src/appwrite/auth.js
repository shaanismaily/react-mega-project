import conf from "../conf.js";

import { Client, Account, ID } from "appwrite";

export class AuthService {
  client = new Client();
  account;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.account = new Account(this.client);
  }

  async createAccount({ email, password, name }) {
  try {
    const userAccount = await this.account.create(
      ID.unique(),
      email,
      password,
      name
    );

    if (!userAccount) return null;

    await this.login({ email, password });
    return userAccount;

  } catch (error) {
    console.error("Signup failed:", error.message);
    throw error;
  }
}

  async login({ email, password }) {
    try {
      return await this.account.createEmailPasswordSession(email, password);
    } catch (error) {
      console.error("Login failed:", error.message);
      throw error;
    }
  }

  async getCurrentUser() {
    try {
      return await this.account.get();
    } catch (error) {
      console.log("Appwrite service :: getCurrentUser :: error: ", error);
    }
    return null; // in case try block doesn't return anything
  }

  async logout() {
    try {
      return await this.account.deleteSessions();
    } catch (error) {
      console.log("Appwrite service :: logout :: error: ", error);
    }
  }
}

const authService = new AuthService();

export default authService;
