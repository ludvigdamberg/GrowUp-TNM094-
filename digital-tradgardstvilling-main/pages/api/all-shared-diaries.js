import dbConnect from "../../utils/dbConnect";
import ShareDiary from "../../models/sharediary";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

dbConnect(); //Connect to database

async function generateUniqueID(ids) {
  var id = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++)
    id += possible.charAt(Math.floor(Math.random() * possible.length));

  const sharedDiaries = await ShareDiary.find({});

  if (ids.includes(id)) {
    id = generateUniqueID(ids);
  }
  return id;
}

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);

  switch (req.method) {
    case "GET":
      try {
        let code = req.query.code;
        const diary = await ShareDiary.find({ user_id: session.user.sub });
        if (diary.length === 0) {
          res.status(200).json({ success: false });
          return;
        }

        res.status(200).json({ success: true, data: diary });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;

    default:
      res.status(res.status(400).json({ success: false, data: "Bad request" }));
      break;
  }
});
