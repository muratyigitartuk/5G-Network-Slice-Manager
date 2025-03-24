from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, List, Optional
from pydantic import BaseModel
import uvicorn
import uuid
import logging
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('api.log')
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Network Slicing Management API",
    description="API for managing 5G/6G network slices and virtual network functions",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage
slices = {}
vnfs = {}

# Pydantic models
class QoSRequirements(BaseModel):
    latency_ms: float
    bandwidth_mbps: float
    reliability: float
    isolation_level: str

class CreateSliceRequest(BaseModel):
    name: str
    qos_requirements: QoSRequirements
    service_type: str

class VNFConfig(BaseModel):
    vnf_type: str
    instance_name: str
    config: Dict[str, str] = {}

@app.get("/")
async def root():
    logger.info("Health check request received")
    return {"status": "Network Slicing API is running"}

@app.post("/api/v1/slices")
async def create_slice(request: CreateSliceRequest):
    try:
        slice_id = str(uuid.uuid4())
        slices[slice_id] = {
            "id": slice_id,
            "name": request.name,
            "qos_requirements": request.qos_requirements.dict(),
            "service_type": request.service_type,
            "status": "active"
        }
        logger.info(f"Created new slice: {request.name} (ID: {slice_id})")
        return {"slice_id": slice_id}
    except Exception as e:
        logger.error(f"Error creating slice: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/slices")
async def list_slices():
    try:
        logger.info("Listing all slices")
        return {"slices": list(slices.values())}
    except Exception as e:
        logger.error(f"Error listing slices: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/slices/{slice_id}")
async def get_slice(slice_id: str):
    try:
        if slice_id not in slices:
            logger.warning(f"Slice not found: {slice_id}")
            raise HTTPException(status_code=404, detail="Slice not found")
        logger.info(f"Retrieved slice: {slice_id}")
        return slices[slice_id]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving slice: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/vnf/instances")
async def create_vnf(config: VNFConfig):
    try:
        instance_id = str(uuid.uuid4())
        vnfs[instance_id] = {
            "id": instance_id,
            "type": config.vnf_type,
            "name": config.instance_name,
            "status": "running",
            "config": config.config
        }
        logger.info(f"Created new VNF instance: {config.instance_name} (ID: {instance_id})")
        return {"instance_id": instance_id}
    except Exception as e:
        logger.error(f"Error creating VNF instance: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/vnf/instances")
async def list_vnfs():
    try:
        logger.info("Listing all VNF instances")
        return {"vnfs": list(vnfs.values())}
    except Exception as e:
        logger.error(f"Error listing VNF instances: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.on_event("startup")
async def startup_event():
    logger.info("Starting Network Slicing API server...")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Shutting down Network Slicing API server...")

if __name__ == "__main__":
    try:
        uvicorn.run(app, host="0.0.0.0", port=8000)
    except Exception as e:
        logger.error(f"Failed to start server: {str(e)}")
        sys.exit(1) 