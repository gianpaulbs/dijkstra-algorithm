from classes import *

def test_grafo():
    grafo = Grafo({})
    grafo.agregar_vertice(Vertice("a"))
    grafo.agregar_vertice(Vertice("b"))
    grafo.agregar_vertice(Vertice("c"))
    grafo.agregar_vertice(Vertice("d"))

    assert list(grafo.obtener_vertices()) == ["a", "b", "c", "d"]