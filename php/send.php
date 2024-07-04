<?php
// Configuration
$apiKey = '1de660588b1ed81c65bfde01cd3c4b39';
$senderNumber = $_POST['sender_number'];
$recipientNumbers = $_POST['recipient_numbers'];
$amount = $_POST['amount'];
$message = $_POST['message'];

// Validate input
if (empty($senderNumber) || empty($recipientNumbers) || empty($amount) || empty($message)) {
    echo 'Please fill in all fields.';
    exit;
}

// Validate recipient numbers format
$recipientNumbersArray = explode(',', $recipientNumbers);
$formattedRecipientNumbers = [];

foreach ($recipientNumbersArray as $number) {
    $number = preg_replace('/\D/', '', $number); // Remove non-numeric characters

    // Ensure number starts with '+'
    if (substr($number, 0, 1) !== '+') {
        $number = '+' . $number; // Prepend '+' if not already present
    }

    // Check if number starts with '+' and is followed by digits
    if (preg_match('/^\+\d{11,}$/', $number)) { // Adjust regex as per your country code and phone number length
        $formattedRecipientNumbers[] = $number;
    } else {
        echo "Invalid phone number format: $number";
        exit;
    }
}

// Check if the number of formatted recipient numbers matches the amount
if (count($formattedRecipientNumbers) != $amount) {
    echo 'Number of recipient numbers does not match the specified amount.';
    exit;
}

// Convert array of recipient numbers to comma-separated string
$recipientString = implode(',', $formattedRecipientNumbers);

// Initialize curl
$curl = curl_init();

// Set curl options
curl_setopt_array($curl, [
    CURLOPT_URL => "https://api.ycloud.com/v2/sms",
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_ENCODING => "",
    CURLOPT_MAXREDIRS => 10,
    CURLOPT_TIMEOUT => 30,
    CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
    CURLOPT_CUSTOMREQUEST => "POST",
    CURLOPT_POSTFIELDS => json_encode([
        'to' => $recipientString,
        'text' => $message,
        'from' => $senderNumber
    ]),
    CURLOPT_HTTPHEADER => [
        "Content-Type: application/json",
        "X-API-Key: $apiKey"
    ],
]);

// Execute curl
$response = curl_exec($curl);
$err = curl_error($curl);

// Close curl
curl_close($curl);

// Check for errors
if ($err) {
    echo "cURL Error #: $err";
} else {
    echo $response;
}
?>
