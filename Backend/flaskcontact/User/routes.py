from flask import request,Blueprint,session,make_response,abort,jsonify
from flask_login import LoginManager,login_required,logout_user,login_user,UserMixin,current_user
from flaskcontact.db import get_db_connection
from flaskcontact.User.utils import extract_key,send_otp_email,generate_otp
from flaskcontact import bcrypt
from flaskcontact.models import User
from flaskcontact.User.custom_exception import CustomException
import mysql.connector # type: ignore
from flaskcontact import Session
user=Blueprint('user',__name__)


@user.route('/test-session')
def test_session():
    return session['registration']


@user.route('/ping')
def ping():
    return "<center><h1>actively running flask on port 5000<h1></center>"

@user.route('/login',methods=['GET','POST'])
def login():
    if request.method=='POST':
        try:
           
            email=extract_key(request.form,'email',"")
            password=extract_key(request.form,'password',"")
            conn = get_db_connection()

            cursor = conn.cursor(dictionary=True)  # dictionary=True gives us the result as a dict
            if not (email and password):
                raise CustomException('Please provide email and password',403)
            cursor.execute("SELECT * FROM users WHERE email = %s", (email,))
            user = cursor.fetchone()
            #check if user exists and matches the password
            if not user:
                raise CustomException('Please enter a registered email',401)
            
            hash_password=extract_key(user,'password',"")
            check_password=bcrypt.check_password_hash(hash_password,password)
            if not check_password:
                raise CustomException('Please enter a valid password',401)
            
            
            response={
                'message':'logged in successfully'
            }
            user_obj = User( user['username'], user['email'],user['id'])
            session.permanent=False
            login_user(user_obj)
            return make_response(jsonify(response),200)
            
        except CustomException as e:
            return abort(e.code,description=e)
        finally:
            cursor.close()
            conn.close()


@user.route('/logout')
@login_required
def logout():
    
    logout_user()
    session.clear()
    response = {'message': 'You have been logged out.'}
    #redirect to home page
    return make_response(jsonify(response), 200)
    

@user.route('/register', methods=['POST'])
def register_user():
    try:
        username = extract_key(request.form, 'username', "")
        email = extract_key(request.form, 'email', "")
        password = extract_key(request.form, 'password', "")
        conn=get_db_connection()
        cursor=conn.cursor()
        if not (username and email and password):
            raise CustomException("Please provide all details", 403)
        
        cursor.execute("SELECT * FROM users WHERE email = %s or username=%s", (email,username))
        user = cursor.fetchone()
        #check if user exists and matches the password
        if user:
            raise CustomException('Username or email already exists',401)
        
        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')
        otp = generate_otp()
        otp_status = send_otp_email(email, otp)
        if not otp_status:
            raise CustomException('Failed to send OTP', 500)

        session['registration']={'username': username, 'email': email, 'password': hashed_password, 'otp': otp}
        
        
        
        resp = make_response(jsonify({'message': 'OTP sent successfully'}), 200)
        
        return resp
    except CustomException as e:
        
        return abort(e.code, description=e)
    finally:
        cursor.close()
        conn.close()

    
    
@user.route('/verify-otp', methods=['POST'])
def verify_otp():
    
    try:
        
        otp = request.form['otp']
        
        if otp!=session['registration']['otp']:
            raise CustomException('Invalid otp',401)
        conn = get_db_connection()
        cursor=conn.cursor()
        if 'registration' not in session:
            raise CustomException('Invalid Registration',500)
        
        user_data=session['registration']
        cursor.execute("SELECT * FROM users WHERE email = %s or username=%s", ( user_data['email'],user_data['username']))
        user = cursor.fetchone()
        #check if user exists and matches the password
        if user:
            raise CustomException('Username or email already exists',401)
        cursor.execute('INSERT INTO users (username, email, password) VALUES (%s, %s, %s)',
                        (user_data['username'], user_data['email'], user_data['password']))
    
        conn.commit()
        conn.close()
        response={'message':'new user created successfully'}
        
        return make_response(jsonify(response),201)
            
    except CustomException as e:
       
        return abort(e.code,description=e)


