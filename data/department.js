import db from "../database.js";

export async function getDepartments() {
  const [departments] = await db.execute(
    "SELECT DepartmentID, DepartmentName FROM department"
  );

  if (departments.length == 0) {
    return null;
  }

  return departments;
}
