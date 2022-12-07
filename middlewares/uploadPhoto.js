const uploadPhoto = (req, res, next) => {
      const file = req.file
      if (!file) {
        const error = new Error('Please upload a file')
        res.status(400).send(error)
        return next(error)
      }
  res.send({
    success: true,
    filePath: file.path,
    fileName: file.filename
  })
};

module.exports = uploadPhoto;