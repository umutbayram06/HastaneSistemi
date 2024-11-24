import express from "express";

import {
  getPatientGeneralInfo,
  getPatientPrescriptions,
  getPatientSurgeries,
} from "./data/patient.js";
import { getDoctorDetails } from "./data/doctor.js";
import { createMedication, getMedicationDetails } from "./data/medication.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/patient-information", async (req, res) => {
  const { patientID } = req.query;

  const patientInformationView = "functions/patient-information";

  if (patientID) {
    const patientGeneralInfo = await getPatientGeneralInfo(patientID);
    const patientPrescriptions = await getPatientPrescriptions(patientID);
    const patientSurgeries = await getPatientSurgeries(patientID);

    if (!patientGeneralInfo) {
      return res.render(patientInformationView, {
        patient: null,
        errorMessage: "Patient Not Found !",
      });
    }

    return res.render(patientInformationView, {
      patient: { patientGeneralInfo, patientPrescriptions, patientSurgeries },
      errorMessage: null,
    });
  }
  res.render(patientInformationView, {
    patient: null,
    errorMessage: null,
  });
});

app.get("/doctor-details", async (req, res) => {
  const { doctorID } = req.query;

  const doctorDetailsView = "functions/doctor-details";

  if (doctorID) {
    const doctorDetails = await getDoctorDetails(doctorID);

    if (!doctorDetails) {
      return res.render(doctorDetailsView, {
        doctorDetails: null,
        errorMessage: "Doctor Not Found !",
      });
    }

    return res.render(doctorDetailsView, { doctorDetails, errorMessage: null });
  }

  res.render(doctorDetailsView, { doctorDetails: null, errorMessage: null });
});

app.get("/medication-details", async (req, res) => {
  const { medicationID } = req.query;

  const medicationDetailsView = "functions/medication-details";
  const templateParameters = {
    medicationDetails: null,
    errorMessage: null,
    successMessage: null,
  };

  if (medicationID) {
    const medicationDetails = await getMedicationDetails(medicationID);

    if (!medicationDetails) {
      templateParameters.errorMessage = "Medication Not Found !";
      return res.render(medicationDetailsView, templateParameters);
    }

    templateParameters.medicationDetails = medicationDetails;
    return res.render(medicationDetailsView, templateParameters);
  }

  res.render(medicationDetailsView, templateParameters);
});

app.post("/medication-details", async (req, res) => {
  const { medicationName, sideEffects, manufacturer, dosage } = req.body;

  const medicationDetailsView = "functions/medication-details";
  const templateParameters = {
    medicationDetails: null,
    errorMessage: null,
    successMessage: null,
  };

  const result = await createMedication(
    medicationName,
    sideEffects,
    manufacturer,
    dosage
  );

  if (!result) {
    templateParameters.errorMessage = "Medication Could Not Be Added !";
    return res.render(medicationDetailsView, templateParameters);
  }

  templateParameters.successMessage = "Medication Added !";
  res.render(medicationDetailsView, templateParameters);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});