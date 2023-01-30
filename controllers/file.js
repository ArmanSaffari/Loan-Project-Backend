const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck")
const fs = require("fs");
const path = require("path");

const handleSendingFile =  async (req, res) => {
  const folder = "users";
  const fileName = (req.userData.personnelCode).toString() + ".";
  const folderPath = path.join(__dirname, '..', 'uploads', folder)
  let filePath = null;
  try {
    if (req.query.category == 'userPhoto') {
      fs.readdir(folderPath, (err, files) => {
        if (err) {
          throw err
        } else {
          for (let file of files) {
            if (file.includes(fileName, 0)) {
              filePath = path.join(__dirname, '..', 'uploads', folder, file);
              break
            }
          }
          filePath ? res.status(200).sendFile(filePath) : res.status(200).send(null);
        }
      });
    } else {
      throw { message: "specified category is not valid!"}
    }
  } catch (error) {
    console.log(error)
    res.status(404).send({
      error
    })
  }
};

router.get("/", tokenCheck, handleSendingFile);

module.exports = router;