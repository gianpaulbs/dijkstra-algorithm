import { Matrix } from './matrix.js';

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const selectedNodesFromServer = [];
const selectedEdgesForShortestPath = [];
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
    toggleMatrixContainer();
}

const deleteNode = (node, commit) => {
    commit(node);

    matrix.removeRowAndColumnByNodeId(node.nodes[0]);
    matrix.nodes = data.nodes.get();
    matrix.draw();
    toggleMatrixContainer();
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

const toggleMatrixContainer = () => {
    if (getTotalNodes() > 0)
        matrixContainer.style.display = 'block';
    else
        matrixContainer.style.display = 'none';
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
    toggleMatrixContainer();
}

const existGraphInPanel = () => {
    return getTotalNodes() > 0 && getTotalEdges() > 0;
}

const clearAll = () => {
    data.nodes.clear();
    data.edges.clear();
    matrix.reset();
    toggleMatrixContainer();
}

const resetDijkstra = () => {
    const defaultColor = {
        node: {
            background: "#97C2FC",
            highlight: {
                border: "#2B7CE9",
                background: "#D2E5FF"
            }
        },
        edge: {
            color: "#2B7CE9"
        }
    }

    for (let node of selectedNodesFromServer) {
        console.log(node);
        network.body.nodes[node.id].options.color.background = defaultColor.node.background;
        network.body.nodes[node.id].options.color.highlight = {
            background: defaultColor.node.highlight.background,
            border: defaultColor.node.highlight.border
        };
    }

    for (let edge of selectedEdgesForShortestPath) {
        network.body.edges[edge.id].options.color.color = defaultColor.edge.color;
        network.body.edges[edge.id].options.color.highlight = defaultColor.edge.color;
        network.body.edges[edge.id].options.color.hover = defaultColor.edge.color;
    }

    selectedNodesFromServer.splice(0);
    selectedEdgesForShortestPath.splice(0);
    message.innerHTML = 'Seleccione el nodo de partida y de llegada usando las teclas <b>CTRL + Click</b>.';
    console.log(network.body.edges);
    network.redraw();
}

const cancelAll = () => {
    network.setOptions({
        interaction: {
            multiselect: false
        }
    });

    selectedNodesFromServer.splice(0);
    toggleMainDijkstraView();
}

const toggleMainDijkstraView = () => {
    const dijkstraButtonsDisplay = dijkstraButtonsContainer.style.visibility;

    if (dijkstraButtonsDisplay === 'visible') {
        dijkstraButtonsContainer.style.visibility = 'hidden';
        dijkstraButtonsContainer.style.height = 0;
        mainButtonsContainer.style.visibility = 'visible';
        mainButtonsContainer.style.height = 'auto';
        messageContainer.style.display = 'none';
    }
    else {
        dijkstraButtonsContainer.style.visibility = 'visible';
        dijkstraButtonsContainer.style.height = 'auto';
        mainButtonsContainer.style.visibility = 'hidden';
        mainButtonsContainer.style.height = 0;
        messageContainer.style.display = 'block';
    }
}

const changeDijkstraView = () => {
    if (!existGraphInPanel()) return;

    message.innerHTML = 'Seleccione el nodo de partida y de llegada usando las teclas <b>CTRL + Click</b>.';
    network.setOptions({
        interaction: {
            multiselect: true
        }
    });
    
    toggleMainDijkstraView();
}

const findShortesPath = () => {
    if (selectedNodesFromServer.length == 0) {
        alert('Selecciona 2 nodos para calcular el camino mas corto.');
        return;
    }

    const body = {
        nodes: data.nodes.get(),
        edges: data.edges.get(),
        selected: selectedNodesFromServer
    };

    const setEdgeColors = (path) => {
        const edgesArray = data.edges.get();
        console.log('edgesArray', edgesArray);

        for (let i = 0; i < path.length - 1; i++) {
            const sourceNodeId = path[i].id;
            const targetNodeId = path[i + 1].id;

            const edge = edgesArray.find(edge => (
                (edge.from === sourceNodeId && edge.to === targetNodeId) ||
                (edge.from === targetNodeId && edge.to === sourceNodeId)
            ));

            if (edge) {
                console.log(edge);
                edge.color = 'red';
                selectedEdgesForShortestPath.push(edge);
            }
        }

       data.edges.update(edgesArray);
    };

    const handleResponse = (data) => {
        const path = data.path;
        const pathLength = path.length;
        const startNode = path[0].node;
        const endNode = path[pathLength - 1].node;

        setEdgeColors(path);
        message.textContent = `La distancia más corta entre ${startNode} y ${endNode} es ${data.distance}.`;
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
document.getElementById('button-toggle-dijkstra').addEventListener('click', changeDijkstraView);
document.getElementById('button-clear-all').addEventListener('click', clearAll);
document.getElementById('button-cancel-all').addEventListener('click', cancelAll);
document.getElementById('button-find-shortest-path').addEventListener('click', findShortesPath);
document.getElementById('button-clear-dijkstra').addEventListener('click', resetDijkstra);

const matrixContainer = document.getElementById('matrix');
const networkContainer = document.getElementById('network');
const messageContainer = document.getElementById('message-container');
const message = document.getElementById('message');
const mainButtonsContainer = document.getElementById('main-buttons');
const dijkstraButtonsContainer = document.getElementById('dijkstra-buttons');

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

const network = new vis.Network(networkContainer, data, options);

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

        const originNodeLabel = network.body.nodes[selectedNodes[0]].options.label;
        const targetNodeLabel = network.body.nodes[selectedNodes[1]].options.label;
        selectedNodesFromServer.push({ id: selectedNodes[0], label: originNodeLabel });
        selectedNodesFromServer.push({ id: selectedNodes[1], label: targetNodeLabel });
    }
});
