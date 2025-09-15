class CategoryService {
    constructor(conex) {
        this.conex = conex;
    }

    // Obtener todas las categorías
    getAllCategories = async () => {
        try {
            const [rows] = await this.conex.query('SELECT * FROM categories ORDER BY name');
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las categorías', cause: error };
        }
    };

    // Obtener una categoría por ID
    getCategoryById = async (id) => {
        try {
            const [rows] = await this.conex.query('SELECT * FROM categories WHERE id_category = ?', [id]);
            if (rows.length === 0) {
                throw { status: 404, message: 'Categoría no encontrada' };
            }
            return rows[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener la categoría', cause: error };
        }
    };

    // Crear una nueva categoría
    createCategory = async (categoryData) => {
        try {
            const { name } = categoryData;
            
            // Verificar si la categoría ya existe
            const [existing] = await this.conex.query('SELECT id_category FROM categories WHERE name = ?', [name]);
            if (existing.length > 0) {
                throw { status: 409, message: 'La categoría ya existe' };
            }

            const [result] = await this.conex.query(
                'INSERT INTO categories (name) VALUES (?)',
                [name]
            );

            return {
                id_category: result.insertId,
                name: name
            };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al crear la categoría', cause: error };
        }
    };

    // Actualizar una categoría
    updateCategory = async (id, categoryData) => {
        try {
            const { name } = categoryData;
            
            // Verificar si la categoría existe
            await this.getCategoryById(id);
            
            // Verificar si el nuevo nombre ya existe en otra categoría
            const [existing] = await this.conex.query(
                'SELECT id_category FROM categories WHERE name = ? AND id_category != ?', 
                [name, id]
            );
            if (existing.length > 0) {
                throw { status: 409, message: 'Ya existe otra categoría con ese nombre' };
            }

            const [result] = await this.conex.query(
                'UPDATE categories SET name = ? WHERE id_category = ?',
                [name, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Categoría no encontrada' };
            }

            return {
                id_category: parseInt(id),
                name: name
            };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al actualizar la categoría', cause: error };
        }
    };

    // Eliminar una categoría
    deleteCategory = async (id) => {
        try {
            // Verificar si la categoría existe
            await this.getCategoryById(id);
            
            // Verificar si hay platos asociados a esta categoría
            const [menu] = await this.conex.query('SELECT id_menu FROM menu WHERE id_category = ?', [id]);
            if (menu.length > 0) {
                throw { status: 400, message: 'No se puede eliminar la categoría porque tiene platos asociados' };
            }

            const [result] = await this.conex.query('DELETE FROM categories WHERE id_category = ?', [id]);

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Categoría no encontrada' };
            }

            return { message: 'Categoría eliminada correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar la categoría', cause: error };
        }
    };

    // Obtener platos por categoría
    getMenuByCategory = async (id) => {
        try {
            // Verificar si la categoría existe
            await this.getCategoryById(id);
            
            const [rows] = await this.conex.query(
                `SELECT m.*, c.name as category_name 
                 FROM menu m 
                 JOIN categories c ON m.id_category = c.id_category 
                 WHERE m.id_category = ? 
                 ORDER BY m.name`,
                [id]
            );
            
            return rows;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener los platos de la categoría', cause: error };
        }
    };
}

export default CategoryService;