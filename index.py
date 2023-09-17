from flask import Flask, render_template
from classes.graph import Grafo

app = Flask(__name__)

@app.get("/")
def index():
  return render_template("index.html")

@app.get("/application")
def dijkstra():
    return render_template("application.html")

app.run(debug=True)