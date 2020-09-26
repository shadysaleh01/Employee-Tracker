const mysql = require("mysql")
const inquirer = require("inquirer")
const fs = require("fs")
var Table = require('cli-table');
const { title } = require("process");
// var Table = require('../');
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
            "View All Departments",
            "View All Roles",
            "View All Employees",
            "View All Employees By Department",
            "View All Employees By Nanager",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Remove Employee",
            "Update Employee Role",
            "Update Employee Manager",
            "Quit",
            "Done"
         ]
      }
   ).then(answer => {
      switch (answer.choice) {
         case "View All Departments":
            ViewAllDepartments()
            break;
         case "View All Roles":
            ViewAllRoles()
            break;
         case "View All Employees":
            ViewAllEmployees()
            break;
         case "View All Employees by Department":
            byDepartment()
            break;
         case "View All Employees by Manager":
            byManager()
            break;
         case "Add Department":
            addDepartment()
            break;
         case "Add Role":
            addRole()
            break;
         case "Add Employee":
            addEmployee()
            break;

         case "Remove Employee":
            removeEmployee()
            break;
         case "Update Employee Role":
            updateEmployeeRole()
            break;
         case "Update Employee Manager":
            updateEmployeeManager()
            break;
         case "Quit":
            updateEmployeeManager()
            break;
      }
   })
}

function ViewAllDepartments() {
   connection.query("SELECT d_name FROM department;", (err, res) => {
      if (err) throw err
      var table = new Table({
         head: ['Departments']
         , style: {
            'padding-left': 1
            , 'padding-right': 1
            , head: []
            , border: []
         }
         , colWidths: [20]
      });

      for (let i = 0; i < res.length; i++) {
         let data = []
         data.push(res[i].d_name)
         table.push(data)
      }

      console.log(table.toString())
      start()
   })
}

function ViewAllRoles() {
   connection.query("SELECT role.id, role.title, role.salary, department.d_name FROM department JOIN role ON department.id = role.department_id;", (err, res) => {
      if (err) throw err
      // console.log("\n")
      var table = new Table({
         head: ['Title', 'Salary', 'Department']
         , style: {
            'padding-left': 1
            , 'padding-right': 1
            , head: []
            , border: []
         }
         , colWidths: [21, 15, 20]
      });
      for (let i = 0; i < res.length; i++) {
         let data = []
         data.push(res[i].title, res[i].salary, res[i].d_name)
         table.push(data)
      }
      console.log(table.toString())
      start()
   })
}

function ViewAllEmployees() {
   connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.d_name FROM employee JOIN role ON role_id = role.id JOIN department ON department_id = department.id", (err, res) => {
      if (err) throw err

      var table = new Table({
         head: ['ID', 'First Name', 'Last Name', 'Title', 'Salary', 'Department']
         , style: {
            'padding-left': 1
            , 'padding-right': 1
            , head: []
            , border: []
         }
         , colWidths: [7, 15, 15, 22, 12, 18]
      });

      for (let i = 0; i < res.length; i++) {
         let data = []
         data.push(res[i].id, res[i].first_name, res[i].last_name, res[i].title, res[i].salary, res[i].d_name)
         table.push(data)
      }
      console.log(table.toString())
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
      connection.query("INSERT INTO department SET d_name =?", [answer.department], (err, data) => {
         if (err) throw err

      })

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
         message: "Please Enter The Department Role's Name.",
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
         console.log(res)
         connection.query("INSERT INTO role SET title= ?, salary=?, department_id=?", [answer.title, answer.salary, res[0].id], (err, res) => {
            if (err) throw err
         })
         ViewAllRoles()
      })
   })
}

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
         // () => {
         //    return connection.query("SELECT title FROM role;", (err, res) => {
         //       if (err) throw err;
         //       var data = [];
         //       // console.log(res)

         //       for (let i = 0; i < res.length; i++) {

         //          data.push(res[i].title);

         //       }
         //       return JSON.stringify(data)
         //    })

         // }
      },
      {
         type: "list",
         name: "managerFirst",
         message: "What is The Employee's Manager?",
         choices: ["Saad", "Stevie", "Ahmed", "Mike"]

      },
      {
         type: "list",
         name: "managerLast",
         message: "What is The Employee's Manager?",
         choices: ["Zaghloul", "Nicks", "Shalaby", "Roger", "None"]

      }
   ]).then((answer) => {
      connection.query("SELECT id FROM role where title = ?", [answer.role], (err, rolID) => {
         if (err) throw err
         // console.log(rolID[0].id)
         // console.log(answer.managerFirst)
         connection.query("SELECT id FROM employee WHERE first_name = ? AND last_name =?", [answer.managerFirst, answer.managerLast], (err, mangID) => {
            if (err) throw err
            console.log(mangID)

            connection.query("INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?", [answer.first, answer.last, rolID[0].id, mangID[0].id], (err, res) => {
               if (err) throw err
            })

            start()
         })
      })
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
      connection.query("SELECT id FROM employee WHERE first_name =? AND last_name =?", [answer.first, answer.last], (err, id) => {
         if (err) throw err
         console.log(id)
         connection.query("DELETE FROM employee WHERE id = ? ", [id[0].id], (err, res) => {
            if (err) throw err

         })
      })


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


