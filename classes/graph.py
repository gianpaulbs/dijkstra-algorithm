import heapq

class Vertice:
    def __init__(self, valor) -> None:
        self.valor = valor
    
    def __lt__(self, otro_vertice):
        return self.valor < otro_vertice.valor

    def __hash__(self) -> int:
        return hash(self.valor)

    def __eq__(self, o: object) -> bool:
        return self.valor == o.valor if type(o) == Vertice else self.valor == o

    def __repr__(self) -> str:
        return f"{self.valor}"
    
    def to_dict(self):
        return { 'value': self.valor }

class Arista:
    def __init__(self, vertice1: Vertice, vertice2: Vertice, peso: int) -> None:
        self.vertice1: Vertice = vertice1
        self.vertice2: Vertice = vertice2
        self.peso: int = peso
    
    def __eq__(self, __value: object) -> bool:
        if type(__value) == Arista:
            return self.vertice1 == __value.vertice1 and self.vertice2 == __value.vertice2 and self.peso == __value.peso
        elif type(__value) == tuple and len(__value) == 3:
            return (self.vertice1, self.vertice2, self.peso) == __value
        return False

    def __iter__(self):
        return iter((self.vertice1, self.vertice2, self.peso))

    def __str__(self) -> str:
        return f"{self.vertice1} -{self.peso}-> {self.vertice2}"
    
    def __repr__(self) -> str:
        return self.__str__()
    
class Grafo:
    def __init__(self) -> None:
        self.vertices: dict[Vertice, list[tuple[Vertice, int]]] = {}
    
    def agregar_vertice(self, vertice: Vertice | str):
        vertice = Vertice(vertice) if isinstance(vertice, str) else vertice 
        if vertice not in self.vertices:
            self.vertices[vertice] = []
            
    def agregar_arista(self, arista:Arista):
        vertice1, vertice2, peso = arista
        if vertice1 not in self.vertices or vertice2 not in self.vertices:
            raise Exception("No existe el vertice")
        self.vertices[vertice1].append((vertice2, peso))
        self.vertices[vertice2].append((vertice1, peso))
    
    def obtener_vertices(self) -> list[Vertice]:
        return self.vertices.keys()

    def obtener_aristas(self) -> list[Arista]:
        return [Arista(v, a[0], a[1]) for v, vertices in self.vertices.items() for a in vertices]

    def obtener_adyacentes(self, vertice: Vertice) -> list[tuple[Vertice, int]]:
        return self.vertices[vertice]

    def dijkstra(self, inicio: Vertice, destino: Vertice):
        if inicio not in self.vertices or destino not in self.vertices:
            raise Exception("El vértice de inicio o destino no existe en el grafo")

        distancias = {vertice: float('inf') for vertice in self.vertices}
        distancias[inicio] = 0
        camino = {vertice: None for vertice in self.vertices}

        cola_prioridad = [(0, inicio)]

        while cola_prioridad:
            distancia_actual, vertice_actual = heapq.heappop(cola_prioridad)

            if vertice_actual == destino:
                break

            for adyacente, peso in self.vertices[vertice_actual]:
                distancia_nueva = distancias[vertice_actual] + peso

                if distancia_nueva < distancias[adyacente]:
                    distancias[adyacente] = distancia_nueva
                    camino[adyacente] = vertice_actual
                    heapq.heappush(cola_prioridad, (distancia_nueva, adyacente))

        camino_resultante = []
        vertice_actual = destino
        
        while vertice_actual:
            camino_resultante.insert(0, vertice_actual.to_dict())
            vertice_actual = camino[vertice_actual]

        if distancias[destino] == float('inf'):
            raise Exception("No hay camino entre los vértices de inicio y destino")

        return distancias[destino], camino_resultante
        
        
# testeo de grafo con ciclos
"""
if __name__ == "__main__":
    grafo = Grafo()
    vertices = [Vertice("A"), Vertice("B"), Vertice("C"), Vertice("D")]

    for vertice in vertices:
        grafo.agregar_vertice(vertice)
    
    aristas = [
        Arista(Vertice("A"), Vertice("B"), 2),
        Arista(Vertice("B"), Vertice("C"), 3),
        Arista(Vertice("C"), Vertice("D"), 4),
        Arista(Vertice("D"), Vertice("A"), 5)
    ]
    
    for arista in aristas:
        grafo.agregar_arista(arista)
    
    inicio = Vertice("A")
    destino = Vertice("C")
    distancia, camino = grafo.dijkstra(inicio, destino)
    
    print(f"Distancia más corta entre {inicio} y {destino}: {distancia}")
    print("Camino:", " -> ".join(map(str, camino)))
"""

# testeo
if __name__ == "__main__":
    grafo = Grafo()
    vertices = ["A", "B", "C", "D", "E"]
    for vertice in vertices:
        grafo.agregar_vertice(Vertice(vertice))

    aristas = [
        Arista(Vertice("A"), Vertice("B"), 2),
        Arista(Vertice("A"), Vertice("C"), 4),
        Arista(Vertice("B"), Vertice("C"), 1),
        Arista(Vertice("B"), Vertice("D"), 7),
        Arista(Vertice("C"), Vertice("D"), 3),
        Arista(Vertice("C"), Vertice("E"), 5),
        Arista(Vertice("D"), Vertice("E"), 2)
    ]

    for arista in aristas:
        grafo.agregar_arista(arista)
    
    inicio = Vertice("A")
    destino = Vertice("E")

    distancia, camino = grafo.dijkstra(inicio, destino)

    print(f"Distancia más corta entre {inicio} y {destino}: {distancia}")
    print("Camino:", " -> ".join(map(str, camino)))