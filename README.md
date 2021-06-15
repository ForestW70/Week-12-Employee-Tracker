# Forest Wilson - Homework 12 - Employee Tracker
For Good.


## Table of Contents:
- [Project description](#project-description)
- [Usage instructions](#usage-instructions)
- [Project installation](#project-installation)
- [Additional comments](#additional-comments)
- [Contribution information](#contribution-information)
- [Questions](#questions-or-concerns)


### About This Project
* # Project description:
  Are you a blossoming business man who wants to keep a better inventory of your employees? Welcome to Employee tracker, your one stop shop for keeping track and managing all of your employees and their information. Here you may view all of your employees, add and remove employees, update employee's information, add and remove departments, and view your total budget.
  

* # Usage instructions
  Start the app, and proceed through the menus to your desire. "view all" will display all of your current employees, refreshed after every action.
  

* # Project installation
  1. npm i,
  2. npm run seed - if you would like to start with employees,
  3. npm run start,
  4. enjoy.
 

* # Additional comments
  - This project took a lot longer than expected. I saw it was another inquirer and thought it would be a breeze, but the mysql side of things made this a lot harder. Even with inquirer knowledge, it was hard for me to plan the input logic behind the many functions we needed to implement.

  - I would have liked to be more consistent with my approach with this project, but every function i created showed me a better or different way to do something, so there are many differing formats I used through the script. In the future i would like to plan ahead and find what format I should use for everything. (eg. all forms of throw err I used or different approaches to queries and action functions.)

  - I had trouble figuring out the best way to format the console.log/table outputs in the console, specifically where my next prompt would not cover up the previous functions output. I couldnt quite figure out how to fix this, so all returned values are surrounded by "\n"

  - The logic behind the joins for the three tables also took me a while to figure out. especially when it came to creating new departments.

  - regex function taken from stackoverflow (ln: 550). hopefully when i get to that hw I will better understand what its doing lol.

  - One thing I really wanted to add was the display of who is a manager and who manages which employee. I used a colomn "has_boss" to match up with the colomn "manager_id" which would only have a value if they were a manager of that department, however I couldnt figure out how to assosiate values inside one table. I also couldnt figure out how i can add manager as a persons role while also keeping their department info. this one really frusterated me.

  - For some reason I couldnt not get insterting NULL to work with my mysql queries, so the only time you can have an employee with no manager is if you remove the department.

  - During the demo vid I noticed that deleting the department resulted in the employee being deleted as well. Ususally what happened was the employee would persist but would have NULL in all job related fields. I'm not sure if this was a bug with my queries or if it is a bug with the console.table/log displaying in the console (explained above).



#### Contribution information 
- Wanna collaborate? Hit the line.


###### Questions or concerns? 
* Please contact me at one of the following!
  - Email - hexaforest@gmail.com
  - gitHub - https://github.com/ForestW70/


# Extras
* Screenshots:
  ![App demo screen](./assets/images/app-demo-page.png)

* Demo:
  [App demo video](https://youtu.be/x-xalO1bMd8)

* Links:
  [Repo page](https://github.com/ForestW70/hw12employeetracker)
  