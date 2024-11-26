import random
import json
from question_generator import generate_question_and_options, validate_answer, generate_true_false, generate_open_ended

def load_metadata(metadata_path):
    with open(metadata_path, "r") as f:
        return json.load(f)

def get_quiz_question(metadata, question_type):

    # Choose a random chunk
    chunk = random.choice(metadata)
    text = chunk["chunk"]

    # Generate a question based on the selected type
    if question_type == "MCQ":
        question_text = generate_question_and_options(text)
    elif question_type == "True/False":
        question_text = generate_true_false(text)
    # elif question_type == "Open-Ended":
        # question_text = generate_open_ended(text)
    else:
        return None, "Invalid question type selected."

    return {
        "question_text": question_text,
        "chunk_id": chunk["chunk_id"],
        "filename": chunk["filename"],
    }, None

def validate_user_answer(question_text, user_answer):
    return validate_answer(question_text, user_answer)
