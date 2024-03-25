import 'persian-datepicker/dist/js/persian-datepicker.min.js';
//----------------------Time Line------------------------

// Function to generate timeline guides
function generateGuides() {
    var timelineGuides = document.querySelector('.timeline-guides');
    var hourWidth = 100 / 24; // Calculate width for each hour

    for (var hour = 0; hour <= 24; hour++) {
        var guideDiv = document.createElement('div');
        guideDiv.textContent = hour + ''; // Display hour
        guideDiv.style.left = (hour * hourWidth) + '%'; // Position guide
        timelineGuides.appendChild(guideDiv);
    }
}

// Function to generate vertical rulers on the timeline line
function generateVerticalRulers() {
    var timelineLine = document.querySelector('.timeline-line');
    var hourWidth = 100 / 24;

    for (var hour = 0; hour <= 24; hour++) {
        var rulerDiv = document.createElement('div');
        rulerDiv.className = 'timeline-ruler';
        rulerDiv.style.left = (hour * hourWidth) + '%';
        timelineLine.appendChild(rulerDiv);
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

        // Add data attributes
        eventDiv.setAttribute('data-start-time', session.start_time);
        eventDiv.setAttribute('data-end-time', session.end_time);
        eventDiv.setAttribute('data-duration', session.duration);
        eventDiv.setAttribute('data-app-name', session.app_name);

        // Add event listener for tooltip
        eventDiv.addEventListener('mouseover', function(ev) {
            // Show tooltip with session details
            showTooltip(ev);
        });

        // Remove tooltip when mouse leaves eventDiv
        eventDiv.addEventListener('mouseout', function() {
            // Hide tooltip
            hideTooltip();
        });

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
    { start_time: '2024-03-23 10:00:00', end_time: '2024-03-23 12:00:00', duration: '2:00', app_name: 'Dota 2', id: 1, app_id: 570, scan_time: '2024-03-23 12:00:00', code: 'nfl8sdfsdfdsfsd' },
    { start_time: '2024-03-23 14:00:00', end_time: '2024-03-23 15:30:00', duration: '1:30', app_name: 'Dota 2',  id: 2, app_id: 570, scan_time: '2024-03-23 12:00:00', code: 'nfldfdsfsd' },
    { start_time: '2024-03-23 14:00:00', end_time: '2024-03-23 15:30:00', duration: '1:30', app_name: 'Dota 2',  id: 2, app_id: 570, scan_time: '2024-03-23 12:00:00', code: 'nfldfdsfsd' },
    { start_time: '2024-03-22 23:50:00', end_time: '2024-03-23 1:30:00', duration: '1:30', app_name: 'Dota 2',  id: 2, app_id: 570, scan_time: '2024-03-23 12:00:00', code: 'nfldfdsfsd' },
    { start_time: '2024-03-23 23:00:00', end_time: '2024-03-24 5:30:00', duration: '1:30', app_name: 'Dota 2',  id: 2, app_id: 570, scan_time: '2024-03-23 12:00:00', code: 'nfldfdsfsd' },
    // Add more session data as needed
];

// Generate timeline guides and populate the timeline with session data
generateGuides();
generateVerticalRulers();
populateTimeline(sessions);

//----------------TOOLTIP--------------------------


const tooltip = document.querySelector('.tooltip');

// Function to show tooltip
function showTooltip(event) {
    const startTime = event.target.dataset.startTime;
    const endTime = event.target.dataset.endTime;
    const duration = event.target.dataset.duration;
    const appName = event.target.dataset.appName;

    // Set tooltip content
    tooltip.innerHTML = `
        <strong>Start Time:</strong> <span class="primary">${startTime}</span><br>
        <strong>End Time:</strong> <span class="primary">${endTime}</span><br>
        <strong>Duration:</strong> <span class="primary">${duration}</span><br>
        <strong>App Name:</strong> <span class="primary">${appName}</span>
    `;

    // Position tooltip relative to the event
    const rect = event.target.getBoundingClientRect();
    tooltip.style.bottom = `${window.innerHeight - rect.top + 10}px`;
    tooltip.style.left = `${rect.left}px`;

    // Show tooltip
    tooltip.style.display = 'block';
}

function hideTooltip() {
    tooltip.style.display = 'none';
}

//------------------------Apps Table---------------------------

// Sample test data for apps
const appsData = [
    { row: 1, app_id: 101, app_name: 'App 1', duration: '2:30', date_duration: '1:15' },
    { row: 2, app_id: 102, app_name: 'App 2', duration: '1:45', date_duration: '0:45' },
    { row: 3, app_id: 103, app_name: 'App 3', duration: '3:15', date_duration: '1:30' },
    // Add more sample data as needed
];

// Function to populate the apps table
function populateAppsTable() {
    const appsTableBody = document.getElementById('apps-table-body');

    appsData.forEach(app => {
        const row = document.createElement('tr');

        // Populate table cells
        row.innerHTML = `
            <td>${app.row}</td>
            <td>${app.app_id}</td>
            <td>${app.app_name}</td>
            <td>${app.duration}</td>
            <td>${app.date_duration}</td>
        `;

          // Add purpose class for color coding
        row.classList.add("trow");

        // Add hover effect
        row.addEventListener('mouseenter', () => {
            row.classList.add('hover');
        });

        row.addEventListener('mouseleave', () => {
            row.classList.remove('hover');
        });

        // Append row to table body
        appsTableBody.appendChild(row);
    });
}

// Call the function to populate the apps table
populateAppsTable();

//------------------------Sessions Table---------------------------
function populateSessionsTable() {
    const appsTableBody = document.getElementById('sessions-table-body');

    sessions.forEach(session => {
        const row = document.createElement('tr');

        // Populate table cells
        row.innerHTML = `
            <td>${session.id}</td>
            <td>${session.app_id}</td>
            <td>${session.app_name}</td>
            <td>${session.start_time}</td>
            <td>${session.end_time}</td>
            <td>${session.duration}</td>
            <td>${session.scan_time}</td>
            <td>${session.code}</td>
        `;

          // Add purpose class for color coding
        row.classList.add("trow2");

        // Add hover effect
        row.addEventListener('mouseenter', () => {
            row.classList.add('hover');
        });

        row.addEventListener('mouseleave', () => {
            row.classList.remove('hover');
        });

        // Append row to table body
        appsTableBody.appendChild(row);
    });
}

// Call the function to populate the apps table
populateSessionsTable();

/*--------------------------Date Picker----------------------------*/

// Initialize Persian Date Picker
  $(document).ready(function() {
    $("#datepicker").pDatepicker({
      format: 'YYYY-MM-DD', // Date format
      initialValue: false, // Do not set an initial value
      observer: true, // Enable observer mode
      responsive: true, // Make the calendar responsive
      autoClose: true, // Automatically close the calendar after selecting a date
      calendar: {
        persian: {
          locale: 'en' // Set calendar language to English
        }
      }
    });
  });



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
