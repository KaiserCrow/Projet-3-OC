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

addPhotoButton.textContent = "Ajouter une photo";
addPhotoButton.id = "add-button";
addAndDelete.appendChild(addPhotoButton);

const imageIcon = document.createElement("div");
imageIcon.classList.add("fa-regular", "fa-image");
const imageJpg = document.createElement("label");
imageJpg.id = "imageJpg";

const imageButtonJpg = document.createElement("label");
imageButtonJpg.innerText = "+ Ajouter une photo";
imageButtonJpg.id = "imageButtonJpg";

const imageLabel = document.createElement("label");
imageLabel.textContent = "jpg, png : 4mo max";
imageLabel.id = "imageLabel";

const imageInput = document.createElement("input");
imageInput.id = "image";
imageInput.type = "file";
imageInput.name = "image";

addPhoto.appendChild(imageJpg);
imageJpg.appendChild(imageIcon);
imageJpg.appendChild(imageButtonJpg);
imageButtonJpg.appendChild(imageInput);
imageJpg.appendChild(imageLabel);

const titleLabel = document.createElement("label");
titleLabel.textContent = "Titre:";
titleLabel.id = "titleName";

const titleInput = document.createElement("input");
titleInput.id = "title";
titleInput.type = "text";
titleInput.name = "title";

addPhoto.appendChild(titleLabel);
addPhoto.appendChild(titleInput);

const categoryLabel = document.createElement("label");
categoryLabel.textContent = "Catégorie:";
categoryLabel.id = "categoryName";

const categoryInput = document.createElement("input");
categoryInput.id = "category";
categoryInput.type = "text";
categoryInput.name = "category";

addPhoto.appendChild(categoryLabel);
addPhoto.appendChild(categoryInput);

const submitButton = document.createElement("input");
submitButton.type = "submit";
submitButton.value = "Ajouter";
addPhoto.appendChild(submitButton);

backButton.innerHTML = "&#8592;";
backButton.id = "backButton";
backButton.classList.add("back");
closeAndBack.appendChild(backButton);

closeButton.innerHTML = "&#10006;";
closeButton.id = "closeButton";
closeButton.classList.add("close");
closeAndBack.appendChild(closeButton);

function main() {
  if (token) {
    boutonModifier.style.display = "block";
  } else {
    boutonModifier.style.display = "none";
  }

  fetch("http://localhost:5678/api/works")
    .then((response) => response.json())
    .then((works) => {
      showFilters();
      showWorks(works);
      filterEvents(works);
      displayEditButton(works);
    });
}

function showFilters() {
  filters.forEach((filter, index) => {
    const btnElt = document.createElement("button");
    btnElt.innerText = filter;
    btnElt.id = `filter-btn-${index}`;
    filtersElt.appendChild(btnElt);
  });
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

function filterEvents(works) {
  const filterElts = filtersElt.querySelectorAll("button");
  filterElts.forEach((filterElt) => {
    filterElt.addEventListener("click", () => {
      const filteredWorks =
        filterElt.innerText === "Tous"
          ? works
          : works.filter((work) => work.category.name === filterElt.innerText);
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

function displayEditButton(works) {
  const token = localStorage.getItem("token");
  if (token) {
    boutonModifier.textContent = "Modifier";
    mesProjets.appendChild(boutonModifier);
    boutonModifier.classList.add("fa-solid", "fa-pen");
    boutonModifier.addEventListener("click", () => {
      modal.style.display = "block";
      galleryModal.innerHTML = galleryElt.innerHTML;
      const galleryModalImages = galleryModal.querySelectorAll("img");
      galleryModalImages.forEach((img, index) => {
        img.classList.add("modal-image");

        const deleteBtn = document.createElement("button");
        deleteBtn.classList.add("fas", "fa-trash-alt", "delete-btn");
        deleteBtn.addEventListener("click", (event) => {
          event.stopPropagation();
          event.preventDefault();
          deleteImage(works[index].id, event);
        });

        deleteBtn.onclick = function (event) {
          event.stopPropagation();
        };

        img.parentNode.appendChild(deleteBtn);
      });
    });
  }
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
    .then(() => {
      const figure = galleryElt.querySelector(`[data-id="${id}"]`);
      if (figure) {
        figure.remove();
      }

      const modalFigure = galleryModal.querySelector(`[data-id="${id}"]`);
      if (modalFigure) {
        modalFigure.remove();
      }

      fetch("http://localhost:5678/api/works")
        .then((response) => response.json())
        .then((works) => {
          filterEvents(works);
          displayEditButton(works);
        });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  return false;
}

function addImages() {
  addPhoto.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();
    const formData = new FormData(addPhoto);
    const categorySelect = document.getElementById("category");
    const selectedCategory = categorySelect.value;

    formData.append("category", selectedCategory);
    fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((response) => {
        return response.json();
      })
      .then((newWork) => {
        const img = document.createElement("img");
        img.src = newWork.imageUrl;
        img.alt = newWork.title;
        img.classList.add("gallery-image");

        const figcaption = document.createElement("figcaption");
        figcaption.innerText = newWork.title;

        const figure = document.createElement("figure");
        figure.appendChild(img);
        figure.appendChild(figcaption);
        figure.setAttribute("data-id", newWork.id);

        galleryElt.appendChild(figure);

        addPhoto.reset();

        addPhotoModal.style.display = "none";
        modal.style.display = "none";

        fetch("http://localhost:5678/api/works")
          .then((response) => response.json())
          .then((works) => {
            filterEvents(works);
            displayEditButton(works);
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });
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

addImages();
main();
