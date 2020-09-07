const express 		= require("express");
const app 			= express();
const port 			= process.env.PORT || "3000";
const multer  		= require('multer');

const storage = multer.diskStorage({
	
	destination: function(req, file, cb) {
		cb(null, './uploads');
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	
	if(file.mimetype === 'image/jpeg' || file.mimetype === 'video/mp4') {
		cb(null, true);
	} 
	else {
		cb('Invalid file type!');
	}
};

const uploadFile = multer({
	
	storage: storage,
	/*limits: {
		fileSize: 1024 * 1024 * 5
	},*/
	fileFilter: fileFilter
}).single('sourceFile');

app.get("/", (req, res) => { res.status(200).send("Welcome to file uploader!"); });

app.post('/upload', function (req, res) {

	if(!req || !req.files || !req.files.sourceFile){

		return res.status(422).send({status: 422, message: 'The required input is missing!'});
	}
	
	uploadFile(req, res, function (err) {
		
		if(err){

			return res.status(422).send({status: 422, message: err});
		}

		return res.status(200).send({status: 200, message: 'Success!'}); 
	});
});

app.listen(port, () => { console.log(`Listening to requests on http://localhost:${port}`); });