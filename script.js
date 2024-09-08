document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("schedule-container");
    const seasonContainer = document.getElementById("season-container");

    // Fetch the historical season information
    fetch('https://raw.githubusercontent.com/your-username/your-repo/main/data_season.json')  // Change this URL to the correct path for your JSON
        .then(response => response.json())
        .then(seasonData => {
            // Display historical seasons data
            let seasonHTML = '<h2>Historical NHL Seasons</h2>';
            seasonData.data.forEach(season => {
                seasonHTML += `
                    <div class="season-info">
                        <p><strong>Season:</strong> ${season.formattedSeasonId}</p>
                        <p><strong>Start Date:</strong> ${new Date(season.startDate).toLocaleDateString()}</p>
                        <p><strong>End Date:</strong> ${new Date(season.endDate).toLocaleDateString()}</p>
                        <p><strong>Total Regular Season Games:</strong> ${season.totalRegularSeasonGames}</p>
                        <p><strong>Total Playoff Games:</strong> ${season.totalPlayoffGames}</p>
                    </div>
                `;
            });
            seasonContainer.innerHTML = seasonHTML;
        })
        .catch(error => {
            seasonContainer.innerHTML = '<p>Failed to load season information.</p>';
            console.error("Error fetching season data:", error);
        });

    // Fetch the schedule data
    fetch('https://raw.githubusercontent.com/kasljevic/NHL-schedule/main/data.json')
        .then(response => response.json())
        .then(data => {
            // Clear initial message
            container.innerHTML = '';

            // Display next and previous start dates
            const datesHTML = `
                <p><strong>Next Start Date:</strong> ${data.nextStartDate}</p>
                <p><strong>Previous Start Date:</strong> ${data.previousStartDate}</p>
            `;
            container.innerHTML += datesHTML;

            // Loop through each game week
            data.gameWeek.forEach(week => {
                const weekHTML = `
                    <h2>${week.dayAbbrev} (${week.date}) - ${week.numberOfGames} Games</h2>
                `;
                container.innerHTML += weekHTML;

                // Loop through each game
                week.games.forEach(game => {
                    const gameHTML = `
                        <div class="game">
                            <h3>${game.awayTeam.placeName.default} (${game.awayTeam.abbrev}) 
                            vs ${game.homeTeam.placeName.default} (${game.homeTeam.abbrev})</h3>
                            <p><strong>Venue:</strong> ${game.venue.default}</p>
                            <p><strong>Start Time:</strong> ${new Date(game.startTimeUTC).toLocaleTimeString()}</p>
                            <p><strong>Special Event:</strong> ${game.specialEvent ? game.specialEvent.default : 'None'}</p>
                            <a href="${game.ticketsLink}" target="_blank">Get Tickets</a>
                        </div>
                    `;
                    container.innerHTML += gameHTML;
                });
            });
        })
        .catch(error => {
            container.innerHTML = '<p>Failed to load game schedule.</p>';
            console.error("Error fetching data:", error);
        });
});
