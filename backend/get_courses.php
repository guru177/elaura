<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

require 'config.php';

try {
    $stmt = $pdo->query("SELECT * FROM courses ORDER BY id ASC");
    $courses = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    // Decode JSON strings back to arrays/objects for frontend
    foreach ($courses as &$course) {
        if ($course['whatYouLearn']) $course['whatYouLearn'] = json_decode($course['whatYouLearn'], true);
        if ($course['curriculum']) $course['curriculum'] = json_decode($course['curriculum'], true);
    }
    
    echo json_encode($courses);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}
?>
