import {IResponseError} from "../interfaces"
import {isArrayLikeObject, size} from "lodash"
import {isString, isObject, isArray} from "util"

export enum Reason {
  // db errors
  dbValidationError = "dbValidationError",
  dbConnectionError = "dbConnectionError",
  dbError = "dbError",
  dbDuplicateError = "dbDuplicateError",
  // auth errors
  authFailed = "authFailed",
  loggedIn = "loggedIn",
  authCodeMissing = "authCodeMissing",
  authCodeExpired = "authCodeExpired",
  invalidAuthCode = "invalidAuthCode",
  corruptToken = "corruptToken",
  notPermitted = "notPermitted",
  timeout = "timeout",
  // general responses
  noData = "noData",
  success = "success",
  deleted = "deleted",
  inserted = "inserted",
  updated = "updated",
  validation = "validation",
  // undefined error
  badCredentials = "badCredentials",
  serverError = "serverError",
  unknown = "unknown",
  stripeError = "stripeError",
  subscribed = "subscribed"
}

export enum StatusCode {
  // db errors
  success = 200,
  inserted = 201,
  badRequest = 400,
  auth = 401,
  forbidden = 403,
  server = 500
}

const $default = {
  message: "undefined",
  why: Reason[Reason.unknown],
  field: "none"
}

export const AuthError: IResponseError = {
  why: Reason[Reason.authFailed],
  msg: "Authorization Failed for this request",
  field: "Authorization"
}

export const DBConnectionError: IResponseError = {
  why: Reason[Reason.dbConnectionError],
  msg: "Database Connection Failed",
  field: "none"
}

export const GenerateResp = (message: any, reason: Reason, field?): IResponseError => {
  const ro: IResponseError = {
    why: reason,
    msg: message,
    count: 0,
    field
  }

  if (isObject(message) || isArray(message)) {
    ro.msg = "#data"
    ;(ro as IResponseError).data = message
  }

  if (isArray(message)) {
    ro.count = size(message)
  } else {
    delete ro.count
  }

  return ro
}
