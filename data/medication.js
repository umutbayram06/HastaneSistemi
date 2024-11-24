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

export async function createMedication(
  medicationName,
  sideEffects,
  manufacturer,
  dosage
) {
  const [resultSet] = await db.execute(`
    INSERT INTO medication(MedicationName, SideEffects, Manufacturer, Dosage) VALUES('${medicationName}','${sideEffects}', '${manufacturer}', '${dosage}')
  `);

  return resultSet;
}
