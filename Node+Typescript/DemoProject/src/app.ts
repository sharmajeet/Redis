import express, { Express, Request, Response } from 'express';

const app : Express = express();

const PORT : number = 3000;

app.get('/', (req:Request, res:Response) => {
    res.send('Hello World!');
});


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


// console.log("Welcome to the Demo Project!");
// console.log("This is a simple TypeScript application.");

// function greet(name : string){
//     console.log(`Hello, ${name}!, Welcome to the TypeScript world!`);
// }

// greet("Jeet Sharma");