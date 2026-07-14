import fs from "fs";

function titleCase(text) {
  return text
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sortLines(lines) {
  return lines.sort().join("\n");
}

const data = fs.readFileSync("input.txt", "utf8");

const titleCased = data
  .split("\n")
  .map(titleCase);
const result = sortLines(titleCased);
fs.writeFileSync("output.txt", result);
console.log("File processed successfully!");