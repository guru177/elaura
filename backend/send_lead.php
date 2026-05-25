<?php
// backend/send_lead.php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Ensure the request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Method Not Allowed"]);
    exit();
}

// Load Composer's autoloader
require 'vendor/autoload.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Get the raw POST data
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

if (!$data) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Invalid JSON payload"]);
    exit();
}

// Extract fields
$name = $data['Name'] ?? 'Not provided';
$phone = $data['Phone'] ?? 'Not provided';
$email = $data['Email'] ?? 'Not provided';
$age = $data['Age'] ?? 'Not provided';
$interestedArea = $data['Interested Area'] ?? 'Not provided';
$address = $data['Address'] ?? 'Not provided';
$messageContent = $data['Message'] ?? 'Not provided';
$date = date('Y-m-d H:i:s');

// ---------------------------------------------------------
// SAVE TO MYSQL DATABASE
// ---------------------------------------------------------
require_once __DIR__ . '/config.php';

try {
    $stmt = $pdo->prepare("INSERT INTO leads (date, name, phone, email, age, interested_area, address, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->execute([
        $date,
        $name,
        $phone,
        $email,
        $age,
        $interestedArea,
        $address,
        $messageContent
    ]);
} catch (PDOException $e) {
    // We can choose to continue sending the email even if DB fails, or stop here.
    // Let's log error but continue with email.
    error_log("Database insert failed: " . $e->getMessage());
}

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->isSMTP();
    $mail->Host       = 'mail.elauraacademy.com';     // Set the SMTP server to send through
    $mail->SMTPAuth   = true;                         // Enable SMTP authentication
    $mail->Username   = 'lead@elauraacademy.com';     // SMTP username
    $mail->Password   = 'Password@0123';              // SMTP password
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Enable TLS encryption
    $mail->Port       = 587;                          // TCP port to connect to
    $mail->Timeout    = 15;                           // Add 15 second timeout to prevent hanging

    // Recipients
    $mail->setFrom('lead@elauraacademy.com', 'Elaura Academy Website');
    $mail->addAddress('lead@elauraacademy.com', 'Elaura Leads'); // Send notifications to lead@elauraacademy.com
    
    // Reply-To user
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $mail->addReplyTo($email, $name);
    }

    // Content
    $mail->isHTML(true);
    $mail->Subject = 'New Lead Submission: ' . $name;
    
    // Elegant HTML Template
    $mail->Body = "
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset='utf-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; margin: 0; padding: 0; }
            .email-wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); border: 1px solid #eaeaea; }
            .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 30px 40px; text-align: center; }
            .header h1 { color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px; }
            .header p { color: #94a3b8; margin: 8px 0 0 0; font-size: 14px; }
            .content { padding: 40px; }
            .lead-info { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
            .lead-info th, .lead-info td { padding: 15px 12px; text-align: left; border-bottom: 1px solid #f1f5f9; font-size: 15px; }
            .lead-info th { color: #64748b; font-weight: 500; width: 35%; }
            .lead-info td { color: #334155; font-weight: 600; }
            .message-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 20px; border-radius: 0 8px 8px 0; margin-top: 10px; }
            .message-label { font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; margin-bottom: 8px; }
            .message-content { color: #334155; line-height: 1.6; font-size: 15px; margin: 0; }
            .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #f1f5f9; }
            .footer p { color: #94a3b8; margin: 0; font-size: 13px; }
            .badge { background: #dbeafe; color: #1d4ed8; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; margin-bottom: 20px; }
        </style>
    </head>
    <body>
        <div class='email-wrapper'>
            <div class='header'>
                <h1>Elaura Academy</h1>
                <p>New Lead Notification</p>
            </div>
            <div class='content'>
                <span class='badge'>New Submission</span>
                <table class='lead-info'>
                    <tr>
                        <th>Full Name</th>
                        <td>{$name}</td>
                    </tr>
                    <tr>
                        <th>Phone Number</th>
                        <td><a href='tel:{$phone}' style='color: #3b82f6; text-decoration: none;'>{$phone}</a></td>
                    </tr>
                    <tr>
                        <th>Email Address</th>
                        <td><a href='mailto:{$email}' style='color: #3b82f6; text-decoration: none;'>{$email}</a></td>
                    </tr>
                    <tr>
                        <th>Age</th>
                        <td>{$age} years old</td>
                    </tr>
                    <tr>
                        <th>Interested Area</th>
                        <td>{$interestedArea}</td>
                    </tr>
                    <tr>
                        <th>Location/Address</th>
                        <td>{$address}</td>
                    </tr>
                </table>
                
                <div class='message-box'>
                    <div class='message-label'>Message / Query</div>
                    <p class='message-content'>" . nl2br(htmlspecialchars($messageContent)) . "</p>
                </div>
            </div>
            <div class='footer'>
                <p>This email was automatically generated from the Elaura Academy website lead form.</p>
            </div>
        </div>
    </body>
    </html>
    ";
    
    $mail->AltBody = "New Lead Details\n\nName: {$name}\nPhone: {$phone}\nEmail: {$email}\nAge: {$age}\nInterested Area: {$interestedArea}\nAddress: {$address}\nMessage: {$messageContent}";

    $mail->send();

    // ---------------------------------------------------------
    // SEND PREMIUM THANK YOU EMAIL TO THE USER
    // ---------------------------------------------------------
    if (filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // Clear previous recipients and reply-tos
        $mail->clearAllRecipients();
        $mail->clearReplyTos();
        
        $mail->addAddress($email, $name);
        $mail->Subject = 'Thank you for your interest in Elaura Academy!';
        
        $mail->Body = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='utf-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <style>
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
                .email-wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #f1f5f9; }
                .header { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 40px; text-align: center; }
                .header h1 { color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 0.5px; }
                .header-accent { display: block; width: 60px; height: 4px; background: #3b82f6; margin: 20px auto 0; border-radius: 2px; }
                .content { padding: 40px; text-align: center; }
                .greeting { font-size: 22px; color: #1e293b; font-weight: 600; margin-top: 0; }
                .message { color: #475569; line-height: 1.8; font-size: 16px; margin: 20px 0; }
                .highlight { color: #3b82f6; font-weight: 600; }
                .next-steps { background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; text-align: left; border: 1px solid #e2e8f0; }
                .next-steps h3 { margin-top: 0; color: #1e293b; font-size: 16px; margin-bottom: 15px; }
                .step { display: table; margin-bottom: 12px; width: 100%; }
                .step-icon { display: table-cell; color: #3b82f6; font-weight: bold; width: 25px; vertical-align: top; }
                .step-text { display: table-cell; color: #64748b; font-size: 15px; line-height: 1.5; }
                .footer { background: #1e293b; padding: 30px; text-align: center; }
                .footer p { color: #94a3b8; margin: 0 0 10px 0; font-size: 14px; }
                .social-links { margin-top: 15px; }
                .social-links a { color: #ffffff; text-decoration: none; margin: 0 10px; font-size: 13px; font-weight: 500; opacity: 0.8; }
            </style>
        </head>
        <body>
            <div class='email-wrapper'>
                <div class='header'>
                    <h1>Elaura Academy</h1>
                    <div class='header-accent'></div>
                </div>
                <div class='content'>
                    <h2 class='greeting'>Hello {$name},</h2>
                    <p class='message'>Thank you for taking the first step towards your future with <strong>Elaura Academy</strong>! We have successfully received your inquiry regarding <span class='highlight'>{$interestedArea}</span>.</p>
                    
                    <div class='next-steps'>
                        <h3>What happens next?</h3>
                        <div class='step'>
                            <div class='step-icon'>✓</div>
                            <div class='step-text'>Our admissions team will review your details.</div>
                        </div>
                        <div class='step'>
                            <div class='step-icon'>✓</div>
                            <div class='step-text'>We will prepare customized information for your interests.</div>
                        </div>
                        <div class='step'>
                            <div class='step-icon'>✓</div>
                            <div class='step-text'>One of our counselors will contact you shortly to guide you.</div>
                        </div>
                    </div>
                    
                    <p class='message'>If you have any urgent questions, feel free to reply directly to this email. We are thrilled to help you begin your journey!</p>
                </div>
                <div class='footer'>
                    <p>Elaura Academy Team</p>
                    <div class='social-links'>
                        <a href='#'>Website</a> &bull; 
                        <a href='#'>Courses</a> &bull; 
                        <a href='#'>Contact Us</a>
                    </div>
                </div>
            </div>
        </body>
        </html>
        ";
        
        $mail->AltBody = "Hi {$name},\n\nThank you for reaching out to Elaura Academy! We have received your inquiry regarding {$interestedArea} and our team will get back to you shortly.\n\nBest regards,\nElaura Academy Team";
        
        $mail->send();
    }

    echo json_encode(["status" => "success", "message" => "Message has been sent successfully"]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"]);
}
?>
