import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv() # Load environment variables from .env file

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not found in environment variables. Please create a .env file.")

client = AsyncIOMotorClient(MONGO_URI)
database = client.candidate_analyzer # Name of your database
report_collection = database.get_collection("reports") # Name of your collection