import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function prompt(question) {
  const rl = readline.createInterface({ input, output });
  const response = await rl.question(question);
  rl.close();
  return response;
}
const details = [];
let Continue = true;

while (Continue) {
  const name = await prompt("Enter your name: ");
  const phonenumber = await prompt("Enter your phone number :");
  if (/^[A-Za-z ]+$/.test(name) && /^\d+$/.test(phonenumber)) {
    
    details.push({ name: name, phone: phonenumber });

    const choice = await prompt(
      "Do you want to add another person?  could you type (yes/no): ",
    );

    if (choice.toLowerCase() !== "yes" && choice.toLowerCase() !== "y") {
      Continue = false;
    }
    console.log("Our list of array", details, details.length);
  } 
  else {
    console.log("Enter the valid name and number");
  }
}
