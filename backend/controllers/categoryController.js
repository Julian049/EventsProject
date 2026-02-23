const categoryService = require('../services/categoryService');

exports.createCategory = async (req, res) => {
    try {
        const newCategory = await categoryService.createCategory(req.body);
        res.json(newCategory);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.viewCategories = async (req, res) => {
    try {
        const categories = await categoryService.viewCategories();
        res.json(categories);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.getCategoryById = async (req, res) => {
    try {
        const {id} = req.params;
        const category = await categoryService.getCategoryById(id);
        res.json(category);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const updated = await categoryService.updateCategory(req.body, id);
        res.json(updated);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

exports.disableCategory = async (req, res) => {
    try {
        const {id} = req.params;
        const disabled = await categoryService.disableCategory(id);
        res.json(disabled);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}