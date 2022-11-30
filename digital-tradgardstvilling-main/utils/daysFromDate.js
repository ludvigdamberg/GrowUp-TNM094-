// Parametern är ett datum i String-format, som fås hur databasen. T.ex. Plant.created_at
export function daysFromDate(dateString) {
  return Math.ceil((Date.now() - Date.parse(dateString)) / (1000 * 3600 * 24));
}
//Returnerar dagar sedan datumet man skickar in
