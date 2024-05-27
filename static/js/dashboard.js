document.addEventListener('DOMContentLoaded', function () {
    const addTodoForm = document.getElementById('add-todo-form');
    const editTodoForm = document.getElementById('edit-todo-form');
    const taskList = document.getElementById('today-tasks');
    const upcomingtaskList = document.getElementById('upcoming-tasks');
    const usernameSpan = document.getElementById('username');
    const token = localStorage.getItem('token');
    const logoutButton = document.getElementById('logout-btn');
  
    if (token) {
      // If token is present, fetch user email information from server
      fetch('/api/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        // Update username span with user's email
        usernameSpan.textContent = data.email;
      })
      .catch(error => console.error('Error:', error));
    }
    
    

// Add an event listener to the logout button
logoutButton.addEventListener('click', async () => {
  try {
    const token = localStorage.getItem('token');

    // Send a request to the logout route on the server
    const response = await fetch('/api/auth/logout', {
      method: 'GET',
      headers: {
        'x-auth-token': token,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to logout');
    }

    // Clear the token from localStorage
    localStorage.removeItem('token');

    // Redirect the user to the login page
    window.location.href = '/'; // Assuming your login page URL is '/login'

  } catch (error) {
    console.error('Error:', error);
    // Handle error if necessary
  }
});

    addTodoForm.addEventListener('submit', async function (event) {
      event.preventDefault();
  
      // Get task details from the form
      const taskTitle = document.getElementById('task-title').value;
      const startDate = document.getElementById('start-date').value;
      const endDate = document.getElementById('end-date').value;
      const description = document.getElementById('description').value;
      const priority = document.getElementById('priority').value;
      const status = document.getElementById('status').value;
  
      const token = localStorage.getItem('token');
  
      try {
        // Send task data to the server
        const response = await fetch('/api/tasks', {
          method: 'POST',
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            taskTitle,
            startDate,
            endDate,
            description,
            priority,
            status
          })
        });
  
        if (!response.ok) {
          throw new Error('Failed to add task');
        }
  
        // Extract the newly added task data from the response
        const responseData = await response.json();
        const newTask = responseData.task; // Assuming the server returns the newly added task
  
        // Clear form fields after successful submission
        addTodoForm.reset();
  
        // Add the newly added task to the appropriate task list
        addTaskToList(newTask);
  
      } catch (error) {
        console.error('Error:', error);
      }
    });
  

        // Assuming you have a submit event listener for the edit form
    editTodoForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        // Get taskId from somewhere, e.g., from a hidden input field in the form
        const taskId = document.getElementById('task-id').value;

        // Collect task data from form fields
        const taskData = {
            taskTitle: document.getElementById('edit-task-title').value,
            startDate: document.getElementById('edit-start-date').value,
            endDate: document.getElementById('edit-end-date').value,
            description: document.getElementById('edit-description').value,
            priority: document.getElementById('edit-priority').value,
            status: document.getElementById('edit-status').value
        };

        // Send the task data to the server
        await sendEditTaskData(taskId, taskData);
    });


    // Function to fetch tasks and update UI
    async function fetchTasks() {
      try {
        const token = localStorage.getItem('token');
  
        // Fetch tasks from the server
        const response = await fetch('/api/tasks', {
          headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
  
        // Parse response JSON
        const tasks = await response.json();
  
        // Clear existing tasks
        taskList.innerHTML = '';
        upcomingtaskList.innerHTML = '';
  
        // Add the fetched tasks to the appropriate task list
        tasks.forEach(task => {
          addTaskToList(task);
        });
  
      } catch (error) {
        console.error('Error:', error);
      }
    }
  
    // Function to add a task to the appropriate task list
    function addTaskToList(task) {
      const newTaskElement = document.createElement('li');
      newTaskElement.id = task._id;
      newTaskElement.classList.add('task-card');
  
      const taskContent = document.createElement('div');
      taskContent.classList.add('task-content');
  
      const taskName = document.createElement('h3');
      taskName.textContent = task.taskTitle;
  
      const startDatePara = document.createElement('p');
      startDatePara.textContent = `Start Date: ${task.startDate}`;
  
      const endDatePara = document.createElement('p');
      endDatePara.textContent = `End Date: ${task.endDate}`;
  
      const descriptionPara = document.createElement('p');
      descriptionPara.textContent = `Description: ${task.description}`;
  
      const priorityPara = document.createElement('p');
      priorityPara.textContent = `Priority: ${task.priority}`;
  
      const statusPara = document.createElement('p');
      statusPara.textContent = `Status: ${task.status}`;
  
      taskContent.appendChild(taskName);
      taskContent.appendChild(startDatePara);
      taskContent.appendChild(endDatePara);
      taskContent.appendChild(descriptionPara);
      taskContent.appendChild(priorityPara);
      taskContent.appendChild(statusPara);
  
      const taskButtons = document.createElement('div');
      taskButtons.classList.add('task-buttons');
  
      const editButton = document.createElement('button');
      editButton.classList.add('edit-btn');
      editButton.textContent = 'Edit';
  
      const deleteButton = document.createElement('button');
      deleteButton.classList.add('delete-btn');
      deleteButton.textContent = 'Delete';
    
      taskButtons.appendChild(editButton);
      taskButtons.appendChild(deleteButton);
        
      deleteButton.addEventListener('click', async () => {
        try {
            const taskId = deleteButton.parentElement.parentElement.id; // Get the ID of the parent li element
    
            // Send the task ID to the server for deletion
            const response = await fetch(`/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token':token,
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to delete task');
            }
    
            // Remove the task from the UI
            deleteButton.parentElement.parentElement.remove();
        } catch (error) {
            console.error('Error:', error);
        }
    });
    
    editButton.addEventListener('click', () => {
        try {
            // Get the parent li element of the edit button
            const taskCard = editButton.parentElement.parentElement;
            const taskid = taskCard.id;
            // Extract task details from the task card
            const taskTitle = taskCard.querySelector('.task-content h3').textContent;
            const startDate = taskCard.querySelector('.task-content p:nth-child(2)').textContent.replace('Start Date: ', '');
            const endDate = taskCard.querySelector('.task-content p:nth-child(3)').textContent.replace('End Date: ', '');
            const description = taskCard.querySelector('.task-content p:nth-child(4)').textContent.replace('Description: ', '');
            const priority = taskCard.querySelector('.task-content p:nth-child(5)').textContent.replace('Priority: ', '');
            const status = taskCard.querySelector('.task-content p:nth-child(6)').textContent.replace('Status: ', '');
    
            toggleEditformPopup();
            document.getElementById('task-id').style.visibility = 'hidden';
            // Populate the form fields with the extracted task details
             document.getElementById('task-id').value = taskid
             document.getElementById('edit-task-title').value = taskTitle
             document.getElementById('edit-start-date').value = startDate
             document.getElementById('edit-end-date').value = endDate
             document.getElementById('edit-description').value = description
             document.getElementById('edit-priority').value = priority
             document.getElementById('edit-status').value = status
            
            


        } catch (error) {
            console.error('Error:', error);
        }
    });
    

      newTaskElement.appendChild(taskContent);
      newTaskElement.appendChild(taskButtons);
  
      // Check if the end date is today or earlier
      const today = new Date();
      const taskEndDate = new Date(task.endDate);
      if (taskEndDate <= today) {
        // Add the task to the 'today' tasks list
        taskList.appendChild(newTaskElement);
      } else {
        // Add the task to the 'upcoming' tasks list
        upcomingtaskList.appendChild(newTaskElement);
      }
    }
  
    // Fetch tasks when the page loads
    fetchTasks();
  });
  
  async function sendEditTaskData(taskId, taskData) {
    try {
        const token = localStorage.getItem('token');
        
        // Send task data to the server
        const response = await fetch(`/api/tasks/edit/${taskId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        // Handle successful response
        const responseData = await response.json();
        console.log(responseData); // Optionally handle the response from the server
        
        // Perform any additional actions after updating the task, if needed

    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
}

  function toggleFormPopup() {
    const popup = document.getElementById('add-todo-form-popup');
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';
  }

  function toggleEditformPopup(){
    const popup = document.getElementById('edit-todo-form-popup');
    popup.style.display = popup.style.display === 'none' ? 'block' : 'none';

    
  }
  

  async function sendEditTaskData(taskId, taskData) {
    try {
        const taskcard = document.getElementById(taskId);
        const token = localStorage.getItem('token');
        
        // Send task data to the server
        const response = await fetch(`/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error('Failed to update task');
        }

        // Handle successful response
        const responseData = await response.json();
        console.log(responseData); // Optionally handle the response from the server
        
        taskcard.querySelector('.task-content h3').textContent = taskData.taskTitle;
        taskcard.querySelector('.task-content p:nth-child(2)').textContent = `Start Date: ${taskData.startDate}`
        taskcard.querySelector('.task-content p:nth-child(3)').textContent = `End Date: ${taskData.endDate}`;
        taskcard.querySelector('.task-content p:nth-child(4)').textContent = `Description: ${taskData.description}`;
        taskcard.querySelector('.task-content p:nth-child(5)').textContent = `Priority: ${taskData.priority}`;
        taskcard.querySelector('.task-content p:nth-child(6)').textContent = `Status: ${taskData.status}`;
        
        
    } catch (error) {
        console.error('Error:', error);
        // Handle error
    }
}




