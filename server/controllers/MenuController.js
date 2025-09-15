import handleError from '../utils/handleError.js';

class MenuController {
    constructor(menuService) {
        this.menuService = menuService;
    }

    // Obtener todos los platos del menú
    getAllMenuItems = async (req, res) => {
        try {
            const menuItems = await this.menuService.getAllMenuItems();
            res.status(200).json({
                success: true,
                message: 'Platos del menú obtenidos correctamente',
                data: menuItems
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener platos disponibles
    getAvailableMenuItems = async (req, res) => {
        try {
            const menuItems = await this.menuService.getAvailableMenuItems();
            res.status(200).json({
                success: true,
                message: 'Platos disponibles obtenidos correctamente',
                data: menuItems
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener un plato por ID
    getMenuItemById = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de plato inválido' };
            }

            const menuItem = await this.menuService.getMenuItemById(id);
            res.status(200).json({
                success: true,
                message: 'Plato obtenido correctamente',
                data: menuItem
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Crear un nuevo plato
    createMenuItem = async (req, res) => {
        try {
            const { name, price, is_available, id_category } = req.body;
            
            // Validaciones
            if (!name || name.trim() === '') {
                throw { status: 400, message: 'El nombre del plato es requerido' };
            }

            if (name.length > 100) {
                throw { status: 400, message: 'El nombre del plato no puede exceder 100 caracteres' };
            }

            if (!price || isNaN(price) || parseFloat(price) <= 0) {
                throw { status: 400, message: 'El precio debe ser un número mayor a 0' };
            }

            if (parseFloat(price) > 99999999.99) {
                throw { status: 400, message: 'El precio excede el límite máximo' };
            }

            if (!id_category || isNaN(id_category)) {
                throw { status: 400, message: 'La categoría es requerida y debe ser válida' };
            }

            const menuData = {
                name: name.trim(),
                price: parseFloat(price),
                is_available: is_available !== undefined ? Boolean(is_available) : true,
                id_category: parseInt(id_category)
            };

            const newMenuItem = await this.menuService.createMenuItem(menuData);
            res.status(201).json({
                success: true,
                message: 'Plato creado correctamente',
                data: newMenuItem
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar un plato
    updateMenuItem = async (req, res) => {
        try {
            const { id } = req.params;
            const { name, price, is_available, id_category } = req.body;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de plato inválido' };
            }

            // Validaciones
            if (!name || name.trim() === '') {
                throw { status: 400, message: 'El nombre del plato es requerido' };
            }

            if (name.length > 100) {
                throw { status: 400, message: 'El nombre del plato no puede exceder 100 caracteres' };
            }

            if (!price || isNaN(price) || parseFloat(price) <= 0) {
                throw { status: 400, message: 'El precio debe ser un número mayor a 0' };
            }

            if (parseFloat(price) > 99999999.99) {
                throw { status: 400, message: 'El precio excede el límite máximo' };
            }

            if (!id_category || isNaN(id_category)) {
                throw { status: 400, message: 'La categoría es requerida y debe ser válida' };
            }

            const menuData = {
                name: name.trim(),
                price: parseFloat(price),
                is_available: is_available !== undefined ? Boolean(is_available) : true,
                id_category: parseInt(id_category)
            };

            const updatedMenuItem = await this.menuService.updateMenuItem(id, menuData);
            res.status(200).json({
                success: true,
                message: 'Plato actualizado correctamente',
                data: updatedMenuItem
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Cambiar disponibilidad de un plato
    toggleAvailability = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de plato inválido' };
            }

            const updatedMenuItem = await this.menuService.toggleAvailability(id);
            res.status(200).json({
                success: true,
                message: 'Disponibilidad del plato actualizada correctamente',
                data: updatedMenuItem
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Eliminar un plato
    deleteMenuItem = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de plato inválido' };
            }

            const result = await this.menuService.deleteMenuItem(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Buscar platos por nombre
    searchMenuItems = async (req, res) => {
        try {
            const { q } = req.query;
            
            if (!q || q.trim() === '') {
                throw { status: 400, message: 'Término de búsqueda requerido' };
            }

            if (q.length < 2) {
                throw { status: 400, message: 'El término de búsqueda debe tener al menos 2 caracteres' };
            }

            const menuItems = await this.menuService.searchMenuItems(q.trim());
            res.status(200).json({
                success: true,
                message: 'Búsqueda completada correctamente',
                data: menuItems
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default MenuController;