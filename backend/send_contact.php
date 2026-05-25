<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require __DIR__ . '/../vendor/autoload.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON data"]);
    exit();
}

$name = $data['name'] ?? 'Not provided';
$email = $data['email'] ?? 'Not provided';
$phone = $data['phone'] ?? 'Not provided';
$subject = $data['subject'] ?? 'Not provided';
$messageContent = $data['message'] ?? 'Not provided';
$date = date('Y-m-d H:i:s');

require_once __DIR__ . '/config.php';

try {
    $stmt = $pdo->prepare("INSERT INTO contacts (date, name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->execute([$date, $name, $email, $phone, $subject, $messageContent]);
} catch (PDOException $e) {
    error_log("Database insert failed: " . $e->getMessage());
}

$mail = new PHPMailer(true);

try {
    // 1. Send Email to Admin
    $mail->isSMTP();
    $mail->Host       = 'mail.elauraacademy.com';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'lead@elauraacademy.com';
    $mail->Password   = 'Password@0123';
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;

    $mail->setFrom('lead@elauraacademy.com', 'Elaura Academy System');
    $mail->addAddress('lead@elauraacademy.com', 'Elaura Admin');

    $mail->isHTML(true);
    $mail->Subject = 'New Contact Form Submission: ' . $subject;
    
    $htmlBody = "
    <h2>New Contact Submission</h2>
    <table border='1' cellpadding='10' style='border-collapse: collapse; width: 100%; max-width: 600px;'>
        <tr><td width='30%'><strong>Date</strong></td><td>{$date}</td></tr>
        <tr><td><strong>Name</strong></td><td>{$name}</td></tr>
        <tr><td><strong>Email</strong></td><td>{$email}</td></tr>
        <tr><td><strong>Phone</strong></td><td>{$phone}</td></tr>
        <tr><td><strong>Subject</strong></td><td>{$subject}</td></tr>
        <tr><td><strong>Message</strong></td><td>" . nl2br(htmlspecialchars($messageContent)) . "</td></tr>
    </table>
    ";

    $mail->Body    = $htmlBody;
    $mail->AltBody = "New Contact from {$name}\nEmail: {$email}\nPhone: {$phone}\nSubject: {$subject}\nMessage: {$messageContent}";

    $mail->send();

    // 2. Send Auto-Reply to User
    $mail->clearAddresses();
    $mail->addAddress($email, $name);
    
    $mail->Subject = 'Thank you for contacting Elaura Academy';
    
    // Premium Auto-reply template for Contact
    $userHtmlBody = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;'>
        <div style='background-color: #0f172a; padding: 30px; text-align: center;'>
            <h1 style='color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;'>ELAURA ACADEMY</h1>
        </div>
        <div style='padding: 40px 30px; background-color: #ffffff;'>
            <h2 style='color: #1e293b; margin-top: 0;'>Hi {$name},</h2>
            <p style='color: #475569; font-size: 16px; line-height: 1.6;'>
                Thank you for reaching out to us. We have received your message regarding <strong>{$subject}</strong>.
            </p>
            <p style='color: #475569; font-size: 16px; line-height: 1.6;'>
                Our support team is reviewing your inquiry and will get back to you as soon as possible.
            </p>
            <div style='margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb;'>
                <p style='color: #94a3b8; font-size: 14px; margin: 0;'>
                    Best regards,<br>
                    <strong>The Elaura Academy Team</strong>
                </p>
            </div>
        </div>
        <div style='background-color: #f8fafc; padding: 20px; text-align: center;'>
            <p style='color: #94a3b8; font-size: 12px; margin: 0;'>© 2026 Elaura Academy. All rights reserved.</p>
        </div>
    </div>
    ";

    $mail->Body = $userHtmlBody;
    $mail->AltBody = "Hi {$name},\n\nThank you for reaching out. We have received your message regarding {$subject} and will get back to you soon.\n\nBest regards,\nElaura Academy Team";

    $mail->send();

    echo json_encode(["status" => "success", "message" => "Message sent successfully"]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
?>
