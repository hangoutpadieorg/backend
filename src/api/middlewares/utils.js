const vendorsReg = async (req, res, next) => {
  req.vendors = true;
  next();
};

module.exports = {
  vendorsReg,
};
