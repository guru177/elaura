<?php
// backend/get_leads.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Simple Security Token (You can change this)
$SECRET_TOKEN = 'elaura_admin_2026';

$headers = getallheaders();
$authHeader = $headers['Authorization'] ?? '';
$token = str_replace('Bearer ', '', $authHeader);

// Check if token matches
if ($token !== $SECRET_TOKEN && (!isset($_GET['token']) || $_GET['token'] !== $SECRET_TOKEN)) {
    http_response_code(401);
    echo json_encode(["status" => "error", "message" => "Unauthorized"]);
    exit();
}

// Use MySQL
require_once __DIR__ . '/config.php';

try {
    $stmt = $pdo->query("SELECT id, date, name, phone, email, age, interested_area as interestedArea, address, message FROM leads ORDER BY date DESC");
    $leads = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($leads);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Database error: " . $e->getMessage()]);
}
?>
