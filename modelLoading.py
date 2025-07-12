from transformers import AutoTokenizer
from optimum.intel import OVModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2")
model = OVModelForCausalLM.from_pretrained("phi-2-ov")

def generate_answer(question):
    inputs = tokenizer(question, return_tensors="pt")
    outputs = model.generate(
        inputs["input_ids"],
        max_new_token=128,
        temperature=0.8,
        top_p=0.95,
        top_k=50,
        do_sample=True,
        num_return_sequences=1
    )
    return tokenizer.decode(outputs[0], skip_special_tokens=True)