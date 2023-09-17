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

    matrix.addRowAndColumn();
    matrix.draw(node.label);
}

const deleteNode = (node, commit) => {
    commit(node);
    matrix.removeRowAndColumn();
    matrix.draw();
}

const addEdge = (edge, commit) => {
    const originIndex = edge.from - 1;
    const targetIndex = edge.to - 1;
    const weight = prompt('Ingrese el peso de la arista');

    edge.label = weight;
    commit(edge);

    matrix.setRelation(originIndex, targetIndex, weight);
    matrix.draw();
}

const generateManyNodes = () => {
    const selectDimensionMatrix = document.getElementById("select-matrix-dimension");
    const missingNodes = selectDimensionMatrix.value - getTotalNodes();

    if (missingNodes < 0) {
        for (let i = 0; i < Math.abs(missingNodes); i++) {
            data.nodes.remove(getTotalNodes());
            matrix.removeRowAndColumn();
            matrix.draw()
        }

        return;
    }

    for (let i = 0; i < missingNodes; i++) {
        const id = getTotalNodes() + 1;
        const label = alphabet[getTotalNodes()];

        data.nodes.add({ id, label });
        matrix.addRowAndColumn();
        matrix.draw(label);
    }
}

document.getElementById('button-generate-nodes').addEventListener('click', generateManyNodes);

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
