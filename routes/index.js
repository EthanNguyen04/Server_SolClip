var express = require('express');
var router = express.Router();

/* Hiển thị trang tạo Asset Collection */
router.get('/create_collection', function(req, res, next) {
  res.render('form', { title: 'Create Asset Collection' });
});

/* Xử lý form submission để tạo Asset Collection */
router.post('/create-asset-collection', function(req, res) {
  const { name, description, imageUrl } = req.body;

  // Xử lý phản hồi và thực hiện POST request đến API hoặc lưu vào MongoDB
  res.send('Asset collection created successfully');
});

module.exports = router;
