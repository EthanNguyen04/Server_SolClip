var express = require('express');
var router = express.Router();

/* Hiển thị trang tạo Asset Collection */
router.get('/createNft', function(req, res, next) {
  res.render('createNFT', { title: 'Create NFT' });
});

/* Xử lý form submission để tạo Asset Collection */
router.post('/add_NFT_maket', function(req, res) {
  const { name, description, imageUrl } = req.body;

  // Xử lý phản hồi và thực hiện POST request đến API hoặc lưu vào MongoDB
  res.send('Asset collection created successfully');
});





module.exports = router;
