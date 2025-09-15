import handleError from '../utils/handleError.js';

class ReservationController {
    constructor(reservationService) {
        this.reservationService = reservationService;
    }

    // Validar formato de fecha
    isValidDate = (dateString) => {
        const date = new Date(dateString);
        return date instanceof Date && !isNaN(date) && date > new Date();
    };

    // Validar formato de teléfono
    isValidPhone = (phone) => {
        if (!phone) return true; // El teléfono es opcional
        const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
        return phoneRegex.test(phone);
    };

    // Obtener todas las reservas
    getAllReservations = async (req, res) => {
        try {
            const reservations = await this.reservationService.getAllReservations();
            res.status(200).json({
                success: true,
                message: 'Reservas obtenidas correctamente',
                data: reservations
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener reservas por fecha
    getReservationsByDate = async (req, res) => {
        try {
            const { date } = req.params;
            
            if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
                throw { status: 400, message: 'Formato de fecha inválido. Use YYYY-MM-DD' };
            }

            const reservations = await this.reservationService.getReservationsByDate(date);
            res.status(200).json({
                success: true,
                message: `Reservas para ${date} obtenidas correctamente`,
                data: reservations
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener reservas futuras
    getUpcomingReservations = async (req, res) => {
        try {
            const reservations = await this.reservationService.getUpcomingReservations();
            res.status(200).json({
                success: true,
                message: 'Reservas futuras obtenidas correctamente',
                data: reservations
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Obtener una reserva por ID
    getReservationById = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de reserva inválido' };
            }

            const reservation = await this.reservationService.getReservationById(id);
            res.status(200).json({
                success: true,
                message: 'Reserva obtenida correctamente',
                data: reservation
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Crear una nueva reserva
    createReservation = async (req, res) => {
        try {
            const { customer_name, phone, people_count, reservation_datetime, id_table } = req.body;
            
            // Validaciones
            if (!customer_name || customer_name.trim() === '') {
                throw { status: 400, message: 'El nombre del cliente es requerido' };
            }

            if (customer_name.length > 100) {
                throw { status: 400, message: 'El nombre del cliente no puede exceder 100 caracteres' };
            }

            if (phone && !this.isValidPhone(phone)) {
                throw { status: 400, message: 'Formato de teléfono inválido' };
            }

            if (!people_count || isNaN(people_count) || parseInt(people_count) <= 0) {
                throw { status: 400, message: 'La cantidad de personas debe ser un número positivo' };
            }

            if (parseInt(people_count) > 20) {
                throw { status: 400, message: 'La cantidad de personas no puede exceder 20' };
            }

            if (!reservation_datetime || !this.isValidDate(reservation_datetime)) {
                throw { status: 400, message: 'Fecha y hora de reserva inválida o en el pasado' };
            }

            if (!id_table || isNaN(id_table)) {
                throw { status: 400, message: 'ID de mesa inválido' };
            }

            const reservationData = {
                customer_name: customer_name.trim(),
                phone: phone ? phone.trim() : null,
                people_count: parseInt(people_count),
                reservation_datetime: new Date(reservation_datetime),
                id_table: parseInt(id_table)
            };

            const newReservation = await this.reservationService.createReservation(reservationData);
            res.status(201).json({
                success: true,
                message: 'Reserva creada correctamente',
                data: newReservation
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Actualizar una reserva
    updateReservation = async (req, res) => {
        try {
            const { id } = req.params;
            const { customer_name, phone, people_count, reservation_datetime, id_table } = req.body;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de reserva inválido' };
            }

            // Validaciones
            if (!customer_name || customer_name.trim() === '') {
                throw { status: 400, message: 'El nombre del cliente es requerido' };
            }

            if (customer_name.length > 100) {
                throw { status: 400, message: 'El nombre del cliente no puede exceder 100 caracteres' };
            }

            if (phone && !this.isValidPhone(phone)) {
                throw { status: 400, message: 'Formato de teléfono inválido' };
            }

            if (!people_count || isNaN(people_count) || parseInt(people_count) <= 0) {
                throw { status: 400, message: 'La cantidad de personas debe ser un número positivo' };
            }

            if (parseInt(people_count) > 20) {
                throw { status: 400, message: 'La cantidad de personas no puede exceder 20' };
            }

            if (!reservation_datetime || !this.isValidDate(reservation_datetime)) {
                throw { status: 400, message: 'Fecha y hora de reserva inválida o en el pasado' };
            }

            if (!id_table || isNaN(id_table)) {
                throw { status: 400, message: 'ID de mesa inválido' };
            }

            const reservationData = {
                customer_name: customer_name.trim(),
                phone: phone ? phone.trim() : null,
                people_count: parseInt(people_count),
                reservation_datetime: new Date(reservation_datetime),
                id_table: parseInt(id_table)
            };

            const updatedReservation = await this.reservationService.updateReservation(id, reservationData);
            res.status(200).json({
                success: true,
                message: 'Reserva actualizada correctamente',
                data: updatedReservation
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Eliminar una reserva
    deleteReservation = async (req, res) => {
        try {
            const { id } = req.params;
            
            if (!id || isNaN(id)) {
                throw { status: 400, message: 'ID de reserva inválido' };
            }

            const result = await this.reservationService.deleteReservation(id);
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

    // Buscar reservas por nombre de cliente
    searchReservationsByCustomer = async (req, res) => {
        try {
            const { q } = req.query;
            
            if (!q || q.trim() === '') {
                throw { status: 400, message: 'Término de búsqueda requerido' };
            }

            if (q.length < 2) {
                throw { status: 400, message: 'El término de búsqueda debe tener al menos 2 caracteres' };
            }

            const reservations = await this.reservationService.searchReservationsByCustomer(q.trim());
            res.status(200).json({
                success: true,
                message: 'Búsqueda de reservas completada correctamente',
                data: reservations
            });
        } catch (err) {
            return handleError(res, err);
        }
    };
}

export default ReservationController;