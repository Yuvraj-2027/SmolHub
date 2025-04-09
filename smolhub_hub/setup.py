from setuptools import setup, find_packages

setup(
    name="smolhub_hub",
    version="0.1.0",
    packages=find_packages(),
    install_requires=[
        "requests>=2.25.1",
        "tqdm>=4.64.0",
    ],
    author="SmolHub",
    author_email="support@smolhub.ai",
    description="A package to download models from SmolHub",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
    url="https://github.com/smolhub/smolhub-hub",
    classifiers=[
        "Programming Language :: Python :: 3",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.7",
    entry_points={
        "console_scripts": [
            "smolhub=smolhub_hub.cli:main",
        ],
    },
)