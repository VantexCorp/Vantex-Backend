USE vantex_db;

DROP PROCEDURE IF EXISTS sp_seed_database;

DELIMITER //

CREATE PROCEDURE sp_seed_database()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Error crítico: Fallo en la inserción de datos. Se ha ejecutado ROLLBACK.' AS Log_Message;
    END;

    START TRANSACTION;

    DELETE FROM material_used;
    DELETE FROM work_orders;
    DELETE FROM spare_parts;
    DELETE FROM machines;
    DELETE FROM users;

    ALTER TABLE users AUTO_INCREMENT = 1;
    ALTER TABLE machines AUTO_INCREMENT = 1;
    ALTER TABLE spare_parts AUTO_INCREMENT = 1;
    ALTER TABLE work_orders AUTO_INCREMENT = 1;

    INSERT INTO users (email, password_hash, full_name, role) VALUES
    ('admin@vantexcorp.com', '123456', 'Administrador Vantex', 'admin'),
    ('jefe@vantexcorp.com', '123456', 'Carlos (Director Mantenimiento)', 'maintenance_manager'),
    ('pepe@vantexcorp.com', '123456', 'Pepe (Mecánico Senior)', 'technician'),
    ('laura@vantexcorp.com', '123456', 'Laura (Técnica Eléctrica)', 'technician');

    INSERT INTO machines (asset_code, name, location, status, downtime_hourly_cost) VALUES
    ('EQ-001', 'Empaquetadora Principal', 'Nave A - Línea 1', 'operational', 450.00),
    ('EQ-002', 'Cinta Transportadora Elevada', 'Zona Logística', 'broken', 120.00),
    ('EQ-003', 'Torno de Precisión CNC', 'Taller Central', 'maintenance', 800.00),
    ('EQ-004', 'Compresor Industrial', 'Cuarto de Máquinas', 'operational', 200.00);

    INSERT INTO spare_parts (sku, name, current_stock, minimum_stock, unit_price) VALUES
    ('SKF-6204', 'Rodamiento Bolas SKF', 15, 5, 12.50),     
    ('SENS-IND', 'Sensor Óptico Inductivo', 3, 5, 45.00),   
    ('FUS-30A',  'Fusible Industrial 30A', 0, 10, 2.50),    
    ('VBELT-A',  'Correa de Transmisión V-Belt', 8, 2, 18.00), 
    ('FIL-AIR',  'Filtro de Aire Neumático', 2, 2, 25.00);  

    INSERT INTO work_orders (wo_code, technician_id, machine_id, issue_description, status, opened_at, started_at, closed_at, resolution_comment) VALUES
    ('OT-2026-001', 3, 1, 'Sobrecalentamiento del motor principal.', 'in_progress', DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL),
    ('OT-2026-002', 4, 2, 'Rotura de correa. Se requiere sustitución.', 'open', DATE_SUB(NOW(), INTERVAL 5 HOUR), NULL, NULL, NULL),
    ('OT-2026-003', 3, 4, 'Mantenimiento preventivo mensual.', 'closed', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), 'Filtros cambiados y revisión completada con éxito.');

    INSERT INTO material_used (id_work_order, id_part, quantity_used, applied_price) VALUES
    (1, 1, 2, 12.50),
    (3, 5, 1, 25.00);

    COMMIT;
    SELECT 'Operación exitosa: Base de datos reseteada y datos semilla insertados.' AS Log_Message;
END //

DELIMITER ;

CALL sp_seed_database();
DROP PROCEDURE sp_seed_database;