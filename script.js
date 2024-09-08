// Function to fetch NHL schedule data
async function fetchNHLSchedule() {
    try {
        // Replace this URL with the actual NHL API endpoint or your data file URL
        const response = await fetch('https://statsapi.web.nhl.com/api/v1/schedule?startDate=2024-09-08&endDate=2024-12-22');
        const data = await response.json();
        return data.dates;
    } catch (error) {
        console.error('Error fetching NHL schedule:', error);
    }
}

// Function to display NHL schedule
function displaySchedule(scheduleData) {
    const scheduleElement = document.getElementById('schedule');
    let html = '<ul>';

    scheduleData.forEach(date => {
        html += `<li><strong>${date.date}</strong>`;
        html += '<ul>';
        date.games.forEach(game => {
            html += `<li>${game.teams.away.team.name} @ ${game.teams.home.team.name}</li>`;
        });
        html += '</ul></li>';
    });

    html += '</ul>';
    scheduleElement.innerHTML = html;
}

// Main function to fetch and display the schedule
async function init() {
    const scheduleData = await fetchNHLSchedule();
    if (scheduleData) {
        displaySchedule(scheduleData);
    }
}

// Call the init function when the page loads
window.onload = init;
