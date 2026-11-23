/* Phase 3 - Manage Activity Leaders
   Save the activity-leader array in localStorage so add/delete changes
   survive a page refresh in the same browser. Other project pages are unchanged.
*/
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  const STORAGE_KEY = "recraftHub.phase3.activityLeaders.v1";
  const list = document.querySelector("#manage-leaders .manage-leaders-list");
  const deleteForm = document.querySelector("#manage-leaders .delete-leaders-form");
  const addForm = document.querySelector("#manage-leaders .add-leader-form");
  if (!list || !deleteForm || !addForm) return;

  // The six original leaders from Phase 2 are the initial default data.
  const defaultLeaders = Array.from(list.querySelectorAll(".manage-leader-card"), function (card, index) {
    return {
      id: card.querySelector('input[type="checkbox"]').value || "leader-" + index,
      name: card.querySelector(".manage-leader-name").textContent.trim(),
      photo: card.querySelector("img").getAttribute("src")
    };
  });

  // Read a saved array, including an empty array if all leaders were deleted.
  function loadLeaders() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === null) return defaultLeaders;

      const parsed = JSON.parse(saved);
      if (!Array.isArray(parsed)) return defaultLeaders;

      // Only load records with the properties needed to render them.
      if (!parsed.every(function (leader) {
        return leader && typeof leader.id === "string" &&
          typeof leader.name === "string" && typeof leader.photo === "string";
      })) {
        return defaultLeaders;
      }
      return parsed;
    } catch (error) {
      console.warn("Saved activity leaders could not be read:", error);
      return defaultLeaders;
    }
  }

  let leaders = loadLeaders();
  let nextId = 1;

  function saveLeaders(updatedLeaders) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedLeaders));
      return true;
    } catch (error) {
      console.error("Activity leaders could not be saved:", error);
      alert("Unable to save changes in this browser. Please check that local storage is enabled and try a smaller photo.");
      return false;
    }
  }

  function renderLeaders() {
    const fragment = document.createDocumentFragment();

    leaders.forEach(function (leader) {
      const card = document.createElement("label");
      card.className = "manage-leader-card";

      const img = document.createElement("img");
      img.src = leader.photo;
      img.alt = leader.name;
      img.width = 70;
      img.height = 70;

      const name = document.createElement("span");
      name.className = "manage-leader-name";
      name.textContent = leader.name;

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "delete_leaders";
      checkbox.value = leader.id;
      checkbox.setAttribute("aria-label", "Select " + leader.name + " for deletion");

      card.append(img, name, checkbox);
      fragment.appendChild(card);
    });

    list.replaceChildren(fragment);
  }

  // Convert selected images into small, permanent data URLs.
  // Blob URLs disappear after a refresh and cannot be stored reliably.
  function photoToDataURL(file) {
    return new Promise(function (resolve, reject) {
      const reader = new FileReader();
      reader.onerror = function () { reject(new Error("Unable to read the selected photo.")); };
      reader.onload = function () {
        const image = new Image();
        image.onerror = function () { reject(new Error("The selected photo cannot be opened.")); };
        image.onload = function () {
          try {
            const maxSide = 360;
            const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
            const canvas = document.createElement("canvas");
            canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
            canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
            const context = canvas.getContext("2d");
            // White background preserves transparent PNGs in the JPEG preview.
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

  renderLeaders();

  deleteForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const selected = Array.from(list.querySelectorAll('input[type="checkbox"]:checked'))
      .map(function (checkbox) { return checkbox.value; });

    if (selected.length === 0) {
      alert("Please select at least one activity leader to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete " + selected.length + " selected activity leader(s)?")) {
      return;
    }

    const updatedLeaders = leaders.filter(function (leader) {
      return !selected.includes(leader.id);
    });
    if (!saveLeaders(updatedLeaders)) return;

    leaders = updatedLeaders;
    renderLeaders();
    alert("Selected activity leader(s) deleted successfully.");
  });

  // Use our existing Phase 3 alert-based validation.
  addForm.noValidate = true;
  const nameInput = document.getElementById("leader-name");
  const photoInput = document.getElementById("leader-photo");
  const dobInput = document.getElementById("leader-dob");
  const emailInput = document.getElementById("leader-email");
  const expertiseInput = document.getElementById("leader-expertise");
  const skillsInput = document.getElementById("leader-skills");
  const educationInput = document.getElementById("leader-education");

  // Apply the same 2008-or-earlier rule as the About Us form.
  dobInput.max = "2008-12-31";

  addForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    const submitButton = addForm.querySelector('button[type="submit"]');
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

    const name = nameInput.value.trim().replace(/\s+/g, " ");
    const words = name.split(" ");
    if (words.length < 2 || !words.every(function (part) { return /^[\p{L}'-]+$/u.test(part); })) {
      alert("Please enter a full name using letters, without numbers or special characters.");
      nameInput.focus();
      return;
    }

    const photo = photoInput.files[0];
    if (!photo || !photo.type.startsWith("image/")) {
      alert("Please select a valid image for Photo.");
      photoInput.focus();
      return;
    }

    const dob = new Date(dobInput.value + "T00:00:00");
    if (Number.isNaN(dob.getTime()) || dob.getTime() > Date.now() || dobInput.value > "2008-12-31") {
      alert("The year of birth must be 2008 or earlier.");
      dobInput.focus();
      return;
    }

    if (!emailInput.checkValidity()) {
      alert("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    if (!/\p{L}/u.test(expertiseInput.value) || !/\p{L}/u.test(skillsInput.value) ||
        !/\p{L}/u.test(educationInput.value)) {
      alert("Please enter descriptive text in Expertise, Skills, and Education.");
      return;
    }

    if (submitButton) submitButton.disabled = true;
    try {
      const savedPhoto = await photoToDataURL(photo);
      const newLeader = {
        id: "new-" + Date.now().toString(36) + "-" + nextId++,
        name: name,
        photo: savedPhoto,
        dateOfBirth: dobInput.value,
        email: emailInput.value.trim(),
        expertise: expertiseInput.value.trim(),
        skills: skillsInput.value.trim(),
        education: educationInput.value.trim()
      };

      const updatedLeaders = leaders.concat(newLeader);
      if (!saveLeaders(updatedLeaders)) return;
      leaders = updatedLeaders;
      renderLeaders();
      addForm.reset();
      alert("Activity leader " + name + " added successfully.");
    } catch (error) {
      console.error("Photo processing failed:", error);
      alert("The selected photo could not be saved. Please choose a JPG or PNG image and try again.");
    } finally {
      if (submitButton) submitButton.disabled = false;
    }
  });
});
