from flask import Flask, jsonify

def create_app():
    app = Flask(__name__)

    @app.route('/')
    def hello():
        return jsonify({"message": "Hello from Poetry + Flask!"})

    return app
