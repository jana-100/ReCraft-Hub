/* Phase 3 — Manage Activity Leaders: manage an in-page array of objects */
document.addEventListener("DOMContentLoaded", function () {
  const list = document.querySelector("#manage-leaders .manage-leaders-list");
  const deleteForm = document.querySelector("#manage-leaders .delete-leaders-form");
  const addForm = document.querySelector("#manage-leaders .add-leader-form");
  if (!list || !deleteForm || !addForm) return;

  // Start with the six activity leaders supplied by the Phase 2 HTML.
  // Array of objects required by Phase 3; changes last while on this page.
  let leaders = Array.from(list.querySelectorAll(".manage-leader-card"), function (card, index) {
    return {
      id: card.querySelector('input[type="checkbox"]').value || "leader-" + index,
      name: card.querySelector(".manage-leader-name").textContent.trim(),
      photo: card.querySelector("img").getAttribute("src")
    };
  });
  let nextId = 1;

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

    leaders = leaders.filter(function (leader) {
      if (selected.includes(leader.id)) {
        // Release images that were temporarily selected from the device.
        if (leader.photo.startsWith("blob:")) URL.revokeObjectURL(leader.photo);
        return false;
      }
      return true;
    });
    renderLeaders();
    alert("Selected activity leader(s) deleted successfully.");
  });

  // Prevent the browser's built-in popup from suppressing our Phase 3 alerts.
  addForm.noValidate = true;
  const nameInput = document.getElementById("leader-name");
  const photoInput = document.getElementById("leader-photo");
  const dobInput = document.getElementById("leader-dob");
  const emailInput = document.getElementById("leader-email");
  const expertiseInput = document.getElementById("leader-expertise");
  const skillsInput = document.getElementById("leader-skills");
  const educationInput = document.getElementById("leader-education");

  addForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const fields = [
      [nameInput, "Full Name"], [photoInput, "Photo"],
      [dobInput, "Date of Birth"], [emailInput, "Email"],
      [expertiseInput, "Area of Expertise"], [skillsInput, "Skills"],
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

    const name = nameInput.value.trim().replace(/\s+/g, " ");
    const words = name.split(" ");
    if (words.length < 2 || !words.every(function (part) { return /^[\p{L}'-]+$/u.test(part); })) {
      alert("Please enter a full name using letters, without numbers or special characters.");
      nameInput.focus();
      return;
    }

    const photo = photoInput.files[0];
    if (!photo.type.startsWith("image/")) {
      alert("Please select a valid image for Photo.");
      photoInput.focus();
      return;
    }

    const dob = new Date(dobInput.value + "T00:00:00");
    if (Number.isNaN(dob.getTime()) || dob.getTime() > Date.now()) {
      alert("Please enter a valid date of birth that is not in the future.");
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

    const newLeader = {
      id: "new-" + nextId++,
      name: name,
      photo: URL.createObjectURL(photo),
      dateOfBirth: dobInput.value,
      email: emailInput.value.trim(),
      expertise: expertiseInput.value.trim(),
      skills: skillsInput.value.trim(),
      education: educationInput.value.trim()
    };

    leaders.push(newLeader);
    renderLeaders();
    alert("Activity leader " + name + " added successfully.");
    addForm.reset();
  });
});
