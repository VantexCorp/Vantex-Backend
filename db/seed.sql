USE vantex_db;

DROP PROCEDURE IF EXISTS sp_seed_database;

DELIMITER //

CREATE PROCEDURE sp_seed_database()
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        ROLLBACK;
        SELECT 'Critical error: Data insertion failed. ROLLBACK executed.' AS Log_Message;
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
    ('admin@vantexcorp.com', '$2b$10$PlDMjyQown11x5p/rZd6H.QLb4FDD6zt19rhZBIWOUFI2jDzcFoz2', 'Vantex Administrator', 'admin'),
    ('manager@vantexcorp.com', '$2b$10$PlDMjyQown11x5p/rZd6H.QLb4FDD6zt19rhZBIWOUFI2jDzcFoz2', 'Carlos (Maintenance Director)', 'maintenance_manager'),
    ('pepe@vantexcorp.com', '$2b$10$PlDMjyQown11x5p/rZd6H.QLb4FDD6zt19rhZBIWOUFI2jDzcFoz2', 'Pepe (Senior Mechanic)', 'technician'),
    ('laura@vantexcorp.com', '$2b$10$PlDMjyQown11x5p/rZd6H.QLb4FDD6zt19rhZBIWOUFI2jDzcFoz2', 'Laura (Electrical Technician)', 'technician'),
    ('sam@vantexcorp.com', '$2b$10$PlDMjyQown11x5p/rZd6H.QLb4FDD6zt19rhZBIWOUFI2jDzcFoz2', 'Sam (Maintenance Tech)', 'technician'),
    ('maria@vantexcorp.com', '$2b$10$PlDMjyQown11x5p/rZd6H.QLb4FDD6zt19rhZBIWOUFI2jDzcFoz2', 'Maria (Systems Specialist)', 'technician'),
    ('alex@vantexcorp.com', '$2b$10$PlDMjyQown11x5p/rZd6H.QLb4FDD6zt19rhZBIWOUFI2jDzcFoz2', 'Alex (Shift Supervisor)', 'maintenance_manager'),
    ('dev@vantexcorp.com', '$2b$10$PlDMjyQown11x5p/rZd6H.QLb4FDD6zt19rhZBIWOUFI2jDzcFoz2', 'Developer Support', 'admin');

    INSERT INTO machines (asset_code, name, location, status, downtime_hourly_cost) VALUES
    ('EQ-001', 'Main Packer', 'Warehouse A - Line 1', 'operational', 450.00),
    ('EQ-002', 'Elevated Conveyor Belt', 'Logistics Zone', 'broken', 120.00),
    ('EQ-003', 'Precision CNC Lathe', 'Central Workshop', 'maintenance', 800.00),
    ('EQ-004', 'Industrial Compressor', 'Machine Room', 'operational', 200.00),
    ('EQ-005', 'Hydraulic Press', 'Warehouse B - Press Area', 'operational', 350.00),
    ('EQ-006', 'Labeling System', 'Warehouse A - Line 2', 'maintenance', 150.00),
    ('EQ-007', 'Forklift L-20', 'Shipping Dock', 'operational', 80.00),
    ('EQ-008', 'Cooling Tower', 'Rooftop', 'broken', 500.00);

    INSERT INTO spare_parts (sku, name, current_stock, minimum_stock, unit_price) VALUES
    ('SKF-6204', 'SKF Ball Bearing', 15, 5, 12.50),     
    ('SENS-IND', 'Inductive Optical Sensor', 3, 5, 45.00),   
    ('FUS-30A',  'Industrial Fuse 30A', 0, 10, 2.50),    
    ('VBELT-A',  'V-Belt Drive Belt', 8, 2, 18.00), 
    ('FIL-AIR',  'Pneumatic Air Filter', 2, 2, 25.00),
    ('OIL-HYD',  'Hydraulic Oil 5L', 12, 4, 35.00),
    ('PLC-BAT',  'PLC Backup Battery', 20, 5, 15.00),
    ('MOTOR-S',  'Small Stepper Motor', 1, 2, 120.00);

    INSERT INTO work_orders (wo_code, technician_id, machine_id, issue_description, status, opened_at, started_at, closed_at, resolution_comment) VALUES
    ('WO-2026-001', 3, 1, 'Main motor overheating.', 'in_progress', DATE_SUB(NOW(), INTERVAL 3 HOUR), DATE_SUB(NOW(), INTERVAL 1 HOUR), NULL, NULL),
    ('WO-2026-002', 4, 2, 'Belt breakage. Replacement required.', 'open', DATE_SUB(NOW(), INTERVAL 5 HOUR), NULL, NULL, NULL),
    ('WO-2026-003', 3, 4, 'Monthly preventive maintenance.', 'closed', DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), 'Filters changed and inspection completed successfully.'),
    ('WO-2026-004', 5, 5, 'Oil leak in hydraulic cylinder.', 'open', DATE_SUB(NOW(), INTERVAL 8 HOUR), NULL, NULL, NULL),
    ('WO-2026-005', 6, 8, 'Total failure in cooling pump.', 'open', DATE_SUB(NOW(), INTERVAL 12 HOUR), NULL, NULL, NULL),
    ('WO-2026-006', 4, 6, 'Labeler alignment calibration.', 'in_progress', DATE_SUB(NOW(), INTERVAL 2 HOUR), DATE_SUB(NOW(), INTERVAL 30 MINUTE), NULL, NULL),
    ('WO-2026-007', 5, 1, 'Scheduled safety inspection.', 'closed', DATE_SUB(NOW(), INTERVAL 3 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY), 'Inspection passed. No issues found.'),
    ('WO-2026-008', 6, 7, 'Hydraulic system checkup.', 'closed', DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), DATE_SUB(NOW(), INTERVAL 3 DAY), 'System pressure adjusted to optimal levels.');

    INSERT INTO material_used (id_work_order, id_part, quantity_used, applied_price) VALUES
    (1, 1, 2, 12.50),
    (3, 5, 1, 25.00),
    (7, 4, 1, 18.00),
    (8, 6, 1, 35.00);

    COMMIT;
    SELECT 'Success: Database reset and seed data inserted.' AS Log_Message;
END //

DELIMITER ;

CALL sp_seed_database();
DROP PROCEDURE sp_seed_database;