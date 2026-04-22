CREATE DATABASE IF NOT EXISTS vantex_db;
USE vantex_db;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    role ENUM('admin', 'maintenance_manager', 'technician') NOT NULL DEFAULT 'technician',
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS machines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    asset_code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    status ENUM('operational', 'broken', 'maintenance') DEFAULT 'operational',
    downtime_hourly_cost DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spare_parts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    current_stock INT DEFAULT 0,
    minimum_stock INT DEFAULT 1,
    unit_price DECIMAL(10, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS work_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    wo_code VARCHAR(20) NOT NULL UNIQUE,
    technician_id INT NOT NULL,
    machine_id INT NOT NULL,
    issue_description TEXT NOT NULL,
    resolution_comment TEXT,
    opened_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP NULL,
    time_spent_minutes INT DEFAULT 0,
    status ENUM('open', 'in_progress', 'closed') DEFAULT 'open',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (technician_id) REFERENCES users(id) ON DELETE RESTRICT,
    FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS material_used (
    id_work_order INT NOT NULL,
    id_part INT NOT NULL,
    quantity_used INT NOT NULL DEFAULT 1,
    applied_price DECIMAL(10, 2) NOT NULL, 
    
    PRIMARY KEY (id_work_order, id_part),
    FOREIGN KEY (id_work_order) REFERENCES work_orders(id) ON DELETE CASCADE,
    FOREIGN KEY (id_part) REFERENCES spare_parts(id) ON DELETE RESTRICT 
);