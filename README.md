Task Management

The Task management is an application that has been designed as part of assignment that follows CRUD operation of tasks (create, read, delete, update) and other functions like filter, sorting, searching authentication etc.

Instructions:

Login to the application using Google Authentication.
Page opens with all your existing tasks will open. In case of no tasks it will appear blank .
Click on Add Task and fill all the details and click on Create for new task creation. Attachments can be updated here .
Click on three dots of the last column , click on edit and click on Update after updating the info. For updating attachment , you can delete or add the attachments required
For deleting task, select the Delete button from the list .
For mass delete and Status update, select the rows which you want to perform the operation and click on Delete for mass Delete and Status for status update.
You can drag within the Task category as well as across the task categories. You have to simply hold the row and put it in the category which you want , it will update automatically.
You can switch between List View and Board Kanban View to Perform tasks.


Features:

CRUD operations : User can create,read , update, and delete his/her task.
Drag and drop : User can drag and drop his/her task within the categories upon his/her convenience.
Batch call for delete and status update: User can select multiple rows and do mass delete of records and update for status .
Filter, Sorting and Search: Searching is enabled for Task name, Filter can be done on the basis of Category, Sorting is based on due date.
Firebase cloud: FIrebase cloud is utilised for Storing of the tasks .
Cloudinary: It is a third party storage service storing files. 


Challenges:

Firebase Storage : Due to movement of firebase storage into base plan , There was no methodology to upload files in Firebase. That’s where Cloudinary comes into play.
Drag and drop: Drag and drop between categories was a challenging one as till the last only functionality within compartments was going on. It involved change in code base to implement the functionality. Even buttons within functionality were not clickable.
Query management: More than one query was not allowing to do search, filter and sort.
Responsive Design: Responsive features were different from the web version, some new feature also implemented 


Github url : Task Management- Github
Application url:
Firebase: Firebase - Task Management
