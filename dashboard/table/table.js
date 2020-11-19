import dashboard from 'https://ventumdashboard.s3.amazonaws.com/dashboard/dashboard.js';
import utils from 'https://ventumdashboard.s3.amazonaws.com/lib/utils.js';
import card from 'https://ventumdashboard.s3.amazonaws.com/dashboard/card/card.js';
import form from 'https://ventumdashboard.s3.amazonaws.com/dashboard/forms/form.js';
import modal from 'https://ventumdashboard.s3.amazonaws.com/dashboard/modal/modal.js';
import buttons from 'https://ventumdashboard.s3.amazonaws.com/dashboard/buttons/buttons.js';

const dfltState = {
    id: "noID",
    title: "Table",
    fetchPath: "/api/aggregate",
    headers: {},
    filters: {},
    headerButtons: {
        filter: {
            enabled: "true",
            type: "filter",
            label: "filtrar",
            onClick: {
                cmds: {
                    0: {
                        type: "filter",
                        payload: {}
                    }
                }
            }
        },
        erase: {
            enabled: "true",
            type: "erase",
            label: "filtrar",
            targeted: true, // Solo se habilita si tengo seleccionado elementos de la tabla
            onClick: {
                cmds: {
                    0: {
                        type: "erase",
                        payload: {}
                    }
                }
            }
        },
        edit: {
            enabled: "true",
            type: "edit",
            label: "editar",
            targeted: true, // Solo se habilita si tengo seleccionado elementos de la tabla
            onClick: {
                cmds: {
                    1: {
                        type: "modal",
                        form: {
                            title: "INTI",
                            cols: {
                                0: {
                                    0: {
                                        type: "text",
                                        label: "DNI",
                                        placeholder: "DNI"
                                    },
                                    1: {
                                        type: "text",
                                        label: "Nombre",
                                        placeholder: "Nombre"
                                    },
                                    2: {
                                        type: "text",
                                        label: "Apellido",
                                        placeholder: "Apellido"
                                    },
                                    3: {
                                        type: "date",
                                        label: "Fecha N.",
                                        placeholder: ""
                                    },
                                    4: {
                                        type: "text",
                                        label: "Empresa",
                                        placeholder: "Empresa"
                                    },
                                },
                                1: {
                                    0: {
                                        type: "text",
                                        label: "Sector",
                                        placeholder: "Sector"
                                    },
                                    1: {
                                        type: "text",
                                        label: "Posición",
                                        placeholder: "Posición"
                                    },
                                    2: {
                                        type: "text",
                                        label: "Mail",
                                        placeholder: "Mail"
                                    },
                                    3: {
                                        type: "text",
                                        label: "Teléfono",
                                        placeholder: ""
                                    },
                                    4: {
                                        type: "text",
                                        label: "Dirección",
                                        placeholder: "Dirección"
                                    },
                                }
                            },
                            footerBtns: {
                                cancel: {
                                    enabled: "true",
                                    type: "edit",
                                    label: "editar",
                                    onClick: {}
                                },
                                acept: {
                                    enabled: "true",
                                    type: "edit",
                                    label: "editar",
                                    onClick: {}
                                }
                            }
                        },
                    }
                }
            }
        },
        add: {
            enabled: "true",
            type: "add",
            label: "agregar",
            onClick: {
                cmds: {
                    0: {
                        type: "modal",
                        payload: {
                            form: {
                                title: "Usuario",
                                cols: {
                                    0: {
                                        0: {
                                            type: "text",
                                            label: "DNI",
                                            placeholder: "DNI"
                                        },
                                        1: {
                                            type: "text",
                                            label: "Nombre",
                                            placeholder: "Nombre"
                                        },
                                        2: {
                                            type: "text",
                                            label: "Apellido",
                                            placeholder: "Apellido"
                                        },
                                        3: {
                                            type: "date",
                                            label: "Fecha N.",
                                            placeholder: ""
                                        },
                                        4: {
                                            type: "text",
                                            label: "Empresa",
                                            placeholder: "Empresa"
                                        },
                                    },
                                    1: {
                                        0: {
                                            type: "text",
                                            label: "Sector",
                                            placeholder: "Sector"
                                        },
                                        1: {
                                            type: "text",
                                            label: "Posición",
                                            placeholder: "Posición"
                                        },
                                        2: {
                                            type: "text",
                                            label: "Mail",
                                            placeholder: "Mail"
                                        },
                                        3: {
                                            type: "text",
                                            label: "Teléfono",
                                            placeholder: ""
                                        },
                                        4: {
                                            type: "text",
                                            label: "Dirección",
                                            placeholder: "Dirección"
                                        },
                                    }
                                },
                                footerButtons: {
                                    cancel: {
                                        enabled: "true",
                                        type: "cancel",
                                        label: "Cancelar",
                                        onClick: {
                                            cmds: {
                                                0: {
                                                    type: "dissmis-modal",
                                                    payload: {}
                                                }
                                            }
                                        }
                                    },
                                    accept: {
                                        enabled: "true",
                                        type: "accept",
                                        label: "Aceptar",
                                        onClick: {
                                            cmds: {
                                                0: {
                                                    type: "push-form",
                                                    payload: {
                                                        fetchPath: "/ingreso/nuevo-equipo",
                                                    }
                                                }
                                            }
                                        }
                                    },
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    add: {},
    initialStages: {},
    finalStages: {},
    footerButtons: {},
    rowsData: [],
    rowsCheckboxs: [],
    targetedButtons: [],
    emptyCellChar: "-",
    selectedPage: 0,
    paginationIndex: 0,

    //HTML References:
    filterBtn: null,
    eraseBtn: null,
    editBtn: null,
    addBtn: null,
};

var states = [];

//---------------------------------------- Otros ----------------------------------------------------

//TODO: Mover a un librería
const formatDateToQuery = (date) => {
    var dateToFormat = date.split("-");
    dateToFormat = dateToFormat[0] + dateToFormat[1] + dateToFormat[2];
    return (dateToFormat[0] + dateToFormat[1] + dateToFormat[2]);
};

//------------------------------ Públicos -----------------------------------------------------------------

// filter, edit, erase, add, dismissModal, post, update, modal
const cmd = (state, cmds, res, pos) => {

    const updateEditRemoveBtns = (state, payload) => {

        return new Promise((resolve, reject) => {
            try {

                const enableBtns = () => {
                    state.targetedButtons.forEach((btn) => {
                        btn.disabled = false;
                    });
                    console.log("enableBtns true");
                };

                const disableBtns = () => {
                    state.targetedButtons.forEach((btn) => {
                        btn.disabled = true;
                    });
                    console.log("enableBtns false");
                };

                var enable = false;
                state.rowsCheckboxs.forEach((checkbox) => {
                    if (checkbox.checked) {
                        enable = true;
                    }
                });

                if (enable) {
                    enableBtns();
                } else {
                    disableBtns();
                }

                resolve();
            } catch (error) {
                console.log(error);
                reject(error);
            }

        });

    };

    const filter = (state, payload) => {
        return new Promise((res, rej) => {
            state.selectedPage = 0;
            state.paginationIndex = 0;
            update(state)
                .then(() => {
                    console.log("updated");
                    res();
                })
                .catch(err => {
                    console.log("failed update: " + err);
                    rej();
                });
        });

    };

    //Updates table data and view
    const update = (state, payload) => {

        const fetchData = () => {

            const getFiltersValues = () => {
                var result = {};
                if (state.filterForm) {
                    const formData = new FormData(state.filterForm);
                    var i = 0;
                    for (var pair of formData.entries()) {
                        result[pair[0]] = pair[1];
                    }
                };
                console.log("filter values: " + JSON.stringify(result));
                return result;
            };

            const getRows = () => {

                const buildPipeline = (filters) => {

                    const buildStage = (key, value) => {
                        console.log(key);
                        console.log(value);

                        const getStageDefinition = () => {
                            var result = null;
                            if (value == "")
                                return result;
                            Object.keys(state.filters).forEach((index) => {
                                Object.keys(state.filters[index].inputs).forEach((filter) => {
                                    if (state.filters[index].inputs[filter].name == key) {
                                        result = state.filters[index].inputs[filter].stage;
                                        console.log(result);
                                    }
                                })
                            })
                            return result;
                        };

                        var result = "";
                        var stageDef = getStageDefinition();
                        console.log(stageDef);
                        if (stageDef != null) {
                            switch (stageDef.type) {
                                case "match":
                                    switch (stageDef.transform) {
                                        case "date":
                                            value = formatDateToQuery(value);
                                            break;
                                        default:
                                            break;
                                    }
                                    var op = "";
                                    switch (typeof(stageDef.op)) {
                                        case 'string':
                                            op = `{"${stageDef.op}":"${value}"}`;
                                            break;
                                        case 'undefined':
                                            op = `"${value}"`;
                                            break;
                                        case 'object':
                                            //TODO
                                            break;
                                        default:
                                            break;
                                    }
                                    result += `{"$match":{"${stageDef.var}":${op}}},`;
                                    break;
                                default:
                                    break;
                            }
                        }
                        return result;
                    }

                    var result = "[";
                    Object.keys(filters).forEach(key => {
                        result += buildStage(key, filters[key]);
                    });
                    Object.keys(state.finalStages).forEach((key) => {
                        result += state.finalStages[key] + ",";
                    })
                    result += `{"$skip": ${state.selectedPage*10} },{"$limit": 10 }]`; //Ordenamiento descendente por Hora (de nuevo a viejo) -- Hasta 10 resultados.
                    console.log(result);
                    return result;
                };
                var path = state.fetchPath;
                var filters = getFiltersValues();
                var pipeline = buildPipeline(filters);

                return new Promise((resolve, reject) => {
                    const options = `{"collation":{"locale":"en_US","numericOrdering":true},"allowDiskUse" : true}`;
                    fetch(path + "?pipeline=" + pipeline + "&options=" + options, {
                            referrerPolicy: "origin-when-cross-origin",
                            credentials: 'include',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            }
                        })
                        .then(res => res.json())
                        .then(res => resolve(res))
                        .catch(err => {
                            console.log(err);
                            reject(err)
                        });
                });
            }

            const getCount = () => {
                const buildPipeline = (filters) => {

                    const buildStage = (key, value) => {
                        console.log(key);
                        console.log(value);

                        const getStageDefinition = () => {
                            var result = null;
                            if (value == "")
                                return result;
                            Object.keys(state.filters).forEach((index) => {
                                Object.keys(state.filters[index].inputs).forEach((filter) => {
                                    if (state.filters[index].inputs[filter].name == key) {
                                        result = state.filters[index].inputs[filter].stage;
                                        console.log(result);
                                    }
                                })
                            })
                            return result;
                        };

                        var result = "";
                        var stageDef = getStageDefinition();
                        console.log(stageDef);
                        if (stageDef != null) {
                            switch (stageDef.type) {
                                case "match":
                                    switch (stageDef.transform) {
                                        case "date":
                                            value = formatDateToQuery(value);
                                            break;
                                        default:
                                            break;
                                    }
                                    var op = "";
                                    switch (typeof(stageDef.op)) {
                                        case 'string':
                                            op = `{"${stageDef.op}":"${value}"}`;
                                            break;
                                        case 'undefined':
                                            op = `"${value}"`;
                                            break;
                                        case 'object':
                                            //TODO
                                            break;
                                        default:
                                            break;
                                    }
                                    result += `{"$match":{"${stageDef.var}":${op}}},`;
                                    break;
                                default:
                                    break;
                            }
                        }
                        return result;
                    }

                    var result = "[";
                    Object.keys(filters).forEach(key => {
                        result += buildStage(key, filters[key]);
                    });
                    Object.keys(state.finalStages).forEach((key) => {
                        result += state.finalStages[key] + ",";
                    })
                    result += `{ "$count": "count" }]`; //Ordenamiento descendente por Hora (de nuevo a viejo) -- Hasta 10 resultados.
                    console.log(result);
                    return result;
                };
                var path = state.fetchPath;
                var filters = getFiltersValues();
                var pipeline = buildPipeline(filters);

                return new Promise((resolve, reject) => {
                    // const options = `{"collation":{"locale":"en_US","numericOrdering":true}, "allowDiskUse" : true}`;
                    const options = `{"allowDiskUse" : "true"}`;
                    fetch(path + "?pipeline=" + pipeline + "&options=" + options, {
                            referrerPolicy: "origin-when-cross-origin",
                            credentials: 'include',
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json;charset=utf-8',
                            }
                        })
                        .then(res => {
                            console.log(res);
                            return res.json();
                        })
                        .then(res => {
                            console.log(res);
                            resolve(res);
                        })
                        .catch(err => {
                            console.log(err);
                            reject(err)
                        });
                });
            };

            return new Promise((resolve, reject) => {
                var result = {};
                getRows()
                    .then(rows => {
                        result.rows = rows;
                        return getCount();
                    })
                    .then(count => {
                        if (count[0])
                            result.count = count[0].count;
                        else
                            result.count = 0;
                        resolve(result);
                    })
                    .catch(err => {
                        console.log(err);
                        reject(err);
                    });
            });
        };

        const drawPagination = (count) => {
            try {
                state.paginationRoot.innerHTML = "";

                const removeAllActives = () => {
                    state.paginationRoot.childNodes.forEach(el => el.classList.remove("active"));
                }

                //Creo el btn first
                var first = document.createElement("li");
                first.className = "page-item";
                state.paginationRoot.appendChild(first);
                var firstButton = document.createElement("button");
                firstButton.className = "page-link ventum-pagination-btn";
                firstButton.innerHTML = "Principio";
                if (state.paginationIndex == 0) {
                    firstButton.disabled = true;
                    firstButton.style.color = "grey";
                }
                firstButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.paginationIndex = 0;
                    drawPagination(state, count);
                })
                first.appendChild(firstButton);

                //Creo el btn <<
                var previous = document.createElement("li");
                previous.className = "page-item";
                state.paginationRoot.appendChild(previous);
                var previousButton = document.createElement("button");
                previousButton.className = "page-link ventum-pagination-btn";
                previousButton.innerHTML = "<<";
                if (state.paginationIndex == 0) {
                    previousButton.disabled = true;
                    previousButton.style.color = "grey";
                }
                previousButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.paginationIndex -= 1;
                    drawPagination(state, count);
                });
                previous.appendChild(previousButton);

                //Creo los indices...
                for (let index = state.paginationIndex * 10;
                    (index < count / 10 && index < state.paginationIndex * 10 + 10); index++) {
                    console.log(index);
                    var li = document.createElement("li");
                    li.className = "page-item";
                    state.paginationRoot.appendChild(li);
                    var button = document.createElement("button");
                    button.className = "page-link ventum-pagination-btn";
                    button.innerHTML = (index + 1).toString();
                    const i = index;
                    button.addEventListener('click', (e) => {
                        e.preventDefault();
                        removeAllActives();
                        state.selectedPage = i;
                        state.paginationRoot.childNodes[state.selectedPage % 10 + 2].className += " active";
                        update(state).then(() => console.log("updated")).catch(err => console.log("failed update: " + err));
                    })
                    li.appendChild(button);
                }

                removeAllActives();
                if (state.selectedPage >= state.paginationIndex * 10 && state.selectedPage <= (state.paginationIndex + 1) * 10 && state.paginationRoot.childNodes[state.selectedPage % 10 + 2])
                    state.paginationRoot.childNodes[state.selectedPage % 10 + 2].className += " active";

                //Creo el btn >>
                var next = document.createElement("li");
                next.className = "page-item";
                state.paginationRoot.appendChild(next);
                var nextButton = document.createElement("button");
                nextButton.className = "page-link ventum-pagination-btn";
                nextButton.innerHTML = ">>";
                if (Math.trunc(count / 100) == state.paginationIndex) {
                    nextButton.disabled = true;
                    nextButton.style.color = "grey";
                }

                nextButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.paginationIndex += 1;
                    drawPagination(state, count);
                });
                next.appendChild(nextButton);

                //Creo el btn last
                var last = document.createElement("li");
                last.className = "page-item";
                state.paginationRoot.appendChild(last);
                var lastButton = document.createElement("button");
                lastButton.className = "page-link ventum-pagination-btn";
                lastButton.innerHTML = "Último";
                if (Math.trunc(count / 100) == state.paginationIndex) {
                    lastButton.disabled = true;
                    lastButton.style.color = "grey";
                }

                lastButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    state.paginationIndex = Math.trunc(count / 100);
                    drawPagination(state, count);
                })
                last.appendChild(lastButton);

                //Pagina n de N
                var pages = document.createElement("li");
                pages.className = "page-item";
                pages.style["align-self"] = "center";
                pages.style.float = "right";
                pages.innerHTML = `${state.selectedPage + 1} de ${Math.trunc(count/10+ 1) } &nbsp`;
                pages.style.color = "grey";
                state.paginationRoot.appendChild(pages);

                //Input ir a
                var goToLi = document.createElement("li");
                goToLi.className = "page-item";
                goToLi.style.width = '5%';
                state.paginationRoot.appendChild(goToLi);
                var goTo = document.createElement("input");
                goTo.className = "form-control";
                goTo.style.width = '95%';
                goToLi.appendChild(goTo);
                var goToButton = document.createElement("button");
                goToButton.className = "page-link ventum-pagination-btn";
                goToButton.innerHTML = "Ir";
                goToButton.addEventListener('click', (e) => {
                    e.preventDefault();
                    var page = parseInt(goTo.value, 10);
                    if (page && page < count / 10) {
                        state.selectedPage = page - 1;
                        state.paginationIndex = Math.trunc(state.selectedPage / 10);
                        update(state).then(() => console.log("updated")).catch(err => console.log("failed update: " + err));
                    } else {
                        goTo.value = "";
                    }
                })
                state.paginationRoot.appendChild(goToButton);
            } catch (error) {
                console.log(error);
            }
        };

        const drawRows = (data) => {
            try {

                const getCellValue = (row, path) => {
                    if (row[path[0]] == null) {
                        return null;
                    } else if (path.length > 1) {
                        var temp = path.shift();
                        return getCellValue(row[temp], path);
                    } else {
                        return row[path[0]];
                    }
                }

                console.log("drawRows data: " + JSON.stringify(data));
                console.log("drawRows headers: " + JSON.stringify(state.headers));
                state.rowsRoot.innerHTML = "";

                state.rowsCheckboxs = [];

                data.forEach(row => {
                    var tr = document.createElement("tr");
                    tr.className = "";
                    state.rowsRoot.appendChild(tr);

                    if (true) {
                        var th = document.createElement("th");
                        var checkbox = document.createElement("input");
                        checkbox.type = "checkbox";
                        checkbox.className = "";
                        state.rowsCheckboxs.push(checkbox);
                        checkbox.addEventListener('click', (e) => {
                            updateEditRemoveBtns(state);
                        })
                        th.appendChild(checkbox);
                        tr.appendChild(th);
                    }

                    Object.keys(state.headers).forEach(headerKey => {
                        var th = document.createElement("th");
                        var cellValue = getCellValue(row, state.headers[headerKey].name.split('.'));
                        cellValue = cellValue || state.emptyCellChar;
                        th.innerHTML = cellValue;
                        tr.appendChild(th);
                    });
                });
            } catch (error) {
                console.log(error);
            }
        };

        return new Promise((resolve, reject) => {
            fetchData()
                .then(result => {
                    state.rowsData = result.rows;
                    drawRows(result.rows);
                    drawPagination(result.count);
                    resolve("ok");
                })
                .catch(err => {
                    console.log(err);
                    reject(err);
                });
        });
    };
    console.log(`cmds´(${JSON.stringify(pos)}): ${JSON.stringify(cmds)}`);

    try {
        //A: Si ya ejecute todos los comandos termino
        if (Object.keys(cmds).length == pos) {
            return;
        } else {
            var c = null;
            var command = cmds[pos];
            switch (command.type) {
                case "filter":
                    c = () => filter(state, command.payload);
                    break;
                case "post":
                    c = () => dashboard.post(state, command.payload);
                    break;
                case "modal":
                    c = () => modal.show(state, command.payload);
                    break;
                case "update":
                    c = () => update(state, command.payload);
                    break;
                default:
                    console.log(`Cmd not found: ${command.type}`);
                    c = () => new Promise((res, rej) => { rej(`Cmd not found: ${command.type}`) });
                    break;
            }

            c()
                .then((res) => {
                    cmd(state, cmds, res, pos + 1);
                })
                .catch(err => console.log(err));
        }
    } catch (error) {
        console.log(error);
    }
};

const resetStates = () => {
    if (states.length > 0) {
        states.forEach((el) => {
            el = null;
        })
    }
    states = [];
};

const create = (data, parent) => {
    try {

        const createFilters = () => {
            var div = document.createElement("div");
            div.id = newState.id + "-table-filters";
            div.className = "ventum-table-filters ";
            cardParent.body.appendChild(div);

            newState.filterForm = document.createElement("form");
            newState.filterForm.id = newState.id + "-table-filters-form";
            newState.filterForm.className = "ventum-table-filters-form";
            div.appendChild(newState.filterForm);

            var formRow = document.createElement("div");
            formRow.id = newState.id + "-table-filters-form-row";
            formRow.className = "form-row ventum-table-filters-form-row";
            newState.filterForm.appendChild(formRow);

            //TODO modificar para que se puedan poner mas de 5 filtros
            for (let index = 0; index < 5; index++) {
                var col = document.createElement("div");
                col.id = newState.id + "-table-filters-form-col-" + index.toString();
                col.className = "col-2";
                formRow.appendChild(col);
                if (Object.keys(newState.filters).length > index) {
                    var label = document.createElement("label");
                    label.id = newState.id + "-table-filters-form-col-" + index.toString() + "-label";
                    label.innerHTML = newState.filters[index].label;
                    col.appendChild(label);

                    var inputs = document.createElement("div");
                    inputs.className = "form-row";
                    col.appendChild(inputs);

                    var inputsArray = Object.values(newState.filters[index].inputs);
                    inputsArray.forEach(input => {
                        var inputCol = document.createElement("div");
                        switch (inputsArray.length) {
                            case 1:
                                inputCol.className = "col-12";
                                break;
                            case 2:
                                inputCol.className = "col-6";
                                break;
                            case 3:
                                inputCol.className = "col-4";
                                break;
                            case 4:
                                inputCol.className = "col-3";
                                break;
                            default:
                                inputCol.className = "col-12";
                                break;
                        }
                        inputs.appendChild(inputCol);

                        var field = document.createElement("input");
                        field.ishoveredin = "0";
                        field.isfocusedin = "0";
                        field.name = input.name;
                        field.type = input.type;
                        field.className = "form-control";
                        field.placeholder = input.placeholder;
                        field.value = input.value;
                        field.required = input.required;
                        inputCol.appendChild(field);
                    });
                }

            }
            var col = document.createElement("div");
            col.id = newState.id + "-table-filters-form-col-" + "6";
            col.className = "col-2";
            col.style.textAlign = "center";
            formRow.appendChild(col);
            var label = document.createElement("label");
            label.id = newState.id + "-table-filters-form-col-" + "submit" + "-label";
            label.innerHTML = "  &nbsp";
            label.style.position = "relative";
            label.style.width = '100%';
            col.appendChild(label);

            var inputs = document.createElement("div");
            inputs.className = "form-row";
            col.appendChild(inputs);

            var btns = Object.entries(newState.headerButtons);
            var btnsCount = 0;
            btns.forEach(([key, value]) => {
                if (value)
                    btnsCount++;
            });
            console.log("header buttons: " + btnsCount.toString());
            newState.targetedButtons = [];
            btns.forEach(([key, value]) => {
                if (value.enabled) {
                    if (btnsCount < 3)
                        value.showLabel = true;
                    else
                        value.showLabel = false;

                    var btnDiv = document.createElement("div");
                    switch (btnsCount) {
                        case 1:
                            btnDiv.className += "col-12";
                            break;
                        case 2:
                            btnDiv.className += "col-6";
                            break;
                        case 3:
                            btnDiv.className += "col-4";
                            break;
                        case 4:
                            btnDiv.className += "col-3";
                            break;
                        default:
                            btnDiv.className += "col-12";
                            break;
                    }
                    inputs.appendChild(btnDiv);
                    var btn = buttons.createBtn(value);
                    btnDiv.appendChild(btn);
                    btn.addEventListener('click', (e) => {
                        e.preventDefault();
                        cmd(newState, value.onClick.cmds, null, 0);
                    });

                    if (value.targeted) {
                        newState.targetedButtons.push(btn);
                        btn.disabled = true;
                    }
                }
            });

            return div;
        };
        const createContent = () => {
            var table = document.createElement("table");
            table.id = newState.id + "-table-content";
            //Ahora uso table-sm pero deberÃ­a adaptarse a la contenedor...
            table.className = "table table-sm table-striped table-hover ventum-table-content";
            cardParent.body.appendChild(table);

            //Creo los headers
            var thead = document.createElement("thead");
            thead.id = newState.id + "-table-headers";
            thead.className = "thead-dark";
            table.appendChild(thead);
            var tr = document.createElement("tr");
            tr.id = newState.id + "-table-headers-tr";
            tr.className = "";
            thead.appendChild(tr);

            if (true) {
                var th = document.createElement("th");
                th.id = newState.id + "-table-headers-th";
                th.className = "";
                th.innerHTML = " &nbsp";
                thead.appendChild(th);
            }

            Object.keys(newState.headers).forEach(key => {
                var th = document.createElement("th");
                th.id = newState.id + "-table-headers-th";
                th.className = "";
                th.innerHTML = newState.headers[key].label;
                thead.appendChild(th);
            });

            //Creo las filas
            var tbody = document.createElement("tbody");
            tbody.id = newState.id + "-table-body";
            tbody.className = "";
            newState.rowsRoot = tbody;
            table.appendChild(tbody);

            return table;
        };
        const createFooter = () => {
            var nav = document.createElement("nav");
            nav.id = newState.id + "-card-footer-nav";
            nav.className = "ventum-table-footer";
            cardParent.footer.appendChild(nav);

            var ul = document.createElement("ul");
            ul.id = newState.id + "-card-footer-ul";
            ul.className = "pagination ventum-table-footer-ul";
            nav.appendChild(ul);
            newState.paginationRoot = ul;

            return nav;
        };

        var newState = utils.fillObjWithDflt(data, dfltState);
        const cardParent = card.create({ title: newState.title }, parent);

        var filters = createFilters();
        var content = createContent();
        var footer = createFooter();

        console.log("states: " + states.push(newState).toString());

        cmd(newState, { 0: { type: "update", payload: {} } }, null, 0);

        return newState;

    } catch (error) {
        console.log("failed to create table: " + error.toString());
        return null;
    }

};

export default { create, resetStates, cmd, states };