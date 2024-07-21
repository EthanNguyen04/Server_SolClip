const express = require('express');
const multer = require('multer');
const path = require('path');
const Video = require('../model/vd');

const router = express.Router();

// Cấu hình lưu trữ với multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/video');
        cb(null, uploadPath); // Thư mục để lưu tệp video
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên tệp
    }
});

const upload = multer({ storage: storage });

// Middleware để tải video lên
router.post('/upload-video', upload.single('file'), async (req, res, next) => {
  try {
      const file = req.file;
      if (!file) {
          return res.status(400).send('No file uploaded.');
      }
      const url = path.join('/videos', file.filename);
      req.videoUrl = url; // Lưu URL tạm thời vào request để sử dụng ở middleware tiếp theo
      next(); // Chuyển sang middleware tiếp theo
  } catch (err) {
      console.error('Error uploading video:', err);
      res.status(500).send('Something went wrong.');
    }
  }, async (req, res) => {
      try {
          const { publickey, title, content } = req.body;
          const url = req.videoUrl; // Lấy URL tạm thời đã lưu từ middleware trước đó
  
          const newVideo = new Video({
              publickey,
              title,
              content,
              url
          });
  
          await newVideo.save();
          console.log('Video added successfully.');
          res.status(200).send('Video added successfully.');
      } catch (err) {
          console.error('Error saving video:', err);
          res.status(500).send('Something went wrong.');
      }
  });
  
  // Endpoint để lấy danh sách tất cả video
  router.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find({});
        res.json(videos);
    } catch (err) {
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;