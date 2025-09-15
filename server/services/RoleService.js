class RoleService {
    constructor(conex) {
        this.conex = conex;
    }

    // Obtener todos los roles
    getAllRoles = async () => {
        try {
            const [rows] = await this.conex.query('SELECT * FROM roles ORDER BY id_role');
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los roles', cause: error };
        }
    };

    // Obtener un rol por ID
    getRoleById = async (id) => {
        try {
            const [rows] = await this.conex.query('SELECT * FROM roles WHERE id_role = ?', [id]);
            if (rows.length === 0) {
                throw { status: 404, message: 'Rol no encontrado' };
            }
            return rows[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener el rol', cause: error };
        }
    };

    // Crear un nuevo rol
    createRole = async (roleData) => {
        try {
            const { name } = roleData;
            
            // Verificar si el rol ya existe
            const [existing] = await this.conex.query('SELECT id_role FROM roles WHERE name = ?', [name]);
            if (existing.length > 0) {
                throw { status: 409, message: 'El rol ya existe' };
            }

            const [result] = await this.conex.query(
                'INSERT INTO roles (name) VALUES (?)',
                [name]
            );

            return {
                id_role: result.insertId,
                name: name
            };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al crear el rol', cause: error };
        }
    };

    // Actualizar un rol
    updateRole = async (id, roleData) => {
        try {
            const { name } = roleData;
            
            // Verificar si el rol existe
            await this.getRoleById(id);
            
            // Verificar si el nuevo nombre ya existe en otro rol
            const [existing] = await this.conex.query(
                'SELECT id_role FROM roles WHERE name = ? AND id_role != ?', 
                [name, id]
            );
            if (existing.length > 0) {
                throw { status: 409, message: 'Ya existe otro rol con ese nombre' };
            }

            const [result] = await this.conex.query(
                'UPDATE roles SET name = ? WHERE id_role = ?',
                [name, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Rol no encontrado' };
            }

            return {
                id_role: parseInt(id),
                name: name
            };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al actualizar el rol', cause: error };
        }
    };

    // Eliminar un rol
    deleteRole = async (id) => {
        try {
            // Verificar si el rol existe
            await this.getRoleById(id);
            
            // Verificar si hay usuarios asociados a este rol
            const [users] = await this.conex.query('SELECT id_user FROM users WHERE id_role = ?', [id]);
            if (users.length > 0) {
                throw { status: 400, message: 'No se puede eliminar el rol porque tiene usuarios asociados' };
            }

            const [result] = await this.conex.query('DELETE FROM roles WHERE id_role = ?', [id]);

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Rol no encontrado' };
            }

            return { message: 'Rol eliminado correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar el rol', cause: error };
        }
    };
}

export default RoleService;