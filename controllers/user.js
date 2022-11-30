const router = require("express").Router();
const createUser = require("../services/user/create");

const register = async (req, res) => {
  try {
    const data = {
      emailAddress: "",
      password: "",
      firstName: req.body.name,
      lastName: "",
      personnelCode: 12,
      nationalCode: 386109151,
      employmentStatus: "",
      homeAddress: "",
      zipCode: "",
      phoneNumber: 919,
      isAdmin: true,
      isActiveUser: true,
    };
    await createUser(data);
    res.status(201).json({ success: true });
  } catch (error) {
    console.error(error);
  }
};

router.post("/register", register);

module.exports = router;
