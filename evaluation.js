var form = document.getElementById("evaluation-form");
var offeringSelect = document.getElementById("completed-offering");
var ratingBox = document.getElementById("rating-box");
var feedbackBox = document.getElementById("written-feedback");

function getRating() {
  var stars = document.getElementsByName("rating");
  for (var i = 0; i < stars.length; i++) {
    if (stars[i].checked) {
      return parseInt(stars[i].value);
    }
  }
  return 0;
}

function clearErrors() {
  offeringSelect.classList.remove("input-error");
  ratingBox.classList.remove("input-error");
  feedbackBox.classList.remove("input-error");
}

function handleSubmit(event) {
  event.preventDefault();
  clearErrors();

  var offering = offeringSelect.value;
  var rating = getRating();
  var feedback = feedbackBox.value.trim();
  var problems = "";

  if (offering === "") {
    problems += "- Please select an offering.\n";
    offeringSelect.classList.add("input-error");
  }

  if (rating === 0) {
    problems += "- Please add a rating.\n";
    ratingBox.classList.add("input-error");
  }

  if (feedback === "") {
    problems += "- Please write your feedback.\n";
    feedbackBox.classList.add("input-error");
  }

  if (problems !== "") {
    alert("Please fix the following:\n" + problems);
    return;
  }

  // Form is valid: good rating = 4 or 5
  if (rating >= 4) {
    alert("Thank you for your great rating! We are happy you enjoyed the offering.");
  } else {
    alert("We are sorry the offering did not meet your expectations. We will work to improve it.");
  }

  // Nothing is stored, go back to the Member Dashboard
  window.location.href = "member-dashboard.html";
}

form.onsubmit = handleSubmit;