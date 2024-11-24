import db from "../database.js";

export async function getMedicationDetails(medicationID) {
  const [medicationsDetails] = await db.execute(`
        SELECT MedicationName, SideEffects, Manufacturer, Dosage FROM medication WHERE MedicationID = ${medicationID}
        `);

  if (!medicationsDetails) {
    return null;
  }

  return medicationsDetails[0];
}
