document.addEventListener("DOMContentLoaded", function () {
    const scheduleContainer = document.getElementById("schedule-container");
    const standingsContainer = document.getElementById("standings-container");
    const leadersContainer = document.getElementById("leaders-container");
    const navLinks = document.querySelectorAll(".nav-menu a");

    // Fetch the schedule data
    fetch('https://raw.githubusercontent.com/kasljevic/NHL-schedule/main/data.json')
        .then(response => response.json())
        .then(data => {
            displaySchedule(data);
        })
        .catch(handleError(scheduleContainer, "Failed to load game schedule."));

    // Fetch the standings data
    fetch('https://raw.githubusercontent.com/kasljevic/NHL-schedule/main/data_standings.json')
        .then(response => response.json())
        .then(standingsData => {
            displayStandings(standingsData);
        })
        .catch(handleError(standingsContainer, "Failed to load standings."));

    // Add event listener for navigation links
    navLinks.forEach(link => {
        link.addEventListener("click", function (e) {
            e.preventDefault();
            navLinks.forEach(link => link.classList.remove("active"));
            this.classList.add("active");
            showSection(this.getAttribute("href"));
        });
    });

    // Show the correct section based on navigation
    function showSection(section) {
        if (section === "#games") {
            scheduleContainer.style.display = "block";
            standingsContainer.style.display = "none";
        } else if (section === "#standings") {
            scheduleContainer.style.display = "none";
            standingsContainer.style.display = "block";
        }
    }
    showSection("#games"); // Default to showing games section
});

function displaySchedule(data) {
    const container = document.getElementById("schedule-container");
    container.innerHTML = '<h2>Upcoming Games</h2>';

    data.gameWeek.forEach(week => {
        const weekHTML = `
            <h3>${week.dayAbbrev} (${formatDate(week.date)}) - ${week.numberOfGames} Games</h3>
        `;
        container.innerHTML += weekHTML;

        week.games.forEach(game => {
            const gameHTML = `
                <div class="game">
                    <h4>
                        <img src="${game.awayTeam.logo}" alt="${game.awayTeam.abbrev} logo" class="team-logo">
                        ${game.awayTeam.placeName.default} (${game.awayTeam.abbrev}) 
                        vs 
                        <img src="${game.homeTeam.logo}" alt="${game.homeTeam.abbrev} logo" class="team-logo">
                        ${game.homeTeam.placeName.default} (${game.homeTeam.abbrev})
                    </h4>
                    <p><strong>Venue:</strong> ${game.venue.default}</p>
                    <p><strong>Start Time:</strong> ${formatTime(game.startTimeUTC)}</p>
                    ${game.specialEvent ? `<p><strong>Special Event:</strong> ${game.specialEvent.default}</p>` : ''}
                    <div class="game-links">
                        <a href="${game.ticketsLink}" target="_blank" class="ticket-link">Get Tickets</a>
                        ${game.gameCenterLink ? `<a href="${game.gameCenterLink}" target="_blank" class="game-center-link">Game Center</a>` : ''}
                    </div>
                </div>
            `;
            container.innerHTML += gameHTML;
        });
    });
}

function displayStandings(standingsData) {
    const container = document.getElementById("standings-container");
    container.innerHTML = `
        <h2>Standings</h2>
        <div class="standings-section">
            <h3>Eastern Conference</h3>
            ${renderStandingsTable(standingsData.eastern)}
        </div>
        <div class="standings-section">
            <h3>Western Conference</h3>
            ${renderStandingsTable(standingsData.western)}
        </div>
    `;
}

function renderStandingsTable(conference) {
    return `
        <table class="standings-table">
            <thead>
                <tr>
                    <th>Team</th>
                    <th>GP</th>
                    <th>W</th>
                    <th>L</th>
                    <th>OTL</th>
                    <th>Pts</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>Diff</th>
                    <th>Streak</th>
                </tr>
            </thead>
            <tbody>
                ${conference.map(team => `
                    <tr>
                        <td>${team.teamName}</td>
                        <td>${team.gamesPlayed}</td>
                        <td>${team.wins}</td>
                        <td>${team.losses}</td>
                        <td>${team.otLosses}</td>
                        <td>${team.points}</td>
                        <td>${team.goalsFor}</td>
                        <td>${team.goalsAgainst}</td>
                        <td>${team.difference}</td>
                        <td>${team.streak}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

function formatTime(timeString) {
    return new Date(timeString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZoneName: 'short' });
}

function handleError(container, message) {
    return error => {
        container.innerHTML = `<p class="error">${message}</p>`;
        console.error("Error:", error);
    };
}
