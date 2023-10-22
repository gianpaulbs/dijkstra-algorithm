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
    const data = {
        nodes: matrix.nodes,
        edges: matrix.edges
    };

    axios
    .post('http://localhost:5000/dijkstra', data)
    .then((response) => {
        console.log('Todo ok owo');
    })
    .catch((error) => {
        console.log('un error u.u');
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
