import inquirer from "inquirer";
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

class Cli {
    async makeSelection(): Promise<void> {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name: 'action',
                    message: 'What would you like to do?',
                    choices: [
                        'View All Employees',
                        'Add Employee',
                        'Update Employee Role',
                        'View All Roles',
                        'Add Role',
                        'View All Departments',
                        'Add Department',
                        'Quit',
                    ],
                },
            ])
            .then((answers) => {
                if (answers.action === 'View All Emplpoyees') {
                    const sql = 'SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT (m.first_name, " ", m.last_name) as manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department = d.id LEFT JOIN employee m ON e.manager_id = m.id;';
                    pool.query(sql, (err: Error, result: QueryResult) => {
                        if (err) {
                            console.log({ error: err.message });
                            return result;
                        }
                    })
                } else if (answers.action === 'Add Employee') {

                    this.addEmployee()

                } else if (answers.action === 'Update Employee Role') {

                    this.updateEmployee()

                } else if (answers.action === 'View All Roles') {
                    const sql = 'SELECT role.id, title, department.name AS department, salary FROM role JOIN department ON department.id = role.department;';
                    pool.query(sql, (err: Error, result: QueryResult) => {
                        if (err) {
                            console.log({ error: err.message });
                            return result;
                        }
                    })
                } else if (answers.action === 'Add Role') {
                    this.addRole()
                } else if (answers.action === 'View All Departments') {
                    const sql = 'SELECT * FROM department';
                    pool.query(sql, (err: Error, result: QueryResult) => {
                        if (err) {
                            console.log({ error: err.message });
                            return result;
                        }
                    })
                } else if (answers.action === 'Add Department') {
                    this.addDepartment()
                } else {
                    pool.query('/q')
                }
            })
    }
   async addEmployee (): Promise<void> {
        const roles = await pool.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(row => row.title);
        const employees = await pool.query('SELECT * FROM employee');
        const managers = await employees.rows;
        const managerChoices = managers.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }))
        managerChoices.unshift({name: 'None', value: null})

        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'employeeFirstName',
                    message: "What is employee's first name?",
                }
            {
                    type: 'input',
                    name: 'employeeLastName',
                    message: "What is the employee's last name?",
                }
    {
                    type: 'list',
                    name: 'employeeRole',
                    message: "What is the employee's role?",
                    choices: roleChoices
                }
                {
                    type: 'list',
                    name: 'employeeManager',
                    message: "Who is the employee's manager?",
                    choices: managerChoices
                }
            ]).then(async (answers: any) => {
                const selectedRole = answers.employeeRole;
                const role = roles.rows.find(row => row.name === selectedRole);
                if (role) {
                    const roleId = role.id;
                    const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)`;
                    pool.query(sql, [answers.employeeFirstName, answers.employeeLastName, Number(roleId), answers.employeeManager.value], (err: Error, result: QueryResult) => {
                        if (err) {
                            console.log({ error: err.message });
                            return result;
                        }
                    })
                };
            })
    }
    async updateEmployee (): Promise<void> {
        const employeesQuery = await pool.query('SELECT * FROM employee');
        const employees = await employeesQuery.rows;
        const employeeChoices = employees.map(emp => ({
            name: `${emp.first_name} ${emp.last_name}`,
            value: emp.id
        }))
        const roles = await pool.query('SELECT * FROM role');
        const roleChoices = roles.rows.map(row => row.title);
        inquirer.prompt([{
            type: 'list',
            name: 'employeeSelect',
            message: "Which employee's role do you want to update?",
            choices: employeeChoices
        }
        {
            type: 'list',
            name: 'employeeRole',
            message: "Which role do you want to assign the selected employee?",
            choices: roleChoices
        }
    ]).then(async (answers: any) => {
        const selectedRole = answers.employeeRole;
        const role = roles.rows.find(row => row.title === selectedRole);
        const selectedEmployee = answers.employeeSelect;
        const [firstName, lastName] = selectedEmployee.split(' ');
        const employeeFirstName = {firstName}
        const employeeLastName = {lastName}
        const employee = employeesQuery.rows.find(row => row.first_name === employeeFirstName && row.last_name === employeeLastName)
        if (role && employee) {
            const roleId = role.id;
            const employeeId = employee.id;
            const sql = 'UPDATE employee SET role_id = $1 WHERE id = $2';
            pool.query(sql, [roleId, employeeId], (err: Error, result: QueryResult) => {
                if (err) {
                    console.log({ error: err.message });
                    return result;
                }
            })
        };
    })
    }
   async addRole(): Promise<void> {
        const departments = await pool.query('SELECT * FROM department');
        const departmentChoices = departments.rows.map(row => row.name)
        inquirer.prompt([
            {
                type: 'input',
                name: 'roleTitle',
                message: 'What is the name of the role?',
            }
        {
                type: 'input',
                name: 'roleSalary',
                message: 'What is the salary for the role?',
            }
        {
                type: 'list',
                name: 'roleDepartment',
                message: 'Which department does the role belong to?',
                choices: departmentChoices
            }
        ])
            .then(async (answers: any) => {
                const selectedDepartment = answers.roleDeparment;
                const department = departments.rows.find(row => row.name === selectedDepartment);
                if (department) {
                    const departmentId = department.id;
                    const sql = `INSERT INTO role (title, salary, department) VALUES ($1, $2, $3)`;
                    pool.query(sql, [answers.roleTitle, Number(answers.roleSalary), Number(departmentId)], (err: Error, result: QueryResult) => {
                        if (err) {
                            console.log({ error: err.message });
                            return result;
                        }
                    })
                };
            })
    }
    async addDepartment(): Promise<void> {
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'departmentName',
                    message: 'What is the name of the department?',
                }
            ])
            .then((answers: any) => {
                const sql = `INSERT INTO department (name) VALUES ($1)`;
                pool.query(sql, [answers.departmentName], (err: Error, result: QueryResult) => {
                    if (err) {
                        console.log({ error: err.message });
                        return result;
                    }
                });
            })
    }


}

