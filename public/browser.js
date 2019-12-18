function itemTemplate(item) {
  if (item.checked) {
    return ` 
    <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <div class="input-group-text d-flex align-items-center justify-content-between">
    <input class="check-me" id=checkbox data-id=${item._id} type="checkbox" aria-label="Acheté" checked>
    </div>
    <span class="item-text">${item.text}</span>
    <div>
    <button data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Modifier</button>
    <button data-id=${item._id} class="delete-me btn btn-danger btn-sm">Supprimer</button>
    </div>
    </li>`;
  } else {
    return ` 
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <div class="input-group-text d-flex align-items-center justify-content-between">
        <input class="check-me" id=checkbox data-id=${item._id} type="checkbox" aria-label="Acheté">
        </div>
        <span class="item-text">${item.text}</span>
        <div>
        <button data-id=${item._id} class="edit-me btn btn-secondary btn-sm mr-1">Modifier</button>
        <button data-id=${item._id} class="delete-me btn btn-danger btn-sm">Supprimer</button>
        </div>
        </li>`;
  }
}

//Inital Page Render
let ourHTML = items
  .map(function(item) {
    return itemTemplate(item);
  })
  .join("");
document.getElementById("item-list").insertAdjacentHTML("beforeend", ourHTML);

//Create Feature
let createField = document.getElementById("create-field");
document.getElementById("create-form").addEventListener("submit", function(e) {
  e.preventDefault();
  axios
    .post("/create-item", { text: createField.value })
    .then(function(response) {
      document
        .getElementById("item-list")
        .insertAdjacentHTML("beforeend", itemTemplate(response.data));
      createField.value = "";
      createField.focus();
    })
    .catch(function() {
      console.log("Try again later");
    });
});

document.addEventListener("click", function(e) {
  //Delete Feature
  if (e.target.classList.contains("delete-me")) {
    if (confirm("Effacer cet élément?")) {
      axios
        .post("/delete-item", { id: e.target.getAttribute("data-id") })
        .then(function() {
          e.target.parentElement.parentElement.remove();
        })
        .catch(function() {
          console.log("Try again later");
        });
    }
  }

  //Update Feature
  if (e.target.classList.contains("edit-me")) {
    let userInput = prompt(
      "Entrez la nouvelle valeur",
      e.target.parentElement.parentElement.querySelector(".item-text").innerHTML
    );
    if (userInput) {
      axios
        .post("/update-item", {
          text: userInput,
          id: e.target.getAttribute("data-id")
        })
        .then(function() {
          e.target.parentElement.parentElement.querySelector(
            ".item-text"
          ).innerHTML = userInput;
        })
        .catch(function() {
          console.log("Try again later");
        });
    }
  }

  //check Features
  if (e.target.classList.contains("check-me")) {
    let checked = e.target.parentElement.querySelector(".check-me").checked;
    console.log(checked);
    axios
      .post("/check-item", {
        id: e.target.getAttribute("data-id"),
        checked: checked
      })
      .then(function() {
        e.target.parentElement
          .querySelector(".check-me")
          .setAttribute("checked", "");
      });
  }
});
