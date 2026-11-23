var form = document.getElementById("request-form");

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

function showRequests() {
  var html = "";
  for (var i = 0; i < requests.length; i++) {
    html += "<li>" +
      "<strong>Offering:</strong> " + requests[i].offering + "<br>" +
      "<strong>Member:</strong> " + requests[i].name + "<br>" +
      "<strong>Preferred date:</strong> " + requests[i].date +
      "</li>";
  }
  document.getElementById("requests-list").innerHTML = html;
  document.getElementById("new-requests").style.display = "block";
}

function handleSubmit() {
  var offeringSelect = document.getElementById("select-offering");
  var dateSelect = document.getElementById("preferred-date");
  var fullName = document.getElementById("full-name").value;
  var problems = "";

  if (offeringSelect.value === "") {
    problems += "- Please select an offering.\n";
  }

  if (countWords(fullName) === 0) {
    problems += "- Full Name is empty.\n";
  } else {
    if (countWords(fullName) < 2) {
      problems += "- Please enter your full name (first and last name).\n";
    }
    if (hasBadCharacters(fullName)) {
      problems += "- Full Name cannot contain numbers or characters such as ? ! @\n";
    }
  }

  if (dateSelect.value === "") {
    problems += "- Please choose a preferred date.\n";
  } else {
    var chosen = new Date(dateSelect.value);
    var today = new Date();
    if (chosen <= today) {
      problems += "- The preferred date must be a future date.\n";
    }
  }

  if (problems !== "") {
    alert("Please fix the following:\n" + problems);
    return false;
  }

  var request = {
    offering: offeringSelect.options[offeringSelect.selectedIndex].text,
    name: fullName,
    date: dateSelect.options[dateSelect.selectedIndex].text
  };

  var stay = confirm("Your request was sent successfully!\n\nPress OK to stay on this page, or Cancel to return to the Member Dashboard.");

  if (stay) {
    requests.push(request);
    showRequests();
    document.getElementById("select-offering").value = "";
    document.getElementById("full-name").value = "";
    document.getElementById("preferred-date").value = "";
  } else {
    window.location.href = "member-dashboard.html";
  }

  return false;
}

form.onsubmit = handleSubmit;
