from fastapi import FastAPI
from .clients.agiClient import AGIClient
from .papers import router
import uvicorn

app = FastAPI()
app.include_router(router)

if __name__ == "__main__":
    uvicorn.run("src.backend.run:app", host="127.0.0.1", port=8000, reload=True)