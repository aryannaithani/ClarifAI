from transformers import AutoTokenizer
from optimum.intel import OVModelForSeq2SeqLM

tokenizer = AutoTokenizer.from_pretrained("google/flan-t5-large")
model = OVModelForSeq2SeqLM.from_pretrained("flan-t5-large-ov-fp32")

def generate_answer(question):
    inputs = tokenizer(question, return_tensors="pt")
    outputs = model.generate(
        inputs["input_ids"],
        max_length=512,
        temperature=0.8,
        top_p=0.95,
        top_k=50,
        do_sample=True,
        num_return_sequences=1
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)