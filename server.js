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

   let departments = [];
   connection.query("SELECT * FROM department", (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {

         departments.push({ name: res[i].d_name, value: res[i].id });
      }
   })
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
         type: "list",
         name: "department_id",
         message: "Please Choose The Department Role's Name.",
         choices: departments
      }
   ]).then((answer) => {

      connection.query("INSERT INTO role SET title= ?, salary=?, department_id=?", [answer.title, answer.salary, answer.department_id], (err, res) => {
         if (err) throw err
      })
      ViewAllRoles()
   })
}

function addEmployee() {

   let roleTitles = [];
   connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;
      for (let i = 0; i < res.length; i++) {

         roleTitles.push({ name: res[i].title, value: res[i].id });
      }
   })

   let employees = []
   connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;

      for (let i = 0; i < res.length; i++) {
         employees.push({ name: `${res[i].first_name} ${res[i].last_name}`, value: res[i].id });
      }

   })

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
         name: "role_id",
         message: "What is The Employee's Role?",
         choices: roleTitles

      },
      {
         type: "list",
         name: "manager_id",
         message: "What is The Employee's Manager?",
         choices: employees
      }

   ]).then((answer) => {


      connection.query("INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?", [answer.first, answer.last, answer.role_id, answer.manager_id], (err, res) => {
         if (err) throw err
      })

      start()
   })

}

function removeEmployee() {

   let remove = []
   connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;

      for (let i = 0; i < res.length; i++) {
         remove.push({ name: `${res[i].first_name} ${res[i].last_name}`, value: res[i].id });
      }

   })


   inquirer.prompt([
      {
         type: "list",
         name: "fullName",
         message: "What is The Employee's Manager?",
         choices: remove
      }
   ]).then((answer) => {
      // connection.query("SELECT id FROM employee WHERE first_name =? AND last_name =?", [answer.first, answer.last], (err, id) => {
      //    if (err) throw err
      //    console.log(id)
      //    connection.query("DELETE FROM employee WHERE id = ? ", [id[0].id], (err, res) => {
      //       if (err) throw err

      //    })
      // })
      console.log(answer)

   })
}

function updateEmployeeRole() {
   let employeeList = []
   connection.query("SELECT * FROM employee", (err, res) => {
      if (err) throw err;

      for (let i = 0; i < res.length; i++) {
         employeeList.push({ name: `${res[i].first_name} ${res[i].last_name}`, value: res[i].id });
      }
   })
   let role = []
   connection.query("SELECT * FROM role", (err, res) => {
      if (err) throw err;

      for (let i = 0; i < res.length; i++) {
         role.push({ name: res[i].title, value: res[i].id });
      }
   })
   inquirer.prompt([
      {
         name: "fullName",
         type: "list",
         message: "What is The Employee First Name",
         choices: employeeList
      },
      {
         name: "role",
         type: "list",
         message: "Please Choise the New Position",
         choices: role
      }
   ]).then((answer) => {


      connection.query("UPDATE employee SET role_id= ? WHERE id=?", [answer.role, answer.fullName], (err, res) => {
         if (err) throw err
         ViewAllEmployees()
      })

      // connection.query("SELECT id FROM role WHERE title=? ", [answer.role], (err, roleID) => {
      //    if (err) throw err
      //    // console.log(roleID)
      //    // console.log(roleID[0].id)
      //    // console.log(answer.first)
      //    // console.log(answer.last)

      //    connection.query("UPDATE employee SET role_id= ? WHERE first_name=? AND last_name=?", [roleID[0].id, answer.first, answer.last], (err, res) => {
      //       if (err) throw err
      //    })
      //    ViewAllEmployees()
      // })
      console.log(answer)
   })
}

function updateEmployeeManager() {


}


function byDepartment() {
   // connection.query("SELECT DISTINCT column, AGG_FUNC(column_or_expression), …
   // FROM mytable
   //     JOIN another_table
   //       ON mytable.column = another_table.column
   //     WHERE constraint_expression")
}

function byManager() { }
