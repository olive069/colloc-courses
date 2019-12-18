function itemTemplate(item) {
  if (item.checked) {
    //   <input class="check-me" id=checkbox data-id=${item._id} type="checkbox" aria-label="Acheté" checked>
    // <div class="input-group-text d-flex align-items-center justify-content-between">
    {
      /* </div> */
    }
    return ` 
      <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
      <button class="btn btn-info btn-sm check-me" data-id=${item._id}>OK</button>
      <span class="item-text">${item.text}</span>
      <div>
      <button data-id=${item._id} class="edit-me btn btn-outline-secondary btn-sm mr-1">Modif</button>
      <button data-id=${item._id} class="delete-me btn btn-outline-danger btn-sm">Suppr</button>
      </div>
      </li>`;
  } else {
    //   <input class="check-me" id=checkbox data-id=${item._id} type="checkbox" aria-label="Acheté">
    // <div class="input-group-text d-flex align-items-center justify-content-between">
    {
      /* </div> */
    }
    return ` 
        <li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
        <button class="btn btn-outline-info btn-sm check-me" data-id=${item._id}>OK</button>
        <span class="item-text">${item.text}</span>
        <div>
        <button data-id=${item._id} class="edit-me btn btn-outline-secondary btn-sm mr-1">Modifier</button>
        <button data-id=${item._id} class="delete-me btn btn-outline-danger btn-sm">Supprimer</button>
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
    let newClass, checked;
    if (e.target.classList.contains("btn-info")) {
      console.log("Ola");
      newClass = "btn btn-outline-info check-me btn-sm";
      checked = false;
    } else {
      newClass = "btn btn-info check-me btn-sm";
      checked = true;
    };
    console.log(e.target.className);
    axios
      .post("/check-item", {
        id: e.target.getAttribute("data-id"),
        checked: checked
      })
      .then(function() {
        e.target.className =newClass;
      });
  }
});
