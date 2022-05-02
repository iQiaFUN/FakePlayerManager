function getList(id = ""){
    let p = {
        type: "list",
        id: id
    }
    return JSON.stringify(p)
}

function getAdd(name,id,skin="steve",acc = true){
    let p ={
        type: "add",
        id:id,
        data: {
            name: name,
            skin: skin,
            allowChatControl: acc
        }
    }
    return JSON.stringify(p)
}

function getRemove(name,id){
    let p = {
        type: "remove",
        id: id,
        data: {
            name: name
        }
    }
    return JSON.stringify(p)
}

function getState(name,id = ""){
    let p ={
        type: "getState",
        id: id,
        data: {
            name: name
        }
    }
    return JSON.stringify(p)
}

function getStateAll(id = ""){
    let p = {
        type: "getState_all",
        id:id
    }
    return JSON.stringify(p)
}

function getDiscon(name,id){
    let p = {
        type: "disconnect",
        id: id,
        data: {
            name: name
        }
    }
    return JSON.stringify(p)
}

function getConn(name,id){
    let p = {
        type: "connect",
        id:id,
        data: {
            name: name
        }
    }
    return JSON.stringify(p)
}

function getRemoveAll(id){
    let p = {
        id: id,
        type: "remove_all"
    }
    return JSON.stringify(p)
}

function getConnectAll(id){
    let p = {
        id: id,
        type: "connect_all"
    }
    return JSON.stringify(p)
}

function getDiscAll(id){
    let p = {
        id: id,
        type: "disconnect_all"
    }
    return JSON.stringify(p)
}

function getSetControl(name,acc,id=""){
    let p = {
        type: "setChatControl",
        id:id,
        data: {
            name: name,
            allowChatControl: acc
        }
    }
    return JSON.stringify(p)
}

module.exports = {
    getAdd,
    getConn,
    getConnectAll,
    getDiscAll,
    getDiscon,
    getList,
    getRemove,
    getSetControl,
    getState,
    getStateAll,
    getRemoveAll
}
