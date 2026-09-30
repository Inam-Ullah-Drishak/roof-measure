// Admins can reach every order. Employees can only reach orders assigned to them,
// so any other order looks like "not found" to them.
export const isEmployee = (user) => user?.role === "employee";

// Mongo filter for a single order the current user may work on
export const staffOrderFilter = (req, id) =>
  isEmployee(req.user) ? { _id: id, assignedTo: req.user._id } : { _id: id };
