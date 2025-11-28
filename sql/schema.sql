CREATE DATABASE IF NOT EXISTS assessment_db;
USE assessment_db;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- index for optimization (created_at )
CREATE INDEX idx_created_at ON users (created_at DESC);
