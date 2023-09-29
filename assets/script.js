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

        if (day < currentDate.date()) {
            dayElement.classList.add("past-day");
        }

        if (day > currentDate.date()) {
            dayElement.classList.add("future-day");
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






