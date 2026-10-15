<?php

header('Content-Type: application/json');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';


// ======================================
// ONLY POST REQUESTS
// ======================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {

    echo json_encode([
        "success" => false,
        "message" => "Invalid request"
    ]);

    exit;
}


// ======================================
// reCAPTCHA
// ======================================

// Credentials live in secrets.php (not in git) — see secrets.example.php
$config = require __DIR__ . '/secrets.php';

$secret_key = $config['recaptcha_secret'];

$token = $_POST['g-recaptcha-response'] ?? '';

if(empty($token)){

    echo json_encode([
        "success" => false,
        "message" => "Captcha missing"
    ]);

    exit;
}

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL,
"https://www.google.com/recaptcha/api/siteverify");

curl_setopt($ch, CURLOPT_POST, 1);

curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query([
    'secret' => $secret_key,
    'response' => $token
]));

curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);

curl_close($ch);

$captcha = json_decode($response);

if (!$captcha->success) {

    echo json_encode([
        "success" => false,
        "message" => "Captcha verification failed"
    ]);

    exit;
}

// ======================================
// SANITIZE
// ======================================

$name = strip_tags(trim($_POST['full_name'] ?? ''));

$email = filter_var(
    trim($_POST['email'] ?? ''),
    FILTER_SANITIZE_EMAIL
);

$phone = strip_tags(trim($_POST['phone'] ?? ''));

$subject = strip_tags(trim($_POST['subject'] ?? ''));

$message = strip_tags(trim($_POST['message'] ?? ''));



if (
    empty($name) ||
    empty($email) ||
    empty($subject) ||
    empty($message)
) {

    echo json_encode([
        "success" => false,
        "message" => "Required fields missing"
    ]);

    exit;
}



// ======================================
// SEND MAIL
// ======================================

$mail = new PHPMailer(true);

try {

    $mail->isSMTP();

    $mail->Host = $config['smtp_host'];

    $mail->SMTPAuth = true;

    $mail->Username = $config['smtp_username'];

    $mail->Password = $config['smtp_password'];

    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;

    $mail->Port = 587;

$mail->setFrom(
    'noreply@craftscouncilofindia.in',
    'Crafts Council Of India'
);

    $mail->addAddress(
        'info@craftscouncilofindia.in'
    );

    $mail->addReplyTo($email, $name);


    $mail->isHTML(true);

    $mail->Subject = "New Contact Form Enquiry";


    $mail->Body = "

    <div style='font-family:Arial;padding:20px;'>

        <h2>New Contact Form Submission</h2>

        <p><strong>Name:</strong> {$name}</p>

        <p><strong>Email:</strong> {$email}</p>

        <p><strong>Phone:</strong> {$phone}</p>

        <p><strong>Subject:</strong> {$subject}</p>

        <p><strong>Message:</strong><br>{$message}</p>

    </div>

    ";


    $mail->send();


    echo json_encode([
        "success" => true,
        "message" => "Message sent successfully"
    ]);

} catch (Exception $e) {

    echo json_encode([
        "success" => false,
        "message" => $mail->ErrorInfo
    ]);

}
?>