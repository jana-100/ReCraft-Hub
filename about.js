/* Phase 3 — About Us: Join Our Team form validation */
document.addEventListener("DOMContentLoaded", function () {
  const form = document.querySelector("#join-team .join-team-form");
  if (!form) return;

  const nameInput = document.getElementById("team-name");
  const photoInput = document.getElementById("team-photo");
  const dobInput = document.getElementById("team-dob");
  const emailInput = document.getElementById("team-email");
  const expertiseInput = document.getElementById("team-expertise");
  const skillsInput = document.getElementById("team-skills");
  const educationInput = document.getElementById("team-education");

  // The project specifies birth years 2008 or earlier.
  dobInput.max = "2008-12-31";
  photoInput.accept = "image/*";
  // Our JavaScript checks every field and displays clear messages.
  form.noValidate = true;

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const fields = [
      [nameInput, "Full Name"],
      [photoInput, "Photo"],
      [dobInput, "Date of Birth"],
      [emailInput, "Email"],
      [expertiseInput, "Area of Expertise"],
      [skillsInput, "Skills"],
      [educationInput, "Education"]
    ];

    for (const [field, label] of fields) {
      const empty = field.type === "file"
        ? field.files.length === 0
        : field.value.trim() === "";
      if (empty) {
        alert("Please fill in the " + label + " field.");
        field.focus();
        return;
      }
    }

    const name = nameInput.value.trim();
    if (/^\p{N}/u.test(name)) {
      alert("Full Name cannot start with a number.");
      nameInput.focus();
      return;
    }

    const photo = photoInput.files[0];
    if (!photo || !photo.type.startsWith("image/")) {
      alert("Please upload an image file for Photo.");
      photoInput.focus();
      return;
    }

    const birthDate = new Date(dobInput.value + "T00:00:00");
    if (Number.isNaN(birthDate.getTime()) || birthDate.getFullYear() > 2008) {
      alert("The year of birth must be 2008 or earlier.");
      dobInput.focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      alert("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    alert("Thank you, " + name + "! Your Join Our Team application has been submitted successfully.");
    form.reset();
  });
});
