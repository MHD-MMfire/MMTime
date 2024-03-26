import configparser

DEFAULT_CONFIG = """[Paths]
STEAM_PATH = F:/Games/Steam

[Database]
DB_NAME = sessions.db

[AppNames]
570 = Dota 2
359550 = Rainbow Six Siege
"""

# Initialize the configparser
config = configparser.ConfigParser()

# Read the configuration from config.ini
config.read('config.ini')

if not config.sections():
    with open("config.ini", "w") as file:
        file.write(DEFAULT_CONFIG)
        print("File config.ini with default values was created in app main directory.")
    config.read('config.ini')

# Get configuration values
STEAM_PATH = config['Paths']['STEAM_PATH']
DB_NAME = config['Database']['DB_NAME']
APP_NAMES = dict(config['AppNames'])
