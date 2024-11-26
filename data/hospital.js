import db from "../database.js";

export async function getHospitalDetails(hospitalID) {
  const [hospitals] = await db.execute(`
        SELECT HospitalName, HospitalAddress, Capacity, City FROM hospital WHERE HospitalID = ${hospitalID}
        `);

  if (hospitals.length == 0) {
    return null;
  }

  return hospitals[0];
}
