<?php
// backend/config.php

$db_host = '127.0.0.1';
$db_name = 'elaura_db';
$db_user = 'root'; // Change this on production
$db_pass = '';     // Change this on production

try {
    $pdo = new PDO("mysql:host=$db_host;charset=utf8mb4", $db_user, $db_pass);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Create database if it doesn't exist
    $pdo->exec("CREATE DATABASE IF NOT EXISTS `$db_name`");
    $pdo->exec("USE `$db_name`");
    
    // Create admins table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `admins` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `email` VARCHAR(255) NOT NULL UNIQUE,
        `password` VARCHAR(255) NOT NULL
    )");
    
    // Create leads table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `leads` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `date` DATETIME NOT NULL,
        `name` VARCHAR(255) NOT NULL,
        `phone` VARCHAR(50) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `age` VARCHAR(10) NOT NULL,
        `interested_area` VARCHAR(255) NOT NULL,
        `address` TEXT NOT NULL,
        `message` TEXT NOT NULL
    )");

    // Create contacts table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `contacts` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `date` DATETIME NOT NULL,
        `name` VARCHAR(255) NOT NULL,
        `email` VARCHAR(255) NOT NULL,
        `phone` VARCHAR(50) NOT NULL,
        `subject` VARCHAR(255) NOT NULL,
        `message` TEXT NOT NULL
    )");
    
    // Create courses table
    $pdo->exec("CREATE TABLE IF NOT EXISTS `courses` (
        `id` INT AUTO_INCREMENT PRIMARY KEY,
        `title` VARCHAR(255) NOT NULL,
        `image` VARCHAR(255) NOT NULL,
        `description` TEXT NOT NULL,
        `coursesCount` VARCHAR(100) NOT NULL,
        `lessonsCount` VARCHAR(100) NOT NULL,
        `duration` VARCHAR(100) NOT NULL,
        `category` VARCHAR(100) NOT NULL,
        `overview` TEXT NOT NULL,
        `whatYouLearn` JSON,
        `curriculum` JSON
    )");
    
    // Insert default admin if table is empty
    $stmt = $pdo->query("SELECT COUNT(*) FROM admins");
    if ($stmt->fetchColumn() == 0) {
        $default_email = 'lead@elauraacademy.com';
        $default_pass = password_hash('elaura_admin_2026', PASSWORD_DEFAULT);
        $insert = $pdo->prepare("INSERT INTO admins (email, password) VALUES (?, ?)");
        $insert->execute([$default_email, $default_pass]);
    }

} catch(PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Database Connection failed: " . $e->getMessage()]));
}
?>
