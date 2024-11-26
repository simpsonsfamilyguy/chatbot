import streamlit as st
import time
from quiz_logic import load_metadata, get_quiz_question, validate_user_answer
from question_generator import generate_open_ended  # Import the updated generate_open_ended function

st.title("Quiz Bot")

# Sidebar for quiz options
st.sidebar.header("Quiz Options")
question_type = st.sidebar.selectbox("Select question type", ["MCQ", "True/False", "Open-Ended"])

# Initialize session state
if "current_question" not in st.session_state:
    st.session_state.current_question = None
    st.session_state.selected_answer = None
    st.session_state.validation_response = None
    st.session_state.open_ended_query = ""

# Button to generate a new question for MCQ or True/False
if question_type in ["MCQ", "True/False"] and st.button("Generate Quiz"):
    metadata = load_metadata("./metadata/document_metadata.json")
    start_time = time.time()
    with st.spinner("Generating question..."):
        question_data, error = get_quiz_question(metadata, question_type)
    elapsed_time = round(time.time() - start_time, 2)
    st.write(f"Time taken: {elapsed_time} seconds")

    if error:
        st.error(error)
    else:
        st.session_state.current_question = question_data
        st.session_state.selected_answer = None
        st.session_state.validation_response = None

# Display the current question for MCQ or True/False
if st.session_state.current_question and question_type in ["MCQ", "True/False"]:
    question_data = st.session_state.current_question
    st.write("### Question:")
    st.write(question_data["question_text"])
    st.write(f"*Citations: {question_data['filename']}*")

    # Question type specific input
    if question_type == "MCQ":
        st.session_state.selected_answer = st.selectbox(
            "Select your answer:",
            ["Select an answer", "A", "B", "C", "D"],
            key="answer_dropdown"
        )
    elif question_type == "True/False":
        st.session_state.selected_answer = st.radio("Select your answer:", ["True", "False"], key="answer_radio")

    # Button to submit the answer
    if st.button("Submit Answer"):
        if not st.session_state.selected_answer or st.session_state.selected_answer in ["Select an answer", ""]:
            st.warning("Please provide an answer before submitting.")
        else:
            with st.spinner("Validating your answer..."):
                start_time = time.time()
                st.session_state.validation_response = validate_user_answer(
                    question_data["question_text"],
                    st.session_state.selected_answer
                )
                elapsed_time = round(time.time() - start_time, 2)
                st.write(f"Time taken to validate: {elapsed_time} seconds")

# Display the validation response
if st.session_state.validation_response:
    st.write("### Validation:")
    st.write(st.session_state.validation_response)

if question_type == "Open-Ended":
    st.write("### Ask a Question:")
    st.session_state.open_ended_query = st.text_input("Type your question here:")
    if st.button("Get Answer"):
        if st.session_state.open_ended_query.strip():
            with st.spinner("Retrieving relevant information..."):
                start_time = time.time()
                response = generate_open_ended(st.session_state.open_ended_query)
                elapsed_time = round(time.time() - start_time, 2)
                st.write(f"Time taken: {elapsed_time} seconds")
                
                # Display the response
                if response["success"]:
                    st.write("### Answer:")
                    st.write(response["question_text"])
                    if response["filename"]:
                        st.write(f"*Citations: {response['filename']}*")
                else:
                    st.warning(response["question_text"])
        else:
            st.warning("Please enter a question.")
