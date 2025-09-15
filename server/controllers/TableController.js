import handleError from '../utils/handleError.js';

class TableController {
    constructor(tableService) {
        this.tableService = tableService;
    }

    // Estados válidos para las mesas
    validStatuses = ['free', 'reserved', 'occupied'];

    // Obtener todas las mesas
    getAllTables = async (req, res) => {
        try {
            const tables = await this.tableService.getAllTables();
            res.status(200).json({
                success: true,
                message: 'Mesas obtenidas correctamente',
                data: tables
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener mesas por estado
    getTablesByStatus = async (req, res) => {
        try {
            const { status } = req.params;
            
            if (!this.validStatuses.includes(status)) {
                throw { status: 400, message: 'Estado de mesa inválido. Estados válidos: free, reserved, occupied' };
            }

            const tables = await this.tableService.getTablesByStatus(status);
            res.status(200).json({
                success: true,
                message: `Mesas con estado '${status}' obtenidas correctamente`,
                data: tables
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener una mesa por ID
    getTableById = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de mesa inválido' };
            }

            const table = await this.tableService.getTableById(id);
            res.status(200).json({
                success: true,
                message: 'Mesa obtenida correctamente',
                data: table
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Crear una nueva mesa
    createTable = async (req, res) => {
        try {
            const { status, table_number, max_people, id_waiter } = req.body;
            
            // Validaciones
            if (!table_number || isNaN(table_number) || parseInt(table_number) <= 0) {
                throw { status: 400, message: 'El número de mesa debe ser un número positivo' };
            }

            if (!max_people || isNaN(max_people) || parseInt(max_people) <= 0) {
                throw { status: 400, message: 'La capacidad máxima debe ser un número positivo' };
            }

            if (parseInt(max_people) > 50) {
                throw { status: 400, message: 'La capacidad máxima no puede exceder 50 personas' };
            }

            const tableStatus = status || 'free';
            if (!this.validStatuses.includes(tableStatus)) {
                throw { status: 400, message: 'Estado de mesa inválido. Estados válidos: free, reserved, occupied' };
            }

            if (id_waiter && isNaN(id_waiter)) {
                throw { status: 400, message: 'ID de mozo inválido' };
            }

            const tableData = {
                status: tableStatus,
                table_number: parseInt(table_number),
                max_people: parseInt(max_people),
                id_waiter: id_waiter ? parseInt(id_waiter) : null
            };

            const newTable = await this.tableService.createTable(tableData);
            res.status(201).json({
                success: true,
                message: 'Mesa creada correctamente',
                data: newTable
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar una mesa
    updateTable = async (req, res) => {
        try {
            const { id } = req.params;
            const { status, table_number, max_people, id_waiter } = req.body;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de mesa inválido' };
            }

            // Validaciones
            if (!table_number || isNaN(table_number) || parseInt(table_number) <= 0) {
                throw { status: 400, message: 'El número de mesa debe ser un número positivo' };
            }

            if (!max_people || isNaN(max_people) || parseInt(max_people) <= 0) {
                throw { status: 400, message: 'La capacidad máxima debe ser un número positivo' };
            }

            if (parseInt(max_people) > 50) {
                throw { status: 400, message: 'La capacidad máxima no puede exceder 50 personas' };
            }

            const tableStatus = status || 'free';
            if (!this.validStatuses.includes(tableStatus)) {
                throw { status: 400, message: 'Estado de mesa inválido. Estados válidos: free, reserved, occupied' };
            }

            if (id_waiter && isNaN(id_waiter)) {
                throw { status: 400, message: 'ID de mozo inválido' };
            }

            const tableData = {
                status: tableStatus,
                table_number: parseInt(table_number),
                max_people: parseInt(max_people),
                id_waiter: id_waiter ? parseInt(id_waiter) : null
            };

            const updatedTable = await this.tableService.updateTable(id, tableData);
            res.status(200).json({
                success: true,
                message: 'Mesa actualizada correctamente',
                data: updatedTable
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Cambiar estado de una mesa
    changeTableStatus = async (req, res) => {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de mesa inválido' };
            }

            if (!status || !this.validStatuses.includes(status)) {
                throw { status: 400, message: 'Estado de mesa inválido. Estados válidos: free, reserved, occupied' };
            }

            const updatedTable = await this.tableService.changeTableStatus(id, status);
            res.status(200).json({
                success: true,
                message: 'Estado de la mesa actualizado correctamente',
                data: updatedTable
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Asignar mozo a una mesa
    assignWaiter = async (req, res) => {
        try {
            const { id } = req.params;
            const { id_waiter } = req.body;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de mesa inválido' };
            }

            if (id_waiter && isNaN(id_waiter)) {
                throw { status: 400, message: 'ID de mozo inválido' };
            }

            const updatedTable = await this.tableService.assignWaiter(id, id_waiter ? parseInt(id_waiter) : null);
            res.status(200).json({
                success: true,
                message: id_waiter ? 'Mozo asignado correctamente' : 'Mozo removido correctamente',
                data: updatedTable
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Eliminar una mesa
    deleteTable = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de mesa inválido' };
            }

            const result = await this.tableService.deleteTable(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default TableController;