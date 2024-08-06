const express = require('express');
const multer = require('multer');
const path = require('path');
const Video = require('../model/vd');
const User = require('../model/user'); // Import model User
const NFT = require('../model/nft');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
require('dotenv').config();


const router = express.Router();

// Cấu hình lưu trữ với multer cho video
const videoStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/video');
        cb(null, uploadPath); // Thư mục để lưu tệp video
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên tệp
    }
});

const videoUpload = multer({ storage: videoStorage });

// Cấu hình lưu trữ với multer cho ảnh
const imageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path.join(__dirname, '../public/images');
        cb(null, uploadPath); // Thư mục để lưu tệp ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname); // Đặt tên tệp
    }
});

const imageUpload = multer({ storage: imageStorage });

// Middleware để tải video lên
router.post('/upload-video', videoUpload.single('file'), async (req, res, next) => {
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

        // Tìm user bằng publickey để xác minh rằng người dùng tồn tại
        const user = await User.findOne({ publickey });
        if (!user) {
            return res.status(404).send('User not found.');
        }

        const newVideo = new Video({
            publickey, // Sử dụng publickey của user
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

// Middleware để tải ảnh lên
router.post('/add-user', imageUpload.single('img'), async (req, res) => {
    try {
        const file = req.file;
        if (!file) {
            return res.status(400).send('No image uploaded.');
        }
        const imgPath = '/images/' + file.filename; // Đường dẫn URL cho ảnh

        const { publickey, name, email } = req.body; // Lấy thêm email từ request body
        
        const newUser = new User({
            publickey,
            name,
            email,
            img: imgPath
        });

        await newUser.save();
        console.log('User added successfully.');

        // Sau khi thêm user vào MongoDB, thực hiện POST request
        const apiKey = process.env.APIKEY; // Thay thế bằng API key thực tế của bạn

        const options = {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'x-api-key': apiKey,
            'content-type': 'application/json'
          },
          body: JSON.stringify({
              referenceId: publickey, // Sử dụng publickey làm referenceId
              email: email, // Sử dụng email từ request body
              externalWalletAddress: publickey // Sử dụng publickey làm externalWalletAddress
          })
        };

        fetch('https://api.gameshift.dev/nx/users', options)
          .then(response => response.json())
          .then(response => {
              console.log('API Response:', response);
              res.status(200).send('User added and API request successful.');
          })
          .catch(err => {
              console.error('API Request Error:', err);
              res.status(500).send('User added but API request failed.');
          });

    } catch (err) {
        console.error('Error adding user:', err);
        res.status(500).send('Something went wrong.');
    }
});

// Endpoint để kiểm tra user bằng publickey
router.get('/check-user/:publickey', async (req, res) => {
  try {
      const { publickey } = req.params;
      const user = await User.findOne({ publickey });
      if (user) {
          return res.status(200).json({ exists: true });
      } else {
          return res.status(404).json({ exists: false });
      }
  } catch (err) {
      console.error('Error checking user:', err);
      res.status(500).send('Something went wrong.');
  }
});

// Endpoint để lấy thông tin người dùng theo publickey
router.get('/user/:publickey', async (req, res) => {
  try {
      const { publickey } = req.params;
      const user = await User.findOne({ publickey });
      if (user) {
          return res.status(200).json(user);
      } else {
          return res.status(404).json({ message: 'User not found' });
      }
  } catch (err) {
      console.error('Error fetching user:', err);
      res.status(500).send('Something went wrong.');
  }
});

// Endpoint để lấy tất cả video theo publickey
router.get('/videos/user/:publickey', async (req, res) => {
  try {
      const { publickey } = req.params;
      const videos = await Video.find({ publickey });
      res.json(videos);
  } catch (err) {
      console.error('Error fetching videos:', err);
      res.status(500).send('Something went wrong.');
  }
});

// Endpoint tạo và lưu NFT vào MongoDB
const CollectionId = process.env.collectionId;
router.post('/create-nft', async (req, res) => {
    try {
        const { description, imageUrl, name, publickey , from, to } = req.body;

        // Cấu hình cho fetch
        const options = {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'x-api-key': process.env.APIKEY,
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                details: {
                    collectionId: CollectionId,
                    description,
                    imageUrl,
                    name
                },
                destinationUserReferenceId: publickey
            })
        };

        const response = await fetch('https://api.gameshift.dev/nx/unique-assets', options);
        const data = await response.json();

        console.log('API Response:', data); // Ghi lại phản hồi API để kiểm tra cấu trúc

        if (response.ok) {
            const { id, imageUrl: createdImageUrl, name: createdName, description: createdDescription } = data;

            // Lưu thông tin NFT vào MongoDB
            const newNFT = new NFT({
                id,
                imageUrl: createdImageUrl,
                name: createdName,
                description: createdDescription,
                publickey,
                from, // Thêm thuộc tính from
                to     // Thêm thuộc tính to
            });

            await newNFT.save();
            console.log('NFT created and saved successfully.');
            res.status(201).send('NFT created and saved successfully.');
        } else {
            console.error('Failed to create NFT, status:', response.status, data);
            res.status(500).send('Failed to create NFT.');
        }
    } catch (err) {
        console.error('Error creating and saving NFT:', err);
        res.status(500).send('Something went wrong.');
    }
});
// Hàm để niêm yết NFT cho bán
const listNFTForSale = async (idNft, naturalAmount) => {
    const options = {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'x-api-key': process.env.APIKEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify({ price: { currencyId: 'USDC', naturalAmount } })
    };

    try {
        const response = await fetch(`https://api.gameshift.dev/nx/unique-assets/${idNft}/list-for-sale`, options);
        const data = await response.json();
        console.log(data)
        return { status: response.status, data };
    } catch (err) {
        console.error('Error listing NFT for sale:', err);
        throw err;
    }
};

// Endpoint để niêm yết NFT cho bán và trả về consentUrl
router.post('/list-nft-for-sale', async (req, res) => {
    try {
        const { idNft, naturalAmount } = req.body;
        const { status, data } = await listNFTForSale(idNft, naturalAmount);

        if (data.consentUrl) {
            // Trả về consentUrl trong phản hồi JSON
            res.status(200).json({ consentUrl: data.consentUrl });
        } else {
            res.status(500).send('Failed to list NFT for sale. No consent URL provided.');
        }
    } catch (err) {
        res.status(500).send('Something went wrong.');
    }
});

module.exports = router;