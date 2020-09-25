const mysql = require("mysql")
const inquirer = require("inquirer")
const fs = require("fs")
var Table = require('cli-table');
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
            "View Role",
            "Remove employee",
            "Update employee role",
            "Update employee manager"
         ]
      }
   ).then(answer => {
      switch (answer.choice) {
         case "View all employees":
            byEmployee()
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
         case "View Role":
            roleTable()
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

function byEmployee() {

   connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err
      console.log("\n")
      console.log("id", "First_name", "Last_name", "Title", "Department", "Salary", "Manager")


      for (let i = 0; i < res.length; i++) {

         console.log("ID: " + res[i].id + "  ||  First Name: " + res[i].first_name + "  ||  Last Name: " + res[i].last_name + "  ||  Role: " + res[i].role_id + "  ||  Manager ID: " + res[i].manager_id)
      }
      console.log("\n")
      start()
   })

}

function byDepartment() {
   // connection.query("SELECT DISTINCT column, AGG_FUNC(column_or_expression), …
   // FROM mytable
   //     JOIN another_table
   //       ON mytable.column = another_table.column
   //     WHERE constraint_expression")
}

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
         type: "list",
         name: "role",
         message: "What is The Employee's Role?",
         choices: ["Salesperson", "Sales Lead", 'Lead Engineer', 'Software Engineer', 'Account Manager', 'Accountant', 'Legal Team Lead', 'Lawyer']
      },
      {
         type: "list",
         name: "manager",
         message: "What is The Employee's Manager?",
         choices: ['Saad', 'Stevie', 'Ahmed', "Mike", "None"]
      }

   ]).then((answer) => {



      connection.query("INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?", [answer.first, answer.last, answer.role, answer.manager], (err, data) => {
         if (err) throw err
         start()
      })
   })
}

function addDepartment() {
   inquirer.prompt(
      {
         name: "department",
         type: "input",
         message: "Please Enter The Department You Would Like To Add?",
         validate: answer => {
            if (answer !== "") {
               return true;
            }
            return "Please enter at least one character.";
         }
      }
   ).then((answer) => {
      connection.query("INSERT INTO department SET ?", [answer.department], (err, data) => {
         if (err) throw err
      })
      departmentTable()
      start()
   })
}

function departmentTable() {
   connection.query("SELECT d_name FROM department;", (err, res) => {
      if (err) throw err
      console.table(res)
      start()
   })
}

function addRole() {
   inquirer.prompt([
      {
         type: "input",
         name: "title",
         message: "Please Enter The Role's Title.",
         validate: answer => {
            if (answer !== "") {
               return true;
            }
            return "Please enter at least one character.";
         }

      },
      {
         type: "input",
         name: "salary",
         message: "Please Enter The Role's Salary.",
         validate: answer => {
            if (answer !== "") {
               return true;
            }
            return "Please enter at least one character.";
         }
      },
      {
         type: "input",
         name: "department",
         message: "Please Enter The Role's Department Name.",
         validate: answer => {
            if (answer !== "") {
               return true;
            }
            return "Please enter at least one character.";
         }
      }
   ]).then((answer) => {

      connection.query("SELECT id FROM department where d_name = ?", [answer.department], (err, res) => {
         if (err) throw err
         connection.query("INSERT INTO role SET title= ?, salary=?, department_id=?", [answer.title, answer.salary, res[0].id], (err, res) => {
            if (err) throw err
         })
         roleTable()
      })

   })
}

function roleTable() {
   connection.query("SELECT role.id, role.title, role.salary, department.d_name FROM department JOIN role ON department.id = role.department_id;", (err, res) => {
      if (err) throw err
      console.log("\n")
      for (let i = 0; i < res.length; i++) {

         console.log("ID: " + res[i].id + "  ||  Title: " + res[i].title + "  ||  Salary: " + res[i].salary + "  ||  Dapartment: " + res[i].d_name)
      }
      console.log("\n")
      start()
      // console.log(res)
      // var table = new Table({
      //    head: ['TH 1 label', 'TH 2 label']
      //    , colWidths: [100, 200]
      // });

      // for (let i = 0; i < res.length; i++) {

      //    table.push(res[i])
      // }
      // console.log(table.toString())
   })
}

function removeEmployee() {
   inquirer.prompt([
      {
         name: "first",
         type: "input",
         message: "Please Enter The Employee First Name"
      },
      {
         name: "last",
         type: "input",
         message: "Please Enter The Employee Last Name"
      }
   ]).then((answer) => {
      connection.query("DELETE FROM employee WHERE first_name = ?, last_name = ? ", [answer.first, answer.last], (err, res) => {
         if (err) throw err
      })
      byEmployee()
   })
}

function updateEmployeeRole() {
   inquirer.prompt([
      {
         name: "employee",
         type: "input",
         message: "Please Enter The Employee ID"
      },
      {
         name: "role",
         type: "input",
         message: "Please Enter The Role ID"
      }
   ]).then((answer) => {
      connection.query("UPDATE emoployee SET role_id= ? WHERE id=?", [answer.role, answer.employee], (err, res) => {
         if (err) throw err
      })
      byEmployee()
   })
}

function updateEmployeeManager() { }


