# Employee-Tracker

## Links to project

[GitHub Repository](https://github.com/svivoli/Employee-Tracker)

## Instructions

// Update password
1 In the 'app.js' file change the password on line 15 to your MySQL password.  
// Initialize database in MySQL  
Method 1:  
1 With Terminal pointing toward the project's directory, input the following command:  
```sh
mysql -u root -p schema.sql
```
2 Enter your MySQL password when prompted.  
3 Input the following command:  
```sh
mysql -u root -p seeds.sql
```
4 Enter your MySQL password when prompted.    
The database should now be loaded in MySQL.   
Method 2:  
1 Copy the contents of the 'schema.sql' file and paste them into a new query in MySQL.  
2 Run the query.  
3 Copy the contents of the 'seeds.sql' file and paste them into MySQL.  
4 Run the query.  
The database should now be loaded in MySQL.  
// Run the application  
1 With Terminal pointing toward the project's directory, input the following command:  
```sh
node app.js
```
2 A menu of options will appear after the question "What would you like to do?". Use the arrow keys to scroll through the options and press enter once you have selected one.  
3 For menu options that prompt you for information, type or select your answer and press enter. Other options may simply display tables and information.  
* A short menu appears after each operation through which you can select to return to the menu or exit.
4 Share and Enjoy!  

## Description

A command-line application that allows users to track employee information. The user is able to view, add, delete, and update data from the command line by selecting from various menu options. This is a useful organizational tool for employees as they can easily track and make changes to an important database of company information.

### Node Modules

1. MySQL
2. Inqurier
3. Chalk

### Application Components

1. Fancy console title upon app start and exit
2. 15 menu options
- Add department, role, employee
- View departments, roles, employees, employees by department, employees by manager
- Update role, employee's manager, employee
- View the total utilized budget of a department (combined salaries)
- Delete department, role, employee
3. Prompts
4. Console.table used to display tables

## Developer Experience

I found this project to be involved but it came easily after my exposure to MySQL in class. The code is a bit lengthy and some functions have nested queries that seem cumbersome and less than concise. I would like to try rebuilding the application using promises to see if the code would be a little cleaner. I found that the console does not always display things properly, despite a working code (the menu displays twice, or things overlap), which was a bit of an annoyance. Another project that showcases the functionality of command-line applications and node.

--Sarah Vivoli
