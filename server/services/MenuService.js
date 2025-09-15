class MenuService {
    constructor(conex) {
        this.conex = conex;
    }

    // Obtener todos los platos del menú
    getAllMenuItems = async () => {
        try {
            const [rows] = await this.conex.query(
                `SELECT m.*, c.name as category_name 
                 FROM menu m 
                 JOIN categories c ON m.id_category = c.id_category 
                 ORDER BY c.name, m.name`
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los platos del menú', cause: error };
        }
    };

    // Obtener platos disponibles
    getAvailableMenuItems = async () => {
        try {
            const [rows] = await this.conex.query(
                `SELECT m.*, c.name as category_name 
                 FROM menu m 
                 JOIN categories c ON m.id_category = c.id_category 
                 WHERE m.is_available = TRUE 
                 ORDER BY c.name, m.name`
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los platos disponibles', cause: error };
        }
    };

    // Obtener un plato por ID
    getMenuItemById = async (id) => {
        try {
            const [rows] = await this.conex.query(
                `SELECT m.*, c.name as category_name 
                 FROM menu m 
                 JOIN categories c ON m.id_category = c.id_category 
                 WHERE m.id_menu = ?`,
                [id]
            );
            if (rows.length === 0) {
                throw { status: 404, message: 'Plato no encontrado' };
            }
            return rows[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener el plato', cause: error };
        }
    };

    // Crear un nuevo plato
    createMenuItem = async (menuData) => {
        try {
            const { name, price, is_available, id_category } = menuData;
            
            // Verificar si la categoría existe
            const [categoryExists] = await this.conex.query(
                'SELECT id_category FROM categories WHERE id_category = ?', 
                [id_category]
            );
            if (categoryExists.length === 0) {
                throw { status: 400, message: 'La categoría especificada no existe' };
            }

            // Verificar si el plato ya existe
            const [existing] = await this.conex.query(
                'SELECT id_menu FROM menu WHERE name = ?', 
                [name]
            );
            if (existing.length > 0) {
                throw { status: 409, message: 'Ya existe un plato con ese nombre' };
            }

            const [result] = await this.conex.query(
                'INSERT INTO menu (name, price, is_available, id_category) VALUES (?, ?, ?, ?)',
                [name, price, is_available, id_category]
            );

            // Obtener el plato creado con información de categoría
            return await this.getMenuItemById(result.insertId);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al crear el plato', cause: error };
        }
    };

    // Actualizar un plato
    updateMenuItem = async (id, menuData) => {
        try {
            const { name, price, is_available, id_category } = menuData;
            
            // Verificar si el plato existe
            await this.getMenuItemById(id);
            
            // Verificar si la categoría existe
            const [categoryExists] = await this.conex.query(
                'SELECT id_category FROM categories WHERE id_category = ?', 
                [id_category]
            );
            if (categoryExists.length === 0) {
                throw { status: 400, message: 'La categoría especificada no existe' };
            }

            // Verificar si el nuevo nombre ya existe en otro plato
            const [existing] = await this.conex.query(
                'SELECT id_menu FROM menu WHERE name = ? AND id_menu != ?', 
                [name, id]
            );
            if (existing.length > 0) {
                throw { status: 409, message: 'Ya existe otro plato con ese nombre' };
            }

            const [result] = await this.conex.query(
                'UPDATE menu SET name = ?, price = ?, is_available = ?, id_category = ? WHERE id_menu = ?',
                [name, price, is_available, id_category, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Plato no encontrado' };
            }

            // Obtener el plato actualizado con información de categoría
            return await this.getMenuItemById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al actualizar el plato', cause: error };
        }
    };

    // Cambiar disponibilidad de un plato
    toggleAvailability = async (id) => {
        try {
            const menuItem = await this.getMenuItemById(id);
            const newAvailability = !menuItem.is_available;

            const [result] = await this.conex.query(
                'UPDATE menu SET is_available = ? WHERE id_menu = ?',
                [newAvailability, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Plato no encontrado' };
            }

            return await this.getMenuItemById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al cambiar la disponibilidad del plato', cause: error };
        }
    };

    // Eliminar un plato
    deleteMenuItem = async (id) => {
        try {
            // Verificar si el plato existe
            await this.getMenuItemById(id);

            const [result] = await this.conex.query('DELETE FROM menu WHERE id_menu = ?', [id]);

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Plato no encontrado' };
            }

            return { message: 'Plato eliminado correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar el plato', cause: error };
        }
    };

    // Buscar platos por nombre
    searchMenuItems = async (searchTerm) => {
        try {
            const [rows] = await this.conex.query(
                `SELECT m.*, c.name as category_name 
                 FROM menu m 
                 JOIN categories c ON m.id_category = c.id_category 
                 WHERE m.name LIKE ? 
                 ORDER BY c.name, m.name`,
                [`%${searchTerm}%`]
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al buscar platos', cause: error };
        }
    };
}

export default MenuService;