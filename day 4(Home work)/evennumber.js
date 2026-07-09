import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function prompt(question) {
  const rl = readline.createInterface({ input, output });
  const response = await rl.question(question);
  rl.close();
  return response;
}
const data = [ ];
let cancel = true;

while (cancel) {
  
   const num = (await prompt("Enter your numbers ")).trim();
  
  if (!isNaN(num) && num !== "") {
    
    data.push({ number: num });

    if( (num % 2) == 0){

  console.log("\n Even number present in our data :", num, "\n Total length of even number  " ,num.length);
  console.log("\n over all data present in out data :", data, "\n Total length of data ",data.length);
  }

  else{
    console.log(data,"No even number present in our data ");
  }
}

  else if(num == '') {

    console.log("You have exited the loop");
    cancel = false;
    break;
  }
  else {
    console.log("Enter the valid  number");
  }


}
