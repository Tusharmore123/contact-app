
from flask_login import UserMixin
from flaskcontact import login_manager
from flaskcontact.db import get_db_connection
from flaskcontact.User.custom_exception import CustomException
import mysql.connector # type: ignore
class User(UserMixin):
    def __init__(self,username,email,user_id):
        self.username=username
        self.email=email
        self.id=user_id
        


@login_manager.user_loader
def load_user(user_id):
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))
        user = cursor.fetchone()
        if not user:
            raise CustomException('User does not exists',401)
        return User(user['username'], user['email'],user['id'])
    except mysql.connector.Error as e:
        return None
    except CustomException as e:
        return None
    finally:
        cursor.close()
        conn.close()
    

