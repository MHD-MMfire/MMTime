# MMTime

MMTime is a productivity application designed to track Steam playtime in detail, providing insights into game usage patterns and playtime durations. Developed by [Your Name], MMTime offers features to monitor game sessions, analyze playtime data, and enhance productivity.

## Screenshot

![v1 0 2 Screenshot](https://github.com/MHD-MMfire/MMTime/assets/16380255/aafb9563-b3af-4253-ade1-ff49d496a652)

## Usage (Release Files)

- Download the latest release from [here](https://github.com/MHD-MMfire/MMTime/releases)
- Unzip file
- Set STEAM_PATH in `config.ini` (you can also add as many AppNames as you want, using steam app ids)
- Run `MMTime.exe`. First run might take a while since it creates `sessions.db` and scans for the first time.
- The dashboard should appear in browser window. If not, manually open `localhost:5000` in any browser.
- Close browser tab and MMTime.exe terminal when you're done.

**Automatic Scan**: If you set a task in Windows Task Scheduler to run `scanner.exe` in desired intervals, the database is updated frequently so you don't miss any old sessions lost by steam log size limit if it hasn't been scanned yet. To run terminal silently in the background, make sure to check "Run whether user is logged on or not".

## Features

- **Steam Playtime Tracking**: MMTime tracks playtime for Steam games using steam log files, and store details.
- **Detailed Insights**: Gain insights into gaming habits with detailed reports on playtime duration, session frequency, and more.
- **Offline Tracking**: MMTime doesn't need to be open while playing. It uses steam logs and doesn't intervene anything.

## Contributing

Contributions to MMTime are welcome! If you'd like to contribute to the project, please follow these guidelines:

- Fork the MMTime repository.
- Create a new branch for your feature or bug fix.
- Make your changes and test thoroughly.
- Submit a pull request with a detailed description of your changes.

## Support

For support, bug reports, or feature requests, please contact MMFire#4018 at Discord.
