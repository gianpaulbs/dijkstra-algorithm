class Edge:
    def __init__(self, fromNodeId, toNodeId, label):
        self.fromNodeId = fromNodeId
        self.toNodeId = toNodeId
        self.label = label

class Node:
    def __init__(self, id, label):
        self.id = id
        self.label = label