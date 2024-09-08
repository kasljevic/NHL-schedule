// Function to fetch NHL schedule data for the upcoming week
async function fetchNHLSchedule() {
    try {
        const response = await fetch('https://api-web.nhle.com/v1/schedule/now');
        const data = await response.json();
        return data.gameWeek;
    } catch (error) {
        console.error('Error fetching NHL schedule:', error);
    }
}

// Function to display NHL schedule
function displaySchedule(scheduleData) {
    const scheduleElement = document.getElementById('schedule');
    let html = '<ul>';

    scheduleData.forEach(date => {
        html += `<li><strong>${new Date(date.date).toLocaleDateString()}</strong>`;
        html += '<ul>';
        date.games.forEach(game => {
            html += `<li>${game.awayTeam.abbrev} @ ${game.homeTeam.abbrev} - ${game.startTimeUTC}</li>`;
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
