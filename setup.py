from setuptools import setup, find_packages

setup(
    name="nwslicing",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "numpy>=1.21.0",
        "tensorflow>=2.8.0",
        "torch>=1.10.0",
        "networkx>=2.6.3",
        "matplotlib>=3.4.3",
        "pandas>=1.3.3",
        "flask>=2.0.1",
        "flask-restful>=0.3.9",
        "python-dotenv>=0.19.0",
        "pytest>=6.2.5",
        "scikit-learn>=0.24.2",
        "simpy>=4.0.1",
        "docker>=5.0.3",
        "pyyaml>=5.4.1",
        "fastapi>=0.68.1",
        "uvicorn>=0.15.0",
        "dash>=2.0.0",
        "plotly>=5.3.1"
    ],
    python_requires=">=3.8",
) 