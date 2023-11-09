// Navigation scroll and scroll-to-top logic
let lastScrollTop = 0; // Keeps track of last scroll position

window.addEventListener("scroll",
function() {
	let currentScroll = window.pageYOffset || document.documentElement.scrollTop;

	// Scroll to top button display logic
	let scrollBtn = document.getElementById("scroll-to-top");
	if (currentScroll > 100) { // Show after 100px of scroll
		scrollBtn.style.display = "block";
	} else {
		scrollBtn.style.display = "none";
	}

	// Navbar hide/show logic
	if (currentScroll > lastScrollTop && currentScroll > 80) { // Hide navbar after 80px of scroll
		document.getElementById("navbar").style.top = "-60px"; // Adjust value to navbar height
	} else {
		document.getElementById("navbar").style.top = "0"; // Show navbar
	}
	lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
},
false);

// Scroll to top button click logic
document.getElementById("scroll-to-top").addEventListener("click",
function() {
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
});

// Function to toggle the menu on mobile
function toggleMenu() {
	var navLinks = document.querySelector('.nav-links');
	navLinks.classList.toggle('active');
}

// Toggle dropdown menu for touch devices
function toggleDropdown(e) {
	e.preventDefault(); // Prevent link from navigating to #projects
	var dropdownContent = e.target.nextElementSibling; // Get the next element, which should be the dropdown content
	if (dropdownContent.style.display === "block") {
		dropdownContent.style.display = "none";
	} else {
		dropdownContent.style.display = "block";
	}
}

// Theme toggle
document.addEventListener('DOMContentLoaded', (event) = >{
	const toggleButton = document.getElementById('theme-toggle');
	const currentTheme = localStorage.getItem('theme');

	// Function to update the icon based on the theme
	const updateIcon = () = >{
		const isDarkMode = document.body.classList.contains('dark-theme');
		if (isDarkMode) {
			toggleButton.innerHTML = '☀️'; // Light mode icon
		} else {
			toggleButton.innerHTML = '🌙'; // Dark mode icon
		}
	};

	// Apply the current theme and update the icon accordingly
	if (currentTheme === 'dark') {
		document.body.classList.add('dark-theme');
	} else {
		document.body.classList.remove('dark-theme');
	}
	updateIcon(); // Update the icon on page load

	toggleButton.addEventListener('click', () = >{
		document.body.classList.toggle('dark-theme');
		const theme = document.body.classList.contains('dark-theme') ? 'dark': 'light';
		localStorage.setItem('theme', theme); // Save the current preference to localStorage
		updateIcon(); // Update the icon on toggle
	});
});

function convertFrom(base) {
	// Hide error message initially
	displayErrorMessage("");
	clearErrorMessages();

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
			if (!/^[01]+$/.test(value)) throw new Error("Invalid binary number.");
			decimalValue = parseInt(value, 2);
			break;
		case "hex":
			// Validate hex and convert
			if (!/^[0-9a-fA-F]+$/.test(value)) throw new Error("Invalid hexadecimal number.");
			decimalValue = parseInt(value, 16);
			break;
		case "octal":
			// Validate octal and convert
			if (!/^[0-7]+$/.test(value)) throw new Error("Invalid octal number.");
			decimalValue = parseInt(value, 8);
			break;
		case "decimal":
			// Validate decimal and convert
			if (!/^\d*\.?\d*$/.test(value)) throw new Error("Invalid decimal number.");
			decimalValue = value === "." ? 0 : parseFloat(value);
			break;
		default:
			clearFields();
			return; // Exit the function early if base is unknown
		}
	} catch(e) {
		// If an error occurs, display it and clear fields
		displayErrorMessage(e.message, base + '-error');
		clearFields();
		return;
	}

	// Update other fields based on decimal value
	updateFields(decimalValue, base);
}

function updateFields(decimalValue, base) {
	// Only update fields that did not trigger the conversion to prevent feedback loop
	if (base !== "binary") document.getElementById("binaryInput").value = (decimalValue >>> 0).toString(2); // For integers only
	if (base !== "hex") document.getElementById("hexInput").value = Math.floor(decimalValue).toString(16); // For integers only
	if (base !== "octal") document.getElementById("octalInput").value = Math.floor(decimalValue).toString(8); // For integers only
	if (base !== "decimal") document.getElementById("decimalInput").value = decimalValue; // This can be a float or integer
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

function displayErrorMessage(message, elementId) {
	var errorSpan = document.getElementById(elementId);
	if (errorSpan) {
		errorSpan.textContent = message;
	}
}

function clearErrorMessages() {
	// Clear all error messages
	var errorElements = document.querySelectorAll('.error-message');
	errorElements.forEach(function(element) {
		element.textContent = ''; // Clear the error message
	});
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
function setInputFilter(textbox, inputFilter) { ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop"].forEach(function(event) {
		textbox.addEventListener(event,
		function() {
			if (inputFilter(this.value)) {
				this.oldValue = this.value;
				this.oldSelectionStart = this.selectionStart;
				this.oldSelectionEnd = this.selectionEnd;
			} else if (this.hasOwnProperty("oldValue")) {
				this.value = this.oldValue;
				this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
			} else {
				this.value = "";
			}
		});
	});
}

// Apply filters to ensure correct input format
setInputFilter(document.getElementById("binaryInput"),
function(value) {
	return /^[01]*$/.test(value); // Only binary numbers
});
setInputFilter(document.getElementById("hexInput"),
function(value) {
	return /^[0-9a-fA-F]*$/.test(value); // Only hex numbers
});
setInputFilter(document.getElementById("octalInput"),
function(value) {
	return /^[0-7]*$/.test(value); // Only octal numbers
});

function convertTemperature(scale) {
	var celsiusInput = document.getElementById('celsiusInput');
	var fahrenheitInput = document.getElementById('fahrenheitInput');

	if (scale === 'C') {
		// Convert Celsius to Fahrenheit
		var celsius = parseFloat(celsiusInput.value);
		var fahrenheit = (celsius * 9 / 5) + 32;
		fahrenheitInput.value = fahrenheit.toFixed(2);
	} else {
		// Convert Fahrenheit to Celsius
		var fahrenheit = parseFloat(fahrenheitInput.value);
		var celsius = (fahrenheit - 32) * 5 / 9;
		celsiusInput.value = celsius.toFixed(2);
	}
}

function convertWeight(unit) {
	var kilograms = document.getElementById('kilograms').value;
	var pounds = document.getElementById('pounds').value;
	var grams = document.getElementById('grams').value;
	var ounces = document.getElementById('ounces').value;

	if (unit === 'kg' && kilograms !== '') {
		document.getElementById('pounds').value = (kilograms * 2.20462).toFixed(2);
		document.getElementById('grams').value = (kilograms * 1000).toFixed(0); // Assuming you want to round grams to the nearest whole number
		document.getElementById('ounces').value = (kilograms * 35.274).toFixed(2);
	} else if (unit === 'lbs' && pounds !== '') {
		document.getElementById('kilograms').value = (pounds / 2.20462).toFixed(2);
		document.getElementById('grams').value = (pounds / 0.00220462).toFixed(0); // Convert pounds to grams
		document.getElementById('ounces').value = (pounds * 16).toFixed(2);
	} else if (unit === 'g' && grams !== '') {
		document.getElementById('kilograms').value = (grams / 1000).toFixed(3); // More precision for small weights
		document.getElementById('pounds').value = (grams * 0.00220462).toFixed(3);
		document.getElementById('ounces').value = (grams * 0.035274).toFixed(2);
	} else if (unit === 'oz' && ounces !== '') {
		document.getElementById('kilograms').value = (ounces / 35.274).toFixed(3);
		document.getElementById('pounds').value = (ounces / 16).toFixed(3);
		document.getElementById('grams').value = (ounces / 0.035274).toFixed(0);
	}
}

function convertLength(unit) {
	var meters = document.getElementById('meters').value;
	var feet = document.getElementById('feet').value;
	var centimeters = document.getElementById('centimeters').value;
	var inches = document.getElementById('inches').value;
	var kilometers = document.getElementById('kilometers').value;
	var miles = document.getElementById('miles').value;

	if (unit === 'm' && meters !== '') {
		document.getElementById('feet').value = (meters * 3.28084).toFixed(2);
		document.getElementById('centimeters').value = (meters * 100).toFixed(0);
		document.getElementById('inches').value = (meters * 39.3701).toFixed(2);
		document.getElementById('kilometers').value = (meters / 1000).toFixed(3);
		document.getElementById('miles').value = (meters * 0.000621371).toFixed(3);
	} else if (unit === 'ft' && feet !== '') {
		document.getElementById('meters').value = (feet / 3.28084).toFixed(2);
		document.getElementById('centimeters').value = (feet * 30.48).toFixed(0);
		document.getElementById('inches').value = (feet * 12).toFixed(0);
		document.getElementById('kilometers').value = (feet / 3280.84).toFixed(3);
		document.getElementById('miles').value = (feet * 0.000189394).toFixed(3);
	} else if (unit === 'cm' && centimeters !== '') {
		document.getElementById('meters').value = (centimeters / 100).toFixed(2);
		document.getElementById('feet').value = (centimeters * 0.0328084).toFixed(2);
		document.getElementById('inches').value = (centimeters * 0.393701).toFixed(2);
		document.getElementById('kilometers').value = (centimeters / 100000).toFixed(5);
		document.getElementById('miles').value = (centimeters * 0.00000621371).toFixed(5);
	} else if (unit === 'in' && inches !== '') {
		document.getElementById('meters').value = (inches * 0.0254).toFixed(2);
		document.getElementById('feet').value = (inches * 0.0833333).toFixed(2);
		document.getElementById('centimeters').value = (inches * 2.54).toFixed(0);
		document.getElementById('kilometers').value = (inches * 0.0000254).toFixed(5);
		document.getElementById('miles').value = (inches * 0.0000157828).toFixed(5);
	} else if (unit === 'km' && kilometers !== '') {
		document.getElementById('meters').value = (kilometers * 1000).toFixed(0);
		document.getElementById('feet').value = (kilometers * 3280.84).toFixed(0);
		document.getElementById('centimeters').value = (kilometers * 100000).toFixed(0);
		document.getElementById('inches').value = (kilometers * 39370.1).toFixed(0);
		document.getElementById('miles').value = (kilometers * 0.621371).toFixed(3);
	} else if (unit === 'mi' && miles !== '') {
		document.getElementById('meters').value = (miles / 0.000621371).toFixed(0);
		document.getElementById('feet').value = (miles * 5280).toFixed(0);
		document.getElementById('centimeters').value = (miles * 160934).toFixed(0);
		document.getElementById('inches').value = (miles * 63360).toFixed(0);
		document.getElementById('kilometers').value = (miles * 1.60934).toFixed(3);
	}
}

// Update the oninput event for each length converter input
document.getElementById('meters').oninput = function() {
	convertLength('m');
};
document.getElementById('feet').oninput = function() {
	convertLength('ft');
};
document.getElementById('centimeters').oninput = function() {
	convertLength('cm');
};
document.getElementById('inches').oninput = function() {
	convertLength('in');
};
document.getElementById('kilometers').oninput = function() {
	convertLength('km');
};
document.getElementById('miles').oninput = function() {
	convertLength('mi');
};

function convertVolume(unit) {
	var liters = parseFloat(document.getElementById('liters').value);
	var milliliters = parseFloat(document.getElementById('milliliters').value);
	var cups = parseFloat(document.getElementById('cups').value);
	var pints = parseFloat(document.getElementById('pints').value);
	var quarts = parseFloat(document.getElementById('quarts').value);
	var gallons = parseFloat(document.getElementById('gallons').value);

	// Define the conversion constants
	const litersPerCup = 0.236588;
	const litersPerPint = 0.473176;
	const litersPerQuart = 0.946353;
	const litersPerGallon = 3.78541;

	// Perform conversions based on the input unit
	if (unit === 'L' && !isNaN(liters)) {
		milliliters = liters * 1000;
		cups = liters / litersPerCup;
		pints = liters / litersPerPint;
		quarts = liters / litersPerQuart;
		gallons = liters / litersPerGallon;
	} else if (unit === 'mL' && !isNaN(milliliters)) {
		liters = milliliters / 1000;
		cups = liters / litersPerCup;
		pints = liters / litersPerPint;
		quarts = liters / litersPerQuart;
		gallons = liters / litersPerGallon;
	} else if (unit === 'cups' && !isNaN(cups)) {
		liters = cups * litersPerCup;
		milliliters = liters * 1000;
		pints = liters / litersPerPint;
		quarts = liters / litersPerQuart;
		gallons = liters / litersPerGallon;
	} else if (unit === 'pints' && !isNaN(pints)) {
		liters = pints * litersPerPint;
		milliliters = liters * 1000;
		cups = liters / litersPerCup;
		quarts = liters / litersPerQuart;
		gallons = liters / litersPerGallon;
	} else if (unit === 'quarts' && !isNaN(quarts)) {
		liters = quarts * litersPerQuart;
		milliliters = liters * 1000;
		cups = liters / litersPerCup;
		pints = liters / litersPerPint;
		gallons = liters / litersPerGallon;
	} else if (unit === 'gallons' && !isNaN(gallons)) {
		liters = gallons * litersPerGallon;
		milliliters = liters * 1000;
		cups = liters / litersPerCup;
		pints = liters / litersPerPint;
		quarts = liters / litersPerQuart;
	}

	// Update the fields with values rounded to two decimal places for liquids
	document.getElementById('liters').value = liters.toFixed(2);
	document.getElementById('milliliters').value = milliliters.toFixed(0); // Milliliters usually don't have decimals
	document.getElementById('cups').value = cups.toFixed(2);
	document.getElementById('pints').value = pints.toFixed(2);
	document.getElementById('quarts').value = quarts.toFixed(2);
	document.getElementById('gallons').value = gallons.toFixed(2);
}

// Set the input event listeners for each volume input field
document.getElementById('liters').oninput = function() {
	convertVolume('L');
};
document.getElementById('milliliters').oninput = function() {
	convertVolume('mL');
};
document.getElementById('cups').oninput = function() {
	convertVolume('cups');
};
document.getElementById('pints').oninput = function() {
	convertVolume('pints');
};
document.getElementById('quarts').oninput = function() {
	convertVolume('quarts');
};
document.getElementById('gallons').oninput = function() {
	convertVolume('gallons');
};

function convertArea(unit) {
	let squareMeters = parseFloat(document.getElementById('squareMeters').value) || 0;
	let squareKilometers = parseFloat(document.getElementById('squareKilometers').value) || 0;
	let squareFeet = parseFloat(document.getElementById('squareFeet').value) || 0;
	let squareYards = parseFloat(document.getElementById('squareYards').value) || 0;
	let acres = parseFloat(document.getElementById('acres').value) || 0;
	let hectares = parseFloat(document.getElementById('hectares').value) || 0;

	// Conversion constants
	const sqMetersInOneSqKilometer = 1e6;
	const sqFeetInOneSqMeter = 10.7639;
	const sqYardsInOneSqMeter = 1.19599;
	const acresInOneSqMeter = 0.000247105;
	const hectaresInOneSqMeter = 0.0001;

	// Conversion logic
	switch (unit) {
	case 'm2':
		squareKilometers = squareMeters / sqMetersInOneSqKilometer;
		squareFeet = squareMeters * sqFeetInOneSqMeter;
		squareYards = squareMeters * sqYardsInOneSqMeter;
		acres = squareMeters * acresInOneSqMeter;
		hectares = squareMeters * hectaresInOneSqMeter;
		break;
	case 'km2':
		squareMeters = squareKilometers * sqMetersInOneSqKilometer;
		// Convert other units using square meters as the base for simplicity
		convertArea('m2');
		break;
	case 'ft2':
		squareMeters = squareFeet / sqFeetInOneSqMeter;
		convertArea('m2');
		break;
	case 'yd2':
		squareMeters = squareYards / sqYardsInOneSqMeter;
		convertArea('m2');
		break;
	case 'acres':
		squareMeters = acres / acresInOneSqMeter;
		convertArea('m2');
		break;
	case 'hectares':
		squareMeters = hectares / hectaresInOneSqMeter;
		convertArea('m2');
		break;
	}

	// Update input fields
	document.getElementById('squareMeters').value = squareMeters.toFixed(2);
	document.getElementById('squareKilometers').value = squareKilometers.toFixed(5);
	document.getElementById('squareFeet').value = squareFeet.toFixed(2);
	document.getElementById('squareYards').value = squareYards.toFixed(2);
	document.getElementById('acres').value = acres.toFixed(4);
	document.getElementById('hectares').value = hectares.toFixed(4);
}

function convertSpeed(unit) {
	let kmph = parseFloat(document.getElementById('kmph').value) || 0;
	let mph = parseFloat(document.getElementById('mph').value) || 0;
	let mps = parseFloat(document.getElementById('mps').value) || 0;
	let fps = parseFloat(document.getElementById('fps').value) || 0;

	// Conversion constants
	const metersPerSecInOneKmph = 1 / 3.6;
	const feetPerSecInOneMps = 3.28084;
	const kmphInOneMph = 1.60934;
	const mpsInOneFps = 1 / feetPerSecInOneMps;

	// Conversion logic
	switch (unit) {
	case 'kmph':
		mph = kmph / kmphInOneMph;
		mps = kmph * metersPerSecInOneKmph;
		fps = mps * feetPerSecInOneMps;
		break;
	case 'mph':
		kmph = mph * kmphInOneMph;
		mps = kmph * metersPerSecInOneKmph;
		fps = mps * feetPerSecInOneMps;
		break;
	case 'mps':
		fps = mps * feetPerSecInOneMps;
		kmph = mps / metersPerSecInOneKmph;
		mph = kmph / kmphInOneMph;
		break;
	case 'fps':
		mps = fps * mpsInOneFps;
		kmph = mps / metersPerSecInOneKmph;
		mph = kmph / kmphInOneMph;
		break;
	}

	// Update input fields
	document.getElementById('kmph').value = kmph.toFixed(2);
	document.getElementById('mph').value = mph.toFixed(2);
	document.getElementById('mps').value = mps.toFixed(2);
	document.getElementById('fps').value = fps.toFixed(2);
}

function convertAngle(unit) {
	// Get the input values
	let degrees = parseFloat(document.getElementById('degrees').value) || 0;
	let radians = parseFloat(document.getElementById('radians').value) || 0;
	let gradians = parseFloat(document.getElementById('gradians').value) || 0;

	// Conversion formulas
	switch (unit) {
	case 'degrees':
		radians = degrees * (Math.PI / 180);
		gradians = degrees * (200 / 180);
		break;
	case 'radians':
		degrees = radians * (180 / Math.PI);
		gradians = radians * (200 / Math.PI);
		break;
	case 'gradians':
		degrees = gradians * (180 / 200);
		radians = gradians * (Math.PI / 200);
		break;
	}

	// Update the input fields
	document.getElementById('degrees').value = degrees.toFixed(3);
	document.getElementById('radians').value = radians.toFixed(3);
	document.getElementById('gradians').value = gradians.toFixed(3);
}

//Copy to clipboard function
function copyToClipboard(elementId) {
	var copyText = document.getElementById(elementId);
	copyText.select();
	document.execCommand("copy");
	alert("Copied: " + copyText.value); // Alert or indicate copy success
}