# ClarifAI  
Real-Time Classroom Assistant with Hardware-Optimized Local LLM Inference

ClarifAI is a locally deployed AI classroom assistant designed to provide real-time doubt resolution during live lectures. The system integrates Microsoft’s Phi-2 language model optimized using Intel OpenVINO to enable low-latency inference on standard CPU hardware.

The assistant is accessible via a Chrome Extension and supports voice input as well as contextual understanding using live Google Meet captions.

---

## 1. Problem Statement

Most AI assistants rely on cloud inference and require GPU-backed infrastructure. This limits deployability in real-world classroom environments where students use standard laptops.

ClarifAI addresses this by:
- Running entirely on local hardware
- Optimizing a transformer-based LLM using OpenVINO
- Delivering real-time contextual responses without GPU dependency

---

## 2. System Architecture

The system is composed of four primary components:

### A. Input Layer
- Text queries via Chrome Extension
- Voice queries using Web Speech API
- Optional context via Google Meet live captions

### B. Backend Layer (Flask)
- REST API for query handling
- Prompt structuring and context injection
- Request routing to optimized inference engine

### C. Model Layer
- Microsoft Phi-2
- Converted to ONNX
- Further optimized to OpenVINO IR format (.xml, .bin)
- Loaded using Optimum-Intel for efficient CPU inference

### D. Output Layer
- Chrome Extension UI
- Chat-based rendering
- Typing indicator and timestamped responses

(Add architecture diagram here)

---

## 3. Model Optimization Pipeline

The optimization workflow followed:

1. Loaded base Phi-2 using Hugging Face Transformers.
2. Exported model to ONNX format.
3. Converted ONNX model to OpenVINO Intermediate Representation using Model Optimizer.
4. Integrated optimized model using Optimum-Intel within Flask backend.

### Why OpenVINO?

Running Phi-2 in raw PyTorch form requires significant GPU resources.  
OpenVINO enables:

- CPU-optimized execution
- Reduced memory footprint
- Lower inference latency
- Greater deployability on resource-constrained systems

---

## 4. Performance Evaluation

Evaluation was conducted on:

- Device: Intel Core i5 (11th Gen), 8GB RAM, no GPU
- Environment: Local Flask server
- Test Prompts: 10 academic queries (science, math, general knowledge)

Observed Results:

- ~2x faster response generation compared to PyTorch baseline
- Significant reduction in CPU utilization
- Lower memory consumption
- Stable performance under continuous usage

This demonstrates the practical viability of local LLM deployment for classroom use.

---

## 5. Context Awareness Mechanism

ClarifAI integrates real-time Google Meet captions for contextual understanding.

Workflow:

1. Content script extracts captions from Meet DOM.
2. Transcript stored in temporary buffer.
3. When "Use Context" is enabled:
   - Transcript appended to user query
   - Backend reformats prompt accordingly
4. Model generates context-aware response.

This transforms the assistant from a generic chatbot into a lecture-aware tutoring system.

---

## 6. Key Features

- Real-time local LLM inference
- CPU-optimized transformer execution
- Voice-based query input
- Context-aware responses
- Chrome Extension interface (Manifest V3)
- Fully local deployment (privacy-preserving)

---

## 7. Installation

(Keep your existing installation instructions here.)

---

## 8. Limitations

- Limited context window due to Phi-2 constraints
- No persistent long-term session memory
- Performance dependent on CPU capability

---

## 9. Future Improvements

- Retrieval-Augmented Generation (RAG)
- Session memory persistence
- Google Meet overlay UI
- Learning analytics dashboard
- Teacher analytics panel
