export default function prescriptionMedicationParser(prescriptions) {
  const parsedPrescriptions = {};

  prescriptions.forEach(
    ({ PrescriptionID, MedicationID, MedicationName, ...rest }) => {
      if (!parsedPrescriptions[PrescriptionID]) {
        parsedPrescriptions[PrescriptionID] = {
          ...rest,
          PrescriptionID,
          Medications: [],
        };
      }
      parsedPrescriptions[PrescriptionID].Medications.push({
        MedicationID,
        MedicationName,
      });
    }
  );

  return Object.values(parsedPrescriptions);
}
