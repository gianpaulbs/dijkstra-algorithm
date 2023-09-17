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
    
    setRelation(originIndex, targetIndex) {
        this.data[originIndex][targetIndex] = 1;
        this.data[targetIndex][originIndex] = 1;
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

        console.log(thead);
        table.appendChild(thead);
        table.appendChild(tbody);
    }
}