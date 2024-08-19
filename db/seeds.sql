INSERT INTO
    department (name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

INSERT INTO
    role (title, salary, department)
VALUES
    ('Sales Lead', 100000, 1),
    ('Salesperson', 80000, 1),
    ('Lead Engineer', 150000, 2),
    ('Software Engineer', 120000, 2),
    ('Account Manager', 160000, 3),
    ('Accountant', 125000, 3),
    ('Legal Team Lead', 250000, 4),
    ('Lawyer', 190000, 4);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ('John', 'Doe', 1,NULL),
    ('Mike', 'Chan', 2, 1),
    ('Ashley', 'Rodriguez', 3,NULL),
    ('Kevin', 'Tupik', 4, 3),
    ('Kunal', 'Singh', 5,NULL),
    ('Malia', 'Brown', 6, 5),
    ('Sarah', 'Lourd', 7,NULL),
    ('Tom', 'Allen', 8, 7)
;

-- SELECT id, first_name, last_name FROM employee LEFT JOIN employee.first_name ON manager_id = id;

-- SELECT movies.movie_name AS movie, reviews.review FROM reviews LEFT JOIN movies ON reviews.movie_id = movies.id ORDER BY movies.movie_name;

-- SELECT role.title AS title, employee.first_name FROM employee LEFT JOIN role ON employee.role_id = role.id ORDER BY employee.first_name;

-- SELECT * FROM role LEFT JOIN employee ON employee.role_id = role.id;

-- SELECT * FROM role FULL JOIN employee ON employee.role_id = role.id;

-- SELECT * FROM employee FULL JOIN role ON role.id = employee.role_id;

-- SELECT id, first_name, last_name FROM employee FULL JOIN (role.title FULL JOIN (department.name ON department.id = role.department) role.salary) FROM role ON role.id = employee.role_id;

-- SELECT id AND first_name AND last_name FROM employee FULL JOIN role ON role.id = employee.role_id;

-- SELECT id, first_name, last_name FROM employee;

-- SELECT id, first_name, last_name FROM employee FULL JOIN role ON role.id = employee.role_id;

-- SELECT id, first_name, last_name FROM employee 
-- SELECT employee.id, first_name, last_name, role.title AS title, department.name AS department, role.salary AS salary, 

-- SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT (m.first_name, ' ', m.last_name) as manager FROM employee e JOIN role r ON e.role_id = r.id JOIN department d ON r.department = d.id LEFT JOIN employee m ON e.manager_id = m.id;