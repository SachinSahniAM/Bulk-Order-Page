from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Configure logging (moved to top before usage)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")  # Ignore MongoDB's _id field
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

# Bulk Order Models
class BulkOrderLead(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    email: EmailStr
    phone: str
    company_name: Optional[str] = None
    product_type: str  # t-shirt, hoodie, sweatshirt
    quantity: int
    printing_type: str  # screen, digital, embroidery
    message: Optional[str] = None
    estimated_price: Optional[str] = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    status: str = Field(default="new")  # new, contacted, converted

class BulkOrderLeadCreate(BaseModel):
    name: str
    email: EmailStr
    phone: str
    company_name: Optional[str] = None
    product_type: str
    quantity: int
    printing_type: str
    message: Optional[str] = None
    estimated_price: Optional[str] = None

class QuoteRequest(BaseModel):
    product_type: str
    quantity: int
    printing_type: str

class QuoteResponse(BaseModel):
    estimated_price_range: str
    per_piece_price: str
    discount_percentage: int
    delivery_time: str

# Add your routes to the router instead of directly to app
@api_router.get("/")
async def root():
    return {"message": "Alma Mater Store - Bulk Order API"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    # Exclude MongoDB's _id field from the query results
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    
    return status_checks

# Bulk Order Endpoints
@api_router.post("/calculate-quote", response_model=QuoteResponse)
async def calculate_quote(quote_request: QuoteRequest):
    """Calculate estimated price for bulk order"""
    
    # Base prices per piece (in INR) - Actual pricing from client
    base_prices = {
        "round-neck-tshirt": {"screen": 499, "digital": 549, "embroidery": 599},
        "collar-tshirt": {"screen": 599, "digital": 649, "embroidery": 699},
        "hoodie": {"screen": 799, "digital": 849, "embroidery": 949},
        "zipper-hoodie": {"screen": 899, "digital": 949, "embroidery": 1049},
        # Legacy support for old product types
        "t-shirt": {"screen": 499, "digital": 549, "embroidery": 599},
        "sweatshirt": {"screen": 699, "digital": 749, "embroidery": 849}
    }
    
    # Quantity-based discounts
    discount_tiers = [
        (200, 30),   # 30% off for 200+
        (100, 25),   # 25% off for 100-199
        (50, 15),    # 15% off for 50-99
        (0, 0)       # No discount for less than 50 (0-49 pieces)
    ]
    
    # Get base price
    base_price = base_prices.get(quote_request.product_type, {}).get(quote_request.printing_type, 499)
    
    # Calculate discount
    discount = 0
    for qty_threshold, discount_pct in discount_tiers:
        if quote_request.quantity >= qty_threshold:
            discount = discount_pct
            break
    
    # Calculate final price
    discounted_price = base_price * (1 - discount / 100)
    total_min = discounted_price * quote_request.quantity
    total_max = (discounted_price * 1.05) * quote_request.quantity  # 5% variation for customization
    
    # Delivery time based on quantity
    if quote_request.quantity < 50:
        delivery = "7-10 working days"
    elif quote_request.quantity < 200:
        delivery = "10-14 working days"
    else:
        delivery = "14-21 working days"
    
    return QuoteResponse(
        estimated_price_range=f"₹{int(total_min):,} - ₹{int(total_max):,}",
        per_piece_price=f"₹{int(discounted_price)}",
        discount_percentage=discount,
        delivery_time=delivery
    )

@api_router.post("/bulk-order-lead", response_model=BulkOrderLead)
async def create_bulk_order_lead(lead_data: BulkOrderLeadCreate):
    """Submit bulk order lead form"""
    
    lead_obj = BulkOrderLead(**lead_data.model_dump())
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = lead_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.bulk_order_leads.insert_one(doc)
    
    logger.info(f"New bulk order lead received: {lead_obj.name} - {lead_obj.email} - {lead_obj.quantity} units")
    
    return lead_obj

@api_router.get("/bulk-order-leads", response_model=List[BulkOrderLead])
async def get_bulk_order_leads():
    """Get all bulk order leads"""
    leads = await db.bulk_order_leads.find({}, {"_id": 0}).to_list(1000)
    
    # Convert ISO string timestamps back to datetime objects
    for lead in leads:
        if isinstance(lead['timestamp'], str):
            lead['timestamp'] = datetime.fromisoformat(lead['timestamp'])
    
    return leads

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()