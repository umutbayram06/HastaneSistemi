import db from "../database.js";
import prescriptionMedicationParser from "./parsers/prescriptionMedicationParser.js";
import surgeryDoctorParser from "./parsers/surgeryDoctorParser.js";

export async function getPatientGeneralInfo(patientID) {
  const [patientsWithGeneralInfo] = await db.execute(
    `SELECT PatientID, PatientName, PatientSurname, DateOfBirth, Gender, PatientTelephoneNumber, PatientAddress, BloodType, Allergies from patient 
        WHERE PatientID = ${patientID}`
  );

  if (patientsWithGeneralInfo.length == 0) {
    return null;
  }

  return patientsWithGeneralInfo[0];
}

export async function getPatientPrescriptions(patientID) {
  let [prescriptions] = await db.execute(
    `SELECT p.PrescriptionID, DateIssued, Instructions, Status, DoctorID, DoctorName, m.MedicationID, m.MedicationName FROM 
patient JOIN prescription as p ON FPatientID = PatientID JOIN prescription_medication as pm ON p.PrescriptionID = pm.PrescriptionID
JOIN doctor ON FDoctorID = DoctorID 
JOIN medication as m ON m.MedicationID = pm.MedicationID WHERE PatientID = ${patientID} `
  );

  if (prescriptions.length == 0) {
    return null;
  }

  const parsedPrescriptions = prescriptionMedicationParser(prescriptions);
  prescriptions = parsedPrescriptions;
  return prescriptions;
}

export async function getPatientSurgeries(patientID) {
  let [surgeries] = await db.execute(`
        SELECT SurgeryID ,SurgeryName, Description, EstimatedDuration, RealDuration, Complications, DoctorName, DoctorID 
        from surgery JOIN surgery_doctor ON SurgeryID = FSurgeryID JOIN doctor ON DoctorID = FDoctorID WHERE FPatientID = ${patientID}`);

  if (surgeries.length == 0) {
    return null;
  }

  const parsedSurgeries = surgeryDoctorParser(surgeries);
  surgeries = parsedSurgeries;

  return surgeries;
}

export async function getPatientAppointments(patientID) {
  const [appointments] = await db.execute(`
    SELECT DoctorID, DoctorName, DepartmentName, AppointmentDate, AppointmentID from appointment JOIN doctor ON FDoctorID = DoctorID JOIN department ON FDepartmentID = DepartmentID WHERE FPatientID = ${patientID};
    `);

  if (appointments.length == 0) {
    return null;
  }

  return appointments;
}
