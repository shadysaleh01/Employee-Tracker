const mysql = require("mysql")
const inquirer = require("inquirer")
const fs = require("fs")
const Choices = require("inquirer/lib/objects/choices")
// const consTable = require("console.table")
// const util = require("util")

// const logo = require("asciiart-logo")
// const config = require('../package.json');
// console.log(logo(config).render());


var connection = mysql.createConnection({
   host: "localhost",
   port: 3306,
   user: "root",
   password: "MySQL",
   database: "employee_tracker"
})


connection.connect((err) => {
   if (err) {
      console.log(err)
      // res.status(500)
      // return res.send("Connetion faild to database.")
   }
   console.log("Connected as id " + connection.threadId + "\n")

   start()
})

function start() {
   inquirer.prompt(
      {
         type: "rawlist",
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
   ).then(answer => {
      switch (answer.choice) {
         case "View all employees":
            allEmployees()
            break;
         case "View all employees by department":
            byDepartment()
            break;
         case "View all employees by manager":
            byManager()
            break;
         case "Add employee":
            addEmployee()
            break;
         case "Add Department":
            addDepartment()
            break;
         case "Add Role":
            addRole()
            break;
         case "Remove employee":
            removeEmployee()
            break;
         case "Update employee role":
            updateEmployeeRole()
            break;
         case "Update employee manager":
            updateEmployeeManager()
            break;
      }
   })
}

function allEmployees() {

   connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err
      console.log("\n")
      // console.log("id", "First_name", "Last_name", "Title", "Department", "Salary", "Manager")
      for (let i = 0; i < res.length; i++) {
         console.log("ID: " + res[i].id + "  ||  First Name: " + res[i].first_name + "  ||  Last Name: " + res[i].last_name + "  ||  Role: " + res[i].role_id + "  ||  Manager ID: " + res[i].manager_id)
      }
      console.log("\n")
      start()
   })

}

function byDepartment() { }

function byManager() { }

function addEmployee() {
   inquirer.prompt([
      {
         type: "input",
         name: "first",
         message: "What is the Employee's First Name?",
         validate: answer => {
            if (answer !== "") {
               return true;
            }
            return "Please enter at least one character.";
         }
      },
      {
         type: "input",
         name: "last",
         message: "What is the Employee's Last Name?",
         validate: answer => {
            if (answer !== "") {
               return true;
            }
            return "Please enter at least one character.";
         }
      },
      {
         type: "input",
         name: "role",
         message: "Please Enter The Role ID"
      },
      {
         type: "input",
         name: "manager",
         message: "Please Enter The Manager ID"
      }

   ]).then((answer) => {
      connection.query("INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?", [answer.first, answer.last, answer.role_id, answer.manager_id], (err, data) => {
         if (err) throw err
         start()
      })
   })
}


function addRole() {
}

function removeEmployee() { }

function updateEmployeeRole() { }

function updateEmployeeManager() { }


