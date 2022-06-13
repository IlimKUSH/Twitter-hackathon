const API = "http://localhost:8000/post";
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpAddPost = document.getElementById("inp-post");
let btnOpen = document.getElementById("modal-open");
let btnOpenMobile = document.getElementById("modal-open-mobile");
let btnAdd = document.getElementById("add-post");
let list = document.getElementById("list");
// console.log(modalEdit,modalEditClose,inpAddPost,btnOpen,btnSave,btnAdd)
modalEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});
btnOpen.addEventListener("click", function () {
  modalEdit.style.display = "flex";
});
btnOpenMobile.addEventListener("click", function () {
  modalEdit.style.display = "flex";
});
btnAdd.addEventListener("click", async function () {
  let newPost = {
    post: inpAddPost.value,
  };
  // console.log(newPost)
  if (inpAddPost.value.trim() === "") {
    alert("Enter something");
    return;
  }
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  getPosts();
  inpAddPost.value = "";
  modalEdit.style.display = "none";
});
let inpSearch = document.getElementById("inp-search");
let page = 1;
let pagination = document.getElementById("pagination");
inpSearch.addEventListener("input", function () {
  getPosts();
});
async function getPosts() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${page}&_limit=6`
  )
    .then(res => res.json())
    .catch(err => console.log(err));
  let allPosts = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log("Error"));
  let lastPage = Math.ceil(allPosts.length / 2);
  // console.log(lastPage);
  list.innerHTML = "";
  // console.log(response);
  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.classList.add("post-main");
    newElem.innerHTML = `<img class="post-img" src='./media/avatar.svg' alt=""><div class="post-div"><span class='post-style'>${item.post}</span><div class='post-btns'><button class='btn-delete'>Delete</button>
    <button class="btn-edit">Edit</button></div></div><div class="one">
    <svg viewBox="0 0 24 24" style="width:21px;vertical-align: middle;margin-right: 5px;">
      <path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-1.91l-.01-.01L23 10z"></path>
    </svg>
    <span class="count">0</span>
    <svg viewBox="0 0 24 24" style="width:21px;vertical-align: middle;margin-right: 5px;">
      <path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v1.91l.01.01L1 14c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path>
    </svg>
    <span class="count">0</span>
  </div>`;
    list.append(newElem);
  });
  pagination.innerHTML = `<button id='btn-prev' ${
    page === 1 ? "disabled" : ""
  }>prev</button> 
<span>${page}</span>
<button  id='btn-next' ${page === lastPage ? "disabled" : ""}>next</button>`;
}
getPosts();
document.addEventListener("click", async function (e) {
  if (e.target.className === "btn-delete") {
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getPosts();
  }
  if (e.target.className === "btn-edit") {
    modalEditTwo.style.display = "flex";
    let id = e.target.parentNode.id;
    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    inpAddPost.value = response.post;
  }
  if (e.target.id === "btn-next") {
    page++;
    getPosts();
  }
  if (e.target.id === "btn-prev") {
    page--;
    getPosts();
  }
  document.querySelectorAll(".one > svg").forEach(n => {
    const count = n.nextElementSibling;
    count.dataset.count = +count.textContent - n.classList.contains("active");
  });
  const el = e.target.closest(".one");
  if (el) {
    const svg = e.target.closest("svg");
    el.querySelectorAll("svg").forEach(n => {
      const liked = n === svg && !n.classList.contains("active");
      const count = n.nextElementSibling;
      n.classList.toggle("active", liked);
      count.textContent = +count.dataset.count + liked;
    });
  }
});
let modalEditTwo = document.getElementById("modal-edit-two");
let modalEditCloseTwo = document.getElementById("modal-edit-close-two");
let inpAddPostTwo = document.getElementById("inp-post-two");
let btnSaveTwo = document.getElementById("save-edit-two");
let inpEditId = document.getElementById("inp-edit-id");
// console.log(modalEditCloseTwo,modalEditTwo,inpAddPostTwo,btnOpenTwo,btnSaveTwo,btnAddTwo)
modalEditClose.addEventListener("click", function () {
  modalEditTwo.style.display = "none";
});
modalEditCloseTwo.addEventListener("click", function () {
  modalEditTwo.style.display = "none";
});
btnSaveTwo.addEventListener("click", async function () {
  let editedPosts = {
    post: inpAddPostTwo.value,
  };
  let id = inpEditId.value;
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedPosts),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  modalEditTwo.style.display = "none";
  getPosts();
});
let btnLike = document.getElementById("btn-like");
