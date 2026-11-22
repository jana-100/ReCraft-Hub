


const offeringForm = document.getElementById("offering-form");

offeringForm.addEventListener("submit", function (event) {

    event.preventDefault();

    // Get input values
    const name = document.getElementById("offering-name").value.trim();
    const imageFile = document.getElementById("offering-image").files[0];
    const price = document.getElementById("offering-price").value;
    const category = document.getElementById("offering-category").value;
    const duration = document.getElementById("offering-duration").value;
    const date = document.getElementById("offering-date").value;
    const time = document.getElementById("offering-time").value;
    const description = document.getElementById("offering-description").value.trim();

    // Validate empty fields
    if (!name) {
        alert("Please enter the offering name.");
        return;
    }

    if (!imageFile) {
        alert("Please select an image.");
        return;
    }

    if (!price) {
        alert("Please enter the price.");
        return;
    }

    if (!category) {
        alert("Please select a category.");
        return;
    }

    if (!duration) {
        alert("Please enter the duration.");
        return;
    }

    if (!date) {
        alert("Please select a date.");
        return;
    }

    if (!time) {
        alert("Please select a time.");
        return;
    }

    if (!description) {
        alert("Please enter the description.");
        return;
    }

    // Validate offering name
    if (/^\d/.test(name)) {
        alert("Offering name cannot start with a number.");
        return;
    }

    // Validate image type
    if (!imageFile.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
    }

    // Validate price
    if (isNaN(Number(price)) || Number(price) < 0) {
        alert("Please enter a valid price.");
        return;
    }

    // Validate duration
    if (Number(duration) <= 0 || isNaN(Number(duration))) {
        alert("Please enter a valid duration.");
        return;
    }

    // Read image
    const reader = new FileReader();

    reader.onload = function () {

        // Get previously saved offerings
        let offerings = JSON.parse(
            localStorage.getItem("managerOfferings")
        ) || [];

        // Create new offering object
        const newOffering = {
            name: name,
            image: reader.result,
            price: Number(price),
            category: category,
            duration: duration + " hours",
            when: date + ", " + time,
            description: description
        };

        // Add new offering
        offerings.push(newOffering);

        // Save offerings
        localStorage.setItem(
            "managerOfferings",
            JSON.stringify(offerings)
        );

        alert(name + " has been added successfully!");

        // Clear form
        offeringForm.reset();
    };

    reader.onerror = function () {
        alert("Unable to read the selected image. Please try again.");
    };

    reader.readAsDataURL(imageFile);

});
