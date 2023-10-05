// Select DOM elements
const daysContainer = document.querySelector(".days");
const currentMonthElement = document.querySelector("#currentMonth");
const prevMonthButton = document.querySelector("#prevMonth");
const nextMonthButton = document.querySelector("#nextMonth");

// Initialize current date
let currentDate = dayjs();
renderCalendar(currentDate);

// Event listeners for navigation buttons
prevMonthButton.addEventListener("click", navigateToPreviousMonth);
nextMonthButton.addEventListener("click", navigateToNextMonth);

// Function to navigate to the previous month
function navigateToPreviousMonth() {
    currentDate = currentDate.subtract(1, "month");
    renderCalendar(currentDate);
}

// Function to navigate to the next month
function navigateToNextMonth() {
    currentDate = currentDate.add(1, "month");
    renderCalendar(currentDate);
}

// Function to render the calendar
function renderCalendar(date) {
    // Clear the days container
    daysContainer.innerHTML = "";

    // Update the current month display
    currentMonthElement.textContent = date.format("MMMM YYYY");

    const daysInMonth = date.daysInMonth();
    const firstDayOfMonth = date.startOf("month").day();

    // Add empty day placeholders for the beginning of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day empty";
        daysContainer.appendChild(emptyDay);
    }

    // Create day elements for the entire month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.className = "day";
        dayElement.textContent = day;

        // Highlight the present day
        if (date.date() === day && date.month() === currentDate.month() && date.year() === currentDate.year()) {
            dayElement.classList.add("present-day");
        }

        // Color past days grey
        if (day < currentDate.date()) {
            dayElement.classList.add("past-day");
        }

        // Color future days green
        if (day > currentDate.date()) {
            dayElement.classList.add("future-day");
        }

        // Makes next/previous month correctly colored
        if (currentMonthElement.textContent === 'September 2023') {
            for (let day = 1; day <= daysInMonth; day++) {
                dayElement.classList.remove("present-day");
                dayElement.classList.remove("future-day");
                dayElement.classList.add("past-day");
            }
        } else if (currentMonthElement.textContent === 'November 2023') {
            for (let day = 1; day <= daysInMonth; day++) {
                dayElement.classList.remove("present-day");
                dayElement.classList.remove("past-day");
                dayElement.classList.add("future-day");
            }
        }

        // Add click event listener to show the schedule
        dayElement.addEventListener("click", () => {
            // Get the full date in YYYY-MM-DD format
            const selectedDate = currentDate.format("YYYY-MM-") + day;
            displaySchedule(selectedDate);
        });

        // Append the day element to the container
        daysContainer.appendChild(dayElement);
    }
}

// Function to display the schedule for a selected day
function displaySchedule(selectedDate) {
    // Remove any existing schedule containers
    const existingScheduleContainers = document.querySelectorAll(".schedule-container");
    existingScheduleContainers.forEach(container => {
        container.remove();
    });

    // Create a container for the schedule
    const scheduleContainer = document.createElement("div");
    scheduleContainer.className = "schedule-container";

    // Get the formatted date with Day.js
    const formattedDate = dayjs(selectedDate).format("dddd, MMMM D, YYYY");

    // Display the formatted date at the top of the container
    const dateHeading = document.createElement("h2");
    dateHeading.textContent = formattedDate;
    scheduleContainer.appendChild(dateHeading);

    // Close button (x icon)
    const closeButton = document.createElement("span");
    closeButton.className = "close-button";
    closeButton.innerHTML = "&times;"; // Unicode character for 'x'
    closeButton.addEventListener("click", () => {
        scheduleContainer.style.display = "none"; // Hide the schedule container
    });
    scheduleContainer.appendChild(closeButton);

    // Create an input form for adding custom events
    const eventForm = document.createElement("form");
    eventForm.className = "event-form";
    eventForm.innerHTML = `
        <input type="time" id="eventTime" required>
        <input type="text" id="eventDescription" placeholder="Event description" required>
        <button type="submit">Add Event</button>
    `;

    eventForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const eventTime = document.getElementById("eventTime").value;
        const eventDescription = document.getElementById("eventDescription").value;

        if (eventTime && eventDescription) {
            const customEvent = `${eventTime}: ${eventDescription}`;
            addCustomEvent(selectedDate, customEvent);
            displaySchedule(selectedDate);
        }
    });

    scheduleContainer.appendChild(eventForm);

    // Define your schedule data here or fetch it from an external source based on the selectedDate
    const scheduleData = getScheduleData(selectedDate);

    // Create a list to hold the events
    const eventList = document.createElement("ul");
    eventList.className = "event-list";

    // Populate the event list
    scheduleData.forEach(event => {
        const eventItem = document.createElement("li");
        eventItem.className = "event-item";

        // Create a delete button for each event
        const deleteButton = document.createElement("button");
        deleteButton.className = "delete-button";
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            deleteCustomEvent(selectedDate, event);
            displaySchedule(selectedDate);
        });

        eventItem.innerHTML = `${event} `;
        eventItem.appendChild(deleteButton);

        eventList.appendChild(eventItem);
    });

    // Append the event list to the schedule container
    scheduleContainer.appendChild(eventList);

    // Append the schedule container to the left side of the calendar container
    const calendarContainer = document.querySelector(".calendar-container");
    calendarContainer.insertBefore(scheduleContainer, calendarContainer.firstChild);

    // Show the schedule container
    scheduleContainer.style.display = "block";
}

function addCustomEvent(selectedDate, customEvent) {
    // Get existing custom events for the selected date or initialize an empty array
    let customEvents = JSON.parse(localStorage.getItem(selectedDate)) || [];
    
    // Add the new custom event to the array
    customEvents.push(customEvent);

    // Save the updated array back to local storage for the selected date
    localStorage.setItem(selectedDate, JSON.stringify(customEvents));
}

// Function to delete a custom event from local storage
function deleteCustomEvent(selectedDate, eventToDelete) {
    // Get existing custom events for the selected date or initialize an empty array
    let customEvents = JSON.parse(localStorage.getItem(selectedDate)) || [];

    // Remove the event to delete from the array
    customEvents = customEvents.filter(event => event !== eventToDelete);

    // Save the updated array back to local storage for the selected date
    localStorage.setItem(selectedDate, JSON.stringify(customEvents));
}

// Function to fetch or generate schedule data for a selected date
function getScheduleData(selectedDate) {
    // You can implement logic here to retrieve or generate the schedule data for the selected date.

    const customEvents = JSON.parse(localStorage.getItem(selectedDate)) || [];
    return [...customEvents];
}

daysContainer.addEventListener("click", (event) => {
    if (event.target.classList.contains("day")) {
        // Get the full date in YYYY-MM-DD format
        const selectedDate = currentDate.format("YYYY-MM-") + event.target.textContent;
        displaySchedule(selectedDate);
    }
});

console.log

// Joke Box Stuff
const jokeContainer = document.getElementById("joke-container");
const loadJokeButton = document.getElementById("loadJoke");

// Add a click event listener to the "Load Joke" button
loadJokeButton.addEventListener("click", async () => {
    try {
        // Fetch Chuck Norris joke from the API
        const jokeData = await fetchChuckNorrisJoke();

        // Extract the joke from the "value" property in the response
        const joke = jokeData.value;

        // Display the joke in the joke container
        jokeContainer.textContent = joke;
    } catch (error) {
        console.error(error);
    }
});

// Function to fetch a Chuck Norris joke from the API
async function fetchChuckNorrisJoke() {
    const url = 'https://matchilling-chuck-norris-jokes-v1.p.rapidapi.com/jokes/random';
    const headers = {
        accept: 'application/json',
        'X-RapidAPI-Key': 'f41bb8e23amshae3f86bba83acd6p1f39b4jsnfa1585872961',
        'X-RapidAPI-Host': 'matchilling-chuck-norris-jokes-v1.p.rapidapi.com'
    };

    const response = await fetch(url, { headers });

    if (!response.ok) {
        throw new Error("Failed to fetch joke");
    }

    return response.json();
}

// Initial load of the joke
fetchAndDisplayJoke();


