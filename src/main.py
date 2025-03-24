import os
import sys
import yaml
import argparse
import uvicorn
from src.core.network_slice import QoSRequirements
from src.sdn.controller import SDNController
from src.nfv.vnf_manager import VNFManager

def load_config(config_path: str = None) -> dict:
    """Load configuration from YAML file."""
    default_config = {
        "api": {
            "host": "0.0.0.0",
            "port": 8000
        },
        "simulation": {
            "num_nodes": 10,
            "initial_slices": 2,
            "update_interval": 5
        }
    }

    if config_path and os.path.exists(config_path):
        with open(config_path, 'r') as f:
            config = yaml.safe_load(f)
            # Merge with default config
            for key, value in default_config.items():
                if key not in config:
                    config[key] = value
                elif isinstance(value, dict):
                    for sub_key, sub_value in value.items():
                        if sub_key not in config[key]:
                            config[key][sub_key] = sub_value
            return config
    
    return default_config

def create_example_slices(sdn_controller, num_slices: int = 2) -> None:
    """Create example network slices for demonstration."""
    # Example slice configurations
    slice_configs = [
        {
            "name": "eMBB-Slice",
            "qos_requirements": QoSRequirements(
                latency_ms=20.0,
                bandwidth_mbps=1000.0,
                reliability=99.9,
                isolation_level="shared"
            ),
            "service_type": "eMBB"
        },
        {
            "name": "URLLC-Slice",
            "qos_requirements": QoSRequirements(
                latency_ms=1.0,
                bandwidth_mbps=100.0,
                reliability=99.999,
                isolation_level="isolated"
            ),
            "service_type": "URLLC"
        }
    ]

    for i in range(min(num_slices, len(slice_configs))):
        config = slice_configs[i]
        success, slice_id = sdn_controller.create_slice(
            name=config["name"],
            qos_requirements=config["qos_requirements"],
            service_type=config["service_type"]
        )
        if success:
            print(f"Created slice: {config['name']} (ID: {slice_id})")
        else:
            print(f"Failed to create slice: {config['name']}")

def create_example_vnfs(vnf_manager) -> None:
    """Register example VNF types for demonstration."""
    # Example VNF configurations
    vnf_configs = [
        {
            "vnf_id": "firewall",
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
        },
        {
            "vnf_id": "load-balancer",
            "image": "haproxy:latest",
            "resource_requirements": {
                "cpu": 2.0,
                "memory": 1024.0,
                "bandwidth": 500.0
            },
            "config": {
                "ports": {"80/tcp": 8081},
                "volumes": []
            }
        }
    ]

    for config in vnf_configs:
        success = vnf_manager.register_vnf(
            vnf_id=config["vnf_id"],
            image=config["image"],
            resource_requirements=config["resource_requirements"],
            config=config["config"]
        )
        if success:
            print(f"Registered VNF type: {config['vnf_id']}")
        else:
            print(f"Failed to register VNF type: {config['vnf_id']}")

def main(config_path: str = None) -> None:
    """Main entry point for the network slicing simulation."""
    # Load configuration
    config = load_config(config_path)
    
    # Initialize components
    sdn_controller = SDNController()
    vnf_manager = VNFManager()
    
    # Create example network slices and VNFs
    create_example_slices(sdn_controller, config["simulation"]["initial_slices"])
    create_example_vnfs(vnf_manager)
    
    # Start the FastAPI server
    from src.api.main import app
    uvicorn.run(app, host=config["api"]["host"], port=config["api"]["port"])

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Network Slicing Simulation")
    parser.add_argument(
        "--config",
        type=str,
        help="Path to configuration file",
        default=None
    )
    
    args = parser.parse_args()
    main(args.config) 