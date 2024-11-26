import express from "express";
import expressEjsLayouts from "express-ejs-layouts";
import appointmentRoutes from "./routes/appointmentRoutes.js";

import {
  getPatientAppointments,
  getPatientGeneralInfo,
  getPatientPrescriptions,
  getPatientSurgeries,
} from "./data/patient.js";
import { getDoctorDetails, getDoctors } from "./data/doctor.js";
import {
  createMedication,
  getMedicationDetails,
  getMedications,
} from "./data/medication.js";
import { createPrescription } from "./data/prescription.js";
import { createSurgery } from "./data/surgery.js";
import { getHospitalDetails } from "./data/hospital.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(expressEjsLayouts); // Enable layouts
app.set("layout", "layout"); // Default layout file (layout.ejs)
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
    const patientAppointments = await getPatientAppointments(patientID);

    if (!patientGeneralInfo) {
      return res.render(patientInformationView, {
        patient: null,
        errorMessage: "Patient Not Found !",
      });
    }

    return res.render(patientInformationView, {
      patient: {
        patientGeneralInfo,
        patientPrescriptions,
        patientSurgeries,
        patientAppointments,
      },
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

app.get("/hospital-details", async (req, res) => {
  const { hospitalID } = req.query;
  const hospitalDetailsView = "functions/hospital-details";
  const templateParameters = {
    errorMessage: null,
    successMessage: null,
    hospitalDetails: null,
  };

  if (hospitalID) {
    const hospitalDetails = await getHospitalDetails(hospitalID);

    if (!hospitalDetails) {
      templateParameters.errorMessage = "Not Found !";
      return res.render(hospitalDetailsView, templateParameters);
    }

    templateParameters.hospitalDetails = hospitalDetails;
    return res.render(hospitalDetailsView, templateParameters);
  }

  templateParameters.errorMessage = "Not Found !";
  res.render(hospitalDetailsView, templateParameters);
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

app.get("/prescribe", async (req, res) => {
  const prescribeView = "functions/prescribe";
  const medications = await getMedications();

  const templateParameters = {
    successMessage: null,
    errorMessage: null,
    medications,
  };
  res.render(prescribeView, templateParameters);
});

app.post("/prescribe", async (req, res) => {
  const prescribeView = "functions/prescribe";
  const medications = await getMedications();

  const templateParameters = {
    successMessage: null,
    errorMessage: null,
    medications,
  };

  const { doctorID, patientID, instructions, medicationIDs = [] } = req.body;

  const isSuccessfullyCreated = await createPrescription(
    doctorID,
    patientID,
    instructions,
    medicationIDs
  );

  if (!isSuccessfullyCreated) {
    templateParameters.errorMessage = "Error while prescribing !";
    return res.render(prescribeView, templateParameters);
  }

  templateParameters.successMessage = "Successfully prescribed !";
  res.render(prescribeView, templateParameters);
});

app.get("/surgery", async (req, res) => {
  const surgeryView = "functions/surgery";
  const doctors = await getDoctors();
  const templateParameters = {
    successMessage: null,
    errorMessage: null,
    doctors,
  };
  res.render(surgeryView, templateParameters);
});

app.post("/surgery", async (req, res) => {
  const surgeryView = "functions/surgery";
  const doctors = await getDoctors();
  const templateParameters = {
    successMessage: null,
    errorMessage: null,
    doctors,
  };

  const {
    patientID,
    surgeryName,
    description,
    estimatedDuration,
    realDuration,
    complications,
    doctorIDs,
  } = req.body;

  const isSuccessfullyCreated = await createSurgery(
    patientID,
    surgeryName,
    description,
    estimatedDuration,
    realDuration,
    complications,
    doctorIDs
  );

  if (!isSuccessfullyCreated) {
    templateParameters.errorMessage =
      "Error while creating surgery information !";
    return res.render(surgeryView, templateParameters);
  }

  templateParameters.successMessage = "Successfully created !";
  res.render(surgeryView, templateParameters);
});

app.use("/appointments", appointmentRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
