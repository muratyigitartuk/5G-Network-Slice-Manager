import pytest
from src.core.network_slice import NetworkSlice, QoSRequirements
from src.sdn.controller import SDNController
from src.nfv.vnf_manager import VNFManager
from src.ai.resource_predictor import ResourcePredictor

@pytest.fixture
def qos_requirements():
    return QoSRequirements(
        latency_ms=20.0,
        bandwidth_mbps=1000.0,
        reliability=99.9,
        isolation_level="shared"
    )

@pytest.fixture
def network_slice(qos_requirements):
    return NetworkSlice(
        name="test-slice",
        qos_requirements=qos_requirements,
        service_type="eMBB"
    )

@pytest.fixture
def sdn_controller():
    return SDNController()

@pytest.fixture
def vnf_manager():
    return VNFManager()

@pytest.fixture
def resource_predictor():
    return ResourcePredictor()

class TestNetworkSlice:
    def test_slice_creation(self, network_slice, qos_requirements):
        assert network_slice.name == "test-slice"
        assert network_slice.service_type == "eMBB"
        assert network_slice.qos_requirements == qos_requirements
        assert not network_slice.active
        assert not network_slice.allocated_resources

    def test_resource_allocation(self, network_slice):
        resources = {
            "cpu": 4.0,
            "memory": 8192.0,
            "bandwidth": 1000.0
        }
        
        assert network_slice.allocate_resources(resources)
        assert network_slice.active
        assert network_slice.allocated_resources == resources

    def test_resource_deallocation(self, network_slice):
        resources = {
            "cpu": 4.0,
            "memory": 8192.0,
            "bandwidth": 1000.0
        }
        
        network_slice.allocate_resources(resources)
        assert network_slice.deallocate_resources()
        assert not network_slice.active
        assert not network_slice.allocated_resources

    def test_vnf_management(self, network_slice):
        vnf_id = "test-vnf"
        assert network_slice.add_virtual_function(vnf_id)
        assert vnf_id in network_slice.virtual_functions
        assert network_slice.remove_virtual_function(vnf_id)
        assert vnf_id not in network_slice.virtual_functions

class TestSDNController:
    def test_slice_creation(self, sdn_controller, qos_requirements):
        success, slice_id = sdn_controller.create_slice(
            name="test-slice",
            qos_requirements=qos_requirements,
            service_type="eMBB"
        )
        
        assert success
        assert slice_id in sdn_controller.active_slices

    def test_slice_deletion(self, sdn_controller, qos_requirements):
        success, slice_id = sdn_controller.create_slice(
            name="test-slice",
            qos_requirements=qos_requirements,
            service_type="eMBB"
        )
        
        assert success
        assert sdn_controller.delete_slice(slice_id)
        assert slice_id not in sdn_controller.active_slices

    def test_slice_update(self, sdn_controller, qos_requirements):
        success, slice_id = sdn_controller.create_slice(
            name="test-slice",
            qos_requirements=qos_requirements,
            service_type="eMBB"
        )
        
        new_qos = QoSRequirements(
            latency_ms=10.0,
            bandwidth_mbps=2000.0,
            reliability=99.99,
            isolation_level="isolated"
        )
        
        assert success
        assert sdn_controller.update_slice(
            slice_id=slice_id,
            qos_requirements=new_qos,
            service_type="URLLC"
        )
        
        updated_slice = sdn_controller.active_slices[slice_id]
        assert updated_slice.qos_requirements == new_qos
        assert updated_slice.service_type == "URLLC"

class TestVNFManager:
    def test_vnf_registration(self, vnf_manager):
        vnf_config = {
            "vnf_id": "test-vnf",
            "image": "nginx:latest",
            "resource_requirements": {
                "cpu": 1.0,
                "memory": 512.0,
                "bandwidth": 100.0
            },
            "config": {
                "ports": {"80/tcp": 8080},
                "volumes": []
            }
        }
        
        assert vnf_manager.register_vnf(
            vnf_id=vnf_config["vnf_id"],
            image=vnf_config["image"],
            resource_requirements=vnf_config["resource_requirements"],
            config=vnf_config["config"]
        )
        
        assert vnf_config["vnf_id"] in vnf_manager.vnf_catalog

class TestResourcePredictor:
    def test_resource_prediction(self, resource_predictor, qos_requirements):
        prediction = resource_predictor.predict_resources(
            qos_requirements=qos_requirements,
            service_type="eMBB",
            current_load={"cpu": 50.0, "memory": 512000.0, "bandwidth": 5000.0}
        )
        
        assert isinstance(prediction, dict)
        assert all(k in prediction for k in ["cpu", "memory", "bandwidth"])
        assert all(v >= 0 for v in prediction.values()) 