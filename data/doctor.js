import db from "../database.js";

export async function getDoctorDetails(doctorID) {
  const [doctorsWithDetails] = await db.execute(`
        SELECT DoctorName, DoctorSurname, DoctorTelephoneNumber, WorkingHoursInterval, DepartmentName, HospitalName FROM doctor JOIN hospital ON FHospitalID = HospitalID JOIN department ON DepartmentID = FDepartmentID WHERE DoctorID = ${doctorID}
        `);

  if (doctorsWithDetails.length == 0) {
    return null;
  }

  return doctorsWithDetails[0];
}
