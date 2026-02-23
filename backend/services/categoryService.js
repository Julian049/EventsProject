const Category = require('../models/category');
const CategoryModel = require('../models/categoryModel');

exports.createCategory = (data) => {
    const newCategory = new Category(data);
    return CategoryModel.create(newCategory);
}

exports.viewCategories = () => {
    return CategoryModel.getAll();
}

exports.getCategoryById = (id) => {
    return CategoryModel.getById(id);
}

exports.updateCategory = (data, id) => {
    return CategoryModel.update(data, id);
}

exports.disableCategory = (id) => {
    return CategoryModel.disable(id);
}