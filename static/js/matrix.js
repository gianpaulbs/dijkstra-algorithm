export class Matrix {
    constructor() {
        this.data = [];
        this.nodes = [];
        this.length = 0;
    }

    addRowAndColumn() {
        this.length++;

        const newIndex = this.length - 1;
        this.data[newIndex] = [];
        
        for (let i = 0; i < this.length; i++) {
            this.data[i][newIndex] = 0;
            this.data[newIndex][i] = 0;
        }
    };

    removeRowAndColumnByNodeId(nodeId) {
        const index = this.getIndexFromNodeId(nodeId);

        for (let i = 0; i < this.length; i++) {
            this.data[i].splice(index, 1);
        }

        this.data.splice(index, 1);
        this.length--;
    }

    removeRowAndColumnByIndex() {
        const index = this.length - 1;

        for (let i = 0; i < this.length; i++) {
            this.data[i].splice(index, 1);
        }

        this.data.splice(index, 1);
        this.length--;
    }
    
    setRelation(from, to, weight) {
        const originIndex = this.getIndexFromNodeId(from);
        const targetIndex = this.getIndexFromNodeId(to); 

        this.data[originIndex][targetIndex] = weight;
        this.data[targetIndex][originIndex] = weight;
    }

    reset() {
        this.nodes = [];
        this.data = [];
        this.length = 0;
        this.draw();
    }

    draw() {
        const table = document.getElementById('matrix-body');
        let thead = table.querySelector('thead');
        let tbody = table.querySelector('tbody');

        if (thead) {
            thead.remove();
            thead.innerHTML = '';
        }
        
        if (tbody) {
            tbody.remove();
        }

        if (this.nodes.length !== 0) {
            thead = document.createElement('thead');
            const theadRow = document.createElement('tr');
            
            for (const node of this.nodes) {
              const th = document.createElement('th');
              th.textContent = node.label;
              theadRow.appendChild(th);
            }
            
            thead.appendChild(theadRow);
        }

        tbody = document.createElement('tbody');
        
        for (const rowData of this.data) {
            const tbodyRow = document.createElement('tr');
            
            for (const cellData of rowData) {
                const td = document.createElement('td');
                td.textContent = cellData;
                tbodyRow.appendChild(td);
            }
            
            tbody.appendChild(tbodyRow);
        }
        
        table.appendChild(thead);
        table.appendChild(tbody);
    }

    getIndexFromNodeId(nodeId) {
        const nodeIdToIndex = {};

        this.nodes.forEach((node, index) => {
            nodeIdToIndex[node.id] = index;
        });

        return nodeIdToIndex[nodeId];
    }
}