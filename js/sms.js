
function updateAmount() {
    var recipientNumbers = document.getElementById('recipient-numbers').value;
    var amountInput = document.getElementById('amount');
    var commaCount = recipientNumbers.split(',').length - 1; // Count commas in input

    amountInput.value = commaCount + 1; // Set amount to number of commas + 1
}

function validateForm() {
    // Optionally, you can add more validation logic here if needed
    return true; // Allow form submission
}
