// import 'jquery/dist/jquery.min';
import $ from 'jquery';
// Import the Persian Date library
// const persianDate = require('persian-date');
import 'persian-date/dist/persian-date.min';
import persianDate from "persian-date";
import 'persian-datepicker/dist/js/persian-datepicker.min';
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

    sessions.forEach(function (session) {
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
        eventDiv.addEventListener('mouseover', function (ev) {
            // Show tooltip with session details
            showTooltip(ev);
        });

        // Remove tooltip when mouse leaves eventDiv
        eventDiv.addEventListener('mouseout', function () {
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

// Generate timeline guides and populate the timeline with session data
generateGuides();
generateVerticalRulers();

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

// Function to populate the apps table
function populateAppsTable(apps) {
    const appsTableBody = document.getElementById('apps-table-body');

    apps.forEach(app => {
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

//------------------------Sessions Table---------------------------
function populateSessionsTable(sessions) {
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

/*--------------------------Date Picker----------------------------*/

var useSessions = function (response) {
    console.log(response)
    //populate durations, timeline, apps, sessions
    $("#sessions-duration").html(response.sessions_duration.split('.')[0]);
    $("#date-duration").html(response.date_duration.split('.')[0]);

    populateTimeline(response.sessions)
    // populateAppsTable(response.apps)
    populateSessionsTable(response.sessions)
}

// Initialize Persian Date Picker
$(document).ready(function () {
    // Get today's date in solar Hijri
    var today = new persianDate().format('YYYY-MM-DD');

    var onSelectFunction = function (inputDate) {
        // Convert the selected date from Hijri to Gregorian (or from Gregorian to Gregorian)

        // Create a new instance of PersianDate with the Hijri date
        const hijriDate = new persianDate(inputDate, 'fa');
        // Convert the Hijri date to Gregorian
        const gregorianDate = hijriDate.toCalendar('gregorian').toLocale('en').format("YYYY-MM-DD");

        // Perform an AJAX request to send the selected date to the backend
        $.ajax({
            url: '/date',
            type: 'GET',
            data: {date: gregorianDate}, // Send the selected date in Gregorian format
            success: useSessions,
            error: function (xhr, status, error) {
                console.log(`${status}: ${error}`)
            }
        });
    };

    // Initialize the datepicker with today's date as the initial value
    $("#datepicker").pDatepicker({
        format: 'YYYY-MM-DD',
        initialValue: today, // Set initial value to today's date
        observer: true,
        responsive: true,
        autoClose: true,
        calendar: {
            persian: {
                locale: 'fa'
            }
        },
        onSelect: onSelectFunction
    });

    // Manually trigger the onSelect function with today's date
    onSelectFunction(today);
});
