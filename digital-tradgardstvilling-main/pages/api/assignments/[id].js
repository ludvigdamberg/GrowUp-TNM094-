import dbConnect from "../../../utils/dbConnect";
import Plant from "../../../models/plant";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

dbConnect(); //Connect to database

let uniqueID = () => {
  return Math.floor((1 + Math.random()) * 0x10000)
    .toString(16)
    .substring(1);
};

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);
  const { id } = req.query;

  switch (req.method) {
    case "GET":
      try {
        const plants = await Plant.find({ _id: id });
        if (plants.length == 0 || plants === null) {
          res
            .status(400)
            .json({ success: false, data: `No plant with id ${id} found` });
        } else {
          res.status(200).json({ success: true, data: plants[0].assignments });
        }
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error });
      }
      break;

    case "DELETE":
      try {
        console.log(req.body.id);
        const assignmentID = req.body.id;
        console.log(assignmentID);
        const plant = await Plant.find({ _id: id });
        if (plant.length == 0 || plant === null) {
          res
            .status(400)
            .json({ success: false, data: `No plant with id ${id} found` });
        } else {
          let update = plant[0].assignments;
          console.log(update);
          update = update.filter((item) => {
            if (item === null) {
              return false;
            }
            console.log(item._id, assignmentID);
            return item._id !== assignmentID;
          });
          console.log(update);

          await Plant.updateOne({ _id: id }, { assignments: update });
          return res
            .status(200)
            .json({ success: true, message: "Assigntment deleted" });
        }

        res.status(202).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;

    case "PATCH":
      try {
        const assignmentID = req.body.id;
        const plant = await Plant.find({ _id: id });
        if (plant.length == 0 || plant === null) {
          res
            .status(400)
            .json({ success: false, data: `No plant with id ${id} found` });
        } else {
          let update = plant[0].assignments;
          update = update.map((item) => {
            if (item._id === assignmentID) {
              return {
                text: item.text,
                _id: item._id,
                done: !item.done,
                duedate: item.duedate,
              };
            }
            return item;
          });

          await Plant.updateOne({ _id: id }, { assignments: update });
          return res
            .status(201)
            .json({ success: true, message: "Assigntmen updateded" });
        }

        res.status(202).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }

    case "POST":
      try {
        const assignment = req.body.assignment;
        const plant = await Plant.find({ _id: id });
        if (plant.length == 0 || plant === null) {
          res
            .status(400)
            .json({ success: false, data: `No plant with id ${id} found` });
        } else {
          let update = plant[0].assignments;
          assignment._id = uniqueID();

          await Plant.updateOne(
            { _id: id },
            { assignments: [...update, assignment] }
          );
          return res
            .status(201)
            .json({ success: true, message: "Assigntmen added" });
        }

        res.status(202).json({ success: true });
      } catch (error) {
        res.status(400).json({ success: false });
      }

    default:
      res.status(res.status(400).json({ success: false, data: "Bad request" }));
      break;
  }
});
