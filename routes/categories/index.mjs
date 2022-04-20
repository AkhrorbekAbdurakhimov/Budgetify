import express from "express";

import { catchReject } from "./../../utils/helper.mjs";
import { getCategoriesSchema, categorySchema, addCategorySchema, updateCategorySchema } from "./schema.mjs";
import Categories from "./../../database/categories.mjs";
import Transactions from "./../../database/transactions.mjs";

const router = express.Router();

const getCategories = catchReject(async (req, res, next) => {
  const { error, value } = getCategoriesSchema.validate(req.query);
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
  const categories = await Categories.getCategories(value.type);
  res.status(200).send({
    categories
  })
})

const addCategory = catchReject(async (req, res, next) => {
  const { error, value } = addCategorySchema.validate(req.body);
  if (error) 
    return next({
      status: 400,
      message: error.details[0].message
    })
  try {
    const result = await Categories.addCategory(value);
    res.status(201).send({
      message: "Category created successfully",
      category: result[0]
    })
  } catch (err) {
    if (err.code == '23505') {
      res.status(400).send({
        message: "Category title must be unique"
      })
    }
  }
})

const updateCategory = catchReject(async (req, res, next) => {
  const { error, value } = updateCategorySchema.validate({ ...req.params, ...req.body });
  if (error)  
    return next({
      status: 400,
      message: error.details[0].message
    })
  try {
    await Categories.updateCategory(value);
    res.status(200).send({
      message: "Category updated successfully"
    })
  } catch (err) {
    if (err.code == '23505') {
      res.status(400).send({
        message: "Category title must be unique"
      })
    }
  }
})

const deleteCategory = catchReject(async (req, res, next) => {
  const { error, value } = categorySchema.validate(req.params);
  if (error)  
    return next({
      status: 400,
      message: error.details[0].message
    })
  try {
    const result = await Transactions.isCategoryExist(value.id);
    if (result.length) {
      res.status(405).send({
        message: "You can not delete this category, because it has belong to transaction, delete transaction before delete"
      })
    } else {
      await Categories.deleteCategory(value.id);
      res.status(200).send({
        message: "Category deleted successfully"
      })
    }
    
  } catch (err) {
    console.log(err);
  }
})

router.get('/', getCategories);
router.post('/', addCategory);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;