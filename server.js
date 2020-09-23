const mysql = requier("mysql")
const inquirer = requier("inquirer")
const fs = requier("fs")
const consTable = requier("console.table")
const util = require("util")


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