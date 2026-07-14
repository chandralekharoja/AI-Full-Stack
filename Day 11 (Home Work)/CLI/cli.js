import fs from "fs";

const command = process.argv[2];
const note = process.argv.slice(3).join(" ");

if (command === "add") {
    fs.appendFileSync("notes.txt", note + "\n");
    console.log("Note added successfully!");
}
else if (command === "list") {
    const data = fs.readFileSync("notes.txt", "utf8");
    console.log("Saved Notes:");
    console.log(data);
}
else {
    console.log("Usage:");
    console.log("node notes.js add Your note");
    console.log("node notes.js list");
}