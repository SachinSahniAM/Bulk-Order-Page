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
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


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

def send_email_notification(lead_obj: BulkOrderLead):
    """Send email notification to info@almamaterstore.in"""
    try:
        # Email configuration
        recipient_email = "info@almamaterstore.in"
        sender_email = "noreply@almamaterstore.in"
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['Subject'] = f"New Bulk Order Lead: {lead_obj.name} - {lead_obj.quantity} units"
        msg['From'] = sender_email
        msg['To'] = recipient_email
        
        # Create HTML email body
        html_body = f"""
        <html>
          <head>
            <style>
              body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; }}
              .container {{ max-width: 600px; margin: 0 auto; padding: 20px; }}
              .header {{ background: linear-gradient(135deg, #2563eb 0%, #7c3aed 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }}
              .content {{ background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }}
              .field {{ margin-bottom: 15px; }}
              .label {{ font-weight: bold; color: #1f2937; }}
              .value {{ color: #4b5563; margin-left: 10px; }}
              .highlight {{ background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }}
              .footer {{ background: #1f2937; color: white; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; }}
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2>🎯 New Bulk Order Lead Received!</h2>
              </div>
              <div class="content">
                <div class="field">
                  <span class="label">Name:</span>
                  <span class="value">{lead_obj.name}</span>
                </div>
                <div class="field">
                  <span class="label">Email:</span>
                  <span class="value">{lead_obj.email}</span>
                </div>
                <div class="field">
                  <span class="label">Phone:</span>
                  <span class="value">{lead_obj.phone}</span>
                </div>
                <div class="field">
                  <span class="label">Company:</span>
                  <span class="value">{lead_obj.company_name or 'Not provided'}</span>
                </div>
                <div class="highlight">
                  <div class="field">
                    <span class="label">Product Type:</span>
                    <span class="value">{lead_obj.product_type}</span>
                  </div>
                  <div class="field">
                    <span class="label">Quantity:</span>
                    <span class="value">{lead_obj.quantity} pieces</span>
                  </div>
                  <div class="field">
                    <span class="label">Printing Type:</span>
                    <span class="value">{lead_obj.printing_type}</span>
                  </div>
                  <div class="field">
                    <span class="label">Estimated Price:</span>
                    <span class="value">{lead_obj.estimated_price or 'Not calculated'}</span>
                  </div>
                </div>
                <div class="field">
                  <span class="label">Message:</span>
                  <div class="value" style="margin-top: 10px; background: white; padding: 15px; border-radius: 5px;">
                    {lead_obj.message or 'No additional message'}
                  </div>
                </div>
                <div class="field" style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                  <span class="label">Lead ID:</span>
                  <span class="value" style="font-family: monospace; font-size: 12px;">{lead_obj.id}</span>
                </div>
                <div class="field">
                  <span class="label">Submitted:</span>
                  <span class="value">{lead_obj.timestamp.strftime('%Y-%m-%d %H:%M:%S UTC')}</span>
                </div>
              </div>
              <div class="footer">
                <p>Alma Mater Store - Bulk Order System</p>
                <p>This is an automated notification. Please respond to the customer within 24 hours.</p>
              </div>
            </div>
          </body>
        </html>
        """
        
        # Attach HTML content
        html_part = MIMEText(html_body, 'html')
        msg.attach(html_part)
        
        # Send email using localhost SMTP (sendmail)
        with smtplib.SMTP('localhost', 25) as server:
            server.send_message(msg)
        
        logger.info(f"Email notification sent to {recipient_email} for lead {lead_obj.id}")
        return True
        
    except Exception as e:
        logger.error(f"Failed to send email notification: {str(e)}")
        # Don't fail the request if email fails
        return False

@api_router.post("/bulk-order-lead", response_model=BulkOrderLead)
async def create_bulk_order_lead(lead_data: BulkOrderLeadCreate):
    """Submit bulk order lead form"""
    
    lead_obj = BulkOrderLead(**lead_data.model_dump())
    
    # Convert to dict and serialize datetime to ISO string for MongoDB
    doc = lead_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    _ = await db.bulk_order_leads.insert_one(doc)
    
    logger.info(f"New bulk order lead received: {lead_obj.name} - {lead_obj.email} - {lead_obj.quantity} units")
    
    # Send email notification (non-blocking)
    try:
        send_email_notification(lead_obj)
    except Exception as e:
        logger.warning(f"Email notification failed but lead saved: {str(e)}")
    
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

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()