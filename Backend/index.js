const express = require("express");
const multer  = require('multer');
const docxToPDF = require('docx-pdf');  //hamane name rakha hain
const path = require('path');



const app = express();


// setting up the file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function (req, file, cb) {
    
    cb(null, file.originalname)
  }
});

const upload = multer({ storage: storage }); 

app.post('/convertFile', upload.single('file'), (req, res, next)=> {
  // req.file is the `avatar` file
  // req.body will hold the text fields, if there were any

try {
        if(!req.file){
          return res.status(400).json({
            message: 'No file uploaded', 
          });

        }

// Defining outputfile path 
    let outputPath = path.join(__dirname,'files','${req.file.originalname}.pdf')

    docxToPDF(req.file.path, outputPath,(err,result)=> { //NAME rakha hain
  if(err){
    console.log(err);
    return res.status(500).json({
        message: 'Error converting docx to pdf',
    });

  }

  res.download(outputPath,()=>{
    console.log('file downloded');
  });

  console.log('result'+result);
});
} catch (error) {
   console.log(error);
   res.status(500).json({
       message: 'Internal server error',
   }); 
    
}


});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});