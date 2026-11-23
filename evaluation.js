var form = document.getElementById("evaluation-form");

function getRating() {
  for (var i = 5; i >= 1; i--) {
    if (document.getElementById("eval-rate-" + i).checked) {
      return i;
    }
  }
  return 0;
}

function markError(element) {
  element.style.borderColor = "#A33232";
  element.style.backgroundColor = "#FCE8E8";
}

function clearError(element) {
  element.style.borderColor = "#C9D6C9";
  element.style.backgroundColor = "#FFFFFF";
}

function handleSubmit() {
  var offeringSelect = document.getElementById("completed-offering");
  var ratingBox = document.getElementById("rating-box");
  var feedbackBox = document.getElementById("written-feedback");

  clearError(offeringSelect);
  clearError(feedbackBox);
  ratingBox.style.backgroundColor = "transparent";

  var rating = getRating();
  var problems = "";

  if (offeringSelect.value === "") {
    problems += "- Please select an offering.\n";
    markError(offeringSelect);
  }

  if (rating === 0) {
    problems += "- Please add a rating.\n";
    ratingBox.style.backgroundColor = "#FCE8E8";
  }

  if (feedbackBox.value === "") {
    problems += "- Please write your feedback.\n";
    markError(feedbackBox);
  }

  if (problems !== "") {
    alert("Please fix the following:\n" + problems);
    return false;
  }

  if (rating >= 4) {
    alert("Thank you for your great rating! We are happy you enjoyed the offering.");
  } else {
    alert("We are sorry the offering did not meet your expectations. We will work to improve it.");
  }

  // Nothing is stored, go back to the Member Dashboard
  window.location.href = "member-dashboard.html";
  return false;
}

form.onsubmit = handleSubmit;