import db from "../database.js";

export async function createAppointment(patientID, doctorID, appointmentDate) {
  const [results] = await db.execute(`
        INSERT INTO appointment(FPatientID, FDoctorID, AppointmentDate) VALUES (${patientID},${doctorID}, "${appointmentDate}")
        `);

  if (!results) {
    return false;
  }

  return true;
}

export async function deleteAppointment(appointmentID) {
  const [results] = await db.execute(`
    DELETE FROM appointment WHERE AppointmentID = ${appointmentID}
    `);

  if (!results) {
    return false;
  }

  return true;
}
