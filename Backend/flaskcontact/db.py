
import mysql.connector # type: ignore
import os
from dotenv import load_dotenv
load_dotenv()

db_config={
    'host':os.getenv('host'),
    'user':os.getenv('user'),
    'password':os.getenv('password'),
    'database':os.getenv('database')
}

def get_db_connection():

    return mysql.connector.connect(
        host=db_config['host'],
        password=db_config['password'],
        user=db_config['user'],
        database=db_config['database'])


