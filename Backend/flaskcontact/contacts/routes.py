from flask import request,Blueprint,session,make_response,abort,jsonify
from flask_login import LoginManager,login_required,logout_user,login_user,UserMixin,current_user
from flaskcontact.db import get_db_connection
from flaskcontact.User.utils import extract_key,send_otp_email,generate_otp
from flaskcontact import bcrypt
from flaskcontact.models import User
from flaskcontact.User.custom_exception import CustomException
import mysql.connector # type: ignore
from flaskcontact import Session
contacts=Blueprint('contacts',__name__)


@contacts.route('/contact-list')
@login_required
def contact_list():
    try :
        
        user_id=current_user.get_id()
        conn=get_db_connection()
        cursor=conn.cursor(dictionary=True)
        cursor.execute('''
        select id,contact_name,contact_email,contact_phone,contact_address,profile_image_url
        from contacts
        where user_id=%s
        ''',(user_id,))
        
        contact_lists=cursor.fetchall()
        response=make_response(jsonify({'message':'contacts fetched successfully','data':contact_lists}),200)
        return response
    except mysql.connector.Error as e:
        return abort(500,description="failed to connect to mysql")
    





@contacts.route('/<int:id>/contact-profile')
@login_required
def contact_profile(id):
    try :
        conn=get_db_connection()
        cursor=conn.cursor(dictionary=True)
        cursor.execute('''
        select contact_name,contact_email,contact_phone,contact_address,profile_image_url
        from contacts
        where user_id=%s
        ''',(id,))
        contact_lists=cursor.fetchall()
    except mysql.connector.Error as e:
        return abort(500,description="failed to connect to mysql")

    

@contacts.route('/user-profile')
@login_required
def user_profile():
    try :
        user_id=current_user.get_id()
        conn=get_db_connection()
        cursor=conn.cursor(dictionary=True)
        cursor.execute('''
        select contact_name,contact_email,contact_phone,contact_address,profile_image_url
        from contacts
        where user_id=%s
        ''',(user_id,))
        contact_lists=cursor.fetchall()
    except mysql.connector.Error as e:
        return abort(500,description="failed to connect to mysql")


@contacts.route('/add-contact', methods=["POST"])
@login_required
def add_contact():
    try:
        
        contact_name = extract_key(request.form, 'name', "")
        email = extract_key(request.form, 'email', "")
        phone_no = extract_key(request.form, 'phone_no', "")
        address = extract_key(request.form, 'address', "")
        profile_image_url = extract_key(request.form, 'profile_image_url', 'default.jpg')

        # Ensure all required details are provided

        conn = get_db_connection()
        cursor = conn.cursor()
        if not contact_name or not email or not phone_no:
            raise CustomException('Please provide all details', 400)

        # Check if contact with the same name or email already exists
        cursor.execute('SELECT * FROM contacts WHERE (contact_name=%s OR contact_email=%s) and user_id=%s', (contact_name, email,current_user.get_id()))
        user = cursor.fetchone()
        
        if user:
            raise CustomException('Contact name or email already exists', 403)

        # Insert new contact into database
        cursor.execute('''
            INSERT INTO contacts (user_id, contact_name, contact_phone, contact_address, profile_image_url, contact_email)
            VALUES (%s, %s, %s, %s, %s, %s)
        ''', (current_user.get_id(), contact_name, phone_no, address, profile_image_url, email))
        conn.commit()
        response = {'message': 'Added contact successfully'}
        return make_response(jsonify(response), 200)

    except mysql.connector.Error as e:
        # Handle MySQL specific errors
        
        return abort(501, description=str(e))
    except CustomException as e:
        # Handle custom exceptions
        return abort(e.code, description=e)
    finally:
        # Ensure resources are closed
        cursor.close()
        conn.close()


    

@contacts.route('/<int:id>/update-contact',methods=['POST','GET'])
@login_required
def update_contact_details(id):
    try:
        if request.method=='POST':
            conn=get_db_connection()
            cursor=conn.cursor()
            contact_name=extract_key(request.form,'username',"")
            email=extract_key(request.form,'email',"")
            phone_no=extract_key(request.form,'phone',"")
            address=extract_key(request.form,'address',"")
            profile_image_url=extract_key(request.form,'profile_image_url','default.jpg')
            
            if not(contact_name and email and phone_no):
                raise CustomException('Please provide all details',400)
            if not (contact_name and email and phone_no):
                raise CustomException("please provide all details",403)
            cursor.execute('select * from contacts where contact_name=%s and contact_email=%s',(contact_name,email))
            user=cursor.fetchone()
            
            #Insert the values and user into database
            if user:
                raise CustomException('User with email id and name already exists',400)
            cursor.execute('''
            Update contacts set contact_name=%s,contact_phone=%s,contact_address=%s,profile_image_url=%s,contact_email=%s
            where id=%s and user_id=%s
            ''',(contact_name,phone_no,address,profile_image_url,email,id,current_user.get_id()))
            conn.commit()
            response={'message':'Updated details Successfully'}
            return make_response(jsonify(response),200)

        else:
            conn=get_db_connection()
            cursor=conn.cursor(dictionary=True)
            cursor.execute('''
            select contact_name,contact_email,contact_phone,contact_address,profile_image_url
            from contacts
            where id=%s and user_id=%s
            ''',(id,current_user.get_id()))
            
            
            contact_lists=cursor.fetchone()
            response={'message':'Contacts fetched successfully',
                    'data':contact_lists}
            conn.commit()
            return make_response(jsonify(response),200)
    except mysql.connector.Error as e:
        return abort(501,description=e)
    except CustomException as e:
        return abort(e.code,description=e)
    finally:
        cursor.close()
        conn.close()
    
@contacts.route('/<int:id>/delete',methods=["DELETE"])
@login_required
def delte_contact_details(id):
    try:
       
        conn=get_db_connection()
        cursor=conn.cursor()
        
        cursor.execute('Delete  from contacts where id=%s ',(id,))
        user=cursor.fetchone()
        
       
        conn.commit()
        response={'message':'Deleted contact Successfully'}
        return make_response(jsonify(response),200)

       
    except mysql.connector.Error as e:
        return abort(501,description=e)
    except CustomException as e:
        return abort(e.code,description=e)
    finally:
        cursor.close()
        conn.close()
    

@contacts.route('/update-user',methods=['POST','GET'])
@login_required 
def update_user_profile():
    try:
        if request.method=='POST':
            contact_name=extract_key(request.form,'name',"")
            email=extract_key(request.form,'email',"")
            phone_no=extract_key(request.form,'phone_no',"")
            address=extract_key(request.form,'address',"")
            profile_image_url=extract_key(request,'profile_image_url','default.jpg')
            conn=get_db_connection()
            cursor=conn.cursor()
            if not(contact_name and email and phone_no):
                raise CustomException('Please provide all details',400)
            if not (contact_name and email and phone_no):
                raise CustomException("please provide all details",403)
            #Insert the values and user into database
            cursor.execute('''
            Update contacts set contact_name=%s,contact_phone=%s,contact_address=%s,profile_image_url=%s
            where user_id=%s
            ''',(contact_name,phone_no,address,profile_image_url,current_user.get_id()))
            response={'message':'Updated details Successfully'}
            return make_response(jsonify(response),200)

        else:
            conn=get_db_connection()
            cursor=conn.cursor(dictionary=True)
            cursor.execute('''
            select contact_name,contact_email,contact_phone,contact_address,profile_image_url
            from contacts
            where user_id=%s
            ''',(current_user.get_id(),))
            contact_lists=cursor.fetchall()
            response={'message':'Contacts fetched successfully',
                    'data':contact_lists}
            return make_response(jsonify(response),200)
    except mysql.connector.Error as e:
        return abort(501,description=e)
    except CustomException as e:
        return abort(e.code,description=e)
    finally:
        cursor.close()
        conn.close()


@contacts.route('/spam', methods=['POST'])
@login_required
def spam_details():
    try:
       
        # Debugging line

        # Establish a database connection
        conn = get_db_connection()
        cursor = conn.cursor()  # Returns results as a dictionary

        # Get reporter ID
        reporter_id = current_user.get_id()

        # Extract form data
        contact_no = extract_key(request.form, 'phone_no', '')
        reason = extract_key(request.form, 'reason', '')
        cursor.execute('''
        select * from spam_reports where reporter_id=%s and contact_phone=%s''',(reporter_id,contact_no))
        spam_user=cursor.fetchone()
       
        if spam_user:
            raise CustomException('User already reported spam',400)
        cursor.execute('Insert into spam_reports(reporter_id,reason,contact_phone) values(%s,%s,%s)',(reporter_id,reason,contact_no))
        conn.commit()
        
        # Create the response
        response = {
            'message': 'Reported spam successfully',
        }

        # Commit the transaction
        conn.commit()

        # Return the response
        return make_response(jsonify(response), 200)

    except mysql.connector.Error as e:
        # Handle database errors
        return abort(501, description=str(e))

    except CustomException as e:
        # Handle custom exceptions
        return abort(e.code, description=str(e))

    finally:
        # Ensure resources are cleaned up
        if cursor:
            cursor.close()
        if conn:
            conn.close()

@contacts.route('/<int:contact_no>/spam-report')
@login_required
def spam_report(contact_no):
    try:
        # Debugging line

        # Establish a database connection
        
        if not contact_no:
            raise CustomException('Invalid url', 400)
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)  # Returns results as a dictionary

        cursor.execute('''select count(*) as total_user from users''')
        total_user=cursor.fetchone()
        cursor.execute('''Select count(distinct(reporter_id)) as reported_users from spam_reports
                                      where contact_phone=%s''',(contact_no,))
        reported_users=cursor.fetchone()
        # Commit the transaction
        conn.commit()

        

        # Get spam count for the reported contact
        

       
        spam_likelihood = (reported_users['reported_users']/ total_user['total_user']) * 100 if total_user['total_user'] > 0 else reported_users['reported_users']

        # Create the response
        response = {
            'message': 'Reported spam successfully',
            'data': {
                ' toatl_user':total_user['total_user'],
                'reported_users':reported_users['reported_users'],
                'spam_likelihood': spam_likelihood
            }
        }


        # Return the response
        return make_response(jsonify(response), 200)

    except mysql.connector.Error as e:
        # Handle database errors
        return abort(501, description=str(e))

    except CustomException as e:
        # Handle custom exceptions
        return abort(e.code, description=str(e))

    finally:
        # Ensure resources are cleaned up
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    

