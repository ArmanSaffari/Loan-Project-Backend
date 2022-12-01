const router = require("express").Router();
const createUser = require("../services/user/create");
const registerValidation = require("../schema/user/register");

const register = async (req, res) => {
  const receivedData = req.body;
  try {
    const { error } = await registerValidation(receivedData)
    if (!error) {
      const data = {
        // emailAddress: "",
        // password: "",
        // firstName,
        // lastName: "",
        // personnelCode: 12,
        // nationalCode: 386109151,
        // employmentStatus: "",
        // homeAddress: "",
        // zipCode: "",
        // phoneNumber: 919,
        ...receivedData,
        isAdmin: false,
        isActiveUser: true,
      };
      await createUser(data);
      res.status(201).json({ success: true });
    } else {
      res.status(422).json({ error });
    }
  } catch (error) {
    console.error(error);
  }
};

router.post("/register", register);

module.exports = router;
