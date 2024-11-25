import db from "../database.js";

export async function getDoctorDetails(doctorID) {
  const [doctorsWithDetails] = await db.execute(`
        SELECT DoctorName, DoctorSurname, DoctorTelephoneNumber, StartTime, EndTime, DepartmentName, HospitalName FROM doctor JOIN hospital ON FHospitalID = HospitalID JOIN department ON DepartmentID = FDepartmentID WHERE DoctorID = ${doctorID}
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

export async function getDoctorsByDepartmentID(departmentID) {
  const [doctors] = await db.execute(`
    SELECT DoctorID, DoctorName FROM doctor WHERE FDepartmentID = ${departmentID}
    `);

  if (doctors.length == 0) {
    return null;
  }

  return doctors;
}

export async function getDoctorAppointmentsByID(doctorID) {
  const [doctorAppointments] = await db.execute(`
    SELECT AppointmentDate FROM appointment WHERE FDoctorID = ${doctorID}
    `);

  return doctorAppointments;
}

export async function getDoctorAvailabilityByID(doctorID) {
  const [doctorWorkingHours] = await db.execute(`
    SELECT StartTime, EndTime FROM doctor WHERE DoctorID = ${doctorID}
    `);

  if (doctorWorkingHours.length == 0) {
    return null;
  }

  const doctorAppointments = await getDoctorAppointmentsByID(doctorID);

  const appointmentTimes = doctorAppointments.map(
    (appt) => new Date(appt.AppointmentDate).getTime() + 3 * 60 * 60 * 1000
  );

  const { StartTime: startTime, EndTime: endTime } = doctorWorkingHours[0];

  const start = new Date(`2024-11-26T${startTime}Z`).getTime();
  const end = new Date(`2024-11-26T${endTime}Z`).getTime();

  const availableTimes = [];

  for (let time = start; time < end; time += 30 * 60 * 1000) {
    // 30-minute intervals
    if (!appointmentTimes.includes(time)) {
      availableTimes.push(new Date(time).toISOString().slice(0, 16));
    }
  }

  return availableTimes;
}
