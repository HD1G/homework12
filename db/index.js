const connection = require("./connection");

class DB {
 // Keeping a reference to the connection on the class in case we need it later
 constructor(connection) {
 this.connection = connection;
 }

 // Find all employees, join with roles and departments to display their roles, salaries, departments, and managers
 findAllEmployees() {
 return this.connection.query(
 "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;"
 );
 }

 // Create a new employee
 createEmployee(employee) {
 console.log("INSERT INTO employee SET ?", employee);
 return this.connection.query("INSERT INTO employee SET ?", employee);
 }

 // Remove an employee with the given id
 removeEmployee(employeeId) {
 return this.connection.query(
 "DELETE FROM employee WHERE id = ?",
 employeeId
 );
 }


 // Update the given employee's role
 updateEmployeeRole(employeeId, roleId) {
 console.log("UPDATE employee SET role_id = ? WHERE id = ?",
 [roleId, employeeId]);
 return this.connection.query(
 "UPDATE employee SET role_id = ? WHERE id = ?",
 [roleId, employeeId]
 );
 }
 // Update the given employee's manager
 updateEmployeeManager(employeeId, managerId) {
 return this.connection.query("UPDATE employee SET manager_id = ? WHERE id = ?", 
 [managerId, employeeId]);
 }

 // Find all roles, join with departments to display the department name
 findAllRoles(){
 return this.connection.query("SELECT * FROM role");
 }

 // Create a new role
 createRole(role){
 return this.connection.query("INSERT INTO role SET ?", role);
 }
 
 // Remove a role from the db
 deleteRole(roleId){
 return this.connection.query(
 "DELETE FROM role WHERE id = ?",
 roleId
 );
 }
 
 //find all departments
 findAllDepartments(){
 return this.connection.query("SELECT * FROM department ORDER BY id ASC");
 }

 //View employees by departent
 findEmployeesByDepartment(department_id){
 return this.connection.query(`SELECT department.id, department.name, role.title, employee.first_name, employee.last_name 
 FROM employee 
 LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id 
 WHERE department.id = ?`, 
 [department_id]);
 }

 // Create a new department
 createDepartment(department){
 console.log("INSERT INTO department SET ?", department);
 return this.connection.query("INSERT INTO department SET ?", department);
 }

 // Remove a department
 removeDepartment(department_id){
 return this.connection.query('DELETE FROM department WHERE id = ?', department_id)
 }

 //Find all managers
 findAllManagers(){
 return this.connection.query(`SELECT employee.manager_id, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee left join employee manager on manager.id = employee.manager_id GROUP BY manager.id;`);
 }

 findUnderlings(manager_id){
 return this.connection.query("SELECT first_name, last_name FROM employee WHERE manager_id is not null and manager_id = ?", manager_id);
 }
}
module.exports = new DB(connection);
