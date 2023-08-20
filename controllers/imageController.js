const multer = require('multer');
const sharp = require('sharp');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(new AppError('Not a Image! Please upload only images', 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});
exports.uploadPhoto = upload.single('photo');
exports.resizePhoto = catchAsync(async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `photo-${Date.now()}.jpeg`;

  await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat('jpeg')
    .jpeg({ quality: 90 })
    .toFile(`public/img/photos/${req.file.filename}`);
  next();
});

exports.uploadImages = upload.fields([{ name: 'images', maxCount: 3 }]);

exports.resizeImages = catchAsync(async (req, res, next) => {
  if (!req.files.images) return next();

  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file) => {
      const filename = `image-${Date.now()}.jpeg`;
      await sharp(file.buffer)
        .resize(2000, 1333)
        .toFormat('jpeg')
        .jpeg({ quality: 90 })
        .toFile(`public/img/images/${filename}`);
      req.body.images.push(filename);
    }),
  );
  next();
});
