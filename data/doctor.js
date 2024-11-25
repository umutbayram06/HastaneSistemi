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

export async function getDoctors() {
  const [doctors] = await db.execute("SELECT DoctorID, DoctorName from doctor");

  if (doctors.length == 0) {
    return null;
  }

  return doctors;
}
