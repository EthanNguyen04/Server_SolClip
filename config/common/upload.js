const multer = require('multer');
const path = require('path');

// Cấu hình lưu trữ ảnh trong thư mục 'image'
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/public/images'); // Thư mục lưu ảnh
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  }
});

const upload = multer({ storage });

module.exports = upload;
