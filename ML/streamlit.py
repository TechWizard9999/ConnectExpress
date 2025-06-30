import streamlit as st
import os
import pickle
from llama_index.core import VectorStoreIndex, SimpleDirectoryReader
from llama_index.core.retrievers import VectorIndexRetriever
from llama_index.core.query_engine import RetrieverQueryEngine
from langchain_core.prompts import PromptTemplate
from langchain.llms import OpenAI
from langchain.chains import LLMChain
from dotenv import load_dotenv

load_dotenv()

os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY")

llm_openai = OpenAI(temperature=0.6, openai_api_key=os.getenv("OPENAI_API_KEY"))

PERSIST_DIR = "./storage"
INDEX_FILE = os.path.join(PERSIST_DIR, "index.pkl")

if os.path.exists(INDEX_FILE):
    with open(INDEX_FILE, "rb") as file:
        index = pickle.load(file)
else:
    documents = SimpleDirectoryReader("data").load_data()
    index = VectorStoreIndex.from_documents(documents)
    os.makedirs(PERSIST_DIR, exist_ok=True)
    with open(INDEX_FILE, "wb") as file:
        pickle.dump(index, file)

retriever = VectorIndexRetriever(index=index, similarity_top_k=5)
query_engine = RetrieverQueryEngine(retriever=retriever)

def answer(user_query, output):
    prompt_template = PromptTemplate(
        input_variables=['user_query', 'output'],
        template="""Given the user query "{user_query}" and the following relevant information: {output},
        craft a comprehensive and concise answer based solely on this information.
        If the information provided does not sufficiently answer the query, indicate that a direct answer cannot be generated."""
    )

    chain = LLMChain(llm=llm_openai, prompt=prompt_template)
    response_stream = chain.run(user_query=user_query, output=output)
    return response_stream

st.title('Query Answering System')

if 'listing_history' not in st.session_state:
    st.session_state['listing_history'] = []

user_query = st.text_input("Enter your query here:", "")

if st.button('Answer Query'):
    if user_query:
        output = query_engine.query(user_query).response
        answer_response = answer(user_query=user_query, output=output)
        st.session_state['listing_history'].append((user_query, answer_response))
        st.write("### Answer")
        st.write(answer_response)
    else:
        st.warning("Please enter a query to get an answer.")

st.write("---")
st.write("### Previous Chats:")

# Display history in reverse order (most recent first)
for question, answer_text in reversed(st.session_state['listing_history']):
    st.info(f"**Question:** {question}")
    st.success(f"**Answer:** {answer_text}")