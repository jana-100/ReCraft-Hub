var form = document.getElementById("request-form");
var offeringSelect = document.getElementById("select-offering");
var nameInput = document.getElementById("full-name");
var dateSelect = document.getElementById("preferred-date");
var requestsSection = document.getElementById("new-requests");
var requestsList = document.getElementById("requests-list");

// All new requests added while the member stays on this page
var requests = [];

var badCharacters = "0123456789?!@#$%^&*()_+=<>/\\|{}[]~`\";:,.";

function hasBadCharacters(text) {
  for (var i = 0; i < text.length; i++) {
    if (badCharacters.indexOf(text.charAt(i)) !== -1) {
      return true;
    }
  }
  return false;
}

function countWords(text) {
  var words = text.split(" ");
  var count = 0;
  for (var i = 0; i < words.length; i++) {
    if (words[i] !== "") {
      count++;
    }
  }
  return count;
}

function isFutureDate(value) {
  var chosen = new Date(value);
  var today = new Date();
  today.setHours(0, 0, 0, 0);
  return chosen > today;
}

function addLine(li, label, value, withBreak) {
  var strong = document.createElement("strong");
  strong.textContent = label;
  li.appendChild(strong);
  li.appendChild(document.createTextNode(" " + value));
  if (withBreak) {
    li.appendChild(document.createElement("br"));
  }
}

function showRequests() {
  requestsList.innerHTML = "";
  for (var i = 0; i < requests.length; i++) {
    var li = document.createElement("li");
    addLine(li, "Offering:", requests[i].offering, true);
    addLine(li, "Member:", requests[i].name, true);
    addLine(li, "Preferred date:", requests[i].date, false);
    requestsList.appendChild(li);
  }
  requestsSection.style.display = "block";
}

function handleSubmit(event) {
  event.preventDefault();

  var offering = offeringSelect.value;
  var fullName = nameInput.value.trim();
  var date = dateSelect.value;
  var problems = "";

  if (offering === "") {
    problems += "- Please select an offering.\n";
  }

  if (fullName === "") {
    problems += "- Full Name is empty.\n";
  } else {
    if (countWords(fullName) < 2) {
      problems += "- Please enter your full name (first and last name).\n";
    }
    if (hasBadCharacters(fullName)) {
      problems += "- Full Name cannot contain numbers or special characters.\n";
    }
  }

  if (date === "") {
    problems += "- Please choose a preferred date.\n";
  } else if (!isFutureDate(date)) {
    problems += "- The preferred date must be a future date.\n";
  }

  if (problems !== "") {
    alert("Please fix the following:\n" + problems);
    return;
  }

  // Valid form: save the request details before leaving or resetting
  var request = {
    offering: offeringSelect.options[offeringSelect.selectedIndex].text,
    name: fullName,
    date: dateSelect.options[dateSelect.selectedIndex].text
  };

  var stay = confirm("Your request was sent successfully!\n\nPress OK to stay on this page, or Cancel to return to the Member Dashboard.");

  if (stay) {
    requests.push(request);
    showRequests();
    form.reset();
  } else {
    window.location.href = "member-dashboard.html";
  }
}

form.onsubmit = handleSubmit;