import global from "../../global";

cc.Class({
    extends: cc.Component,

    properties: {
        winIcon: {
            default: null,
            type: cc.Node
        },
        loseIcon: {
            default: null,
            type: cc.Node
        },
        roomIdLabel: {
            default: null,
            type: cc.Label
        },
        scoreLabelList: {
            default: [],
            type: cc.Label
        },
        timeLabel: {
            default: null,
            type: cc.Label
        }
    },


    onLoad() {
        for (let i = 0; i < this.scoreLabelList.length; i++) {
            this.scoreLabelList[i].string = '';
        }

    },
//     Simulator: JS
// :
// 初始化一些数据
// {
//     "roomId"
// :
//     "065139", "endTime"
// :
//     "2018-1-4 20:43", "playerData"
// :
//     [{"uid": "3628376", "score": 5, "avatar": "baidu.com", "nickName": "小明1"}, {
//         "uid": "1467241",
//         "score": -5,
//         "avatar": "baidu.com",
//         "nickName": "小明9"
//     }], "houseManagerID"
// :
//     "3628376"
// }
    initWithData: function (parent,data) {
        let recordData = JSON.parse(data.data);
        console.log('初始化一些数据' + JSON.stringify(recordData));
        this.roomIdLabel.string = recordData.roomId;
        this.timeLabel.string = recordData.endTime;
        this.roomID = recordData.roomId;
        let playerData = recordData.playerData;
        for (let i = 0; i < playerData.length; i++) {
            let pd = playerData[i];
            this.scoreLabelList[i].string = pd.nickName + '     ' + pd.score;
            if (pd.uid === global.account.playerData.uid) {
                if (pd.score > 0) {
                    this.winIcon.active = true;
                } else {
                    this.loseIcon.active = true;
                }
            }
        }
        this.parentJS = parent;


    }
    ,
    onButtonClick: function (event, customData) {
        switch (customData){
            case 'check':
                console.log('检查');

                // global.socketControl
                this.parentJS.getRoomRecord(this.roomID);
                break;
            default:
                break;
        }
    }


})
;
