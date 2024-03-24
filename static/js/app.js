// Function to generate timeline guides
function generateGuides() {
    var timelineGuides = document.querySelector('.timeline-guides');
    var hourWidth = 100 / 24; // Calculate width for each hour

    for (var hour = 0; hour <= 24; hour++) {
        var guideDiv = document.createElement('div');
        guideDiv.textContent = hour + ':00'; // Display hour
        guideDiv.style.left = (hour * hourWidth) + '%'; // Position guide
        timelineGuides.appendChild(guideDiv);
    }
}

// Function to populate the timeline with session data
function populateTimeline(sessions) {
    var timelineEvents = document.querySelector('.timeline-events');

    sessions.forEach(function(session) {
        var startTime = new Date(session.start_time);
        var endTime = new Date(session.end_time);

        var eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-event';
        eventDiv.style.left = calculatePosition(startTime) + '%';
        eventDiv.style.width = calculateWidth(startTime, endTime) + '%';

        timelineEvents.appendChild(eventDiv);
    });
}

// Calculate position of session event based on start time
function calculatePosition(startTime) {
    var totalHours = 24;
    var currentHour = startTime.getHours();
    return (currentHour / totalHours) * 100;
}

// Calculate width of session event based on start and end times
function calculateWidth(startTime, endTime) {
    var totalHours = 24;
    var durationHours = (endTime - startTime) / (1000 * 60 * 60); // Convert milliseconds to hours
    return (durationHours / totalHours) * 100;
}

// Example session data (similar to previous code)
var sessions = [
    { start_time: '2024-03-23 10:00:00', end_time: '2024-03-23 12:00:00' },
    { start_time: '2024-03-23 14:00:00', end_time: '2024-03-23 15:30:00' },
    // Add more session data as needed
];

// Generate timeline guides and populate the timeline with session data
generateGuides();
populateTimeline(sessions);


/*

// Function to load date stats and timeline from backend
function loadDateStatsAndTimeline(date) {
    // Implement AJAX call to backend to retrieve date stats and timeline data
    // Populate #sessions-duration, #date-duration, and #timeline elements with retrieved data
}

// Function to load apps table from backend
function loadAppsTable(date) {
    // Implement AJAX call to backend to retrieve apps table data
    // Populate #apps-table tbody with retrieved data
}

// Function to load sessions table from backend
function loadSessionsTable(date) {
    // Implement AJAX call to backend to retrieve sessions table data
    // Populate #sessions-table tbody with retrieved data
}

$(document).ready(function() {
    // Load initial data for today's date
    var today = new Date().toISOString().slice(0, 10);
    loadDateStatsAndTimeline(today);
    loadAppsTable(today);
    loadSessionsTable(today);

    // Handle date selection
    $('#solar-hijri-calendar').on('change', function() {
        var selectedDate = $(this).val();
        loadDateStatsAndTimeline(selectedDate);
        loadAppsTable(selectedDate);
        loadSessionsTable(selectedDate);
    });
});

//-------------TIME LINE--------------------

// Function to populate the timeline with session data
// Function to generate timeline rulers
function generateRulers() {
    var timeline = document.getElementById('timeline');

    // Clear previous rulers
    timeline.innerHTML = '';

    // Add rulers for each hour
    for (var hour = 0; hour < 24; hour++) {
        var rulerDiv = document.createElement('div');
        rulerDiv.className = 'timeline-ruler';
        rulerDiv.textContent = ('0' + hour).slice(-2) + ':00'; // Format hour as HH:00

        // Append ruler to timeline
        timeline.appendChild(rulerDiv);
    }
}

function populateTimeline(sessions) {
    var timeline = document.getElementById('timeline');

    // Clear previous content
    timeline.innerHTML = '';

    // Iterate over sessions and create timeline events
    sessions.forEach(function(session) {
        var startTime = new Date(session.start_time);
        var endTime = new Date(session.end_time);
        var duration = session.duration;
        var appName = session.app_name;

        var eventDiv = document.createElement('div');
        eventDiv.className = 'timeline-event';
        eventDiv.title = 'App: ' + appName + '\nStart Time: ' + startTime + '\nEnd Time: ' + endTime + '\nDuration: ' + duration;
        eventDiv.textContent = appName;

        // Append event to timeline
        timeline.appendChild(eventDiv);
    });
}

// Example session data
var sessions = [
    { start_time: '2024-03-23 10:00:00', end_time: '2024-03-23 12:00:00', duration: '2 hours', app_name: 'App 1' },
    { start_time: '2024-03-23 14:00:00', end_time: '2024-03-23 15:30:00', duration: '1.5 hours', app_name: 'App 2' },
    // Add more session data as needed
];

// Populate the timeline with session data
populateTimeline(sessions);
generateRulers();



//---------------------------OLD-------------------------------------
/*
// Function to fetch date stats based on selected date
        function getDateStats() {
            var selectedDate = document.getElementById("date-selector").value;
            fetch("/date?date=" + selectedDate)
            .then(response => response.json())
            .then(data => displayDateStats(data))
            .catch(error => console.error('Error fetching date stats:', error));
        }

        // Function to display date statistics
        function displayDateStats(data) {
            // Clear previous stats
            document.getElementById("stats-container").innerHTML = "";

            // Display date duration
            var dateDuration = document.createElement("p");
            dateDuration.textContent = "Date Duration: " + data.date_duration;
            document.getElementById("stats-container").appendChild(dateDuration);

            // Display sessions duration
            var sessionsDuration = document.createElement("p");
            sessionsDuration.textContent = "Sessions Duration: " + data.sessions_duration;
            document.getElementById("stats-container").appendChild(sessionsDuration);

            // Display app-wise statistics
            var appsList = document.createElement("ul");
            data.apps.forEach(function(app) {
                var appItem = document.createElement("li");
                appItem.textContent = "App ID: " + app.app_id + ", Name: " + app.name + ", Sessions Duration: " + app.sessions_duration + ", Date Duration: " + app.date_duration;
                appsList.appendChild(appItem);
            });
            document.getElementById("stats-container").appendChild(appsList);

            // Display session details
            var sessionsList = document.createElement("ul");
            data.sessions.forEach(function(session) {
                var sessionItem = document.createElement("li");
                sessionItem.textContent = "Session ID: " + session.id + ", App ID: " + session.app_id + ", Code: " + session.code + ", Start Time: " + session.start_time + ", End Time: " + session.end_time + ", Created At: " + session.created_at;
                sessionsList.appendChild(sessionItem);
            });
            document.getElementById("stats-container").appendChild(sessionsList);
        }

        // Fetch date stats for today by default when the page loads
        window.onload = function() {
            getDateStats();
        };

 */
