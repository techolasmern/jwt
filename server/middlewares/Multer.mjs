import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads");
    },
    filename: (req, file, cb) => {
        // SVGFEDisplacementMapElement.jpg
        const ext = file.originalname.split(".").pop();
        const fileName = crypto.randomUUID() + "." + ext;
        cb(null, fileName);
    }
});

export const upload = multer({ storage });

// upload.single("file"), upload.array("files")