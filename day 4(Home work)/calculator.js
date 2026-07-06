import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function prompt(question) {
  const rl = readline.createInterface({ input, output });
  const response = await rl.question(question);
  rl.close();
  return response;
}

const a = parseFloat(await prompt("Enter the value of A : "));
const b = parseFloat(await prompt("Enter the value of B : "));


async function calculator(a,b)

{

const choice = await prompt ("Enter Your choice : \n 1.Addition \n 2.Subraction \n 3.Multiplication \n 4.Division \n> ");

if  (a !== null || String(a).trim() !== '' || !isNaN((a)) ||
    b !== null || String(b).trim() !== '' || !isNaN((b)))
{
         if (choice == 1)
    {
        
        return a + b;
    }

    else if (choice == 2)
    {
        
        return a-b;
    }

    else if (choice == 3)
    {

        return a*b;
    }   

    else if (choice == 4)
    {
        
        return a/b;
    }

    else
    {
        return "Please enter a valid choice"
    }
}

else if (choice == null || choice =='' || isNaN(choice)){

    return"Enter a valid choice"
}


}

const answer = await calculator(a,b);
    console.log(`The answer is  : ${answer}`);