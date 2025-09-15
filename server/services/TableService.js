class TableService {
    constructor(conex) {
        this.conex = conex;
    }

    // Obtener todas las mesas
    getAllTables = async () => {
        try {
            const [rows] = await this.conex.query(
                `SELECT t.*, u.name as waiter_name 
                 FROM tables t 
                 LEFT JOIN users u ON t.id_waiter = u.id_user 
                 ORDER BY t.table_number`
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las mesas', cause: error };
        }
    };

    // Obtener mesas por estado
    getTablesByStatus = async (status) => {
        try {
            const [rows] = await this.conex.query(
                `SELECT t.*, u.name as waiter_name 
                 FROM tables t 
                 LEFT JOIN users u ON t.id_waiter = u.id_user 
                 WHERE t.status = ? 
                 ORDER BY t.table_number`,
                [status]
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las mesas por estado', cause: error };
        }
    };

    // Obtener una mesa por ID
    getTableById = async (id) => {
        try {
            const [rows] = await this.conex.query(
                `SELECT t.*, u.name as waiter_name 
                 FROM tables t 
                 LEFT JOIN users u ON t.id_waiter = u.id_user 
                 WHERE t.id_table = ?`,
                [id]
            );
            if (rows.length === 0) {
                throw { status: 404, message: 'Mesa no encontrada' };
            }
            return rows[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener la mesa', cause: error };
        }
    };

    // Crear una nueva mesa
    createTable = async (tableData) => {
        try {
            const { status, table_number, max_people, id_waiter } = tableData;
            
            // Verificar si ya existe una mesa con ese número
            const [existing] = await this.conex.query(
                'SELECT id_table FROM tables WHERE table_number = ?', 
                [table_number]
            );
            if (existing.length > 0) {
                throw { status: 409, message: 'Ya existe una mesa con ese número' };
            }

            // Verificar si el mozo existe (si se proporciona)
            if (id_waiter) {
                const [waiterExists] = await this.conex.query(
                    'SELECT id_user FROM users WHERE id_user = ?', 
                    [id_waiter]
                );
                if (waiterExists.length === 0) {
                    throw { status: 400, message: 'El mozo especificado no existe' };
                }
            }

            const [result] = await this.conex.query(
                'INSERT INTO tables (status, table_number, max_people, id_waiter) VALUES (?, ?, ?, ?)',
                [status, table_number, max_people, id_waiter || null]
            );

            return await this.getTableById(result.insertId);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al crear la mesa', cause: error };
        }
    };

    // Actualizar una mesa
    updateTable = async (id, tableData) => {
        try {
            const { status, table_number, max_people, id_waiter } = tableData;
            
            // Verificar si la mesa existe
            await this.getTableById(id);
            
            // Verificar si el nuevo número de mesa ya existe en otra mesa
            const [existing] = await this.conex.query(
                'SELECT id_table FROM tables WHERE table_number = ? AND id_table != ?', 
                [table_number, id]
            );
            if (existing.length > 0) {
                throw { status: 409, message: 'Ya existe otra mesa con ese número' };
            }

            // Verificar si el mozo existe (si se proporciona)
            if (id_waiter) {
                const [waiterExists] = await this.conex.query(
                    'SELECT id_user FROM users WHERE id_user = ?', 
                    [id_waiter]
                );
                if (waiterExists.length === 0) {
                    throw { status: 400, message: 'El mozo especificado no existe' };
                }
            }

            const [result] = await this.conex.query(
                'UPDATE tables SET status = ?, table_number = ?, max_people = ?, id_waiter = ? WHERE id_table = ?',
                [status, table_number, max_people, id_waiter || null, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Mesa no encontrada' };
            }

            return await this.getTableById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al actualizar la mesa', cause: error };
        }
    };

    // Cambiar estado de una mesa
    changeTableStatus = async (id, newStatus) => {
        try {
            // Verificar si la mesa existe
            await this.getTableById(id);

            const [result] = await this.conex.query(
                'UPDATE tables SET status = ? WHERE id_table = ?',
                [newStatus, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Mesa no encontrada' };
            }

            return await this.getTableById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al cambiar el estado de la mesa', cause: error };
        }
    };

    // Asignar mozo a una mesa
    assignWaiter = async (id, id_waiter) => {
        try {
            // Verificar si la mesa existe
            await this.getTableById(id);

            // Verificar si el mozo existe
            if (id_waiter) {
                const [waiterExists] = await this.conex.query(
                    'SELECT id_user FROM users WHERE id_user = ?', 
                    [id_waiter]
                );
                if (waiterExists.length === 0) {
                    throw { status: 400, message: 'El mozo especificado no existe' };
                }
            }

            const [result] = await this.conex.query(
                'UPDATE tables SET id_waiter = ? WHERE id_table = ?',
                [id_waiter || null, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Mesa no encontrada' };
            }

            return await this.getTableById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al asignar el mozo', cause: error };
        }
    };

    // Eliminar una mesa
    deleteTable = async (id) => {
        try {
            // Verificar si la mesa existe
            await this.getTableById(id);
            
            // Verificar si hay reservas asociadas a esta mesa
            const [reservations] = await this.conex.query(
                'SELECT id_reservation FROM reservations WHERE id_table = ?', 
                [id]
            );
            if (reservations.length > 0) {
                throw { status: 400, message: 'No se puede eliminar la mesa porque tiene reservas asociadas' };
            }

            const [result] = await this.conex.query('DELETE FROM tables WHERE id_table = ?', [id]);

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Mesa no encontrada' };
            }

            return { message: 'Mesa eliminada correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar la mesa', cause: error };
        }
    };
}

export default TableService;