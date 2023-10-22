from flask import Flask, render_template, request, jsonify
from classes.graph import *
from classes.dto import *

app = Flask(__name__)

@app.get("/")
def index():
   return render_template("index.html")

@app.get("/application")
def application():
   return render_template("application.html")

@app.post("/dijkstra")
def dijkstra():
    data = request.get_json()
    nodes = data.get('nodes', [])
    edges = data.get('edges', [])

    grafo = Grafo()
    vertices = [Node(node['id'], node['label']) for node in nodes]
    aristas = [Edge(edge['from'], edge['to'], int(edge['label'])) for edge in edges]

    for vertice in vertices:
        grafo.agregar_vertice(Vertice(vertice.id, vertice.label))

    for arista in aristas:
        grafo.agregar_arista(Arista(
            Vertice(arista.fromNodeId, vertices[arista.fromNodeId - 1].label),
            Vertice(arista.toNodeId, vertices[arista.toNodeId - 1].label),
            arista.label
        ))

    # aristas = [
    #     Arista(Vertice("A"), Vertice("B"), 2),
    #     Arista(Vertice("A"), Vertice("C"), 4),
    #     Arista(Vertice("B"), Vertice("C"), 1),
    #     Arista(Vertice("B"), Vertice("D"), 7),
    #     Arista(Vertice("C"), Vertice("D"), 3),
    #     Arista(Vertice("C"), Vertice("E"), 5),
    #     Arista(Vertice("D"), Vertice("E"), 2)
    # ]

    inicio = Vertice(1, "A")
    destino = Vertice(5, "E")

    distancia, camino = grafo.dijkstra(inicio, destino)
    return jsonify({
        'distance': distancia,
        'path': camino
    })

app.run(debug=True)