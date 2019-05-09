import * as express from "express"
import * as asyncHandler from "express-async-handler"
import {values, flatten, sortedUniq} from "lodash"
import FavModel from "../models/favouriteCars"
import {asyncForEach} from "../core/array-utils"
import {GenerateResp, Reason} from "../core/common-errors"
import {query, body, validationResult} from "express-validator/check"
import {validationErrorChecker} from "../core/error-handler"

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
      body("customerName", "Valid Customer Name is Required").exists(),
      body("carA", "Valid 3 Cars Required").exists(),
      body("carB", "Valid 3 Cars Required").exists(),
      body("carC", "Valid 3 Cars Required").exists()
    ],
    asyncHandler(async function (req: express.Request, res: express.Response) {

      const errors = validationResult(req)
      if (!errors.isEmpty()) {
        return res.status(422).json(GenerateResp(
          sortedUniq(errors.array().map((er: any) => er.msg)),
          Reason.validation))
      }

      const newFav = new FavModel({
        customerName: req.body.customerName,
        cars: [
          req.body.carA,
          req.body.carB,
          req.body.carC
        ]
      })
      await newFav.save()

      res.json(GenerateResp("ok", Reason.inserted))
    })
  ]

}
