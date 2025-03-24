from typing import Dict, List, Optional, Tuple
import networkx as nx
from src.core.network_slice import NetworkSlice, QoSRequirements

class SDNController:
    def __init__(self):
        self.network_topology = nx.Graph()
        self.active_slices: Dict[str, NetworkSlice] = {}
        self.available_resources = {
            "cpu": 100.0,  # Total CPU units
            "memory": 1024000.0,  # Total memory in MB
            "bandwidth": 10000.0  # Total bandwidth in Mbps
        }
        self.resource_allocation = {}  # Track resource allocation per node
        self.slice_paths = {}  # Track paths for each slice

    def create_slice(
        self,
        name: str,
        qos_requirements: QoSRequirements,
        service_type: str
    ) -> Tuple[bool, Optional[str]]:
        """
        Create a new network slice with specified requirements.
        
        Args:
            name: Name of the slice
            qos_requirements: QoS requirements for the slice
            service_type: Type of service (eMBB, URLLC, mMTC)
        
        Returns:
            Tuple[bool, Optional[str]]: (Success status, Slice ID if successful)
        """
        # Check if we have enough resources
        if not self._check_resource_availability(qos_requirements):
            return False, None

        # Create new slice
        slice_instance = NetworkSlice(
            name=name,
            qos_requirements=qos_requirements,
            service_type=service_type
        )

        # Allocate resources
        resources = self._calculate_required_resources(qos_requirements)
        if slice_instance.allocate_resources(resources):
            self.active_slices[slice_instance.slice_id] = slice_instance
            self._update_available_resources(resources, allocate=True)
            return True, slice_instance.slice_id

        return False, None

    def delete_slice(self, slice_id: str) -> bool:
        """
        Delete an existing network slice.
        
        Args:
            slice_id: ID of the slice to delete
        
        Returns:
            bool: True if deletion successful, False otherwise
        """
        if slice_id in self.active_slices:
            slice_instance = self.active_slices[slice_id]
            resources = slice_instance.allocated_resources
            
            # Release resources
            if slice_instance.deallocate_resources():
                self._update_available_resources(resources, allocate=False)
                del self.active_slices[slice_id]
                if slice_id in self.slice_paths:
                    del self.slice_paths[slice_id]
                return True
        return False

    def update_slice(
        self,
        slice_id: str,
        qos_requirements: Optional[QoSRequirements] = None,
        service_type: Optional[str] = None
    ) -> bool:
        """
        Update an existing network slice's configuration.
        
        Args:
            slice_id: ID of the slice to update
            qos_requirements: New QoS requirements
            service_type: New service type
        
        Returns:
            bool: True if update successful, False otherwise
        """
        if slice_id not in self.active_slices:
            return False

        slice_instance = self.active_slices[slice_id]
        
        if qos_requirements:
            # Check if we can accommodate new requirements
            old_resources = slice_instance.allocated_resources
            new_resources = self._calculate_required_resources(qos_requirements)
            
            # Update resource allocation
            self._update_available_resources(old_resources, allocate=False)
            if self._check_resource_availability(qos_requirements):
                slice_instance.qos_requirements = qos_requirements
                slice_instance.allocate_resources(new_resources)
                self._update_available_resources(new_resources, allocate=True)
            else:
                # Rollback if we can't accommodate new requirements
                self._update_available_resources(old_resources, allocate=True)
                return False

        if service_type:
            slice_instance.service_type = service_type

        return True

    def get_slice_status(self, slice_id: str) -> Optional[Dict]:
        """
        Get the current status of a network slice.
        
        Args:
            slice_id: ID of the slice
        
        Returns:
            Optional[Dict]: Slice status information if found, None otherwise
        """
        if slice_id in self.active_slices:
            slice_instance = self.active_slices[slice_id]
            return {
                "slice": slice_instance.to_dict(),
                "path": self.slice_paths.get(slice_id, []),
                "resource_utilization": self._calculate_utilization(slice_instance)
            }
        return None

    def _check_resource_availability(self, qos_requirements: QoSRequirements) -> bool:
        """
        Check if required resources are available.
        
        Args:
            qos_requirements: QoS requirements to check against
        
        Returns:
            bool: True if resources are available, False otherwise
        """
        required_resources = self._calculate_required_resources(qos_requirements)
        
        for resource_type, amount in required_resources.items():
            if self.available_resources.get(resource_type, 0) < amount:
                return False
        return True

    def _calculate_required_resources(self, qos_requirements: QoSRequirements) -> Dict[str, float]:
        """
        Calculate required resources based on QoS requirements.
        
        Args:
            qos_requirements: QoS requirements
        
        Returns:
            Dict[str, float]: Required resources
        """
        # Simple resource calculation based on QoS requirements
        # In a real implementation, this would be more sophisticated
        return {
            "cpu": qos_requirements.bandwidth_mbps * 0.1,  # Example calculation
            "memory": qos_requirements.bandwidth_mbps * 10,  # Example calculation
            "bandwidth": qos_requirements.bandwidth_mbps
        }

    def _update_available_resources(self, resources: Dict[str, float], allocate: bool) -> None:
        """
        Update available resources after allocation/deallocation.
        
        Args:
            resources: Resources to update
            allocate: True if allocating, False if deallocating
        """
        for resource_type, amount in resources.items():
            if allocate:
                self.available_resources[resource_type] -= amount
            else:
                self.available_resources[resource_type] += amount

    def _calculate_utilization(self, slice_instance: NetworkSlice) -> Dict[str, float]:
        """
        Calculate resource utilization for a slice.
        
        Args:
            slice_instance: Network slice instance
        
        Returns:
            Dict[str, float]: Resource utilization metrics
        """
        utilization = {}
        for resource_type, amount in slice_instance.allocated_resources.items():
            total = self.available_resources[resource_type] + amount
            utilization[resource_type] = (amount / total) * 100
        return utilization

    def optimize_resource_allocation(self) -> None:
        """
        Optimize resource allocation across all active slices.
        This is a placeholder for more sophisticated optimization algorithms.
        """
        # Implement resource optimization logic here
        # This could include:
        # 1. Load balancing
        # 2. Priority-based reallocation
        # 3. QoS-aware optimization
        pass 