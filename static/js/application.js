import { Matrix } from './matrix.js';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const shuffledAlphabet = [...alphabet];

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function getUniqueRandomLabel() {
    if (shuffledAlphabet.length > 0) {
        const label = shuffledAlphabet.pop();
        return label;
    }
    return null;
}

shuffleArray(shuffledAlphabet);

const matrix = new Matrix();
const data = {
    nodes: new vis.DataSet(),
    edges: new vis.DataSet()
}

const getTotalNodes = () => {
    return data.nodes.length;
}

const getTotalEdges = () => {
    return data.edges.length;
}

const addNode = (node, commit) => {
    if (getTotalNodes() > 15) return;

    node.label = getUniqueRandomLabel();
    commit(node);

    matrix.nodes = data.nodes.get();
    matrix.addRowAndColumn();
    matrix.draw();
}

const deleteNode = (node, commit) => {
    commit(node);

    matrix.removeRowAndColumnByNodeId(node.nodes[0]);
    matrix.nodes = data.nodes.get();
    matrix.draw();
}

const addEdge = (edge, commit) => {
    let weight = prompt('Ingrese el peso de la arista');

    while (parseFloat(weight) <= 0) {
        weight = prompt('Ingrese un peso válido (número positivo)');
    }

    while (weight >= 'A' && weight <= 'z') {
        weight = prompt('Ingrese un peso válido (número positivo), no un caracter');
    }

    edge.label = weight;
    commit(edge);

    matrix.setRelation(edge.from, edge.to, weight);
    matrix.draw();
}

const deleteEdge = (edge, commit) => {
    const targetEdge = data.edges.get().find(e => e.id === edge.edges[0]);
    commit(edge);

    matrix.setRelation(targetEdge.from, targetEdge.to, 0);
    matrix.draw();
}

const generateManyNodes = () => {
    const selectDimensionMatrix = document.getElementById("select-matrix-dimension");
    const missingNodes = selectDimensionMatrix.value - getTotalNodes();

    for (let i = 0; i < Math.abs(missingNodes); i++) {
        if (missingNodes < 0) {
            data.nodes.remove(data.nodes.get()[getTotalNodes() - 1].id);
            matrix.removeRowAndColumnByIndex();
        } else {
            const label = getUniqueRandomLabel();

            data.nodes.add({ label });
            matrix.addRowAndColumn();
        }
    }

    matrix.nodes = data.nodes.get();
    matrix.draw();
}

const existGraphInPanel = () => {
    return getTotalNodes() > 0 && getTotalEdges() > 0;
}

const clearAll = () => {
    data.nodes.clear();
    data.edges.clear();
    matrix.reset();
}

const findShortestPath = () => {
    if (!existGraphInPanel()) return;

    network.setOptions({
        interaction: {
            multiselect: true
        }
    });

    /*
    const body = {
        nodes: data.nodes.get(),
        edges: data.edges.get()
    };

    const setEdgeColors = (path) => {
        const edgesArray = data.edges.get();

        for (let i = 0; i < path.length - 1; i++) {
            const sourceNodeId = path[i].id;
            const targetNodeId = path[i + 1].id;

            const edge = edgesArray.find(edge => (
                (edge.from === sourceNodeId && edge.to === targetNodeId) ||
                (edge.from === targetNodeId && edge.to === sourceNodeId)
            ));

            if (edge) edge.color = 'red';
        }

        data.edges.update(edgesArray);
    };

    const handleResponse = (data) => {
        const messageContainer = document.getElementById('message');
        const path = data.path;
        const pathLength = path.length;
        const startNode = path[0].node;
        const endNode = path[pathLength - 1].node;

        setEdgeColors(path);
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
    */
}

document.getElementById('button-generate-nodes').addEventListener('click', generateManyNodes);
document.getElementById('button-shortest-path').addEventListener('click', findShortestPath);
document.getElementById('button-clear-all').addEventListener('click', clearAll);

const container = document.getElementById('network');
const manipulation = {
    initiallyActive: true,
    addNode: addNode,
    addEdge: addEdge,
    deleteNode: deleteNode,
    deleteEdge: deleteEdge
};

const options = {
    locale: 'es',
    manipulation: manipulation,
    edges: {
        smooth: {
            type: 'continuous'
        }
    },
    interaction: {
        multiselect: false
    }
}

const network = new vis.Network(container, data, options);

const isMultiselectActive = () => {
    return network.selectionHandler.options.multiselect;
}

network.on('selectNode', function (event) {
    const selectedNodes = event.nodes;

    if (isMultiselectActive() && selectedNodes.length == 2) {
        network.body.nodes[selectedNodes[0]].options.color.highlight = {
            background: '#81e776',
            border: '#2B7CE9'
        };

        network.body.nodes[selectedNodes[1]].options.color.highlight = {
            background: '#e77676',
            border: '#2B7CE9'
        };

        network.body.nodes[selectedNodes[0]].options.color.background = '#5af24a';
        network.body.nodes[selectedNodes[1]].options.color.background = '#f24a4a';
    }
});
