// ==========================================
// EventEase - College Event Registration
// ==========================================


// Array to store registration records
let registrations = [];


// Get elements from HTML
const registrationForm = document.getElementById("registrationForm");
const registrationTable = document.getElementById("registrationTable");
const registrationCount = document.getElementById("registrationCount");
const messageBox = document.getElementById("messageBox");
const searchInput = document.getElementById("searchInput");
const filterEvent = document.getElementById("filterEvent");
const emptyMessage = document.getElementById("emptyMessage");


// ==========================================
// Load saved registrations
// ==========================================

const savedRegistrations = localStorage.getItem("eventEaseRegistrations");

if (savedRegistrations) {

    registrations = JSON.parse(savedRegistrations);

}


// Display registrations when page loads
displayRegistrations();


// ==========================================
// Registration Form Event
// ==========================================

registrationForm.addEventListener("submit", function (event) {

    event.preventDefault();


    // Get input values
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const department = document.getElementById("department").value;
    const year = document.getElementById("year").value;
    const selectedEvent = document.getElementById("event").value;


    // ==========================================
    // Validation
    // ==========================================

    if (name === "") {

        showMessage("Please enter your full name.", "danger");
        return;

    }


    if (name.length < 3) {

        showMessage("Name must contain at least 3 characters.", "danger");
        return;

    }


    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


    if (!emailPattern.test(email)) {

        showMessage("Please enter a valid email address.", "danger");
        return;

    }


    const phonePattern = /^[0-9]{10}$/;


    if (!phonePattern.test(phone)) {

        showMessage("Phone number must contain exactly 10 digits.", "danger");
        return;

    }


    if (department === "") {

        showMessage("Please select your department.", "danger");
        return;

    }


    if (year === "") {

        showMessage("Please select your year.", "danger");
        return;

    }


    if (selectedEvent === "") {

        showMessage("Please select an event.", "danger");
        return;

    }


    // ==========================================
    // Create JSON registration object
    // ==========================================

    const registration = {

        id: Date.now(),

        name: name,

        email: email,

        phone: phone,

        department: department,

        year: year,

        event: selectedEvent

    };


    // ==========================================
    // Add object to Array
    // ==========================================

    registrations.push(registration);


    // ==========================================
    // Save Array as JSON
    // ==========================================

    localStorage.setItem(
        "eventEaseRegistrations",
        JSON.stringify(registrations)
    );


    // Display updated data
    displayRegistrations();


    // Show success message
    showMessage(
        "Registration successful! You have been registered for " +
        selectedEvent + ".",
        "success"
    );


    // Clear form
    registrationForm.reset();

});


// ==========================================
// Display Registrations
// ==========================================

function displayRegistrations() {

    const searchText =
        searchInput.value.toLowerCase().trim();

    const selectedFilter =
        filterEvent.value;


    // Filter data
    const filteredRegistrations =
        registrations.filter(function (registration) {

            const matchesSearch =
                registration.name.toLowerCase().includes(searchText) ||
                registration.email.toLowerCase().includes(searchText);


            const matchesEvent =
                selectedFilter === "All" ||
                registration.event === selectedFilter;


            return matchesSearch && matchesEvent;

        });


    // Clear existing table
    registrationTable.innerHTML = "";


    // Update registration count
    registrationCount.textContent = registrations.length;


    // Check if no records exist
    if (filteredRegistrations.length === 0) {

        emptyMessage.style.display = "block";

    } else {

        emptyMessage.style.display = "none";

    }


    // ==========================================
    // Create table rows dynamically
    // ==========================================

    filteredRegistrations.forEach(function (registration, index) {

        const row = document.createElement("tr");


        row.innerHTML = `

            <td>${index + 1}</td>

            <td>
                <strong>${registration.name}</strong>
            </td>

            <td>${registration.email}</td>

            <td>${registration.department}</td>

            <td>${registration.year}</td>

            <td>
                <span class="badge bg-primary">
                    ${registration.event}
                </span>
            </td>

            <td>

                <button
                    class="btn btn-sm btn-danger"
                    onclick="deleteRegistration(${registration.id})">

                    <i class="bi bi-trash"></i>

                    Delete

                </button>

            </td>

        `;


        registrationTable.appendChild(row);

    });

}


// ==========================================
// Search Event
// ==========================================

searchInput.addEventListener("input", function () {

    displayRegistrations();

});


// ==========================================
// Filter Event
// ==========================================

filterEvent.addEventListener("change", function () {

    displayRegistrations();

});


// ==========================================
// Delete Registration
// ==========================================

function deleteRegistration(id) {

    const confirmDelete =
        confirm("Are you sure you want to delete this registration?");


    if (!confirmDelete) {

        return;

    }


    registrations =
        registrations.filter(function (registration) {

            return registration.id !== id;

        });


    // Update local storage
    localStorage.setItem(
        "eventEaseRegistrations",
        JSON.stringify(registrations)
    );


    // Update table
    displayRegistrations();


    showMessage(
        "Registration deleted successfully.",
        "warning"
    );

}


// ==========================================
// Display Success / Error Messages
// ==========================================

function showMessage(message, type) {

    messageBox.innerHTML = `

        <div class="alert alert-${type}" role="alert">

            ${message}

        </div>

    `;


    setTimeout(function () {

        messageBox.innerHTML = "";

    }, 4000);

}