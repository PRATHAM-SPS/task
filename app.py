from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import contentful
from difflib import SequenceMatcher

app = Flask(__name__)
CORS(app)

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
        client = contentful.Client(creds['spaceId'], creds['apiKey'])
        fetched_keys = fetch_similar_keys_contentful(client, input_keys)
    
    return jsonify({'attributes': list(fetched_keys)})

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
        fields = content_type.fields  # Access fields as an attribute
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
