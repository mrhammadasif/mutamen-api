import * as mongoose from "mongoose"
import * as idValidator from "mongoose-id-validator"
import * as autopopulate from "mongoose-autopopulate"
import mongooseSanitize from "../core/sanitize-schema"
import {convertEnumToStringArray, hashPassword} from "../core/common"
import * as ch from "chance"
const chance = ch()

const Schema = mongoose.Schema
const ObjectId = mongoose.Types.ObjectId

export enum Roles {
  admin = "admin",
  normalUser = "normalUser",
  paidUser = "paidUser",
  student = "student"
}

export enum UserStatus {
  registered = "registered",
  admitted = "admitted",
  certified = "certified"
}
export const RolesAll = [
  Roles.admin,
  Roles.normalUser,
  Roles.paidUser
]

const mySchema = new Schema(
  {
    email: {
      required: "Email is required",
      index: true,
      unique: "User has already registered with the given email",
      type: String,
      trim: true,
      lowercase: true
    },
    name: String,
    password: {
      required: "Password is required",
      type: String,
      set: hashPassword
    },
    // use this for saving any additional information for the user
    profile: mongoose.Schema.Types.Mixed,
    status: {
      type: String,
      default: UserStatus.registered,
      enum: convertEnumToStringArray(UserStatus)
    },
    type: {
      type: String,
      default: Roles.student,
      enum: convertEnumToStringArray(Roles)
    },
    resetToken: {
      select: false,
      type: String
    },
    registeredAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
)

mySchema.plugin(require("mongoose-unique-validator"))
mySchema.plugin(mongooseSanitize)
mySchema.plugin(idValidator)
mySchema.plugin(autopopulate)
mySchema.set("toObject", {getters: true})
mySchema.set("toJSON", {getters: true})

export default mongoose.model<any>("User", mySchema)
