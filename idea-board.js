var form = document.getElementById("idea-form");
var ideasRow = document.getElementById("ideas-row");

// Array of objects: each idea has title, description, name
var ideas = [];

function loadIdeas() {
  var saved = localStorage.getItem("ideas");
  if (saved !== null) {
    ideas = JSON.parse(saved);
  }
}

function saveIdeas() {
  localStorage.setItem("ideas", JSON.stringify(ideas));
}

function startsWithNumber(text) {
  return text.charAt(0) >= "0" && text.charAt(0) <= "9";
}

function ideaCardHTML(idea) {
  return '<article class="offer-card idea-card">' +
    '<div class="card-body">' +
    '<h3>' + idea.title + '</h3>' +
    '<p>' + idea.description + '</p>' +
    '<p class="review-author">&mdash; Submitted by ' + idea.name + '</p>' +
    '</div></article>';
}

// Show the saved ideas above the default ideas (newest first)
function showSavedIdeas() {
  var html = "";
  for (var i = ideas.length - 1; i >= 0; i--) {
    html += ideaCardHTML(ideas[i]);
  }
  ideasRow.innerHTML = html + ideasRow.innerHTML;
}

function validateIdea() {
  var name = document.getElementById("member-name").value;
  var title = document.getElementById("idea-title").value;
  var description = document.getElementById("idea-description").value;

  var problems = "";

  if (name === "") {
    problems += "- Your Name is empty.\n";
  } else if (startsWithNumber(name)) {
    problems += "- Your Name cannot start with a number.\n";
  }

  if (title === "") {
    problems += "- Idea Title is empty.\n";
  } else if (startsWithNumber(title)) {
    problems += "- Idea Title cannot start with a number.\n";
  }

  if (description === "") {
    problems += "- Description is empty.\n";
  } else if (description.length < 10) {
    problems += "- Description is too short (at least 10 characters).\n";
  }

  if (problems !== "") {
    alert("Please fix the following:\n" + problems);
    return false;
  }

  var idea = {
    title: title,
    description: description,
    name: name
  };

  ideas.push(idea);
  saveIdeas();

  ideasRow.innerHTML = ideaCardHTML(idea) + ideasRow.innerHTML;

  alert("Thank you, " + name + "! Your idea \"" + title + "\" has been posted.");

  document.getElementById("member-name").value = "";
  document.getElementById("idea-title").value = "";
  document.getElementById("idea-description").value = "";

  return false;
}

loadIdeas();
showSavedIdeas();
form.onsubmit = validateIdea;