from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import contentful
from difflib import SequenceMatcher
import base64
import json

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["objectDB"]
objects_collection = db["objects"]

@app.route('/api/objects', methods=['GET'])
def list_objects():
    objects = list(objects_collection.find({}, {"_id": 0}))
    return jsonify(objects)

@app.route('/api/objects', methods=['POST'])
def create_object():
    data = request.json
    object_name = data['name']
    new_object = {
        "name": object_name,
        "attributes": [],
        "fetchedAttributes": [],
        "mappings": {}
    }
    objects_collection.insert_one(new_object)
    return jsonify(new_object)

@app.route('/api/objects/<string:name>', methods=['DELETE'])
def delete_object(name):
    objects_collection.delete_one({"name": name})
    return '', 204

@app.route('/api/objects/<string:name>', methods=['GET'])
def get_object(name):
    obj = objects_collection.find_one({"name": name}, {"_id": 0})
    return jsonify(obj)

@app.route('/api/objects/<string:name>', methods=['PUT'])
def update_object(name):
    data = request.json
    if "name" in data and data["name"] != name:
        objects_collection.update_one({"name": name}, {"$set": data})
        objects_collection.update_one({"name": data["name"]}, {"$set": data})
        return jsonify(data)
    else:
        objects_collection.update_one({"name": name}, {"$set": data})
        return jsonify(data)

@app.route('/api/data', methods=['POST'])
def get_data():
    data = request.json
    connector = data['connector']
    creds = data['creds']
    input_keys = data['attributes']
    
    if connector == 'mongodb':
        client = MongoClient(f"mongodb://{creds['username']}:{creds['password']}@{creds['host']}/{creds['database']}")
        db = client[creds['database']]
        collection = db.list_collection_names()
        fetched_keys = fetch_similar_keys_mongo(db, collection, input_keys)
    
    elif connector == 'contentful':
        client = contentful.Client(space_id=creds['spaceId'], access_token=creds['apiKey'])
        fetched_keys = fetch_similar_keys_contentful(client, input_keys)
    
    return jsonify({'attributes': list(fetched_keys)})

@app.route('/mappings/<encoded_mapping>', methods=['GET'])
def get_mapping(encoded_mapping):
    mapping_json = base64.b64decode(encoded_mapping).decode('utf-8')
    return jsonify(json.loads(mapping_json))

def fetch_similar_keys_mongo(db, collection, input_keys):
    keys = set()
    for coll in collection:
        documents = db[coll].find()
        for doc in documents:
            keys.update(doc.keys())
    return find_similar_keys(input_keys, keys)

def fetch_similar_keys_contentful(client, input_keys):
    keys = set()
    content_types = client.content_types()
    for content_type in content_types:
        fields = content_type.fields
        keys.update([field.id for field in fields])
    return keys

def find_similar_keys(input_keys, all_keys):
    similar_keys = set()
    for input_key in input_keys:
        for key in all_keys:
            if SequenceMatcher(None, input_key, key).ratio() > 0.6:
                similar_keys.add(key)
    return similar_keys

if __name__ == '__main__':
    app.run(debug=True)
