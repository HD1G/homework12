const { prompt } = require("inquirer");
const logo = require("asciiart-logo");
const db = require("./db");
require("console.table");

init();

// Display logo text, load main prompts
function init() {
  const logoText = logo({ name: "Employee Manager" }).render();

  console.log(logoText);

  loadMainPrompts();
}

async function loadMainPrompts() {
  const { choice } = await prompt([
    {
      type: "list",
      name: "choice",
      message: "What would you like to do?",
      choices: [
        {
          name: "View All Employees",
          value: "VIEW_EMPLOYEES"
        },

        {
          name: "Add Employee",
          value: "ADD_EMPLOYEE"
        },
        {
          name: "Remove Employee",
          value: "REMOVE_EMPLOYEE"
        },
        {
          name: "Update Employee Role",
          value: "UPDATE_EMPLOYEE_ROLE"
        },
        {
          name: "Update Employee Manager",
          value: "UPDATE_EMPLOYEE_MANAGER"
          },
        {
          name: "View Roles",
          value: "View_Roles"
        },
        {
          name: "Add Role",
          value: "Add_Role"
        },
        {
          name: "Remove Role",
          value: "Remove_Role"
        },
        {
          name: "Create Department",
          value: "Create_Department"
        },
        {
          name: "Remove Department",
          value: "Remove_Department"
        },
        {
          name: "Find Employees By Department",
          value: "Find_Employees_By_Department"
        },
        {
          name: "Find Employees By Manager",
          value: "Find_Employees_By_Manager"
        },

        {
          name: "Quit",
          value: "QUIT"
        }
      ]
    }
  ]);

  // Call the appropriate function depending on what the user chose
  switch (choice) {
    case "VIEW_EMPLOYEES":
      return viewEmployees();
    case "ADD_EMPLOYEE":
      return addEmployee();
    case "REMOVE_EMPLOYEE":
      return removeEmployee();
    case "UPDATE_EMPLOYEE_ROLE":
      return updateEmployeeRole();
    case "UPDATE_EMPLOYEE_MANAGER":
      return updateEmployeeManager();
    case "VIEW_ROLES":
      return viewRoles();
    case "ADD_ROLE":
      return addRole();
    case "REMOVE_ROLE":
       return removeRole();
    case "CREATE_DEPARTMENT":
       return createDepartment();
    case "REMOVE_DEPARTMENT":
       return removeDepartment();
    case "FIND_EMPLOYEES_BY_DEPARTMENT":
       return findEmployeesByDepartment(); 
    case "FIND_EMPLOYEES_BY_MANAGER":
       return findEmployeesByManager(); 
  
 
    default:
      return quit();
  }
}
//View Employees
async function viewEmployees() {
  const employees = await db.findAllEmployees();

  console.log("\n");
  console.table(employees);

  loadMainPrompts();
}
//Add Employee
async function addEmployee() {
  const roles = await db.findAllRoles();
  const employees = await db.findAllEmployees();

  const employee = await prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?"
    },
    {
      name: "last_name",
      message: "What is the employee's last name?"
    }
  ]);

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt({
    type: "list",
    name: "roleId",
    message: "What is the employee's role?",
    choices: roleChoices
  });

  employee.role_id = roleId;

  const managerChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));
  managerChoices.unshift({ name: "None", value: null });

  const { managerId } = await prompt({
    type: "list",
    name: "managerId",
    message: "Who is the employee's manager?",
    choices: managerChoices
  });

  employee.manager_id = managerId;

  await db.createEmployee(employee);

  console.log(
    `Added ${employee.first_name} ${employee.last_name} to the database`
  );

  loadMainPrompts();
}
//Remove Employee
async function removeEmployee() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee do you want to remove?",
      choices: employeeChoices
    }
  ]);

  await db.removeEmployee(employeeId);

  console.log("Removed employee from the database");

  loadMainPrompts();
}
//Update Employee Role
async function updateEmployeeRole() {
  const employees = await db.findAllEmployees();

  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
    name: `${first_name} ${last_name}`,
    value: id
  }));

  const { employeeId } = await prompt([
    {
      type: "list",
      name: "employeeId",
      message: "Which employee's role do you want to update?",
      choices: employeeChoices
    }
  ]);

  const roles = await db.findAllRoles();

  const roleChoices = roles.map(({ id, title }) => ({
    name: title,
    value: id
  }));

  const { roleId } = await prompt([
    {
      type: "list",
      name: "roleId",
      message: "Which role do you want to assign the selected employee?",
      choices: roleChoices
    }
  ]);

  await db.updateEmployeeRole(employeeId, roleId);

  console.log("Updated employee's role");

  loadMainPrompts();
}

//Create updateEmployeeManager function
async function updateEmployeeManager(){
  const employees = await db.findAllEmployees();
 
  const employeeChoices = employees.map(({ id, first_name, last_name }) => ({
  name: `${first_name} ${last_name}`,
  value: id
  }));
 
  const { employeeId } = await prompt([
  {
  type: "list",
  name: "employeeId",
  message: "Which employee needs to update their manager?",
  choices: employeeChoices
  }
  ]);
  const {managerId} = await prompt([
  {
  type: "list",
  name:"managerId",
  message: "Pick a manager.",
  validate: function deleter(employeeId){
  
  },
  choices: employeeChoices
  }
  ]);
  await db.updateEmployeeManager(employeeId, managerId);
  console.log("\n");
  console.log("Manager updated");
  loadMainPrompts();
 }

//Create viewRoles function
async function viewRoles(){
  var result = await db.findAllRoles();
  console.table(result);
  loadMainPrompts();
 }

 //Create addRole function
async function addRole(){
  const role = await prompt([
  {
  type: "input",
  name: "title",
  message: "What is the new role?"
  }
  ])
  const {salary} = await prompt([
  {
  type: "input",
  name: "salary",
  message: "How much is the new salary?",
  validate: function validateId(salary) {
  var isValid = !Number.isNaN(parseInt(salary));
  return isValid || "The salary must be a number!";
  }
  }
  ])
  role.salary = parseInt(salary);
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({id, name}) => ({
  name: name,
  value: id
  }));
  const {departmentId} = await prompt([
  {
  type: "list",
  name: "departmentId",
  message: "What department needs this new role?",
  choices: departmentChoices
  }]);
  role.department_id = departmentId;
  await db.addRole(role);
  console.log("\n");
  loadMainPrompts();
}

//Create removeRole function
async function removeRole(){
  const roles = await db.findAllRoles();
  const roleChoices = roles.map(({ id, title }) => ({
  name: title,
  value: id
  }));
 
  const { roleId } = await prompt([
  {
  type: "list",
  name: "roleId",
  message: "Which role do you want to remove?",
  choices: roleChoices
  }
  ]);
  await db.deleteRole(roleId);
  console.log("\n");
  console.log("Role Removed!");
  loadMainPrompts();
 }

 //Create addDepartment function
async function createDepartment(){
  const department = await prompt([
  {
  type: "input",
  name: "name",
  message: "What is the new department?"
  }
  ])
  await db.createDepartment(department);
  console.log("\n");
  console.log(department.name +" has been added!")
  loadMainPrompts();
 }

 //Create removeDepartment function
 async function removeDepartment(){
  const departments = await db.findAllDepartments();
  const departmentChoices = departments.map(({id, name}) => ({
  name: name,
  value: id
  }));
  const {departmentId} = await prompt([
  {
  type: "list",
  name: "departmentId",
  message: "What department would you like to remove?",
  choices: departmentChoices
  }]);
  console.log('\n');
  await db.removeDepartment(departmentId);
  loadMainPrompts();
  }

//Create viewEmployeesByDepartment function
async function findEmployeesByDepartment(){
  const department = await db.findAllDepartments();
 
  const departmentChoices = department.map(({id, name}) => ({
  name: name,
  value: id
  }));
  const {departmentId} = await prompt([
  {
  type: "list",
  name: "departmentId",
  message: "What department would you like to see?",
  choices: departmentChoices
  }
 ])
 const result = await db.viewEmployeesByDepartment(departmentId)
  console.log("\n");
  console.table(result);
  loadMainPrompts();
 }
//Create videEmployeesByManager function
async function findEmployeesByManager(){
  const managers = await db.findAllManagers();
  const managerChoices = managers.map(({manager, manager_id}) => ({
  name: manager,
  value: manager_id
  }));
  for(let i = 0; i < managerChoices.length; i++){
  if (managerChoices[i].name == null){
  managerChoices.splice(i,1);
  }
  }
  const {managerId} = await prompt([
  {
  type: "list",
  name: "managerId",
  message: "Select a manager to view their employees.",
  choices: managerChoices
  }
  ]);
  console.log(managerChoices);
  var result = await db.findUnderlings(managerId);
  console.log("\n")
  console.table(result)
  loadMainPrompts();
 }


function quit() {
  console.log("Goodbye!");
  process.exit();
}
