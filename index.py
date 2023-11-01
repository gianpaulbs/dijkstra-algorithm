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
    selected = data.get('selected', [])

    grafo = Grafo()
    vertices = [Node(node['id'], node['label']) for node in nodes]
    aristas = [Edge(edge['from'], edge['to'], int(edge['label'])) for edge in edges]

    for vertice in vertices:
        grafo.agregar_vertice(Vertice(vertice.id, vertice.label))

    for arista in aristas:
        fromNodeLabel = next((vertice.label for vertice in vertices if vertice.id == arista.fromNodeId))
        toNodeLabel = next((vertice.label for vertice in vertices if vertice.id == arista.toNodeId))
        grafo.agregar_arista(Arista(
            Vertice(arista.fromNodeId, fromNodeLabel),
            Vertice(arista.toNodeId, toNodeLabel),
            arista.label
        ))

    inicio = Vertice(selected[0]['id'], selected[0]['label'])
    destino = Vertice(selected[1]['id'], selected[1]['label'])

    distancia, camino, etiquetas = grafo.dijkstra(inicio, destino)

    formattedLabels = []

    for clave, valor in etiquetas.items():
        node = clave
        content = valor

        formattedLabels.append({
            'node': node.id,
            'content': {
                'start': content[0][0].id if content[0][0] != '-' else '-',
                'iteration': content[1],
                'acumulada':content[0][1]
            }
        })
        
    return jsonify({
        'distance': distancia,
        'path': camino,
        'labels': formattedLabels
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)   