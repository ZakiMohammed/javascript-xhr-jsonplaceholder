// ui elements
const spinner = document.querySelector('.spinner-border');
const dvList = document.querySelector('#dvList');
const dvMessage = document.querySelector('#dvMessage');
const frmPost = document.querySelector('#frmPost');
const btnAdd = document.querySelector('#btnAdd');
const btnSubmit = document.querySelector('#btnSubmit');
const btnCancel = document.querySelector('#btnCancel');
const txtTitle = document.querySelector('#txtTitle');
const txtBody = document.querySelector('#txtBody');

// declarations
const apiUrl = 'https://jsonplaceholder.typicode.com/posts';
let editId = 0;
let count = 0;

// events
window.addEventListener('load', onLoad);
btnAdd.addEventListener('click', onAddClick);
frmPost.addEventListener('submit', onSubmitClick);
btnCancel.addEventListener('click', onCancelClick);

// handlers
function onLoad() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', apiUrl, true);
    xhr.onload = () => {
        const posts = JSON.parse(xhr.responseText);
        posts.forEach(post => {
            dvList.innerHTML += `
                <div class="col-sm-6 mb-3 post-${post.id}">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body}</p>
                        </div>
                        <div class="card-footer">
                            <button type="button" class="btn btn-light btn-sm btn-edit" onclick="onEditClick(${post.id})"><i class="fa fa-pencil pr-1"></i>Edit</button>
                            <button type="button" class="btn btn-light btn-sm btn-delete" onclick="onDeleteClick(${post.id})"><i class="fa fa-trash pr-1"></i>Delete</button>
                        </div>
                    </div>
                </div>
            `;
        });
        spinner.classList.add('d-none');
    };
    xhr.send();
}
function onSubmitClick(e) {
    e.preventDefault();

    // validate inputs
    if (txtTitle.value === '' || txtBody.value === '') {
        dvMessage.textContent = 'Please fill the form properly';
        dvMessage.className = 'alert alert-danger';
        setTimeout(() => dvMessage.className = 'alert d-none', 2000);
        return;
    } else {
        dvMessage.textContent = '';
        dvMessage.className = 'alert d-none';
    }

    // message loading
    dvMessage.textContent = 'Loading please wait';
    dvMessage.className = 'alert alert-info';

    // disable button
    btnSubmit.setAttribute('disabled', true);
    btnCancel.setAttribute('disabled', true);

    if (editId === 0) {

        // add new post

        const data = JSON.stringify({
            title: txtTitle.value,
            body: txtBody.value,
            userId: 1
        });
        const xhr = new XMLHttpRequest();
        xhr.open('POST', apiUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            const post = JSON.parse(xhr.responseText);
            dvMessage.textContent = 'Post created successfully';
            dvMessage.className = 'alert alert-success';

            // increment post id in order to make them unique
            post.id += count++;

            dvList.innerHTML = `
                <div class="col-sm-6 mb-3 post-${post.id}">
                    <div class="card h-100">
                        <div class="card-body">
                            <h5 class="card-title">${post.title}</h5>
                            <p class="card-text">${post.body}</p>
                        </div>
                        <div class="card-footer">
                            <button type="button" class="btn btn-light btn-sm btn-edit" onclick="onEditClick(${post.id})"><i class="fa fa-pencil pr-1"></i>Edit</button>
                            <button type="button" class="btn btn-light btn-sm btn-delete" onclick="onDeleteClick(${post.id})"><i class="fa fa-trash pr-1"></i>Delete</button>
                        </div>
                    </div>
                </div>` + dvList.innerHTML;

            setTimeout(() => {
                frmPost.classList.add('d-none');
                dvMessage.className = 'alert d-none';
                txtTitle.value = '';
                txtBody.value = '';
                btnSubmit.removeAttribute('disabled');
                btnCancel.removeAttribute('disabled');
            }, 1500);
        };
        xhr.send(data);
    } else {

        // edit post

        const data = JSON.stringify({
            id: editId,
            title: txtTitle.value,
            body: txtBody.value,
            userId: 1
        });
        const xhr = new XMLHttpRequest();
        xhr.open('PUT', `${apiUrl}/${editId}`, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            const post = JSON.parse(xhr.responseText);
            dvMessage.textContent = 'Post updated successfully';
            dvMessage.className = 'alert alert-success';

            const title = document.querySelector(`.post-${editId} .card-title`);
            const body = document.querySelector(`.post-${editId} .card-text`);

            title.textContent = post.title;
            body.textContent = post.body;
    
            setTimeout(() => {
                frmPost.classList.add('d-none');
                dvMessage.className = 'alert d-none';
                txtTitle.value = '';
                txtBody.value = '';
                btnSubmit.removeAttribute('disabled');
                btnCancel.removeAttribute('disabled');
            }, 1500);
        };
        xhr.send(data);
    }
}
function onAddClick() {
    frmPost.classList.remove('d-none');
}
function onCancelClick() {
    frmPost.classList.add('d-none');
    txtTitle.value = '';
    txtBody.value = '';
    editId = 0;
}
function onEditClick(id) {
    const title = document.querySelector(`.post-${id} .card-title`).textContent;
    const body = document.querySelector(`.post-${id} .card-text`).textContent;

    editId = id;
    txtTitle.value = title;
    txtBody.value = body;

    frmPost.classList.remove('d-none');
}
function onDeleteClick(id) {
    const post = document.querySelector(`.post-${id}`);
    const title = document.querySelector(`.post-${id} .card-title`).textContent;
    const result = confirm(`Are you sure you want to delete "${title}"?`);
    if (result) {
        post.remove();
    }
}