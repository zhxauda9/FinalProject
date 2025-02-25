const API_URL = "http://localhost:3000/api/blogs";

async function loadBlogs() {
    const response = await fetch(API_URL);
    const blogs = await response.json();

    const container = document.getElementById("blogs-container");
    container.innerHTML = "";

    blogs.forEach(blog => {
        const blogElement = document.createElement("div");
        blogElement.classList.add("blog");

        blogElement.innerHTML = `
            <h3 contenteditable="false" id="title-${blog._id}">${blog.title}</h3>
            <p contenteditable="false" id="body-${blog._id}">${blog.body}</p>
            <small>Автор: <span contenteditable="false" id="author-${blog._id}">${blog.author || "Аноним"}</span></small><br>
            <button onclick="editBlog('${blog._id}')">Edit</button>
            <button onclick="updateBlog('${blog._id}')" style="display:none;" id="update-${blog._id}">Update</button>
            <button onclick="deleteBlog('${blog._id}')">Delete</button>
        `;

        container.appendChild(blogElement);
    });
}

async function addBlog() {
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const author = document.getElementById("author").value;

    if (!title || !body) {
        alert("Fill in the title and text!");
        return;
    }

    const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, author })
    });

    if (response.ok) {
        loadBlogs();
    } else {
        alert("Error adding blog");
    }
}
async function deleteBlog(id) {
    await fetch(`${API_URL}/${id}`, { method: "DELETE" });
    loadBlogs();
}

function editBlog(id) {
    document.getElementById(`title-${id}`).contentEditable = "true";
    document.getElementById(`body-${id}`).contentEditable = "true";
    document.getElementById(`author-${id}`).contentEditable = "true";

    document.getElementById(`update-${id}`).style.display = "inline";
}

async function updateBlog(id) {
    const title = document.getElementById(`title-${id}`).innerText;
    const body = document.getElementById(`body-${id}`).innerText;
    const author = document.getElementById(`author-${id}`).innerText;

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, author })
    });

    if (response.ok) {
        document.getElementById(`title-${id}`).contentEditable = "false";
        document.getElementById(`body-${id}`).contentEditable = "false";
        document.getElementById(`author-${id}`).contentEditable = "false";
        document.getElementById(`update-${id}`).style.display = "none";
    } else {
        alert("Error updating blog");
    }
}
loadBlogs();