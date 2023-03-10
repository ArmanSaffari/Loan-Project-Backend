const router = require("express").Router();
const tokenCheck = require("../middlewares/tokenCheck")
const fs = require("fs");
const path = require("path");
const updateUserInfo = require("../services/user/updateUserInfo");

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

const uploadFile = async (req, res) => {
  try {
    //check whether the request contains file or not:
    if (req.file) {
      const receivedData = JSON.parse(req.body.data)

      // in case of uploading user photo which will replace the previous one!
        if (receivedData.category == 'userPhoto') {
        const fileBuffer = req.file.buffer;
          console.log(req.userData)
        // Check previous user photo and delete if ther is any:
        if (req.userData.userPictureAddress) {
          fs.access(req.userData.userPictureAddress, fs.constants.F_OK, (err) => {
            if (!err) {
              fs.unlink(req.userData.userPictureAddress, (err) => {
                if (err) {
                throw err
                }
              });
            }
          });
          
        }

        // save the file on the server
        const newFilePath = "uploads/users/" + req.userData.personnelCode + path.extname(req.file.originalname);
        
        fs.writeFile(`./${newFilePath}`, fileBuffer, async (err) => {
          if (err) {
            throw err
          }
        });

        // change the userPhotoAddress in the database
        const result = await updateUserInfo(req.userId,
          { userPictureAddress: newFilePath }
        );
      }
    } else {
      throw { message: "Request doesn't include a file!" }
    }

    res.status(200).json({
      success: true,
      message: "The file has updated successfully!"
    });

  } catch (err) {
    
    res.status(400).json({ 
      success: false,
      err
    });
  }
};


// using Multer to upload file
const multer = require('multer');
const uploadMemory = multer({ storage: multer.memoryStorage() })

router.get("/", tokenCheck, handleSendingFile);
router.post("/", tokenCheck, uploadMemory.single('file'), uploadFile)

module.exports = router;