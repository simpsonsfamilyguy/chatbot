# NS OnDemand Q&ABot

This is a local question-and-answer bot that utilizes a local LLM model, FAISS, and embeddings to provide answers based on your network security course content. The app is built with Streamlit, offering a user-friendly interface.

## Project Setup
Follow these steps to set up and run the project on your local machine.

### Prerequisites
Ensure the following are installed:

- Python 3.10 or newer
- Git
- Streamlit (for UI)



#### Set Up a Virtual Environment

It’s recommended to use a virtual environment for managing dependencies.


python3 -m venv .venv
source .venv/bin/activate  # macOS/Linux
.venv\Scripts\activate     # Windows


#### Install Dependencies
pip install -r requirements.txt


#### Download Model Files

Make sure the GPT4All model, embeddings, and FAISS index files are downloaded. If they are missing, follow the instructions in `ingestion.py` to generate them.

#### Set Up FAISS Index and Document Metadata

Run `ingestion.py` to create `faiss_index.bin` and `document_metadata.json` if they don’t already exist.

python ingestion.py



### Running the App

To launch the app, use the following command:

streamlit run main.py


### Accessing the App

Once the command runs, Streamlit will provide a local URL. Open it in your browser to access the app. The URL will look like:

Local URL: http://localhost:8501
