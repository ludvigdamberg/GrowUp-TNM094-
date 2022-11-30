import { withApiAuthRequired, getSession } from "@auth0/nextjs-auth0";
const axios = require("axios");

export default withApiAuthRequired(async function ProtectedRoute(req, res) {
  const session = getSession(req, res);

  const base64 = req.body.base64;
  const data = {
    api_key: process.env.PLANT_ID_API_KEY,
    images: [base64],
    plant_language: "en",
    plant_details: [
      "common_names",
      "url",
      "name_authority",
      "wiki_description",
      "taxonomy",
      "synonyms",
    ],
  };

  switch (req.method) {
    case "POST":
      try {
        axios
          .post("https://api.plant.id/v2/identify", data)
          .then((response) => {
            res.status(200).json({ success: true, data: response.data });
          })
          .catch((error) => {
            res.status(400).json({ success: false, data: error });
          });
      } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error });
      }
      break;
    default:
      res.status(400).json({ success: false, data: "Bad request" });
      break;
  }
});
