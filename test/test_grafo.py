from classes import *

lista_vertices = [Vertice("a"), Vertice("b"), Vertice("c"), Vertice("d")]
lista_aristas = [Arista("a", "b", 8), Arista("a", "c", 3), Arista("a", "d", 5), Arista("c", "b", 1)]

def test_vertice_grafo():
    grafo = Grafo()

    for v in lista_vertices:
        grafo.agregar_vertice(v)

    assert list(grafo.obtener_vertices()) == ["a", "b", "c", "d"]

def test_arista_grafo():
    grafo = Grafo()

    for v in lista_vertices:
        grafo.agregar_vertice(v)

    for a in lista_aristas:
        grafo.agregar_arista(a)

    aristas_grafo = grafo.obtener_aristas()
    assert len(aristas_grafo) == len(lista_aristas) * 2
    assert all( arista in aristas_grafo for arista in lista_aristas ) == True

def test_get_adyacentes_grafo():
    grafo = Grafo()

    for v in lista_vertices:
        grafo.agregar_vertice(v)

    for a in lista_aristas:
        grafo.agregar_arista(a)

    assert [a[0] for a in grafo.obtener_adyacentes("a")] == [Vertice("b"), Vertice("c"), Vertice("d")]
    assert [a[0] for a in grafo.obtener_adyacentes("b")] == [Vertice("a"), Vertice("c")]
    assert [a[0] for a in grafo.obtener_adyacentes("c")] == [Vertice("a"), Vertice("b")]
    assert [a[0] for a in grafo.obtener_adyacentes("d")] == [Vertice("a")]