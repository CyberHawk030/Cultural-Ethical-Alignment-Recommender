from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional, List
from datetime import datetime

# Helper class for handling MongoDB's ObjectId in Pydantic models
class PyObjectId(ObjectId):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not ObjectId.is_valid(v):
            raise ValueError("Invalid objectid")
        return ObjectId(v)

    @classmethod
    def __get_pydantic_json_schema__(cls, field_schema):
        field_schema.update(type="string")

# The main schema for data we save to the database
class ReportSchema(BaseModel):
    id: PyObjectId = Field(default_factory=PyObjectId, alias="_id")
    candidate_name: str = Field(...)
    score: int = Field(...)
    date: datetime = Field(default_factory=datetime.utcnow)
    full_report: str = Field(...)

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
        json_encoders = {ObjectId: str}

# Schema for the brief summary sent to the history list
class ReportSummary(BaseModel):
    id: str = Field(..., alias="_id")
    candidate_name: str
    score: int
    date: datetime