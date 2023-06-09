const galleryElt = document.getElementById("gallery");
const filtersElt = document.getElementById("filters");
const filters = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];
const mesProjets = document.querySelector("#portfolio h2");
const boutonModifier = document.createElement("button");
const modal = document.getElementById("myModal");
const modalContent = document.getElementById("modal-content");
const closeBtn = document.querySelector(".close");
const worksList = document.querySelector(".works-list");
const token = localStorage.getItem("token");
const galleryModal = modal.querySelector("#gallery-modal");
const addPhotoModal = document.getElementById("addPhotoModal");
const addPhotoForm = document.getElementById("addPhotoForm");
const addPhoto = addPhotoForm.querySelector("#form");
const backButton = document.createElement("button");
const closeButton = document.createElement("button");
const addPhotoButton = document.createElement("button");
const addAndDelete = document.getElementById("addAndDelete");
const closeAndBack = document.querySelector("#closeBack");
const imageIcon = document.createElement("div");
const imageJpg = document.createElement("label");
const imageButtonJpg = document.createElement("label");
const imageLabel = document.createElement("label");
const imageInput = document.createElement("input");
const titleLabel = document.createElement("label");
const titleInput = document.createElement("input");
const categoryLabel = document.createElement("label");
const categoryInput = document.createElement("input");
const submitButton = document.createElement("input");
let allWorks = [];
let loginLink = document.getElementById("login-link");
const confirmationModal = document.getElementById("confirmationModal");
const confirmationMessage = document.getElementById("confirmationMessage");

addPhotoButton.textContent = "Ajouter une photo";
addPhotoButton.id = "add-button";
addAndDelete.appendChild(addPhotoButton);

const textSpan = document.createElement("span");
textSpan.textContent = "modifier";

const icon = document.createElement("i");
icon.classList.add("fa-solid", "fa-pen");

boutonModifier.appendChild(icon);
boutonModifier.appendChild(textSpan);

mesProjets.appendChild(boutonModifier);

textSpan.classList.add("button-text");

imageIcon.classList.add("fa-regular", "fa-image");
imageJpg.id = "imageJpg";

imageButtonJpg.innerText = "+ Ajouter photo";
imageButtonJpg.id = "imageButtonJpg";

imageLabel.textContent = "jpg, png : 4mo max";
imageLabel.id = "imageLabel";

imageInput.id = "image";
imageInput.type = "file";
imageInput.name = "image";

addPhoto.appendChild(imageJpg);
imageJpg.appendChild(imageIcon);
imageJpg.appendChild(imageButtonJpg);
imageButtonJpg.appendChild(imageInput);
imageJpg.appendChild(imageLabel);

titleLabel.textContent = "Titre";
titleLabel.id = "titleName";

titleInput.id = "title";
titleInput.type = "text";
titleInput.name = "title";

addPhoto.appendChild(titleLabel);
addPhoto.appendChild(titleInput);

categoryLabel.textContent = "Catégorie";
categoryLabel.id = "categoryName";

categoryInput.id = "category";
categoryInput.type = "text";
categoryInput.name = "category";

addPhoto.appendChild(categoryLabel);
addPhoto.appendChild(categoryInput);

submitButton.type = "submit";
submitButton.value = "Valider";
addPhoto.appendChild(submitButton);

backButton.innerHTML = "&#8592;";
backButton.id = "backButton";
backButton.classList.add("back");
closeAndBack.appendChild(backButton);

closeButton.innerHTML = "&#10006;";
closeButton.id = "closeButton";
closeButton.classList.add("close");
closeAndBack.appendChild(closeButton);

addPhotoButton.addEventListener("click", showAddPhotoModal);
addPhotoButton.addEventListener("click", (event) => {
  event.preventDefault();
  showAddPhotoModal();
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

closeButton.addEventListener("click", () => {
  addPhotoModal.style.display = "none";
  myModal.style.display = "none";
});

backButton.addEventListener("click", () => {
  addPhotoModal.style.display = "none";
  modal.style.display = "block";
});

window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

window.addEventListener("click", (event) => {
  if (event.target === addPhotoModal) {
    addPhotoModal.style.display = "none";
  }
});

function main() {
  if (token) {
    const navbar = document.createElement("div");
    navbar.id = "navbar";

    const navContent = document.createElement("div");
    navContent.id = "nav-content";

    const editIcon = document.createElement("i");
    editIcon.classList.add("fa-solid", "fa-pen");
    navContent.appendChild(editIcon);

    const editMode = document.createElement("span");
    editMode.textContent = "Mode édition";
    navContent.appendChild(editMode);

    const publishButton = document.createElement("button");
    publishButton.textContent = "publier les changements";
    navContent.appendChild(publishButton);

    navbar.appendChild(navContent);
    document.body.insertBefore(navbar, document.body.firstChild);

    boutonModifier.style.display = "block";
  } else {
    boutonModifier.style.display = "none";
  }

  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      allWorks = works;
      showFilters();
      showWorks(allWorks);
      filterEvents(allWorks);
      displayEditButton();
    });
}

function checkLoginStatus() {
  const token = localStorage.getItem("token");

  if (token) {
    loginLink.innerHTML = '<a href="#">logout</a>';

    loginLink.addEventListener("click", () => {
      localStorage.removeItem("token");

      location.reload();
    });
  } else {
    loginLink.innerHTML = '<a href="login.html">login</a>';
  }
}

function showWorks(works) {
  galleryElt.innerHTML = "";
  works.forEach((work) => {
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    img.classList.add("gallery-image");

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = work.title;

    const figure = document.createElement("figure");
    figure.appendChild(img);
    figure.appendChild(figcaption);
    figure.setAttribute("data-id", work.id);

    galleryElt.appendChild(figure);
  });
}

function showFilters() {
  filtersElt.innerHTML = "";
  filters.forEach((filter, index) => {
    const btnElt = document.createElement("button");
    btnElt.innerText = filter;
    btnElt.id = `filter-btn-${index}`;
    filtersElt.appendChild(btnElt);
  });
}

function filterEvents(works) {
  const filterElts = filtersElt.querySelectorAll("button");
  filterElts.forEach((filterElt) => {
    filterElt.addEventListener("click", () => {
      const filteredWorks =
        filterElt.innerText === "Tous"
          ? works
          : works.filter(
              (work) =>
                work.category && work.category.name === filterElt.innerText
            );
      showWorks(filteredWorks);
      resetButtonStyles(filterElts);
      filterElt.style.backgroundColor = "#1D6154";
      filterElt.style.color = "white";
    });
  });
}

function resetButtonStyles(filterElts) {
  filterElts.forEach((filterElt) => {
    filterElt.style.backgroundColor = "";
    filterElt.style.color = "";
  });
}

function displayEditButton() {
  const token = localStorage.getItem("token");
  if (token) {
    boutonModifier.addEventListener("click", () => {
      modal.style.display = "block";

      fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((works) => {
          galleryModal.innerHTML = "";
          works.forEach((work) => {
            const img = document.createElement("img");
            img.src = work.imageUrl;
            img.alt = work.title;
            img.classList.add("modal-image");

            const figcaption = document.createElement("figcaption");
            figcaption.innerText = work.title;

            const figure = document.createElement("figure");
            figure.appendChild(img);
            figure.appendChild(figcaption);
            figure.setAttribute("data-id", work.id);

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("fas", "fa-trash-alt", "delete-btn");
            deleteBtn.addEventListener("click", (event) => {
              event.stopPropagation();
              event.preventDefault();
              deleteImage(work.id, event);
            });

            deleteBtn.onclick = function (event) {
              event.stopPropagation();
            };

            img.parentNode.appendChild(deleteBtn);
            galleryModal.appendChild(figure);
          });
        });
    });
  }
}

function showModalWithTimeout(message, duration) {
  confirmationMessage.textContent = message;
  confirmationModal.style.display = "block";

  setTimeout(() => {
    confirmationModal.style.display = "none";
  }, duration);
}

function deleteImage(id, event) {
  event.stopPropagation();
  event.preventDefault();
  const deleteUrl = `http://localhost:5678/api/works/${id}`;

  fetch(deleteUrl, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        showModalWithTimeout(`Item Deleted, status: ${response.status}`, 3000);
      } else {
        showModalWithTimeout(`Item Deleted, status: ${response.status}`, 3000);
      }

      const figure = galleryElt.querySelector(`[data-id="${id}"]`);
      if (figure) {
        figure.remove();
      }

      const modalFigure = galleryModal.querySelector(`[data-id="${id}"]`);
      if (modalFigure) {
        modalFigure.remove();
      }

      allWorks = allWorks.filter((work) => work.id !== id);
      showWorks(allWorks);
      filterEvents(allWorks);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return false;
}

function showAddPhotoModal() {
  addPhotoModal.style.display = "block";

  const categorySelect = document.createElement("select");
  categorySelect.id = "category";

  const categories = [
    { value: 1, label: "Objets" },
    { value: 2, label: "Appartements" },
    { value: 3, label: "Hotels & restaurants" },
  ];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category.value;
    option.textContent = category.label;
    categorySelect.appendChild(option);
  });

  const categoryInputSelect = addPhoto.querySelector("#category");
  console.log(categoryInputSelect);
  categoryInputSelect.parentNode.replaceChild(
    categorySelect,
    categoryInputSelect
  );
}

function addImages() {
  addPhoto.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const formData = new FormData(addPhoto);
    const categorySelect = document.getElementById("category");
    const selectedCategoryLabel =
      categorySelect.options[categorySelect.selectedIndex].text;

    formData.append("category", categorySelect.value);

    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((newWork) => {
        newWork.category = { name: selectedCategoryLabel };
        allWorks.push(newWork);

        if (!filters.includes(selectedCategoryLabel)) {
          filters.push(selectedCategoryLabel);
          showFilters();
        }

        showWorks(allWorks);
        filterEvents(allWorks);
        resetButtonStyles(document.querySelectorAll("#filters button"));
        document.querySelector("#filter-btn-0").style.backgroundColor =
          "#1D6154";
        document.querySelector("#filter-btn-0").style.color = "white";

        addPhoto.reset();
        addPhotoModal.style.display = "none";
        modal.style.display = "none";
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
}

checkLoginStatus();
addImages();
main();
