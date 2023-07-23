const Product = require('../models/Product.js');
const { StatusCodes } = require('http-status-codes');
const CustomError = require('../errors');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (_req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products, count: products.length });
};

const getSingleProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id).populate('reviews');

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${id}`);
  }

  res.status(StatusCodes.OK).send({ product });
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findOneAndUpdate({ _id: id }, req.body, {
    new: true,
    validators: true
  });

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${id}`);
  }

  res.status(StatusCodes.OK).send({ product });
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    throw new CustomError.NotFoundError(`No product with id: ${id}`);
  }

  await product.remove();
  res.status(StatusCodes.OK).send({ msg: 'Success! Product removed' });
};

const uploadImage = async (req, res) => {
  if (!req.files) {
    throw new CustomError.BadRequestError(`No file uploaded`);
  }

  const productImage = req.files.image;

  if (!productImage.mimetype.startsWith('image')) {
    throw new CustomError.BadRequestError(`Please upload image`);
  }

  const maxsize = 1024 * 1024;

  if (!productImage.size > maxsize) {
    throw new CustomError.BadRequestError(
      'Please upload image smaller than 1mb'
    );
  }

  const imagePath = path.join(
    __dirname,
    '../public/uploads/' + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${productImage.name}` });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage
};
