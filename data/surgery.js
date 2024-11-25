import db from "../database.js";

export async function createSurgery(
  patientID,
  surgeryName,
  description,
  estimatedDuration,
  realDuration,
  complications,
  doctorIDs
) {
  const [surgeryResults] = await db.execute(`
        INSERT INTO surgery(SurgeryName, Description, EstimatedDuration, RealDuration, Complications, FPatientID)
         VALUES("${surgeryName}","${description}",${estimatedDuration}, ${realDuration}, "${complications}",${patientID} )
        `);

  if (!surgeryResults) {
    return false;
  }

  const surgeryID = surgeryResults.insertId;

  if (doctorIDs.length > 0) {
    const surgeryDoctorValues = doctorIDs
      .map((doctorID) => `(${surgeryID}, ${doctorID})`)
      .join(",");

    const [surDocResults] = await db.execute(
      `INSERT INTO surgery_doctor VALUES ${surgeryDoctorValues}`
    );

    if (!surDocResults) {
      return false;
    }
  }

  return true;
}
