# SmolHub Hub

A Python package to download models from SmolHub.

## Installation

```bash
pip install smolhub_hub
```

## Usage

### As a Python Package

```python
from smolhub_hub import download_model

# Download a model
model_path = download_model("meta-llama/llama3.1", output_dir="./models")
print(f"Model downloaded to: {model_path}")
```

### Command Line Interface

```bash
# Download a model using the CLI
smolhub meta-llama/llama3.1 -o ./models

# With API key
smolhub meta-llama/llama3.1 -o ./models --api-key YOUR_API_KEY
```

## Environment Variables

- `SMOLHUB_API_KEY`: Your SmolHub API key
- `SMOLHUB_API_URL`: SmolHub API URL (optional)