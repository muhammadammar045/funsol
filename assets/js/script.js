// Wait for the DOM content to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function () {
    // Get the form element by its ID
    // Select the form element by its ID
    const form = document.getElementById('user-form');

    // Add event listener for form submission
    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent default form submission behavior

        // Create FormData object to store form data
        const formData = new FormData();

        // Append form field values to the FormData object
        formData.append('address[city]', form.querySelector('#city').value);
        formData.append('firstName', form.querySelector('#firstName').value);
        formData.append('gender', form.querySelector('#gender').value);
        formData.append('age', parseInt(form.querySelector('#age').value));
        formData.append('birthDate', form.querySelector('#birthDate').value);
        formData.append('image', form.querySelector('#image').value);

        // Create XMLHttpRequest object
        const xhr = new XMLHttpRequest();

        // Open a POST request to the specified URL
        xhr.open('POST', 'https://dummyjson.com/users/add');

        // Define onload event handler for successful request
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Parse response JSON
                const response = JSON.parse(xhr.responseText);
                // Log success message
                console.log("User Added successful:", response);
                // Display success alert
                showAlert("User Added Successfully", "success");
                // Append user data to table
                appendUserToTable(response);
                // Hide modal and reset form
                $('#exampleModal').modal('hide');
                form.reset();
            } else {
                // Parse error message from response JSON
                const errorMessage = JSON.parse(xhr.responseText).error;
                // Display error alert
                showAlert(errorMessage, "danger");
                // Log error message
                console.error("User Not Uploaded Error:", errorMessage);
            }
        };
        xhr.onerror = function () {
            // Display error alert for network error
            showAlert("Network Error", "danger");
            // Log network error message
            console.error("Network Error: Failed to upload user data.");
        }

        xhr.send(formData);
    });

    function showAlert(message, type) {
        const alertContainer = document.getElementById('alert-container');

        const alertElement = document.createElement('div');
        alertElement.classList.add('alert', 'alert-dismissible', 'fade', 'show');
        alertElement.setAttribute('role', 'alert');
        alertElement.style.display = 'block';

        if (type === 'success') {
            alertElement.classList.add('alert-success');
        } else if (type === 'danger') {
            alertElement.classList.add('alert-danger');
        }

        const messageElement = document.createElement('span');
        messageElement.id = 'alert-message';
        messageElement.textContent = message;

        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.classList.add('btn-close');
        closeButton.setAttribute('data-bs-dismiss', 'alert');
        closeButton.setAttribute('aria-label', 'Close');

        alertElement.appendChild(messageElement);
        alertElement.appendChild(closeButton);

        alertContainer.appendChild(alertElement);
    }

    // Function to fetch data from API
    function fetchDataFromApi(query = '') {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `https://dummyjson.com/users/search?q=${query}&limit=5`);
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Parse response JSON
                const response = JSON.parse(xhr.responseText);
                // Log received data
                console.log("Data received:", response.users);
                // Display data in table
                displayData(response.users);
                // Clear existing events
                clearEvents();
                // Append each event to the table
                response.users.forEach(user => {
                    appendEventToTable(user);
                });
            } else {
                // Log error message
                console.error("Error:", xhr.responseText);
            }
        };
        xhr.onerror = function () {
            // Log error message
            console.error("Error:", xhr.responseText);
        };
        xhr.send();
    }

    // Function to clear events from table
    function clearEvents() {
        let eventsTable = document.getElementById('events');
        eventsTable.innerHTML = '';
    }

    // Function to append an event to the table
    function appendEventToTable(user) {
        let eventsTable = document.getElementById('events');
        let eventName = document.createElement('h6');
        eventName.classList.add('py-2', 'px-4', 'links');
        eventName.innerHTML = `<a href="" class="text-decoration-none text-secondary">${user.firstName}</a>`;
        eventsTable.appendChild(eventName);
    }

    // Function to display data in the table
    function displayData(users) {
        let tableBody = document.getElementById('table-body');
        tableBody.innerHTML = '';
        users.forEach(user => {
            appendUserToTable(user);
        });
    }

    // Function to append a user to the table
    function appendUserToTable(user) {
        let tableBody = document.getElementById('table-body');
        let row = document.createElement('tr');
        row.innerHTML = `
            <th scope="row">${user.firstName}</th>
            <td>${user.address.city}</td>
            <td>${user.gender}</td>
            <td>${user.age}</td>
            <td>${user.birthDate}</td>
        `;
        tableBody.appendChild(row);

        let events = document.getElementById('events');
        let eventName = document.createElement('h6');
        eventName.classList.add('py-2', 'px-4', 'links');
        eventName.innerHTML = `<a href="" class="text-decoration-none text-secondary">${user.firstName}</a>`;
        events.appendChild(eventName);
    }

    // Event listener for search input
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', function () {
        const query = this.value.trim();
        fetchDataFromApi(query);
    });

    // Fetch data from API on page load
    fetchDataFromApi();
});
