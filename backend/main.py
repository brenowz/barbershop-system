from fastapi import FastAPI
from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

app = FastAPI(title= "Mauro Cortes Barbershop API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class OrderItem(BaseModel):
    name: str
    price: float

class OrderCreate(BaseModel):
    client_name: Optional[str] = "Cliente"
    total_value: float
    payment_method: str = "PIX"
    items: List[OrderItem]

orders_db = []

@app.get("/")
def home():
    return {"status": "ok", "message": "API active"}


