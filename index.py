from flask import Flask, render_template
from classes.graph import Grafo

app = Flask(__name__)

@app.get("/")
def index():
    return render_template("index.html")

@app.post("/procesar")
def procesar():
    return {"test": True}

app.run(debug=True)