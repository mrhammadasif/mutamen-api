import FavModel, {IFavCar} from "../models/favouriteCars"

export default async function () {

  if (!(await FavModel.findOne())) {
    new FavModel({
      customerName: "Customer A",
      cars: [
        "Ford",
        "BMW",
        "Fiat"
      ]
    } as IFavCar).save()
  }
}
