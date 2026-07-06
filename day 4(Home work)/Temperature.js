import * as readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

async function prompt(question) {
  const rl = readline.createInterface({ input, output });
  const response = await rl.question(question);
  rl.close();
  return response;
}
const celsius = await prompt("Enter the celsius value : ");

function temperature(celsius)
{
    if(celsius == null || celsius == '' || isNaN(parseFloat(celsius)))
    {
        return "Please enter any value";
    }

    else if (celsius < -273.15 || celsius > 1000){
        
        return "Values cannot be zero";
    }

    else {
        
        const celsiusToFahrenheit =  (celsius * 9) / 5 + 32;
        return  celsiusToFahrenheit;
    }

}

    const result = temperature(celsius);
    console.log(`Your Fahrenhiet value is : ${result}`);

