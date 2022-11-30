import React, { useEffect, useState } from "react";
import {
  API_getAllPlantLogsFromUser,
  API_getAllPlantsFromUser,
} from "../../utils/Plants/API_Functions";

function DiaryItem({ plant }) {}

export default function AllDiaries() {
  const [plants, setPlants] = useState(null);

  useEffect(() => {
    API_getAllPlantsFromUser()
      .then((response) => {
        setPlants(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(async () => {
    if (!plants) return;
    let listOfDiaries = plants.map(async (plant) => {
      const response = await API_getAllPlantLogsFromUser(plant._id);
      if (response.data.success) {
        return response.data.data;
      }
      return null;
    });
  }, [plants]);

  return <div></div>;
}
