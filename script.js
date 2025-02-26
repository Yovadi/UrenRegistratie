document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript geladen!");

    const workDate = document.getElementById("workDate");
    const startHour = document.getElementById("startHour");
    const endHour = document.getElementById("endHour");
    const startMinutes = document.getElementById("startMinutes");
    const endMinutes = document.getElementById("endMinutes");
    const addEntryBtn = document.getElementById("addEntry");
    const hoursList = document.getElementById("hoursList");
    const totalHoursDisplay = document.getElementById("totalHours");
    const hourlyRate = document.getElementById("hourlyRate");
    const calculateEarningsBtn = document.getElementById("calculateEarnings");
    const totalEarningsDisplay = document.getElementById("totalEarnings");
    const resetBtn = document.getElementById("resetData");

    let totalHours = 0;
    let entries = JSON.parse(localStorage.getItem("entries")) || [];

    // Vul dropdowns (00-23 voor uren)
    for (let i = 0; i < 24; i++) {
        const option1 = new Option(i.toString().padStart(2, "0"), i);
        const option2 = new Option(i.toString().padStart(2, "0"), i);
        startHour.add(option1);
        endHour.add(option2);
    }

    function updateList() {
        hoursList.innerHTML = "";
        entries.forEach((entry) => {
            const li = document.createElement("li");
            li.textContent = `${entry.date} | ${entry.startHour}:${entry.startMinutes} - ${entry.endHour}:${entry.endMinutes} (${entry.workedHours.toFixed(2)} uur)`;
            hoursList.appendChild(li);
        });

        totalHoursDisplay.textContent = totalHours.toFixed(2);
        localStorage.setItem("entries", JSON.stringify(entries));
    }

    function calculateHours(startH, startM, endH, endM) {
        let startTime = startH * 60 + startM;
        let endTime = endH * 60 + endM;
        if (endTime < startTime) endTime += 1440;
        return (endTime - startTime) / 60;
    }

    addEntryBtn.addEventListener("click", function() {
        let date = workDate.value;
        let startH = parseInt(startHour.value);
        let startM = parseInt(startMinutes.value);
        let endH = parseInt(endHour.value);
        let endM = parseInt(endMinutes.value);

        if (!date) {
            alert("Selecteer een datum!");
            return;
        }

        let workedHours = calculateHours(startH, startM, endH, endM);
        totalHours += workedHours;
        entries.push({ date, startHour: startH, startMinutes: startM, endHour: endH, endMinutes: endM, workedHours });

        updateList();
    });

    calculateEarningsBtn.addEventListener("click", function() {
        totalEarningsDisplay.textContent = (totalHours * parseFloat(hourlyRate.value)).toFixed(2);
    });

    resetBtn.addEventListener("click", function() {
        totalHours = 0;
        entries = [];
        updateList();
    });

    updateList();
});
