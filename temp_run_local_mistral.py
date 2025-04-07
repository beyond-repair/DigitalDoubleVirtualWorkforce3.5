import time
from llama_cpp import Llama

MODEL_PATH = r"C:\Users\willi\.lmstudio\models\lmstudio-community\Mistral-7B-Instruct-v0.3-GGUF\Mistral-7B-Instruct-v0.3-Q4_K_M.gguf"

llm = Llama(model_path=MODEL_PATH, n_ctx=2048, n_threads=4)

prompt = """
You are an expert autonomous software repair agent. Your role is to analyze software issues, generate precise fixes, and update documentation accordingly. Always provide clear, actionable solutions.

Unresolved task detected in project documentation:

- [ ] Fix typo in documentation

Please:
1. Analyze the task.
2. Generate the corrected markdown line if fixed.
3. Provide a brief explanation of the fix.

Respond ONLY with the updated markdown line and explanation.
"""

print("Sending prompt to local Mistral-7B model...")
start = time.time()

output = llm(prompt, max_tokens=256, stop=["\n\n"])

end = time.time()
print(f"\nResponse received in {end - start:.2f} seconds:\n")
print(output["choices"][0]["text"].strip())