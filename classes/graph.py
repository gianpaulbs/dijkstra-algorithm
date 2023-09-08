class Vertice:
    def __init__(self, valor) -> None:
        self.valor = valor
    
    def __hash__(self) -> int:
        return hash(self.valor)

    def __eq__(self, o: object) -> bool:
        return self.valor == o.valor if type(o) == Vertice else self.valor == o

    def __repr__(self) -> str:
        return f"{self.valor}"

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
        vertice: Vertice = Vertice(vertice) if type(vertice) == str else vertice 
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