import express from "express";
import { getDepartments } from "../data/department.js";
import {
  getDoctorAvailabilityByID,
  getDoctorsByDepartmentID,
} from "../data/doctor.js";
import { createAppointment, deleteAppointment } from "../data/appointment.js";
const router = express.Router();

router.get("/", async (req, res) => {
  const appointmentsView = "functions/appointments.ejs";
  const departments = await getDepartments();
  const templateParameters = {
    departments,
    errorMessage: null,
    successMessage: null,
  };

  res.render(appointmentsView, templateParameters);
});

router.get("/doctors", async (req, res) => {
  const { departmentID } = req.query;

  const doctors = await getDoctorsByDepartmentID(departmentID);

  if (!doctors) {
    res.json({
      error: true,
      errorMessage: "There is no doctor for this department !",
    });
  }

  res.json({ doctors, error: false, errorMessage: null });
});

router.get("/availability", async (req, res) => {
  const { doctorID } = req.query;

  res.json(await getDoctorAvailabilityByID(doctorID));
});

router.post("/", async (req, res) => {
  const appointmentsView = "functions/appointments";
  const departments = await getDepartments();

  const templateParameters = {
    errorMessage: null,
    successMessage: null,
    departments: departments,
  };

  const { patientID, doctorID, appointmentDate } = req.body;

  const isSuccessfullyCreated = await createAppointment(
    patientID,
    doctorID,
    appointmentDate
  );

  if (!isSuccessfullyCreated) {
    templateParameters.errorMessage = "Booking Failed !";
    return res.render(appointmentsView, templateParameters);
  }

  templateParameters.successMessage = "Successfully booked !";
  res.render(appointmentsView, templateParameters);
});

router.get("/delete", async (req, res) => {
  const { appointmentID, patientID } = req.query;

  await deleteAppointment(appointmentID);

  res.redirect(`/patient-information?patientID=${patientID}`);
});
export default router;
