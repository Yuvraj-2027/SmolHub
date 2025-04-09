import os
import requests
from tqdm import tqdm
from typing import Optional

class SmolHubDownloader:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.environ.get("SMOLHUB_API_KEY")
        self.base_url = os.environ.get("SMOLHUB_API_URL", "https://ohwjiuloiufhndviqmoc.supabase.co")
        self.headers = {
            "Authorization": f"Bearer {self.api_key}" if self.api_key else "",
            "Content-Type": "application/json",
        }

    def download_model(self, model_id: str, output_dir: str = "./") -> str:
        """
        Download a model from SmolHub.
        
        Args:
            model_id: The unique identifier of the model (e.g., 'meta-llama/llama3.1')
            output_dir: Directory to save the downloaded model
            
        Returns:
            str: Path to the downloaded model file
        """
        try:
            # Get model information
            response = requests.get(
                f"{self.base_url}/rest/v1/models?unique_id=eq.{model_id}",
                headers=self.headers
            )
            response.raise_for_status()
            
            model_info = response.json()[0]
            file_path = model_info["file_path"]
            
            # Create output directory
            os.makedirs(output_dir, exist_ok=True)
            
            # Download the file
            download_url = f"{self.base_url}/storage/v1/object/public/models/{file_path}"
            response = requests.get(download_url, stream=True)
            response.raise_for_status()
            
            total_size = int(response.headers.get("content-length", 0))
            output_path = os.path.join(output_dir, os.path.basename(file_path))
            
            with open(output_path, "wb") as f, tqdm(
                desc=f"Downloading {model_id}",
                total=total_size,
                unit="iB",
                unit_scale=True,
                unit_divisor=1024,
            ) as pbar:
                for data in response.iter_content(chunk_size=1024):
                    size = f.write(data)
                    pbar.update(size)
            
            return output_path
            
        except requests.exceptions.RequestException as e:
            raise Exception(f"Failed to download model: {str(e)}")
        except Exception as e:
            raise Exception(f"An error occurred: {str(e)}")

def download_model(model_id: str, output_dir: str = "./", api_key: Optional[str] = None) -> str:
    """
    Convenience function to download a model from SmolHub.
    """
    downloader = SmolHubDownloader(api_key)
    return downloader.download_model(model_id, output_dir)