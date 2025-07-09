import sys
from transformers import pipeline

input_path = sys.argv[1]

with open(input_path, 'r') as f:
    prompt = f.read().strip()

# Use the model as-is, sampling will disable beam search automatically
generator = pipeline("text2text-generation", model="mrm8488/t5-base-finetuned-question-generation-ap")

results = generator(
    prompt,
    max_length=64,
    do_sample=True,
    num_beams=15,              # ✅ set num_beams >= num_return_sequences
    num_return_sequences=5,
    top_k=50,
    temperature=0.9
)


for r in results:
    print(r['generated_text'])
