import handleError from '../utils/handleError.js';

class CategoryController {
    constructor(categoryService) {
        this.categoryService = categoryService;
    }

    // Obtener todas las categorías
    getAllCategories = async (req, res) => {
        try {
            const categories = await this.categoryService.getAllCategories();
            res.status(200).json({
                success: true,
                message: 'Categorías obtenidas correctamente',
                data: categories
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener una categoría por ID
    getCategoryById = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de categoría inválido' };
            }

            const category = await this.categoryService.getCategoryById(id);
            res.status(200).json({
                success: true,
                message: 'Categoría obtenida correctamente',
                data: category
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Crear una nueva categoría
    createCategory = async (req, res) => {
        try {
            const { name } = req.body;
            
            if (!name || name.trim() === '') {
                throw { status: 400, message: 'El nombre de la categoría es requerido' };
            }

            if (name.length > 100) {
                throw { status: 400, message: 'El nombre de la categoría no puede exceder 100 caracteres' };
            }

            const categoryData = {
                name: name.trim()
            };

            const newCategory = await this.categoryService.createCategory(categoryData);
            res.status(201).json({
                success: true,
                message: 'Categoría creada correctamente',
                data: newCategory
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar una categoría
    updateCategory = async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de categoría inválido' };
            }

            if (!name || name.trim() === '') {
                throw { status: 400, message: 'El nombre de la categoría es requerido' };
            }

            if (name.length > 100) {
                throw { status: 400, message: 'El nombre de la categoría no puede exceder 100 caracteres' };
            }

            const categoryData = {
                name: name.trim()
            };

            const updatedCategory = await this.categoryService.updateCategory(id, categoryData);
            res.status(200).json({
                success: true,
                message: 'Categoría actualizada correctamente',
                data: updatedCategory
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Eliminar una categoría
    deleteCategory = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de categoría inválido' };
            }

            const result = await this.categoryService.deleteCategory(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener platos por categoría
    getMenuByCategory = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de categoría inválido' };
            }

            const menu = await this.categoryService.getMenuByCategory(id);
            res.status(200).json({
                success: true,
                message: 'Platos de la categoría obtenidos correctamente',
                data: menu
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default CategoryController;