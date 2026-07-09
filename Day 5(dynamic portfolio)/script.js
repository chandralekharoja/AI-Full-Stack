import { project } from "./data.js";

const grid = document.querySelector("#project");
project.forEach(project =>{
    const card = document.createElement("article");
    card.className="project-grid-article";
    const title = document.createElement("h2");
    title.textContent = project.title;
    card.appendChild (title);
    const Description = document.createElement("ul");
    
    card.innerHTML=`<h2>${project.title}</h2>
      <ul>
       <li> ${project.Description}</li>
      </ul>`

 grid.appendChild(card);
});


