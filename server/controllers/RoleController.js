import handleError from '../utils/handleError.js';

class RoleController {
    constructor(roleService) {
        this.roleService = roleService;
    }

    // Obtener todos los roles
    getAllRoles = async (req, res) => {
        try {
            const roles = await this.roleService.getAllRoles();
            res.status(200).json({
                success: true,
                message: 'Roles obtenidos correctamente',
                data: roles
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener un rol por ID
    getRoleById = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de rol inválido' };
            }

            const role = await this.roleService.getRoleById(id);
            res.status(200).json({
                success: true,
                message: 'Rol obtenido correctamente',
                data: role
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Crear un nuevo rol
    createRole = async (req, res) => {
        try {
            const { name } = req.body;
            
            if (!name || name.trim() === '') {
                throw { status: 400, message: 'El nombre del rol es requerido' };
            }

            if (name.length > 50) {
                throw { status: 400, message: 'El nombre del rol no puede exceder 50 caracteres' };
            }

            const roleData = {
                name: name.trim()
            };

            const newRole = await this.roleService.createRole(roleData);
            res.status(201).json({
                success: true,
                message: 'Rol creado correctamente',
                data: newRole
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar un rol
    updateRole = async (req, res) => {
        try {
            const { id } = req.params;
            const { name } = req.body;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de rol inválido' };
            }

            if (!name || name.trim() === '') {
                throw { status: 400, message: 'El nombre del rol es requerido' };
            }

            if (name.length > 50) {
                throw { status: 400, message: 'El nombre del rol no puede exceder 50 caracteres' };
            }

            const roleData = {
                name: name.trim()
            };

            const updatedRole = await this.roleService.updateRole(id, roleData);
            res.status(200).json({
                success: true,
                message: 'Rol actualizado correctamente',
                data: updatedRole
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Eliminar un rol
    deleteRole = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de rol inválido' };
            }

            const result = await this.roleService.deleteRole(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default RoleController;