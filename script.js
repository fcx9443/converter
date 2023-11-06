function convertFrom(base) {
    // Hide error message initially
    displayErrorMessage("");

    // Get the value from the appropriate input
    let value = document.getElementById(base + "Input").value.trim();
    let decimalValue;

    // Skip conversion if the value is empty or if only a dot is entered (for decimals)
    if (value === "" || value === ".") {
        clearFieldsExcept(base);
        return;
    }

    try {
        switch (base) {
            case "binary":
                // Validate binary and convert
                if (!/^[01]+$/.test(value))
                    throw new Error("Invalid binary number.");
                decimalValue = parseInt(value, 2);
                break;
            case "hex":
                // Validate hex and convert
                if (!/^[0-9a-fA-F]+$/.test(value))
                    throw new Error("Invalid hexadecimal number.");
                decimalValue = parseInt(value, 16);
                break;
            case "octal":
                // Validate octal and convert
                if (!/^[0-7]+$/.test(value))
                    throw new Error("Invalid octal number.");
                decimalValue = parseInt(value, 8);
                break;
            case "decimal":
                // Validate decimal and convert
                if (!/^\d*\.?\d*$/.test(value))
                    throw new Error("Invalid decimal number.");
                decimalValue = value === "." ? 0 : parseFloat(value);
                break;
            default:
                clearFields();
                return; // Exit the function early if base is unknown
        }
    } catch (e) {
        // If an error occurs, display it and clear fields
        displayErrorMessage(e.message);
        clearFields();
        return;
    }

    // Update other fields based on decimal value
    updateFields(decimalValue, base);
}

function updateFields(decimalValue, base) {
    // Only update fields that did not trigger the conversion to prevent feedback loop
    if (base !== "binary")
        document.getElementById("binaryInput").value = (
            decimalValue >>> 0
        ).toString(2); // For integers only
    if (base !== "hex")
        document.getElementById("hexInput").value =
            Math.floor(decimalValue).toString(16); // For integers only
    if (base !== "octal")
        document.getElementById("octalInput").value =
            Math.floor(decimalValue).toString(8); // For integers only
    if (base !== "decimal")
        document.getElementById("decimalInput").value = decimalValue; // This can be a float or integer
}

function clearFields() {
    document.getElementById("binaryInput").value = "";
    document.getElementById("hexInput").value = "";
    document.getElementById("octalInput").value = "";
    document.getElementById("decimalInput").value = "";
}

function clearFieldsExcept(base) {
    if (base !== "binary") document.getElementById("binaryInput").value = "";
    if (base !== "hex") document.getElementById("hexInput").value = "";
    if (base !== "octal") document.getElementById("octalInput").value = "";
    if (base !== "decimal") document.getElementById("decimalInput").value = "";
}

function displayErrorMessage(message) {
    document.getElementById("error-message").textContent = message;
}

function formatNumber(num) {
    // This will drop any insignificant trailing zeroes and decimal point if not needed
    return parseFloat(num.toFixed(2));
}

// Percentage Calculator Functions
function calculatePercentageFromPartAndTotal() {
    var part = parseFloat(document.getElementById('partValue').value) || 0;
    var total = parseFloat(document.getElementById('percentOfValue').value) || 0;

    if (part !== 0 && total !== 0) {
        var percentage = (100 * part) / total;
        document.getElementById('percentResult').value = formatNumber(percentage);
    } else {
        document.getElementById('percentResult').value = '';
    }
}

function calculatePartFromPercentageAndTotal() {
    var percentage = parseFloat(document.getElementById('percentResult').value) || 0;
    var total = parseFloat(document.getElementById('percentOfValue').value) || 0;

    if (percentage !== 0 && total !== 0) {
        var part = (percentage * total) / 100;
        document.getElementById('partValue').value = formatNumber(part);
    } else {
        document.getElementById('partValue').value = '';
    }
}

// Adjustments to input handling to call the appropriate function
document.getElementById('partValue').oninput = function() {
    if (document.getElementById('percentOfValue').value !== '') {
        calculatePercentageFromPartAndTotal();
    }
};

document.getElementById('percentOfValue').oninput = function() {
    if (document.getElementById('partValue').value !== '') {
        calculatePercentageFromPartAndTotal();
    } else if (document.getElementById('percentResult').value !== '') {
        calculatePartFromPercentageAndTotal();
    }
};

document.getElementById('percentResult').oninput = function() {
    if (document.getElementById('percentOfValue').value !== '') {
        calculatePartFromPercentageAndTotal();
    }
};


// Time Converter Function
function convertTime(unit) {
    var hours = parseFloat(document.getElementById('hours').value) || 0;
    var minutes = parseFloat(document.getElementById('minutes').value) || 0;
    var seconds = parseFloat(document.getElementById('seconds').value) || 0;

    // If hours were entered or changed, recalculate minutes and seconds
    if (unit === 'hours') {
        minutes = hours * 60;
        seconds = hours * 3600;
    } 
    // If minutes were entered or changed, recalculate hours and seconds
    else if (unit === 'minutes') {
        hours = minutes / 60;
        seconds = minutes * 60;
    } 
    // If seconds were entered or changed, recalculate hours and minutes
    else if (unit === 'seconds') {
        hours = Math.floor(seconds / 3600); // Whole hours
        minutes = Math.floor((seconds % 3600) / 60); // Remaining minutes
    }

    // Update the value fields, ensuring we don't skip zero values
    document.getElementById('hours').value = (hours || hours === 0) ? formatNumber(hours) : '';
    document.getElementById('minutes').value = (minutes || minutes === 0) ? formatNumber(minutes) : '';
    document.getElementById('seconds').value = (seconds || seconds === 0) ? formatNumber(seconds) : '';
}


// ASCII/Unicode Converter Functions
function convertCharToCode() {
    var char = document.getElementById("charInput").value;
    if (char.length === 1) {
        // Only proceed if a single character is entered
        var code = char.charCodeAt(0);
        document.getElementById("codeInput").value = code;
    } else if (char.length === 0) {
        // Clear code input if char input is empty
        document.getElementById("codeInput").value = "";
    }
}

function convertCodeToChar() {
    var code = parseInt(document.getElementById("codeInput").value);
    if (!isNaN(code) && code >= 0 && code <= 0x10ffff) {
        // Check for valid code range
        var char = String.fromCharCode(code);
        document.getElementById("charInput").value = char;
    } else if (document.getElementById("codeInput").value === "") {
        // Clear char input if code input is empty
        document.getElementById("charInput").value = "";
    }
}

// Helper function to set input filters based on regular expressions
function setInputFilter(textbox, inputFilter) {
    [
        "input",
        "keydown",
        "keyup",
        "mousedown",
        "mouseup",
        "select",
        "contextmenu",
        "drop"
    ].forEach(function (event) {
        textbox.addEventListener(event, function () {
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(
                    this.oldSelectionStart,
                    this.oldSelectionEnd
                );
            } else {
                this.value = "";
            }
        });
    });
}

// Apply filters to ensure correct input format
setInputFilter(document.getElementById("binaryInput"), function (value) {
    return /^[01]*$/.test(value); // Only binary numbers
});
setInputFilter(document.getElementById("hexInput"), function (value) {
    return /^[0-9a-fA-F]*$/.test(value); // Only hex numbers
});
setInputFilter(document.getElementById("octalInput"), function (value) {
    return /^[0-7]*$/.test(value); // Only octal numbers
});