# Quiz Bot

## Project Description
The <b>Quiz</b> Bot is an intelligent quiz system that uses a local language model (GPT-4) and a vector store to deliver quiz questions, assess answers, and provide feedback to users. This system can be used to create custom quizzes based on a repository of questions and answers or interact with educational materials to generate quiz-style prompts and provide answers.

The main components of the system include:
- **Quiz Question Generation**: The bot generates quiz questions based on documents or datasets.
- **Answer Evaluation**: The bot evaluates the user’s answer and provides feedback on its correctness.
- **Feedback & Explanation**: If the answer is incorrect, the bot can provide the correct answer with an explanation.

## Documentation

The core functionalities of this Quiz Bot are built using the following modules:
1. **LangChain**: A framework for developing applications powered by language models, simplifying processes like vector store management and document-based interaction.
2. **GPT-4All**: A local instance of GPT-4 used as the underlying language model for quiz generation and answer evaluation.
3. **HuggingFaceEmbeddings**: Used to generate embeddings for documents and quiz content, enabling efficient similarity-based retrieval.
4. **Chroma**: A vector database that stores document embeddings for quiz question generation and retrieval.

## System Architecture

The architecture of the  Quiz Bot involves the following components:
1. **User Interface (UI)**:
   - A simple command-line interface (CLI) where users can interact with the quiz bot, answering quiz questions and receiving feedback.

2. **Document Storage (Chroma)**:
   - The vector database stores quiz questions, answers, and explanations, allowing the bot to retrieve and deliver these based on the user’s interactions.

3. **Embedding Model (HuggingFaceEmbeddings)**:
   - Converts documents and quiz content into vector representations. The model used is "sentence-transformers/all-MiniLM-L6-v2," which is suitable for semantic textual similarity tasks like matching user answers to the correct answers.

4. **Quiz Generation & Answer Evaluation (LangChain)**:
   - Handles the logic for generating quiz questions, retrieving relevant content, and evaluating user answers.

5. **Language Model (GPT-4All)**:
   - A local deployment of GPT-4, which generates questions, evaluates answers, and provides explanations.

## Prerequisites

Before setting up and running this project, ensure you have the following:
1. **Python 3.8+** installed on your machine.
2. **Docker** (optional, if you plan to run GPT-4 in a container).
3. **CUDA** or **NVIDIA GPU** for running large models locally (optional but recommended for performance).
4. **HuggingFace Account** (if you're using HuggingFace's API for embeddings or other features).
5. **Local Model Files** (ensure you have downloaded the GPT-4 model file).

## Requirements

These are the core dependencies required to run the project:

pip install langchain chromadb huggingface_hub
pip install gpt4all
pip install sentence-transformers

# OnDemand Quiz Bot

## Project Description
The **OnDemand Quiz Bot** is an intelligent quiz system that uses a local language model (GPT-4) and a vector store to deliver quiz questions, assess answers, and provide feedback to users. This system can be used to create custom quizzes based on a repository of questions and answers or interact with educational materials to generate quiz-style prompts and provide answers.

The main components of the system include:
- **Quiz Question Generation**: The bot generates quiz questions based on documents or datasets.
- **Answer Evaluation**: The bot evaluates the user’s answer and provides feedback on its correctness.
- **Feedback & Explanation**: If the answer is incorrect, the bot can provide the correct answer with an explanation.

## Documentation

The core functionalities of this Quiz Bot are built using the following modules:
1. **LangChain**: A framework for developing applications powered by language models, simplifying processes like vector store management and document-based interaction.
2. **GPT-4All**: A local instance of GPT-4 used as the underlying language model for quiz generation and answer evaluation.
3. **HuggingFaceEmbeddings**: Used to generate embeddings for documents and quiz content, enabling efficient similarity-based retrieval.
4. **Chroma**: A vector database that stores document embeddings for quiz question generation and retrieval.

## System Architecture

The architecture of the OnDemand Quiz Bot involves the following components:
1. **User Interface (UI)**:
   - A simple command-line interface (CLI) where users can interact with the quiz bot, answering quiz questions and receiving feedback.

2. **Document Storage (Chroma)**:
   - The vector database stores quiz questions, answers, and explanations, allowing the bot to retrieve and deliver these based on the user’s interactions.

3. **Embedding Model (HuggingFaceEmbeddings)**:
   - Converts documents and quiz content into vector representations. The model used is "sentence-transformers/all-MiniLM-L6-v2," which is suitable for semantic textual similarity tasks like matching user answers to the correct answers.

4. **Quiz Generation & Answer Evaluation (LangChain)**:
   - Handles the logic for generating quiz questions, retrieving relevant content, and evaluating user answers.

5. **Language Model (GPT-4All)**:
   - A local deployment of GPT-4, which generates questions, evaluates answers, and provides explanations.


## Prerequisites

Before setting up and running this project, ensure you have the following:
1. **Python 3.8+** installed on your machine.
2. **Docker** (optional, if you plan to run GPT-4 in a container).
3. **CUDA** or **NVIDIA GPU** for running large models locally (optional but recommended for performance).
4. **HuggingFace Account** (if you're using HuggingFace's API for embeddings or other features).
5. **Local Model Files** (ensure you have downloaded the GPT-4 model file).

## Requirements

These are the core dependencies required to run the project:
```bash
pip install langchain chromadb huggingface_hub
pip install gpt4all
pip install sentence-transformers

