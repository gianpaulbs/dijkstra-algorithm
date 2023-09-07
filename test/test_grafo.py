from classes import *

def test_grafo():
    grafo = Grafo({})
    grafo.agregar_vertice(Nodo("a"))
    grafo.agregar_vertice(Nodo("b"))
    grafo.agregar_vertice(Nodo("c"))
    grafo.agregar_vertice(Nodo("d"))

    grafo.agregar_arista(Arista("a", "b", 8))
    grafo.agregar_arista(Arista("a", "d", 5))
    grafo.agregar_arista(Arista("a", "c", 3))
    grafo.agregar_arista(Arista("c", "b", 1))

    assert grafo.obtener_vertices() == ["a", "b", "c", "d"]