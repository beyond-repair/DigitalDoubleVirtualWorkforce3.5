# local_model.py
# Wrapper to load and query the local GGUF model using llama-cpp-python

from llama_cpp import Llama

MODEL_PATH = (
    r"C:/Users/willi/.lmstudio/models/lmstudio-community/"
    r"Mistral-7B-Instruct-v0.3-GGUF/"
    r"Mistral-7B-Instruct-v0.3-Q4_K_M.gguf"
)

# Initialize the model (adjust n_ctx and other params as needed)
llm = Llama(model_path=MODEL_PATH, n_ctx=2048)


def generate_response(prompt, max_tokens=256, temperature=0.7, top_p=0.95):
    response = llm(
        prompt,
        max_tokens=max_tokens,
        temperature=temperature,
        top_p=top_p,
        stop=["</s>", "User:"]
    )
    return response["choices"][0]["text"].strip()


if __name__ == "__main__":
    prompt = "Explain the concept of multi-agent systems."
    print(generate_response(prompt))