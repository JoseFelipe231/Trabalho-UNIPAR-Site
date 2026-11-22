CREATE DATABASE IF NOT EXISTS logistica_db
CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE logistica_db;

CREATE TABLE fretes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    origem VARCHAR(255) NOT NULL,
    destino VARCHAR(255) NOT NULL,
    transportadora VARCHAR(120) NOT NULL,
    status_frete VARCHAR(60) NOT NULL DEFAULT 'Aguardando Coleta',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE frete_itens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    frete_id INT NOT NULL,
    produto_nome VARCHAR(255) NOT NULL,
    quantidade INT NOT NULL,
    peso_unitario DECIMAL(10, 2) NOT NULL,
    CONSTRAINT fk_item_frete
        FOREIGN KEY (frete_id) REFERENCES fretes(id)
        ON DELETE CASCADE
);