export class Matrix {
    constructor() {
        this.data = [];
        this.nodes = [];
        this.edges = [];
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

    removeRowAndColumn(index = this.length - 1) {
        for (let i = 0; i < this.length; i++) {
            this.data[i].splice(index, 1);
        }

        this.data.splice(index, 1);
        this.length--;
    }
    
    setRelation(originIndex, targetIndex, weight) {
        this.data[originIndex][targetIndex] = weight;
        this.data[targetIndex][originIndex] = weight;
    }

    draw() {
        const table = document.getElementById('matrix-body');
        let thead = table.querySelector('thead');
        let tbody = table.querySelector('tbody');

        if (thead) {
            thead.remove();
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
}