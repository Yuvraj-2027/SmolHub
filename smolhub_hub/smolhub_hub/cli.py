import argparse
import sys
from .downloader import download_model

def main():
    parser = argparse.ArgumentParser(description="Download models from SmolHub")
    parser.add_argument("model_id", help="The unique identifier of the model")
    parser.add_argument("--output-dir", "-o", default="./", help="Directory to save the downloaded model")
    parser.add_argument("--api-key", help="SmolHub API key")
    
    args = parser.parse_args()
    
    try:
        output_path = download_model(args.model_id, args.output_dir, args.api_key)
        print(f"Model downloaded successfully to: {output_path}")
        sys.exit(0)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()