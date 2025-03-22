import { Document } from "mongoose";

interface IUser extends Document {
  _id: string;
  username: string;
  password: string;
  comparePassword(password: string): Promise<boolean>;
}

export { IUser };
