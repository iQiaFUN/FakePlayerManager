const path = require('path');
const Client = require('./websocket');
const wsPack = require('./wsPack');
const vcfg = NIL._vanilla.cfg;
const self = vcfg.self_id;
const gmain = vcfg.group.main;
const tmpcfg = JSON.parse(NIL.IO.readFrom(path.join(__dirname, 'example.json')));

function checkFile(file, text) {
    if (NIL.IO.exists(path.join(__dirname, file)) == false) {
        NIL.IO.WriteTo(path.join(__dirname, file), text);
    }
}

checkFile("config.json", JSON.stringify(tmpcfg, null, '\t'));
const cfg = JSON.parse(NIL.IO.readFrom(path.join(__dirname, 'config.json')));
const name = '假人';
const url = `ws://127.0.0.1:${cfg.port}`;

function onStart(api){
    api.addEvent('onFakePlayerConnected');
    api.addEvent('onFakePlayerClosed');
    api.addEvent('onFakePlayerReceived');
    api.addEvent('onFakePlayerError');
    api.addEvent('onFakePlayerList');
    api.addEvent('onFakePlayerAdd');
    api.addEvent('onFakePlayerRemove');
    api.addEvent('onFakePlayerState');
    api.addEvent('onFakePlayerStateAll');
    api.addEvent('onFakePlayerDisconnect');
    api.addEvent('onFakePlayerConnect');
    api.addEvent('onFakePlayerRemoveAll');
    api.addEvent('onFakePlayerDisconnectAll');
    api.addEvent('onFakePlayerConnectAll');
    api.addEvent('onFakePlayerChatControl');
    let client = new Client(url,name,onmessage(name));
    api.listen('onFakePlayerReceived',(dt)=>{
        let d = dt.message;
        let msg;
        if(d.id == cfg.id){
            switch(d.type){
                case 'list':
                    msg = [];
                    for(let i = 0; i < d.data.list.length; i++){
                        msg[2*i+1] = `${d.data.list[i]}`;
                        msg[2*i] = `\n`;
                    }
                    msg[0] = `假人列表:\n\n`;
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerList',d.data);
                    break
                case 'add':
                    if(d.data.success){
                        msg = `添加假人${d.data.name}成功`;
                    }else{
                        msg = `添加假人${d.data.name}失败\n原因: ${d.data.reason}`
                    }
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerAdd',d.data);
                    break
                case 'remove':
                    if(d.data.success){
                        msg = `移除假人${d.data.name}成功`;
                    }else{
                        msg = `移除假人${d.data.name}失败\n原因: ${d.data.reason}`
                    }
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerRemove',d.data);
                    break
                case 'getState':
                    if(d.data.success){
                        msg = 
                        `获取假人${d.data.name}状态成功\n\n昵称: ${d.data.name}\n皮肤: ${d.data.skin}\n状态: ${fpState( d.data.state)}\n聊天控制: ${ChatState(d.data.allowChatControl)}`;
                    }else{
                        msg = `获取假人${d.data.name}状态失败\n原因: ${d.data.reason}`
                    }
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerState',d.data);
                    break
                case 'getState_all':
                    let pldata = d.data.playersData;
                    let i = 0;
                    msg = [];
                    for(let m in pldata){
                        let tmp = pldata[m]
                        msg[2*i+1] = `${m}\t${fpState(tmp.state)}\t${ChatState(tmp.allowChatControl)}\t${tmp.skin}`;
                        msg[2*i] = `\n`;
                        i++
                    }
                    msg[0] = `所有假人状态：\n`;
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerStateAll',d.data);
                    break
                case 'disconnect':
                    if(d.data.success){
                        msg = `断开假人${d.data.name}成功`;
                    }else{
                        msg = `断开假人${d.data.name}失败\n原因: ${d.data.reason}`
                    }
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerDisconnect',d.data);
                    break
                case 'connect':
                    if(d.data.success){
                        msg = `连接假人${d.data.name}成功`;
                    }else{
                        msg = `连接假人${d.data.name}失败\n原因: ${d.data.reason}`
                    }
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerConnect',d.data);
                    break
                case 'remove_all':
                    msg = [];
                    for(let i = 0; i < d.data.list.length; i++){
                        msg[2*i+1] = `${d.data.list[i]}`;
                        msg[2*i] = `\n`;
                    }
                    msg[0] = `移除全部假人：\n`;
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerRemoveAll',d.data);
                    break
                case 'disconnect_all':
                    msg = [];
                    for(let i = 0; i < d.data.list.length; i++){
                        msg[2*i+1] = `${d.data.list[i]}`;
                        msg[2*i] = `\n`;
                    }
                    msg[0] = `断开全部假人：\n`;
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerDisconnectAll',d.data);
                    break
                case 'connect_all':
                    msg = [];
                    for(let i = 0; i < d.data.list.length; i++){
                        msg[2*i+1] = `${d.data.list[i]}`;
                        msg[2*i] = `\n`;
                    }
                    msg[0] = `连接全部假人\n`;
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerConnectAll',d.data);
                    break
                case 'setChatControl':
                    if(d.data.success){
                        msg = `设置假人${d.data.name}状态成功`;
                    }else{
                        msg = `设置假人${d.data.name}状态失败\n原因: ${d.data.reason}`
                    }
                    api.logger.info(`${JSON.stringify(d)}`);
                    NIL.bots.getBot(self).sendGroupMsg(gmain, msg);
                    NIL.EventManager.on('onFakePlayerChatControl',d.data);
                    break
                default:
                    break
            }
        }
    });
    api.listen('onMainMessageReceived',(e)=>{
        let text = getText(e);
		let pt = text.split(' ');
		if(pt[0]==cfg.cmd){
            if(client.ifAlive){
                if(pt.length > 1){
                    switch(pt[1]){
                        case cfg.add.cmd:
                            switch(pt.length){
                                case 3:
                                    client.send(wsPack.getAdd(pt[2],cfg.id));
                                    break
                                case 4:
                                    client.send(wsPack.getAdd(pt[2],cfg.id,pt[3]));
                                    break
                                case 5:
                                    client.send(wsPack.getAdd(pt[2],cfg.id,pt[3],pt[4]));
                                    break
                                default:
                                    break
                            }
                            break
                        case cfg.list.cmd:
                            client.send(wsPack.getList(cfg.id));
                            break
                        case cfg.remove.cmd:
                            if(pt.length == 2){
                                client.send(wsPack.getRemoveAll(cfg.id));
                            }else{
                                client.send(wsPack.getRemove(pt[2],cfg.id));
                            }
                            break
                        case cfg.conn.cmd:
                            if(pt.length == 2){
                                client.send(wsPack.getConnectAll(cfg.id));
                            }else{
                                client.send(wsPack.getConn(pt[2],cfg.id));
                            }
                            break
                        case cfg.disc.cmd:
                            if(pt.length == 2){
                                client.send(wsPack.getDiscAll(cfg.id));
                            }else{
                                client.send(wsPack.getDiscon(pt[2],cfg.id));
                            }
                            break
                        case cfg.state.cmd:
                            if(pt.length == 2){
                                client.send(wsPack.getStateAll(cfg.id));
                            }else{
                                client.send(wsPack.getState(pt[2],cfg.id));
                            }
                            break
                        case cfg.setChat.cmd:
                            client.send(wsPack.getSetControl(pt[2],pt[3],cfg.id))
                            break
                        default:
                            e.reply(`参数错误`)
                    }
                }
            }
        }
    })

}

function onmessage(name){
    return (data)=>{
        NIL.EventManager.on('onFakePlayerReceived',{server:name,message:JSON.parse(data)});
    }
}

function ChatState(tf){
    if(tf){
        return '开'
    }else{
        return '关'
    }
}

/**连接中: 0
已连接: 1
断开连接中: 2
已断开连接: 3
重新连接中: 4
停止中: 5
已停止: 6 */
function fpState(state){
    let r ;
    switch(state){
        case 0:
            r = '连接中';
            break
        case 1:
            r = '已连接';
            break
        case 2:
            r = '断开连接中';
            break
        case 3:
            r = '已断开连接';
            break
        case 4:
            r = '重新连接中';
            break
        case 5:
            r = '停止中';
            break
        case 6:
            r = '已停止';
            break
        default:
            r = '状态错误'
    }
    return r
}
function getText(e) {
    var rt = '';
    for (i in e.message) {
        switch (e.message[i].type) {
            case "text":
                rt += e.message[i].text;
                break;
        }
    }
    return rt;
}

module.exports = {
    onStart,
    onStop(){}
}