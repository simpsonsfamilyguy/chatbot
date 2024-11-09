from langchain.vectorstores import Chroma
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.text_splitter import CharacterTextSplitter
from langchain.docstore.document import Document
import os
import fitz  # PyMuPDF

# Path to your PDF documents directory
documents_directory = r"C:\Users\varun\OneDrive\Desktop\New folder (2)"  # Update this with the path to your PDF documents

# Function to extract text from PDF
def extract_text_from_pdf(pdf_path):
    doc = fitz.open(pdf_path)
    text = ""
    for page in doc:
        text += page.get_text("text")
    return text

# Load PDF documents and extract text
documents = []
for filename in os.listdir(documents_directory):
    if filename.endswith('.pdf'):  # Check if the file is a PDF
        pdf_path = os.path.join(documents_directory, filename)
        pdf_text = extract_text_from_pdf(pdf_path)
        documents.append(pdf_text)

# Split the documents into smaller chunks if needed
text_splitter = CharacterTextSplitter(chunk_size=500, chunk_overlap=0)  # Adjust based on your needs
split_docs = text_splitter.split_documents([Document(page_content=doc) for doc in documents])

# Initialize the embedding model
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")

# Initialize Chroma with the embeddings
local_db = "./data"
vectordb = Chroma(persist_directory=local_db, embedding_function=embeddings)

# Add the split documents to the vector store
vectordb.add_documents(split_docs)

print("PDF documents have been added to the vector store!")
