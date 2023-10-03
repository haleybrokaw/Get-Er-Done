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

    // Define your schedule data here or fetch it from an external source based on the selectedDate

    // ... (your schedule data and display logic here)

    // Append the schedule container to the left side of the calendar container
    const calendarContainer = document.querySelector(".calendar-container");
    calendarContainer.insertBefore(scheduleContainer, calendarContainer.firstChild);

    // Show the schedule container
    scheduleContainer.style.display = "block";
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






