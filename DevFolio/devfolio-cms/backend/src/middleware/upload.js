const multer = require("multer");
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");

function makeStorage(subfolder) {
  const dir = path.join(__dirname, "..", "uploads", subfolder);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const unique = crypto.randomBytes(8).toString("hex");
      const ext = path.extname(file.originalname);
      cb(null, `${Date.now()}-${unique}${ext}`);
    },
  });
}

const imageFilter = (req, file, cb) => {
  const allowed = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) cb(null, true);
  else cb(new Error("Only image files (png, jpg, jpeg, webp, gif, svg) are allowed."));
};

const pdfFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext === ".pdf") cb(null, true);
  else cb(new Error("Only PDF files are allowed for the resume."));
};

const uploadProjectImage = multer({
  storage: makeStorage("projects"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadBlogThumbnail = multer({
  storage: makeStorage("blog"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadProfilePhoto = multer({
  storage: makeStorage("profile"),
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadResume = multer({
  storage: makeStorage("resume"),
  fileFilter: pdfFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

module.exports = { uploadProjectImage, uploadBlogThumbnail, uploadProfilePhoto, uploadResume };
