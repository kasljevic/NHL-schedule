document.addEventListener("DOMContentLoaded", function() {
    const scheduleContainer = document.getElementById("schedule-container");
    const seasonContainer = document.getElementById("season-container");
    const leadersContainer = document.getElementById("leaders-container");

    // Fetch the schedule data
    fetch('https://raw.githubusercontent.com/kasljevic/NHL-schedule/main/data.json')
        .then(response => response.json())
        .then(data => {
            displaySchedule(data);
        })
        .catch(handleError(scheduleContainer, "Failed to load game schedule."));

    // Fetch the historical season information
    fetch('https://raw.githubusercontent.com/kasljevic/NHL-schedule/main/data_season.json')
        .then(response => response.json())
        .then(seasonData => {
            displayHistoricalSeasons(seasonData);
        })
        .catch(handleError(seasonContainer, "Failed to load season information."));

    // Fetch the stats leaders
    fetch('https://raw.githubusercontent.com/kasljevic/NHL-schedule/main/data_leaders.json')
        .then(response => response.json())
        .then(leadersData => {
            displayStatsLeaders(leadersData);
        })
        .catch(handleError(leadersContainer, "Failed to load stats leaders."));
});

function displaySchedule(data) {
    const container = document.getElementById("schedule-container");
    container.innerHTML = '<h2>Upcoming Games</h2>';
    
    const datesHTML = `
        <div class="date-info">
            <p><strong>Next Start Date:</strong> ${formatDate(data.nextStartDate)}</p>
            <p><strong>Previous Start Date:</strong> ${formatDate(data.previousStartDate)}</p>
        </div>
    `;
    container.innerHTML += datesHTML;

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

function displayHistoricalSeasons(seasonData) {
    const container = document.getElementById("season-container");
    container.innerHTML = '<h2>Historical NHL Seasons</h2>';
    
    seasonData.data.forEach(season => {
        const seasonHTML = `
            <div class="season-info">
                <h3>${season.formattedSeasonId}</h3>
                <p><strong>Start Date:</strong> ${formatDate(season.startDate)}</p>
                <p><strong>End Date:</strong> ${formatDate(season.endDate)}</p>
                <p><strong>Regular Season Games:</strong> ${season.totalRegularSeasonGames}</p>
                <p><strong>Playoff Games:</strong> ${season.totalPlayoffGames}</p>
            </div>
        `;
        container.innerHTML += seasonHTML;
    });
}

function displayStatsLeaders(leadersData) {
    const container = document.getElementById("leaders-container");
    container.innerHTML = '<h2>Stats Leaders</h2>';

    // Display top 3 goal scorers
    const topScorers = leadersData.goals.slice(0, 3);
    topScorers.forEach(player => {
        const leaderHTML = `
            <div class="leader-card">
                <img src="${player.headshot}" alt="${player.firstName.default} ${player.lastName.default}" class="player-headshot">
                <div class="leader-info">
                    <h3>${player.firstName.default} ${player.lastName.default}</h3>
                    <p>${player.teamName.default} - ${player.position}</p>
                </div>
                <div class="leader-value">${player.value} goals</div>
            </div>
        `;
        container.innerHTML += leaderHTML;
    });
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
