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
function populateTimeline(sessions, baseDate) {
    var timelineEvents = document.querySelector('.timeline-events');

    sessions.forEach(function (session) {
        var startTime = false;
        if (!session.start_time.includes('prev'))
            startTime = new Date(baseDate + "T" + session.start_time);

        var endTime = false;
        if (!session.end_time.includes('next'))
            endTime = new Date(baseDate + "T" + session.end_time);

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
    if (startTime === false)
        return -5;
    // Total minutes in a day
    var totalMinutesInDay = 24 * 60;
    // Convert hours and minutes to total minutes
    var totalMinutes = (startTime.getHours() * 60) + startTime.getMinutes();
    // Calculate position as a percentage of total minutes in a day
    return (totalMinutes / totalMinutesInDay) * 100;
}

// Calculate width of session event based on start and end times
function calculateWidth(startTime, endTime) {
    // Total minutes in a day
    var totalMinutesInDay = 24 * 60;
    //exception for beginning of day
    if (startTime === false)
        return 5 + (endTime.getHours() * 60 + endTime.getMinutes()) / totalMinutesInDay * 100;
    //exception for end of day
    if (endTime === false)
        return 100;
    // Convert milliseconds to minutes
    var durationMinutes = (endTime - startTime) / (1000 * 60);
    // Calculate width as a percentage of total minutes in a day
    return (durationMinutes / totalMinutesInDay) * 100;
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
    if (rect.left < 0)
        tooltip.style.left = 0;
    else
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

    Object.keys(apps).forEach(key => {
        const row = document.createElement('tr');

        var app = apps[key];

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
    //populate durations, timeline, apps, sessions
    $("#sessions-duration").html(response.sessions_duration);
    $("#date-duration").html(response.date_duration);

    //unpopulate previous data:
    $(".timeline-events").html("");
    $("#apps-table-body").html("");
    $("#sessions-table-body").html("");

    //format time ranges relative to selected date
    var sessions = response.sessions;
    sessions.forEach(session => {
        var relativeTimes = formatTimeRangeRelativeToBaseDate(session.start_time, session.end_time, response.date);
        session.start_time = relativeTimes[0];
        session.end_time = relativeTimes[1];

        var gregorianDateTime = new Date(session.scan_time);
        var scanTime = new persianDate(gregorianDateTime, 'fa').format("YYYY-MM-DD HH:mm:ss");
        session.scan_time = farsiToEnglishNumbers(scanTime);
    });

    populateTimeline(sessions, response.date);
    populateAppsTable(response.apps);
    populateSessionsTable(sessions);
}

function formatTimeRangeRelativeToBaseDate(fromDatetime, toDatetime, baseDate) {
    const fromDate = new Date(fromDatetime);
    const toDate = new Date(toDatetime);
    const baseDateTime = new Date(baseDate + 'T00:00:00');

    let startTime, endTime;

    var timeFormat = function (date) {
        return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false,});
    }

    if (fromDate.toDateString() === toDate.toDateString()) {
        // If start date and end date are the same
        startTime = timeFormat(fromDate);
        endTime = timeFormat(toDate);
    } else {
        // If start and end dates are different
        if (fromDate.toDateString() === baseDateTime.toDateString()) {
            // Start date is the same as the base date
            startTime = timeFormat(fromDate);
            endTime = 'next ' + timeFormat(toDate);
        } else {
            // End date is the same as the base date
            startTime = 'prev ' + timeFormat(fromDate);
            endTime = timeFormat(toDate);
        }
    }

    return [startTime, endTime];
}

function farsiToEnglishNumbers(input) {
    const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
    const englishDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

    // Replace each Farsi digit with its English counterpart
    for (let i = 0; i < 10; i++) {
        const regex = new RegExp(farsiDigits[i], 'g');
        input = input.replace(regex, englishDigits[i]);
    }

    return input;
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
