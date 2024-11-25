import db from "../database.js";

export async function createPrescription(
  doctorID,
  patientID,
  instructions,
  medicationIDs
) {
  const [prescriptionResults] = await db.execute(`
        INSERT INTO prescription(Instructions, FDoctorID, FPatientID) VALUES("${instructions}",${doctorID},${patientID})
        `);

  if (!prescriptionResults) {
    return false;
  }

  const prescriptionID = prescriptionResults.insertId;

  if (medicationIDs.length > 0) {
    const precriptionMedicationValues = medicationIDs
      .map((medicationID) => `(${prescriptionID}, ${medicationID})`)
      .join(",");

    const [presMedResults] = await db.execute(
      `INSERT INTO prescription_medication VALUES ${precriptionMedicationValues}`
    );

    if (!presMedResults) {
      return false;
    }
  }

  return true;
}
