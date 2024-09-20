from flask import Blueprint,jsonify
import mysql.connector # type: ignore
errors=Blueprint('error',__name__)




@errors.app_errorhandler(400)
def bad_request_error(error):
    response = {
        'status': 400,
        'message': str(error.description)  # Extract the description from the error
    }
    return jsonify(response), 400

@errors.app_errorhandler(404)
def not_found_error(error):
    response = {
        'status': 404,
        'message': 'Resource not found'
    }
    return jsonify(response), 404

@errors.app_errorhandler(500)
def internal_error(error):
    response = {
        'status': 500,
        'message': str(error.description)
    }
    return jsonify(response), 500
@errors.app_errorhandler(401)
def internal_error(error):
    response = {
        'status': 401,
        'message': str(error.description)
    }
    return jsonify(response), 401


@errors.app_errorhandler(403)
def internal_error(error):
    
    response = {
        'status': 403,
        'message': str(error.description)
    }
    return jsonify(response), 403
