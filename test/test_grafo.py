from classes import *

def test_vertice_grafo():
    grafo = Grafo({})
    grafo.agregar_vertice(Vertice("a"))
    grafo.agregar_vertice(Vertice("b"))
    grafo.agregar_vertice(Vertice("c"))
    grafo.agregar_vertice(Vertice("d"))

    assert list(grafo.obtener_vertices()) == ["a", "b", "c", "d"]

def test_arista_grafo():
    grafo = Grafo({})

    lista_vertices = [Vertice("a"), Vertice("b"), Vertice("c"), Vertice("d")]
    for v in lista_vertices:
        grafo.agregar_vertice(v)

    lista_aristas = [Arista("a", "b", 8), Arista("a", "c", 3), Arista("a", "d", 5), Arista("c", "b", 1)]
    for a in lista_aristas:
        grafo.agregar_arista(a)

    aristas_grafo = grafo.obtener_aristas()
    assert len(aristas_grafo) == len(lista_aristas) * 2
    assert all( arista in aristas_grafo for arista in lista_aristas ) == True