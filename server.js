const mysql = requier("mysql")
const inquirer = requier("inquirer")
const fs = requier("fs")
const consTable = requier("console.table")
const util = require("util")

const PORT
const logo = rquire("asciiart-logo")
const config = require('./package.json');
console.log(logo(config).render());


const connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "Cheeseme1",
   database: "employee_tracker"
})


connection.connect((err, res) => {
   if (err) {
      console.log(err)
      res.status(500)
      return res.send("Connetion faild to database.")
   }
   console.log("Connected as port " + port)
   start()
})

function start() {
   inquirer.prompt(
      {
         type: "list",
         name: "choice",
         message: "What would you like to do?",
         choices: [
            "View all employees",
            "View all employees by department",
            "View all employees by manager",
            "Add employee",
            "Add Department",
            "Add Role",
            "Remove employee",
            "Update employee role",
            "Update employee manager"
         ]
      }
   ).thin(answer => {
      switch (answer.choice) {
         case "View all employees":

            break;
         case "View all employees by department":

            break;
         case "View all employees by manager":

            break;
         case "Add employee":

            break;
         case "Add Department":

            break;
         case "Add Role":

            break;
         case "Remove employee":

            break;
         case "Update employee role":

            break;
         case "Update employee manager":

            break;

         default:
            break;
      }
   })
}