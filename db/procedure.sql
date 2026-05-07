USE vantex_db;

DROP PROCEDURE IF EXISTS sp_registrar_material_usado;

DELIMITER //

CREATE PROCEDURE sp_registrar_material_usado (
    IN p_id_work_order INT,
    IN p_id_part INT,
    IN p_quantity INT
)
BEGIN
    DECLARE v_current_price DECIMAL(10,2);
    DECLARE v_current_stock INT;

    SELECT unit_price, current_stock INTO v_current_price, v_current_stock
    FROM spare_parts
    WHERE id = p_id_part;

    IF v_current_stock IS NULL THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: El repuesto indicado no existe en la base de datos.';
    ELSEIF v_current_stock < p_quantity THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Error: Stock insuficiente. No puedes retirar mas repuestos de los que hay en el almacen.';
    ELSE
        INSERT INTO material_used (id_work_order, id_part, quantity_used, applied_price)
        VALUES (p_id_work_order, p_id_part, p_quantity, v_current_price);

        UPDATE spare_parts
        SET current_stock = current_stock - p_quantity
        WHERE id = p_id_part;
    END IF;
END //

DELIMITER ;

DROP PROCEDURE IF EXISTS sp_cierre_ordenes_abandonadas;

DELIMITER //

CREATE PROCEDURE sp_cierre_ordenes_abandonadas()
BEGIN
    DECLARE v_filas_afectadas INT;

    UPDATE work_orders 
    SET 
        status = 'closed',
        resolution_comment = 'Cierre forzado por el sistema. Inactividad superior a 30 dias.',
        closed_at = NOW() 
    WHERE 
        status IN ('open', 'in_progress') 
        AND opened_at < DATE_SUB(NOW(), INTERVAL 30 DAY);

    SET v_filas_afectadas = ROW_COUNT();
    
    SELECT CONCAT('Auditoria ejecutada. Se cerraron automaticamente ', v_filas_afectadas, ' ordenes.') AS Log_Result;
END //

DELIMITER ;