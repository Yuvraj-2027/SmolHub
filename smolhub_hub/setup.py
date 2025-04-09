from setuptools import setup, find_packages

setup(
    name="smolhub_hub",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.1",
        "tqdm>=4.64.0",
    ],
    entry_points={
        "console_scripts": [
            "smolhub=smolhub_hub.cli:main",
        ],
    },
    python_requires=">=3.7",
)