from dataclasses import dataclass
from typing import Dict, List, Optional
import uuid

@dataclass
class QoSRequirements:
    latency_ms: float
    bandwidth_mbps: float
    reliability: float  # Percentage (0-100)
    isolation_level: str  # "shared", "isolated", "dedicated"

class NetworkSlice:
    def __init__(
        self,
        slice_id: Optional[str] = None,
        name: str = "",
        qos_requirements: Optional[QoSRequirements] = None,
        service_type: str = "eMBB"  # eMBB, URLLC, mMTC
    ):
        self.slice_id = slice_id or str(uuid.uuid4())
        self.name = name
        self.qos_requirements = qos_requirements or QoSRequirements(
            latency_ms=100.0,
            bandwidth_mbps=100.0,
            reliability=99.9,
            isolation_level="shared"
        )
        self.service_type = service_type
        self.allocated_resources: Dict[str, float] = {}
        self.virtual_functions: List[str] = []
        self.active = False
        self.performance_metrics = {
            "current_latency": 0.0,
            "current_bandwidth": 0.0,
            "reliability_score": 0.0,
            "resource_utilization": 0.0
        }

    def allocate_resources(self, resources: Dict[str, float]) -> bool:
        """
        Allocate resources to the network slice.
        
        Args:
            resources: Dictionary of resource types and their quantities
                      (e.g., {"cpu": 4, "memory": 8192, "bandwidth": 1000})
        
        Returns:
            bool: True if allocation successful, False otherwise
        """
        if not self.active:
            self.allocated_resources.update(resources)
            self.active = True
            return True
        return False

    def deallocate_resources(self) -> bool:
        """
        Deallocate all resources from the network slice.
        
        Returns:
            bool: True if deallocation successful, False otherwise
        """
        if self.active:
            self.allocated_resources.clear()
            self.active = False
            return True
        return False

    def add_virtual_function(self, vnf_id: str) -> bool:
        """
        Add a virtual network function to the slice.
        
        Args:
            vnf_id: Identifier of the virtual network function
        
        Returns:
            bool: True if addition successful, False otherwise
        """
        if vnf_id not in self.virtual_functions:
            self.virtual_functions.append(vnf_id)
            return True
        return False

    def remove_virtual_function(self, vnf_id: str) -> bool:
        """
        Remove a virtual network function from the slice.
        
        Args:
            vnf_id: Identifier of the virtual network function
        
        Returns:
            bool: True if removal successful, False otherwise
        """
        if vnf_id in self.virtual_functions:
            self.virtual_functions.remove(vnf_id)
            return True
        return False

    def update_performance_metrics(self, metrics: Dict[str, float]) -> None:
        """
        Update the performance metrics of the slice.
        
        Args:
            metrics: Dictionary of metric names and their values
        """
        self.performance_metrics.update(metrics)

    def meets_qos_requirements(self) -> bool:
        """
        Check if the slice meets its QoS requirements.
        
        Returns:
            bool: True if requirements are met, False otherwise
        """
        return (
            self.performance_metrics["current_latency"] <= self.qos_requirements.latency_ms and
            self.performance_metrics["current_bandwidth"] >= self.qos_requirements.bandwidth_mbps and
            self.performance_metrics["reliability_score"] >= self.qos_requirements.reliability
        )

    def to_dict(self) -> Dict:
        """
        Convert the network slice to a dictionary representation.
        
        Returns:
            Dict: Dictionary representation of the network slice
        """
        return {
            "slice_id": self.slice_id,
            "name": self.name,
            "service_type": self.service_type,
            "qos_requirements": {
                "latency_ms": self.qos_requirements.latency_ms,
                "bandwidth_mbps": self.qos_requirements.bandwidth_mbps,
                "reliability": self.qos_requirements.reliability,
                "isolation_level": self.qos_requirements.isolation_level
            },
            "allocated_resources": self.allocated_resources,
            "virtual_functions": self.virtual_functions,
            "active": self.active,
            "performance_metrics": self.performance_metrics
        } 