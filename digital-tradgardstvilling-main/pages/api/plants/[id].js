import dbConnect from "../../../utils/dbConnect";
import Plant from '../../../models/plant';
import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

//Vad funktionen ska göra vid olika metoder som "POST", "GET" etc.

//GET -> Hämta plantan som matchar user_id  OCH plant_id-> CODE: 200 OK

//DELETE -> Ta bort plantan som matchar user_id och plant_id 

// PATCH -> Uppdatera plantan som matchar user_id och plant_id med ny information

// Om det är någon annan metod som DELETE, PUT etc. -> Gör ingenting, skicka tillbaka 4XX : Bad request

dbConnect(); //Connect to database

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);
  const { id } = req.query

    
  switch(req.method){
    case "GET":
      try {
        const plants = await Plant.find({_id: id})
        if(plants.length == 0 || plants === null){
          res.status(400).json({success: false, data: `No plant with id ${id} found`})
        }
        else{
          res.status(200).json({success: true, data: plants})
        }
        
      } catch (error) {
        console.log(error)
        res.status(400).json({success: false, error: error})
        
      }
      break;

    case "DELETE":
      try {
        await Plant.deleteOne({ _id: id });
        res.status(202).json({success: true})
      } catch (error) {
        res.status(400).json({success: false})
      }
      break;

      case "PATCH":
        try {
          const update = req.body;
          await Plant.updateOne({ _id: id }, update);
          res.status(202).json({success: true})
        } catch (error) {
          res.status(400).json({success: false})
        }

    default:
      res.status(res.status(400).json({success: false, data: "Bad request"} ))
      break;
  }
});