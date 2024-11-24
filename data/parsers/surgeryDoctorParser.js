export default function surgeryDoctorParser(surgeries) {
  let parsedSurgeries = {};
  surgeries.forEach((row) => {
    const {
      SurgeryID,
      SurgeryName,
      Description,
      EstimatedDuration,
      RealDuration,
      Complications,
      DoctorName,
      DoctorID,
    } = row;

    // Check if this surgery already exists
    if (!parsedSurgeries[SurgeryID]) {
      parsedSurgeries[SurgeryID] = {
        SurgeryID,
        SurgeryName,
        Description,
        EstimatedDuration: parseInt(EstimatedDuration),
        RealDuration: parseInt(RealDuration),
        Complications,
        Doctors: [], // List of doctors for this surgery
      };
    }

    // Add the doctor to the surgery if not already included
    if (!parsedSurgeries[SurgeryID].Doctors.includes(DoctorID)) {
      parsedSurgeries[SurgeryID].Doctors.push({
        DoctorName,
        DoctorID,
      });
    }
  });

  return Object.values(parsedSurgeries);
}
