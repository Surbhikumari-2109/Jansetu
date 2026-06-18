export const citizenPanel = (
  req,
  res
) => {
  res.json({
    success: true,
    message:
      "Citizen Dashboard",
  });
};

export const officerPanel = (
  req,
  res
) => {
  res.json({
    success: true,
    message:
      "Officer Dashboard",
  });
};

export const adminPanel = (
  req,
  res
) => {
  res.json({
    success: true,
    message:
      "Admin Dashboard",
  });
};