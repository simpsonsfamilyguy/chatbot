from gpt4all import GPT4All
import re
import faiss
from sentence_transformers import SentenceTransformer
import json
import numpy as np


# Initialize GPT4All
model = GPT4All("Meta-Llama-3-8B-Instruct.Q4_0.gguf")

def generate_question_and_options(chunk):
    prompt = (
        f"Using the text below, give me exactly **one multiple-choice question (MCQ)**: "
        f"Please do not reveal the answer in your response"
        f"kindly don't add any additional text other than the question and options in your response"
        f"Create one MCQ from the following text:\n\n{chunk}\n\nInclude 4 options"
    )
    response = model.generate(prompt)
    return response

def validate_answer(question_text, user_answer):
    # Prompt LLM to evaluate the user's answer
    prompt = (
        f"Here is a question:\n\n{question_text}\n\n"
        f"The user selected option {user_answer}. Validate the user selected answer, provide the correct option, and explain why."
    )
    response = model.generate(prompt)
    return response

def generate_true_false(text):
    prompt = (
        f"Using the text below, create exactly one true/false question:\n\n{text}\n\n"
        f"Please do not reveal the answer in your response"
        f"Your response should strictly follow this format:\n"
        f"Question: <Your question here>\n"
        f"Options:\nA. True\nB. False\n"
    )
    return model.generate(prompt)

# def generate_open_ended(text):
#     prompt = (
#         f"generate a short open-ended question without options for a quiz "
#         f"Kindly refrain from adding notes, extra comments, guidelines to your response"
#         f"use this text for creating the question:\n\n{text}"
#     )
#     return model.generate(prompt);

# Load Sentence Transformer model, FAISS index, and document metadata
embed_model = SentenceTransformer("all-MiniLM-L6-v2")
faiss_index = faiss.read_index("./embeddings/faiss_index.bin")

# Load metadata
with open("./metadata/document_metadata.json", "r") as f:
    document_metadata = json.load(f)

def generate_open_ended(user_query):
    """
    Handles open-ended questions by retrieving the most relevant chunk from the FAISS index
    and using an LLM to generate a response based on the retrieved context.
    """
    # Generate embedding for the user's query
    query_embedding = embed_model.encode([user_query])

    # Perform a search in the FAISS index
    distances, indices = faiss_index.search(query_embedding, k=1)  # Retrieve the top result

    # Check if a result is found
    if indices[0][0] != -1:
        # Fetch the most relevant chunk
        result = document_metadata[indices[0][0]]
        context = result["chunk"]

        # Use the context and user query to ask the LLM
        llm_input = (
            f"Context: {context}\n\n"
            f"Question: {user_query}\n\n"
            f"Answer the question based on the provided context."
        )
        llm_response = model.generate(llm_input)

        return {
            "question_text": llm_response,
            "filename": result["filename"],
            "success": True,
        }
    else:
        return {
            "question_text": "No relevant information found for your query. Please try rephrasing.",
            "filename": None,
            "success": False,
        }
