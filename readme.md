command to start frontend:-npm run dev
<!-- frontend set up -->
npm install react-router-dom
npm install cloudinary-react 
npm install @reduxjs/toolkit react-redux
npm install axios
npm install react-hook-form
npm install @headlessui/react@2.1.8
npm install @heroicons/react@2.1.5
<!-- .env variables -->
VITE_BASE_URL="flask base url"
VITE_CLOUDINARY_PRESET="your preset name"
VITE_CLOUDINARY_NAME="your cloud name"


<!-- Backend set -->
insatll following packages

mysql-connector-python==9.0.0
Flask==2.3.3 
Flask-Bcrypt==1.0.1 
Flask-Cors==5.0.0 
Flask-Login==0.6.3
Flask-Mail==0.10.0 
Flask-Session==0.4.0 
Flask-SQLAlchemy==3.1.1
Flask-WTF==1.2.1 
itsdangerous==2.2.0 
Jinja2==3.1.4 
MarkupSafe==2.1.5 
Werkzeug==3.0.3 
python-dotenv==1.0.1 

<!-- .env set up -->
<!-- for database connection -->
host=""
user=""
password=""
database=""
<!-- for email -->
email=""
password_email=""

<!-- database set up -->
<!-- Create user table -->
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profile_image_url VARCHAR(255) default 'default.jpg',   -- To store the URL of the profile image
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
<!-- for contact table -->
CREATE TABLE contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,      -- Reference to the user who owns the contact
    contact_name VARCHAR(100) NOT NULL,
    contact_email VARCHAR(100) NOT NULL,
    contact_phone VARCHAR(20),
    contact_address VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    profile_image_url varchar(255) default 'default.jpg'
);
<!-- for spam-report table -->
CREATE TABLE spam_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reporter_id INT NOT NULL,   -- The user who is reporting spam
    
    reason VARCHAR(255) ,
    contact_phone varchar(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (reporter_id) REFERENCES users(id)

)