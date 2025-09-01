CREATE TABLE roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

CREATE TABLE users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    id_role INT NOT NULL,
    FOREIGN KEY (id_role) REFERENCES roles(id_role)
);

CREATE table categories (
    id_category INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE menu (
    id_menu INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    id_category INT NOT NULL,
    FOREIGN KEY (id_category) REFERENCES categories(id_category)
);

CREATE TABLE tables (
    id_table INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('free', 'reserved', 'occupied') DEFAULT 'free',
    table_number INT NOT NULL,
    max_people INT NOT NULL,
    waiter_id INT,
    FOREIGN KEY (waiter_id) REFERENCES users(id_user)
);

CREATE TABLE reservations (
    id_reservation INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    people_count INT NOT NULL,
    reservation_datetime DATETIME NOT NULL,
    table_id INT NOT NULL,
    FOREIGN KEY (table_id) REFERENCES tables(id)
);

INSERT INTO roles (name) VALUES ('super_admin'), ('admin_mesas'), ('admin_reservas'), ('admin_catalogo'), ('mozo');
INSERT INTO categories (name) VALUES 
('Entradas'),
('Carnes'),
('Pescados'),
('Mariscos'),
('Pastas'),
('Ensaladas'),
('Sopas'),
('Sandwiches'),
('Pizza'),
('Platos Vegetarianos'),
('Platos Veganos'),
('Guarniciones');

-- Usuarios de ejemplo
INSERT INTO users (name, password, id_role) VALUES
('Juan Pérez', 'hashedpassword1', 1),
('Ana López', 'hashedpassword2', 2),
('Carlos Gómez', 'hashedpassword3', 3),
('Lucía Torres', 'hashedpassword4', 4),
('María Ruiz', 'hashedpassword5', 5);

-- Platos de ejemplo en el menú
INSERT INTO menu (name, price, is_available, id_category) VALUES
('Ensalada César', 8.50, TRUE, 6),
('Bife de Chorizo', 18.00, TRUE, 2),
('Salmón Grillado', 22.00, TRUE, 3),
('Risotto de Mariscos', 19.50, TRUE, 4),
('Pizza Margarita', 12.00, TRUE, 9),
('Hamburguesa Vegana', 11.00, TRUE, 11);

-- Mesas de ejemplo
INSERT INTO tables (status, table_number, max_people, waiter_id) VALUES
('free', 1, 4, 5),
('reserved', 2, 2, 5),
('occupied', 3, 6, 5),
('free', 4, 8, NULL);

-- Reservas de ejemplo
INSERT INTO reservations (customer_name, phone, people_count, reservation_datetime, table_id) VALUES
('Pedro Sánchez', '123456789', 4, '2025-09-01 20:00:00', 2),
('Laura Martínez', '987654321', 2, '2025-09-01 21:00:00', 3);'