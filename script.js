const LEGION_NUMBERS = [1, 3, 4, 5, 6, 7, 8, 9, 10, 12];
const LEGION_NAMES = ["Темные ангелы", "Дети Императора", "Железные воины", "Белые шрамы", "Космические волки",
                       "Имперские кулаки", "Повелители ночи", "Кровавые ангелы", "Железные руки", "Пожиратели миров"];
const PRIMARCHS = ["Лион Эль-Джонсон", "Фулгрим", "Пертурабо", "Джагатай Хан", "Леман Русс",
                    "Рогал Дорн", "Конрад Керз", "Сангвиний", "Феррус Манус", "Ангрон"];
const LOYALTY = ["Лоялен", "Отступники", "Отступники", "Лоялен", "Лоялен",
                  "Лоялен", "Отступники", "Лоялен", "Лоялен", "Отступники"];

let data = [];
for (let i = 0; i < LEGION_NUMBERS.length; i++) {
    let item = {
        'legionNumber': LEGION_NUMBERS[i],
        'legionName': LEGION_NAMES[i],
        'primarch': PRIMARCHS[i],
        'loyalty': LOYALTY[i]
    }
    data.push(item);
}

drawTable = (data) => {
    let html = "";
    for (let row in data) {
        html += "<tr>"
        for (let column in data[row]) {
            html += `<td>${data[row][column]}</td>`
        }
        html += "</tr>"
    }
    return html;
}

let table = document.getElementById("table");
table.innerHTML = drawTable(data);

function sorting (data, sortList) {
    return data.sort(function (a, b) {
                let result = 0;
                for (let i = 0; i < sortList.length; i++) {
                    let key = sortList[i];
                    if (a[key] < b[key]) {
                        result = -1;
                        break;
                    } else if (a[key] > b[key]) {
                        result = 1;
                        break;
                    }
                }
                return result;
        });
}

let form = document.forms[0];

let sortButton = form.sortButton;
sortButton.onclick = function () {
    let list = [];
    for (let i = 0; i < form.sort.length; i++) {
        list.push(form.sort[i].value);
    }
    data = sorting(data, list);
    table.innerHTML = drawTable(data);
};

function getActualOptions () {
    for (let i = 0; i < form.sort.length; i++) {
        for (let j = 0; j < form.sort[i].length; j++) {
            form.sort[i][j].style.display = "";
        }
    }
    for (let i = 0; i < form.sort.length; i++) {
        for (let j = 0; j < form.sort.length; j++) {
            if (i === j) continue;
            if (form.sort[j].value !== 'no')
                form.sort[i][form.sort[j].selectedIndex].style.display = "none";
        }
    }
}

const operations = ['==', '=='];
const filterKeys = ['legionName', 'primarch'];

let filterButton = form.filterButton;
filterButton.onclick = function () {
    let list = [];
    for (let i = 0; i < form.filter.length; i++) {
        if (form.filter[i].value !== '') {
            let object = {
                'key': filterKeys[i],
                'operation': operations[i],
                'value': form.filter[i].value
            }
            list.push(object);
        }
    }
    data = filtering(data, list);
    table.innerHTML = drawTable(data);
};

function getLogOperResult (valueLeft, operation, valueRight) {
    switch (operation)  {
        case '==':
            return valueLeft.toLowerCase().indexOf(valueRight.toLowerCase()) !== -1;
        case '>=':
            return valueLeft >= valueRight;
        case '<=':
            return valueLeft <= valueRight;
    }
}

function filtering (data, list) {
    if (list.length === 0)
        return;
    let temp = data;
    for (let i = 0; i < list.length; i++) {
        temp = temp.filter((item) =>
            getLogOperResult(item[list[i]['key']],
                            list[i]['operation'],
                            list[i]['value'])
        );
    }
    return temp;
}