import { Matrix } from './matrix.js';

const alphabet = 'ABCDEFGHIJKLMNO';
const data = {
    nodes: new vis.DataSet(), 
    edges: new vis.DataSet()
}

const matrix = new Matrix();
const manipulation = {
    initiallyActive: true,
    addNode: (node, commit) => {
        if (getTotalNodes() > 15) return;

        node.id = getTotalNodes() + 1;
        node.label = alphabet[getTotalNodes()];
        commit(node);

        matrix.addRowAndColumn();
        matrix.draw(node.label);
    },
    addEdge: (edge, commit) => {
        const originIndex = edge.from - 1;
        const targetIndex = edge.to - 1;
        const weight = prompt('Ingrese el peso de la arista');

        edge.label = weight;
        commit(edge);

        matrix.setRelation(originIndex, targetIndex);
        matrix.draw();
    },
};

const container = document.getElementById('network');
const options = { 
    locale: 'es', 
    manipulation: manipulation
}

function getTotalNodes() {
    return data.nodes.length;
}

new vis.Network(container, data, options);
