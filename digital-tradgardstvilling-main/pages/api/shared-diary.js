import dbConnect from "../../utils/dbConnect";
import ShareDiary from "../../models/sharediary";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
const axios = require("axios");

//Vad funktionen ska göra vid olika metoder som "POST", "GET" etc.

//GET -> Hämta ALLA plantor som matchar user_id -> CODE: 200 OK

//POST -> Skapa ny planta med information som skickas med -> CODE: 201

// Om det är någon annan metod som DELETE, PUT etc. -> Gör ingenting, skicka tillbaka 4XX : Bad request

// Denna funktionen kollar per automatik om användaren är autentisierad och utför funktionen om så är fallet.
//Om inte -> Användaren får ett 401 svar : "Not authenticated"

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

export default async function ProtectedRoute(req, res) {
  const session = getSession(req, res);
  console.log(req.query.code);

  switch (req.method) {
    case "GET":
      try {
        let code = req.query.code;
        const diary = await ShareDiary.find({ code: code });
        if (diary.length === 0) {
          res.status(200).json({ success: false });
          return;
        }

        const plantID = diary[0].plant_id;

        res.status(200).json({ success: true, data: plantID });
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;

    case "DELETE":
      try {
        let code = req.query.code;
        await ShareDiary.deleteOne({ code: code });

        res.status(200).json({ success: true, message: "Deleted." });
        return;
      } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
      }
      break;

    case "POST":
      if (!session.user)
        res.status(400).json({ success: false, message: "Not authorized" });
      try {
        const sharedDiaries = await ShareDiary.find({});
        const ids = sharedDiaries.map((d) => d.code);
        const id = await generateUniqueID(ids);
        const data = {
          plant_id: req.body.plant_id,
          code: id,
          user_id: session.user.sub,
        };
        var sharedDiary = new ShareDiary(data);
        var diaryCreated = await sharedDiary.save();
        res.status(200).json({ success: true, code: id });
      } catch (error) {
        console.error(error);
        res.status(500).json({ success: false });
        return;
      }

    default:
      res.status(res.status(400).json({ success: false, data: "Bad request" }));
      break;
  }
}
