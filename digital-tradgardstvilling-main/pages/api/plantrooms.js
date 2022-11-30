import dbConnect from "../../utils/dbConnect";
import Plant from "../../models/plant";
import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";

//Vad funktionen ska göra vid olika metoder som "POST", "GET" etc.

//GET -> Hämta ALLA plantor som matchar user_id -> CODE: 200 OK

//POST -> Skapa ny planta med information som skickas med -> CODE: 201

// Om det är någon annan metod som DELETE, PUT etc. -> Gör ingenting, skicka tillbaka 4XX : Bad request

// Denna funktionen kollar per automatik om användaren är autentisierad och utför funktionen om så är fallet.
//Om inte -> Användaren får ett 401 svar : "Not authenticated"

dbConnect(); //Connect to database

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);
  console.log(req.body);

  switch (req.method) {
    case "GET":
      try {
        const plants = await Plant.find({ user_id: session.user.sub });
        const rooms = new Set();
        plants.forEach((element) => {
          if (element.location !== undefined && element.location.trim() !== "")
            rooms.add(element.location);
        });
        res.status(200).json({ success: true, data: Array.from(rooms) });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(res.status(400).json({ success: false, data: "Bad request" }));
      break;
  }
});
