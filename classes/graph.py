class Nodo:
    def __init__(self, valor) -> None:
        self.valor = valor
    
    def __repr__(self) -> str:
        return f"{self.valor}"

class Arista:
    def __init__(self, vertice1: Nodo, vertice2: Nodo, peso: int) -> None:
        self.vertice1: Nodo = vertice1
        self.vertice2: Nodo = vertice2
        self.peso: int = peso
    
    def __iter__(self):
        return iter((self.vertice1, self.vertice2, self.peso))

    def __str__(self) -> str:
        return f"{self.vertice1} -{self.peso}-> {self.vertice2}"
    
    def __repr__(self) -> str:
        return self.__str__()
    
class Grafo:
    def __init__(self, vertices:dict) -> None:
        self.vertices: dict[Nodo, list[tuple[Nodo, int]]] = vertices or {}

    def agregar_vertice(self, vertice):
        if vertice not in self.vertices:
            self.vertices[vertice] = []
    
    def obtener_vertices(self) -> list[Nodo]:
        return self.vertices.keys()

    def obtener_aristas(self) -> list[Arista]:
        return [Arista(v, a[0], a[1]) for v, vertices in self.vertices.items() for a in vertices]

    def agregar_arista(self, arista:Arista):
        vertice1, vertice2, peso = arista
        self.vertices[vertice1].append((vertice2, peso))
        self.vertices[vertice2].append((vertice1, peso))