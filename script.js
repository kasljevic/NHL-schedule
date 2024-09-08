document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById("schedule-container");

    // Fetch the JSON data
    fetch('data.json')
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
