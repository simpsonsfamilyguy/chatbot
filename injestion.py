from pathlib import Path
import re
import json
import faiss
from sentence_transformers import SentenceTransformer
import fitz  # PyMuPDF

# Load and clean text data from a PDF file
def load_and_clean_data(file_path):
    with fitz.open(file_path) as pdf_doc:
        content = ""
        for page in pdf_doc:
            content += page.get_text()
    content = re.sub(r"\s+", " ", content)
    return content

# Split text into chunks
def split_into_chunks(text, chunk_size=500):
    words = text.split()
    return [" ".join(words[i:i + chunk_size]) for i in range(0, len(words), chunk_size)]

# Embed chunks and store metadata
def process_documents(doc_dir, embed_model, index_path, metadata_path):
    faiss_index = faiss.IndexFlatL2(embed_model.get_sentence_embedding_dimension())
    documents = []

    for file_path in Path(doc_dir).glob("*.pdf"):
        content = load_and_clean_data(file_path)
        chunks = split_into_chunks(content)

        for i, chunk in enumerate(chunks):
            embedding = embed_model.encode([chunk])[0]
            faiss_index.add(embedding.reshape(1, -1))

            documents.append({
                "chunk": chunk,
                "filename": file_path.name,
                "chunk_id": i,
                "embedding": embedding.tolist()
            })

    faiss.write_index(faiss_index, index_path)
    with open(metadata_path, "w") as f:
        json.dump(documents, f)

# Main
if __name__ == "__main__":
    embed_model = SentenceTransformer("all-MiniLM-L6-v2")
    process_documents("./local_knowledge_docs", embed_model, "./embeddings/faiss_index.bin", "./metadata/document_metadata.json")
