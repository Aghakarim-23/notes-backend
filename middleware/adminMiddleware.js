export const admin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    console.log(req.user)
    return res.status(403).json({ message: "Forbidden " });
  }
  next();
};
