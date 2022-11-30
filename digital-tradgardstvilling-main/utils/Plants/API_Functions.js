import axios from "axios";
import { daysFromDate } from "../daysFromDate";

// --- README ---:
/*
Varje funktion nedan returnerar datatypen "Promise" ( https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise )
Det betyder att varje gång man kallar på den måste man tänka på att kunna hantera olika fall om den skulle "faila" eller liknande.

Exemplet nedan visar hur man behöver göra varje gång man kallar på någon av funktionerna i denna fil.

-- EXEMPEL --

getAllPlantsFromUser().then((response) => {
    -- Här hanteras "response" som innehåller datan vi förväntar oss från API. I detta fall innehåller den en array med plantor.
    -- Här kan vi hantera den datan.
}).catch((error) => {
    --Här görs något som hanterar fel. T.ex. skriver ut det i console
        eller säger till användaren att något gick fel
})

-- Nedan är exakt samma funktionaliet som exemplet ovan fast med fördefinerade funktion:

getAllPlantsFromUser().then(handleResponse).catch(handleError)

Rekomemenderar att använda första exemplet dock.

När ni använder dessa funktioner bör de endast kallas på inom en "useEffect-hook" där ni använder er av useState för att uppdatera informationen som visas på sidan

Fråga gärna om ni undrar något!

*/

// --- GET ---

export async function API_getAllPlantsFromUser() {
  //Returns all instances of "plant" for the current user. No arguments required
  return axios.get("/api/plants");
}

export async function API_getAllPlantLogsFromUser(id) {
  //Returns all instances of "plantlog" for the current user.
  return axios.get("/api/plantlogs/" + id);
}

export async function API_getPlantById(id) {
  // Returns a specific plant, by _id. Field required: id
  return axios.get("/api/plants/" + id);
}

export async function API_getPlantLogById(plant_id, log_id) {
  // Returns a specific plantlog, by _id. Field required: plant_id and log_id
  return axios.get(`/api/plantlogs/${plant_id}/${log_id}`);
}

export async function API_getPlantRooms() {
  return axios.get(`/api/plantrooms`);
}

export async function API_getAssignmentsFromPlant(plant_id) {
  return axios.get(`/api/assignments/${plant_id}`);
}

// --- POST ---

export async function API_addPlantToUser(data) {
  // Adds a plant to user collection. See /models/plant for available data to fill.
  return axios.post("/api/plants/", data);
}

export async function API_addPlantLogToPlant(plant_id, data) {
  // Adds a plantlog to user plant collection. See /models/plantlog for available data to fill.
  return axios.post(`/api/plantlogs/${plant_id}`, data);
}

// Parametern assignment måste vara ett objekt nycklar som nedan:
/* 
      let myObject = {
        text: "Min uppgift som ska göras",
        done: false,
        duedate: "2022-04-10"
      }
*/
export async function API_addAssignmentToPlant(plant_id, assignment) {
  console.log(Object.keys(assignment));
  if (
    Object.keys(assignment).length !== 3 ||
    !Object.keys(assignment).includes("text") ||
    !Object.keys(assignment).includes("done") ||
    !Object.keys(assignment).includes("duedate")
  ) {
    throw "Assignment needs to a object containing only 3 keys 'text', 'duedate' and 'done'. Change the parameter when calling 'API_addAssignmentToPlant'";
  }
  return axios.post(`/api/assignments/${plant_id}`, { assignment: assignment });
}

// --- DELETE ----
// Här kan det vara bra att alltid fråga användaren en extra gång. Finns ingen återvändo när man använder dessa.

export async function API_deletePlantById(id) {
  // Deletes specifik plant from user collection. Field required: id
  return axios.delete("/api/plants/" + id);
}

export async function API_deletePlantLogById(plant_id, log_id) {
  // Deletes specifik plantlog from user collection. Field required: plant_id and log_id
  return axios.delete(`/api/plantlogs/${plant_id}/${log_id}`);
}

export async function API_deleteAssignmentByID(plant_id, assignmentID) {
  return axios.delete(`/api/assignments/${plant_id}`, {
    data: { id: assignmentID },
  });
}

// --- PATCH / UPDATE ---

export async function API_updatePlantById(id, data) {
  // Updates a plant to user collection. See /models/plant for available data to fill.
  return axios.patch("/api/plants/" + id, data);
}

export async function API_updatePlantLogById(plant_id, log_id, data) {
  // Updates a plantlog to user collection. See /models/plantlog for available data to fill.
  console.log(plant_id, log_id, data);
  return axios.patch(`/api/plantlogs/${plant_id}/${log_id}`, data);
}

export async function API_toggleAssignmentComplete(plant_id, assignmentID) {
  return axios.patch(`/api/assignments/${plant_id}`, { id: assignmentID });
}

export async function API_getAllNotifications() {
  const plants = await (await API_getAllPlantsFromUser()).data.data;
  let notifications = [];
  if (!plants) return [];
  plants.forEach((plant) => {
    if (daysFromDate(plant.last_watered) >= plant.water_interval - 1) {
      notifications.push({
        type: "water",
        plant: plant,
        nDaysLeft: daysFromDate(plant.last_watered) - plant.water_interval,
        info: "Time to water your plant",
      });
    }
    if (plant.assignments) {
      plant.assignments.forEach((assignment) => {
        const days = daysFromDate(assignment.duedate);
        if (days >= 0) {
          notifications.push({
            type: "assignment",
            plant: plant,
            nDaysLeft: -days,
            info: assignment.text,
          });
        } else {
          if (Math.abs(days) <= 1) {
            notifications.push({
              type: "assignment",
              plant: plant,
              nDaysLeft: Math.abs(days),
              info: assignment.text,
            });
          }
        }
      });
    }
  });
  return notifications;
}
