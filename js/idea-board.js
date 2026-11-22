var form = document.getElementById("idea-form");
var ideasRow = document.getElementById("ideas-row");

function startsWithNumber(text) {
  return text.charAt(0) >= "0" && text.charAt(0) <= "9";
}

function createIdeaCard(title, description, name, photoFile) {
  var card = document.createElement("article");
  card.className = "offer-card idea-card";

  var img = document.createElement("img");
  img.src = URL.createObjectURL(photoFile);
  img.alt = "Photo for the idea: " + title;
  card.appendChild(img);

  var body = document.createElement("div");
  body.className = "card-body";

  var h3 = document.createElement("h3");
  h3.textContent = title;
  body.appendChild(h3);

  var p = document.createElement("p");
  p.textContent = description;
  body.appendChild(p);

  var author = document.createElement("p");
  author.className = "review-author";
  author.textContent = "\u2014 Submitted by " + name;
  body.appendChild(author);

  card.appendChild(body);
  return card;
}

function validateIdea(event) {
  event.preventDefault();

  var name = document.getElementById("member-name").value.trim();
  var title = document.getElementById("idea-title").value.trim();
  var photo = document.getElementById("idea-photo").files[0];
  var description = document.getElementById("idea-description").value.trim();

  var problems = "";

  if (name === "") {
    problems += "- Your Name is empty.\n";
  } else if (startsWithNumber(name)) {
    problems += "- Your Name cannot start with a number.\n";
  }

  if (title === "") {
    problems += "- Idea Title is empty.\n";
  } else 

  if (startsWithNumber(title)) {
    problems += "- Idea Title cannot start with a number.\n";
  }

  if (photo === undefined) {
    problems += "- Please choose an Inspiration Photo.\n";
  } else 
    
 if (photo.type.indexOf("image/") !== 0) {
    problems += "- The Inspiration Photo must be an image file.\n";
  }

  if (description === "") {
    problems += "- Description is empty.\n";
  } else 
    
 if (description.length < 10) {
      problems += "- Description is too short (at least 10 characters).\n";
    }

  if (problems !== "") {
    alert("Please fix the following:\n" + problems);
    return;
  }

  var card = createIdeaCard(title, description, name, photo);
  ideasRow.insertBefore(card, ideasRow.firstChild);

  alert("Thank you, " + name + "! Your idea \"" + title + "\" has been posted.");
  form.reset();
}

form.onsubmit = validateIdea;
