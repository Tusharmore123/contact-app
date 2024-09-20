from flask import (Flask,request,redirect,
                   make_response,abort,
                   jsonify,session,url_for
                   )
from flask_session import Session
from flask_login import LoginManager,login_required,logout_user,login_user,UserMixin,current_user
import os
from dotenv import load_dotenv
load_dotenv()
from datetime import datetime,timedelta
import mysql.connector # type: ignore
from flask_bcrypt import Bcrypt
from flask_cors import CORS # type: ignore
from flask_mail import Mail,Message
login_manager=LoginManager()
    
login_manager.login_view='login'
mail=Mail()
sess=Session()
bcrypt=Bcrypt()
def create_app():
    
    app=Flask(__name__)

    app.secret_key='58c1790b148e0394db3277952a0cc2c2'
    bcrypt.init_app(app)
    app.config['MAIL_SERVER']='smtp.gmail.com'
    app.config['MAIL_PORT']=587
    app.config['SESSION_COOKIE_SAMESITE'] = 'None'
    app.config['SESSION_COOKIE_SECURE'] = True  # Required when using 'None'

    app.config['SESSION_COOKIE_HTTPONLY'] =False
    app.config['MAIL_USERNAME']=os.getenv('email')
    app.config['MAIL_PASSWORD']=os.getenv('password_email')
    app.config['MAIL_USE_TLS']=True
    app.config['MAIL_USE_SSL']=False
    

    CORS(app,supports_credentials=True)
    login_manager.__init__(app)
    mail.init_app(app)
    sess.init_app(app)
   
    from flaskcontact.User.routes import user
    from flaskcontact.contacts.routes import contacts
    from flaskcontact.errors.routes import errors
    app.register_blueprint(user)
    app.register_blueprint(contacts)
    app.register_blueprint(errors)

    return app