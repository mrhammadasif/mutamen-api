import * as express from "express"
import * as asyncHandler from "express-async-handler"
import {values, flatten} from "lodash"
import FavModel from "../models/favouriteCars"
import {asyncForEach} from "../core/array-utils"
import {GenerateResp, Reason} from "../core/common-errors"
import {query} from "express-validator/check"

require("dotenv").config()

export class Controller {
  public getRouter (): express.Router {
    const router: express.Router = express.Router()

    router.get("/", this.getFavs)
    router.post("/", ...this.insertFav)

    return router
  }

  private getFavs = asyncHandler(async function (req: express.Request, res: express.Response) {
    const pageToLoad = req.query.p || 1
    const recordsPerPage = 12
    const favs = await FavModel
      .find()
      .limit(recordsPerPage)
      .skip(recordsPerPage * (pageToLoad - 1))
    res.json(GenerateResp(favs, Reason.success))
  })

  private insertFav = [
    [
      query("customerName").exists(),
      query("carA").exists(),
      query("carB").exists(),
      query("carC").exists()
    ],
    asyncHandler(async function (req: express.Request, res: express.Response) {

      const newFav = new FavModel({
        customerName: req.query.customerName,
        cars: [
          req.query.carA,
          req.query.carB,
          req.query.carC
        ]
      })
      await newFav.save()

      res.json(GenerateResp("ok", Reason.inserted))
    })
  ]

}
