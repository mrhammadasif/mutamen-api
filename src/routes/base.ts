import * as express from "express"
import * as cors from "cors"

import {GenerateResp, Reason} from "../core/common-errors"

export default class BaseRouter {
  private App: express.Application

  constructor (App: express.Application) {
    this.App = App
  }

  public initApp = (): express.Application => {
    const App: express.Application = this.App
    const MyRouter: express.Router = express.Router()
    MyRouter.use(cors())
    MyRouter.use("/", new (require("../controllers/api-controller")).Controller()
      .getRouter())
    // use cors for api requests

    App.use("/", MyRouter)
    return App
  }
}
