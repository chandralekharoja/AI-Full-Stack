import { fetchPosts } from "./api.js";

const container = document.querySelector("#profile");

async function loadPosts() {
    container.textContent = "Loading...";

    try {
        const posts = await fetchPosts();

        container.textContent = "";
        posts.forEach(post => {
            const article = document.createElement("article");
            article.className = "profile-card";

            const title = document.createElement("h3");
            title.textContent = post.title;
            article.appendChild(title);

            const body = document.createElement("p");
            body.textContent = post.body.slice(0, 80) + "...";
            article.appendChild(body);
            
            container.appendChild(article);
        });

    } catch (err) {
        console.error(err);
        container.textContent = "Could not load posts.";
    }
}

loadPosts();