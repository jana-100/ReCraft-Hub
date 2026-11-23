/* Phase 3 - About Us: Join Our Team form validation + localStorage saving */
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const STORAGE_KEY = "recraftHub.phase3.joinTeamApplications.v1";
  const form = document.querySelector("#join-team .join-team-form");
  if (!form) return;

  const nameInput = document.getElementById("team-name");
  const photoInput = document.getElementById("team-photo");
  const dobInput = document.getElementById("team-dob");
  const emailInput = document.getElementById("team-email");
  const expertiseInput = document.getElementById("team-expertise");
  const skillsInput = document.getElementById("team-skills");
  const educationInput = document.getElementById("team-education");

  dobInput.max = "2008-12-31";
  photoInput.accept = "image/*";
  form.noValidate = true;

  // Store a small copy of the photo, not a temporary browser blob URL.
  function photoToDataURL(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onerror = function () { reject(new Error("Unable to read the photo.")); };
      reader.onload = function () {
        const image = new Image();
        image.onerror = function () { reject(new Error("Invalid photo.")); };
        image.onload = function () {
          try {
            const maxSide = 360;
            const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            const context = canvas.getContext("2d");
            context.fillStyle = "#FFFFFF";
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg", 0.78));
          } catch (error) {
            reject(error);
          }
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    const submitButton = form.querySelector('button[type="submit"]');
    if (submitButton && submitButton.disabled) return;

    const fields = [
      [nameInput, "Full Name"], [photoInput, "Photo"],
      [dobInput, "Date of Birth"], [emailInput, "Email"],
      [expertiseInput, "Area of Expertise"], [skillsInput, "Skills"],
      [educationInput, "Education"]
    ];
    for (const [field, label] of fields) {
      const empty = field.type === "file" ? field.files.length === 0 : field.value.trim() === "";
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
    if (Number.isNaN(birthDate.getTime()) || dobInput.value > "2008-12-31") {
      alert("The year of birth must be 2008 or earlier.");
      dobInput.focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      alert("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (submitButton) submitButton.disabled = true;
    try {
      const savedPhoto = await photoToDataURL(photo);
      let applications = [];
      const savedApplications = localStorage.getItem(STORAGE_KEY);
      if (savedApplications !== null) {
        applications = JSON.parse(savedApplications);
        if (!Array.isArray(applications)) throw new Error("Invalid saved application data.");
      }

      applications.push({
        id: "application-" + Date.now().toString(36),
        submittedAt: new Date().toISOString(),
        name: name,
        photo: savedPhoto,
        dateOfBirth: dobInput.value,
        email: emailInput.value.trim(),
        expertise: expertiseInput.value.trim(),
        skills: skillsInput.value.trim(),
        education: educationInput.value.trim()
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
      alert("Thank you, " + name + "! Your Join Our Team application has been submitted successfully.");
      form.reset();
    } catch (error) {
      console.error("Application could not be saved:", error);
      alert("Your application could not be saved. Please enable local storage or try a smaller JPG/PNG photo.");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});
