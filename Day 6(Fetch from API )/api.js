export async function fetchPosts() {
const response = await fetch(
"https://jsonplaceholder.typicode.com/posts?_limit=20"
);
if (!response.ok) throw new Error(response.status);
return response.json();
}   