import dbConnect from "../../../utils/dbConnect";
import PlantLog from "../../../models/plantlog";
import Plant from "../../../models/plant";

import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

dbConnect();

export default async function handler(req, res) {
  console.log("hej");
  const { params } = req.query;

  if (params.length == 1) {
    //Return all plantlogs for the corresponding ID
    const plant_id = params[0];

    switch (req.method) {
      case "GET":
        try {
          const plantlogs = await PlantLog.find({ plant_id: plant_id }).sort({
            created_at: -1,
          });

          res.status(200).json({ success: true, data: plantlogs });
        } catch (error) {
          res.status(500).json({ success: false, message: " Error in GET" });
        }

        break;
      case "POST":
        try {
          const session = getSession(req, res);
          const USER_ID = session.user.sub;
          const content = {
            plant_id: plant_id,
            user_id: USER_ID,
            description: req.body.description,
            img: req.body.img,
          };
          var plant = new PlantLog(content);
          var plantlogcreated = await plant.save();
          return res.status(201).send(plantlogcreated);
        } catch (error) {
          return res.status(500).send(error);
        }
        break;

      case "DELETE":
        try {
          await PlantLog.deleteMany({ plant_id: plant_id });
          res.status(202).json({ success: true });
        } catch (error) {
          res.status(500).json({ success: false });
        }
        break;

      default:
        res
          .status(400)
          .json({ success: false, error: "Bad request: No matching method" });
    }
  } else if (params.length == 2) {
    //Return one plantlog for the corresponding IDs
    const [_, log_id] = params;

    switch (req.method) {
      case "GET":
        try {
          const plantlog = await PlantLog.find({
            user_id: USER_ID,
            _id: log_id,
          });
          if (plantlog.length == 0 || plantlog === null) {
            res.status(400).json({
              success: false,
              data: `No plantlogs found for this user`,
            });
          } else {
            res.status(200).json({ success: true, data: plantlog });
          }
        } catch (error) {
          res.status(500).json({ success: false });
        }
        break;
      case "PATCH":
        try {
          const update = req.body;
          await PlantLog.updateOne({ _id: log_id }, update);
          res.status(202).json({ success: true });
        } catch (error) {
          res.status(500).json({ success: false });
        }
        break;
      case "DELETE":
        try {
          await PlantLog.deleteOne({ _id: log_id });
          res.status(202).json({ success: true });
        } catch (error) {
          res.status(500).json({ success: false });
        }

        break;
      default:
        res.status(400).json({ success: false, error: "Bad request" });
    }
  } else {
    return res.status(200).json({ success: true });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb", // Set desired value here
    },
  },
};
