from flask import Flask, render_template, request, jsonify
from classes.graph import *
import json

app = Flask(__name__)

@app.get("/")
def index():
   return render_template("index.html")

@app.get("/application")
def application():
   return render_template("application.html")

@app.post("/dijkstra")
def dijkstra():
    req = json.loads(request.get_data())
    nodes = req.get('nodes')
    edges = req.get('edges')

    grafo = Grafo()
    vertices = list()
    aristas = list()

    for n in nodes: 
        vertices.append(n.get('label'))

    for vertice in vertices:
        grafo.agregar_vertice(Vertice(vertice))

    for e in edges:
        index_from = e.get('from') - 1
        index_to = e.get('to') - 1
        weight = int(e.get('label'))
        aristas.append(Arista(Vertice(vertices[index_from]), Vertice(vertices[index_to]), weight))

    # aristas = [
    #     Arista(Vertice("A"), Vertice("B"), 2),
    #     Arista(Vertice("A"), Vertice("C"), 4),
    #     Arista(Vertice("B"), Vertice("C"), 1),
    #     Arista(Vertice("B"), Vertice("D"), 7),
    #     Arista(Vertice("C"), Vertice("D"), 3),
    #     Arista(Vertice("C"), Vertice("E"), 5),
    #     Arista(Vertice("D"), Vertice("E"), 2)
    # ]

    for arista in aristas:
        grafo.agregar_arista(arista)

    inicio = Vertice("A")
    destino = Vertice("E")

    distancia, camino = grafo.dijkstra(inicio, destino)
    return jsonify({
        'distance': distancia,
        'path': camino
    })

app.run(debug=True)