import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { IUser } from "../@types/userInterfaces";

const userSchema = new mongoose.Schema<IUser>({
  username: {
    type: String,
    required: [true, "A user must have a username"],
    unique: true,
  },
  password: {
    type: String,
    required: [true, "A user must have a password"],
    minlength: 4,
    select: false,
  },
});

// @ts-ignore
userSchema.pre("save", async function (this: IUser, next: NextFunction) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = mongoose.model<IUser>("user", userSchema);
export default User;
