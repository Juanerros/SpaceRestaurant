class ReservationService {
    constructor(conex) {
        this.conex = conex;
    }

    // Obtener todas las reservas
    getAllReservations = async () => {
        try {
            const [rows] = await this.conex.query(
                `SELECT r.*, t.table_number, t.max_people 
                 FROM reservations r 
                 JOIN tables t ON r.id_table = t.id_table 
                 ORDER BY r.reservation_datetime DESC`
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las reservas', cause: error };
        }
    };

    // Obtener reservas por fecha
    getReservationsByDate = async (date) => {
        try {
            const [rows] = await this.conex.query(
                `SELECT r.*, t.table_number, t.max_people 
                 FROM reservations r 
                 JOIN tables t ON r.id_table = t.id_table 
                 WHERE DATE(r.reservation_datetime) = ? 
                 ORDER BY r.reservation_datetime`,
                [date]
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las reservas por fecha', cause: error };
        }
    };

    // Obtener reservas futuras
    getUpcomingReservations = async () => {
        try {
            const [rows] = await this.conex.query(
                `SELECT r.*, t.table_number, t.max_people 
                 FROM reservations r 
                 JOIN tables t ON r.id_table = t.id_table 
                 WHERE r.reservation_datetime >= NOW() 
                 ORDER BY r.reservation_datetime`
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las reservas futuras', cause: error };
        }
    };

    // Obtener una reserva por ID
    getReservationById = async (id) => {
        try {
            const [rows] = await this.conex.query(
                `SELECT r.*, t.table_number, t.max_people 
                 FROM reservations r 
                 JOIN tables t ON r.id_table = t.id_table 
                 WHERE r.id_reservation = ?`,
                [id]
            );
            if (rows.length === 0) {
                throw { status: 404, message: 'Reserva no encontrada' };
            }
            return rows[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener la reserva', cause: error };
        }
    };

    // Verificar disponibilidad de mesa
    checkTableAvailability = async (id_table, reservation_datetime, excludeReservationId = null) => {
        try {
            // Verificar si la mesa existe
            const [tableExists] = await this.conex.query(
                'SELECT id_table FROM tables WHERE id_table = ?', 
                [id_table]
            );
            if (tableExists.length === 0) {
                throw { status: 400, message: 'La mesa especificada no existe' };
            }

            // Verificar conflictos de horario (2 horas antes y después)
            const startTime = new Date(reservation_datetime);
            startTime.setHours(startTime.getHours() - 2);
            const endTime = new Date(reservation_datetime);
            endTime.setHours(endTime.getHours() + 2);

            let query = `SELECT id_reservation FROM reservations 
                        WHERE id_table = ? 
                        AND reservation_datetime BETWEEN ? AND ?`;
            let params = [id_table, startTime, endTime];

            if (excludeReservationId) {
                query += ' AND id_reservation != ?';
                params.push(excludeReservationId);
            }

            const [conflicts] = await this.conex.query(query, params);
            
            return conflicts.length === 0;
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al verificar disponibilidad', cause: error };
        }
    };

    // Crear una nueva reserva
    createReservation = async (reservationData) => {
        try {
            const { customer_name, phone, people_count, reservation_datetime, id_table } = reservationData;
            
            // Verificar disponibilidad de la mesa
            const isAvailable = await this.checkTableAvailability(id_table, reservation_datetime);
            if (!isAvailable) {
                throw { status: 409, message: 'La mesa no está disponible en el horario solicitado' };
            }

            // Verificar capacidad de la mesa
            const [table] = await this.conex.query(
                'SELECT max_people FROM tables WHERE id_table = ?', 
                [id_table]
            );
            if (people_count > table[0].max_people) {
                throw { status: 400, message: `La mesa solo tiene capacidad para ${table[0].max_people} personas` };
            }

            const [result] = await this.conex.query(
                'INSERT INTO reservations (customer_name, phone, people_count, reservation_datetime, id_table) VALUES (?, ?, ?, ?, ?)',
                [customer_name, phone, people_count, reservation_datetime, id_table]
            );

            return await this.getReservationById(result.insertId);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al crear la reserva', cause: error };
        }
    };

    // Actualizar una reserva
    updateReservation = async (id, reservationData) => {
        try {
            const { customer_name, phone, people_count, reservation_datetime, id_table } = reservationData;
            
            // Verificar si la reserva existe
            await this.getReservationById(id);
            
            // Verificar disponibilidad de la mesa (excluyendo esta reserva)
            const isAvailable = await this.checkTableAvailability(id_table, reservation_datetime, id);
            if (!isAvailable) {
                throw { status: 409, message: 'La mesa no está disponible en el horario solicitado' };
            }

            // Verificar capacidad de la mesa
            const [table] = await this.conex.query(
                'SELECT max_people FROM tables WHERE id_table = ?', 
                [id_table]
            );
            if (people_count > table[0].max_people) {
                throw { status: 400, message: `La mesa solo tiene capacidad para ${table[0].max_people} personas` };
            }

            const [result] = await this.conex.query(
                'UPDATE reservations SET customer_name = ?, phone = ?, people_count = ?, reservation_datetime = ?, id_table = ? WHERE id_reservation = ?',
                [customer_name, phone, people_count, reservation_datetime, id_table, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Reserva no encontrada' };
            }

            return await this.getReservationById(id);
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al actualizar la reserva', cause: error };
        }
    };

    // Eliminar una reserva
    deleteReservation = async (id) => {
        try {
            // Verificar si la reserva existe
            await this.getReservationById(id);

            const [result] = await this.conex.query('DELETE FROM reservations WHERE id_reservation = ?', [id]);

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Reserva no encontrada' };
            }

            return { message: 'Reserva eliminada correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar la reserva', cause: error };
        }
    };

    // Buscar reservas por nombre de cliente
    searchReservationsByCustomer = async (customerName) => {
        try {
            const [rows] = await this.conex.query(
                `SELECT r.*, t.table_number, t.max_people 
                 FROM reservations r 
                 JOIN tables t ON r.id_table = t.id_table 
                 WHERE r.customer_name LIKE ? 
                 ORDER BY r.reservation_datetime DESC`,
                [`%${customerName}%`]
            );
            return rows;
        } catch (error) {
            throw { status: 500, message: 'Error al buscar reservas', cause: error };
        }
    };
}

export default ReservationService;