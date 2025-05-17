from bson import ObjectId
from datetime import datetime

def fix_mongo_types(doc):
    if isinstance(doc, list):
        return [fix_mongo_types(d) for d in doc]
    elif isinstance(doc, dict):
        return {
            k: fix_mongo_types(v)
            for k, v in doc.items()
        }
    elif isinstance(doc, ObjectId):
        return str(doc)
    elif isinstance(doc, datetime):
        return doc.isoformat()
    else:
        return doc
