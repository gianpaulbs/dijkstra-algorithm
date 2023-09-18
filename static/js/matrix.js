export class Matrix {
    constructor() {
        this.data = [];
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

    removeRowAndColumn() {
        const index = this.length - 1;

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

    draw(label = '') {
        const table = document.getElementById('matrix-body');
        let thead = table.querySelector('thead');
        let tbody = table.querySelector('tbody');

        if (label != '') {
            let theadRow, th;

            if (!thead) {
                thead = document.createElement('thead');
                theadRow = document.createElement('tr');
            }
            else {
                theadRow = thead.querySelector('tr');
            }
            
            th = document.createElement('th');
            th.textContent = label;
            theadRow.appendChild(th);
            thead.appendChild(theadRow);
        }

        if (tbody) {
            tbody.remove();
        }

        tbody = document.createElement('tbody');
        for (let i = 0; i < this.data.length; i++) {
            const tbodyRow = document.createElement('tr');

            for (let j = 0; j < this.data[i].length; j++) {
                const td = document.createElement('td');
                td.textContent = this.data[i][j];
                tbodyRow.appendChild(td);
            }

            tbody.appendChild(tbodyRow);
        }

        table.appendChild(thead);
        table.appendChild(tbody);
    }
}