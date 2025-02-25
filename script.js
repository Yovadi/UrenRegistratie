document.addEventListener("DOMContentLoaded", function() {
    console.log("JavaScript is geladen en klaar!");
    
    // Controleer of de knoppen bestaan en koppel event listeners
    document.getElementById("addEntryBtn").addEventListener("click", addEntry);
    document.getElementById("calculateBtn").addEventListener("click", calculateEarnings);
    document.getElementById("clearBtn").addEventListener("click", clearData);

    // Laad opgeslagen gegevens
    loadStoredData();
});

function addEntry() {
    console.log("Voeg toe knop werkt!");

    let date = document.getElementById("date").value;
    let startTime = document.getElementById("startTime").value;
    let endTime = document.getElementById("endTime").value;

    if (!date || !startTime || !endTime) {
        alert("Voer een geldige datum, starttijd en eindtijd in.");
        return;
    }

    let start = new Date(`1970-01-01T${startTime}:00`);
    let end = new Date(`1970-01-01T${endTime}:00`);

    if (end <= start) {
        alert("De eindtijd moet later zijn dan de starttijd.");
        return;
    }

    let hoursWorked = (end - start) / (1000 * 60 * 60); // Omrekenen naar uren
    console.log(`Gewerkte uren: ${hoursWorked}`);

    let entries = JSON.parse(localStorage.getItem("workHours")) || [];
    entries.push({ date, startTime, endTime, hoursWorked });
    localStorage.setItem("workHours", JSON.stringify(entries));

    updateList();
}

function updateList() {
    let entries = JSON.parse(localStorage.getItem("workHours")) || [];
    let hoursList = document.getElementById("hoursList");
    let totalHours = 0;

    hoursList.innerHTML = "";

    entries.forEach(entry => {
        if (typeof entry.hoursWorked === "undefined") {
            console.warn("Fout: hoursWorked is niet gedefinieerd voor deze entry", entry);
            return; // Sla foute records over
        }

        totalHours += entry.hoursWorked;
        let li = document.createElement("li");
        li.textContent = `${entry.date}: ${entry.startTime} - ${entry.endTime} (${entry.hoursWorked.toFixed(2)} uur)`;
        hoursList.appendChild(li);
    });

    document.getElementById("totalHours").textContent = totalHours.toFixed(2);
}

function calculateEarnings() {
    let hourlyRate = parseFloat(document.getElementById("hourlyRate").value);
    let totalHours = parseFloat(document.getElementById("totalHours").textContent);

    if (isNaN(hourlyRate) || hourlyRate <= 0) {
        alert("Voer een geldig uurloon in.");
        return;
    }

    let totalEarnings = totalHours * hourlyRate;
    document.getElementById("totalEarnings").textContent = totalEarnings.toFixed(2);
}

function clearData() {
    if (confirm("Weet je zeker dat je alle gegevens wilt wissen?")) {
        localStorage.removeItem("workHours");
        document.getElementById("hoursList").innerHTML = "";
        document.getElementById("totalHours").textContent = "0";
        document.getElementById("totalEarnings").textContent = "0";
    }
}

function loadStoredData() {
    updateList();
}
