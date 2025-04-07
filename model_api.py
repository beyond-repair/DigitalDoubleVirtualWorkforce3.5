from flask import Flask, request, jsonify
from flask_cors import CORS
from local_model import generate_response

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes


@app.route("/generate", methods=["POST"])
def generate():
    data = request.get_json()
    if not data or "prompt" not in data:
        return jsonify({"error": "Missing 'prompt' in request"}), 400

    prompt = data["prompt"]
    try:
        response_text = generate_response(prompt)
        return jsonify({"response": response_text})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/", methods=["GET"])
def index():
    return jsonify({"message": "Local Model API is running."})


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000)