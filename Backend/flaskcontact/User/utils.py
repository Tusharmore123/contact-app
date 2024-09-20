import random
from flaskcontact import mail
from flask_mail import Message
def extract_key(dict1,value,default):
    if not dict1:
        return "0"
    result=dict1.get(value,default)
    
    return result




def generate_otp():
    return str(random.randint(100000, 999999))

def send_otp_email(email, otp):
    msg = Message('Email Verification OTP', sender='Contacts+', recipients=[email])
    msg.body = f'Your OTP for email verification is {otp}. Please use the following link to verify your OTP: {otp}'
    try:
        mail.send(msg)
        # otp_link = url_for('verify_otp', _external=True)
        return True
    except Exception as e:
        return False



