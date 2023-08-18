const API = " http://localhost:3000/CartierGoods";
const inpName = document.querySelector("#inpName");
const inpImg = document.querySelector("#inpImg");
const btnAdd = document.querySelector("#btnAdd");
const btnOpenForm = document.querySelector("#flush-collapseOne");
const section = document.querySelector("#section");

let searchValue = "";

const LIMIT = 10;

btnAdd.addEventListener("click", () => {
  if (!inpName.value.trim() || !inpImg.value.trim()) {
    return alert("Заполните все поля!");
  }

  const newItem = {
    title: inpName.value,
    img: inpImg.value,
  };
  createMyItem(newItem);
  renderGoods();
});

async function createMyItem(item) {
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(item),
  });
  btnOpenForm.classList.toggle("show");
  inpName.value = "";
  inpImg.value = "";
}

async function renderGoods() {
  let res;
  if (searchValue) {
    res = await fetch(`${API}?title=${searchValue}&_limit=${LIMIT}`);
  } else {
    res = await fetch(`${API}?_limit=${LIMIT}`);
  }
  const data = await res.json();

  section.innerHTML = "";
  data.forEach(({ title, img, id }) => {
    section.innerHTML += `
    <div class="card m-4 cardBook" style="width: 20rem">
    <div class="image-container">
        <img id="${id}" src=${img} class="card-img-top detailsCard" style="height: 280px" alt="${title}"/>
        <div class="overlay">
            <div class="btn3">
                <button class="btn btn-outline-danger btnDelete w-30" id="${id}">
                    Delete
                </button>
                <button 
                    class="btn btn-outline-warning btnEdit w-30" id="${id}"
                    data-bs-target="#exampleModal"
                    data-bs-toggle="modal"
                >
                    Edit
                </button>
                <a href="#" data-bs-toggle="modal" data-bs-target="#detailsModal" data-title="${title}" data-img="${img}">
                  <button class="btn btn-outline-info btnDetails w-30" id="${id}">
                    Discover
                  </button>
                </a>
            </div>
        </div>
    </div>                   
            </div>
            </div>
    </div>
        `;
  });
  pageFunc();
}

async function pageFunc() {
  const res = await fetch(API);
  const data = await res.json();
}

// =============Discover =============
const modalElement = document.getElementById("detailsModal");
modalElement.addEventListener("show.bs.modal", function (event) {
  const button = event.relatedTarget;
  const title = button.getAttribute("data-title");
  const img = button.getAttribute("data-img");

  const modalTitle = modalElement.querySelector(".modal-title");
  const modalImg = modalElement.querySelector(".modalImg");

  modalTitle.textContent = title;
  modalImg.innerHTML = `<img src="${img}" alt="${title}" />`;
});

modalElement.addEventListener("hidden.bs.modal", function () {
  const modalTitle = modalElement.querySelector(".modal-title");
  const modalImg = modalElement.querySelector(".modalImg");

  modalTitle.textContent = "";
  modalImg.innerHTML = "";
});

// ----------DELETE--------------------
document.addEventListener("click", async ({ target: { classList, id } }) => {
  const delClass = [...classList];
  if (delClass.includes("btnDelete")) {
    try {
      await fetch(`${API}/${id}`, {
        method: "DELETE",
      });
      renderGoods();
    } catch (error) {
      console.log(error);
    }
  }
});

renderGoods();

//=========== EDIT =========

const editInpName = document.querySelector("#editInpName");
const editInpImage = document.querySelector("#editInpImage");
const editBtnSave = document.querySelector("#editBtnSave");

document.addEventListener("click", async ({ target: { classList, id } }) => {
  const classes = [...classList];
  if (classes.includes("btnEdit")) {
    const res = await fetch(`${API}/${id}`);
    const { title, img, id: productId } = await res.json();
    editInpName.value = title;
    editInpImage.value = img;
    editBtnSave.setAttribute("id", productId);
  }
});

editBtnSave.addEventListener("click", () => {
  const editedProduct = {
    title: editInpName.value,
    img: editInpImage.value,
  };
  editProduct(editedProduct, editBtnSave.id);
});

async function editProduct(product, id) {
  try {
    await fetch(`${API}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(product),
    });
    renderGoods();
  } catch (error) {
    console.log(error);
  }
}

// Search
const searchInp = document.querySelector("#searchInp");
const searchBtn = document.querySelector("#searchBtn");

searchInp.addEventListener("input", ({ target: { value } }) => {
  searchValue = value;
});

searchBtn.addEventListener("click", () => {
  renderGoods();
});

// Details
document.addEventListener("click", ({ target }) => {
  if (target.classList.contains("btnDetails"))
    localStorage.setItem("detail-id", target.id);
});

// Scroll
const prevButton = document.querySelector(".prev-button");
const nextButton = document.querySelector(".next-button");

let currentIndex = 0;
let scrolling = 0;
nextButton.addEventListener("click", () => {
  scrolling += 300;
  section.scrollLeft = scrolling;
});

prevButton.addEventListener("click", () => {
  scrolling -= 300;
  section.scrollLeft = scrolling;
});
