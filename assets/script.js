const daysContainer = document.querySelector(".days");
const currentMonthElement = document.querySelector("#currentMonth");
const prevMonthButton = document.querySelector("#prevMonth");
const nextMonthButton = document.querySelector("#nextMonth");

let currentDate = dayjs();
renderCalendar(currentDate);

prevMonthButton.addEventListener("click", () => {
    currentDate = currentDate.subtract(1, "month");
    renderCalendar(currentDate);
});

nextMonthButton.addEventListener("click", () => {
    currentDate = currentDate.add(1, "month");
    renderCalendar(currentDate);
});

function renderCalendar(date) {
    daysContainer.innerHTML = "";
    currentMonthElement.textContent = date.format("MMMM YYYY");

    const daysInMonth = date.daysInMonth();
    const firstDayOfMonth = date.startOf("month").day();

    for (let i = 0; i < firstDayOfMonth; i++) {
        const emptyDay = document.createElement("div");
        emptyDay.className = "day empty";
        daysContainer.appendChild(emptyDay);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement("div");
        dayElement.className = "day";
        dayElement.textContent = day;
        daysContainer.appendChild(dayElement);
    }
}
