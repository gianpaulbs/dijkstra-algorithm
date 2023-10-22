import { Matrix } from './matrix.js';

const alphabet = 'ABCDEFGHIJKLMNO';
const matrix = new Matrix();
const data = {
    nodes: new vis.DataSet(), 
    edges: new vis.DataSet()
}

const getTotalNodes = () => {
    return data.nodes.length;
}

const addNode = (node, commit) => {
    if (getTotalNodes() > 15) return;

    node.id = getTotalNodes() + 1;
    node.label = alphabet[getTotalNodes()];
    commit(node);

    matrix.nodes = data.nodes.get();
    matrix.addRowAndColumn();
    matrix.draw();
}

const deleteNode = (node, commit) => {
    commit(node);

    matrix.nodes = data.nodes.get();
    matrix.removeRowAndColumn(node.id);
    matrix.draw();
}

const addEdge = (edge, commit) => {
    const originIndex = edge.from - 1;
    const targetIndex = edge.to - 1;
    let weight = prompt('Ingrese el peso de la arista');

    while (parseFloat(weight) <= 0) {
        weight = prompt('Ingrese un peso válido (número positivo)');
    }

    while (weight>='A' && weight<='z') {
        weight = prompt('Ingrese un peso válido (número positivo), no un caracter');
    }

    edge.label = weight;
    commit(edge);

    matrix.edges = data.edges.get();
    matrix.setRelation(originIndex, targetIndex, weight);
    matrix.draw();
}

const generateManyNodes = () => {
    const selectDimensionMatrix = document.getElementById("select-matrix-dimension");
    const missingNodes = selectDimensionMatrix.value - getTotalNodes();

    for (let i = 0; i < Math.abs(missingNodes); i++) {
        if (missingNodes < 0) {
            data.nodes.remove(getTotalNodes());
            matrix.removeRowAndColumn();
        } else {
            const id = getTotalNodes() + 1;
            const label = alphabet[getTotalNodes()];
    
            data.nodes.add({ id, label });
            matrix.addRowAndColumn();
        }
    }
    
    matrix.nodes = data.nodes.get();
    matrix.draw();
}

const findShortestPath = () => {
    const body = {
        nodes: matrix.nodes,
        edges: matrix.edges
    };

    const handleResponse = (data) => {
        const messageContainer = document.getElementById('message');
        const pathLength = data.path.length;
        const startNode = data.path[0].value;
        const endNode = data.path[pathLength - 1].value;
        messageContainer.textContent = `La distancia más corta entre ${startNode} y ${endNode} es ${data.distance}.`;
    };
    
    axios
        .post('http://localhost:5000/dijkstra', body)
        .then((response) => {
            handleResponse(response.data);
        })
        .catch((error) => {
            console.log(error);
        });
    
}

document.getElementById('button-generate-nodes').addEventListener('click', generateManyNodes);
document.getElementById('button-shortest-path').addEventListener('click', findShortestPath);

const container = document.getElementById('network');
const manipulation = {
    initiallyActive: true,
    addNode: addNode,
    addEdge: addEdge,
    deleteNode: deleteNode
};

const options = { 
    locale: 'es',
    manipulation: manipulation
}

new vis.Network(container, data, options);
