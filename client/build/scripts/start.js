function shownotification(message){

    alert(message);
}

function getElement(e) {
    return document.querySelector(e)
}

function getRandomColor() {
    for (var e = "0123456789ABCDEF".split(""), t = "#", n = 0; 6 > n; n++) t += e[Math.round(15 * Math.random())];
    return t
}


function getUserinfo(e, t) {
    return e ? '<video src="' + e + '" autoplay></vide>' : '<img src="' + t + '">'
}

function fireClickEvent(e) {
    var t = new MouseEvent("click", {
        view: window,
        bubbles: !0,
        cancelable: !0
    });
    e.dispatchEvent(t)
}

function bytesToSize(e) {
    var t = ["Bytes", "KB", "MB", "GB", "TB"];
    if (0 == e) return "0 Bytes";
    var n = parseInt(Math.floor(Math.log(e) / Math.log(1024)));
    return Math.round(e / Math.pow(1024, n), 2) + " " + t[n]
}

var t = username;
var o = "/";
var e= null;
var n=useremail;

/* *************************************************************************************
		peerconnection 
****************************************************************************/

var rtcMultiConnection = new RTCMultiConnection;

rtcMultiConnection.session = {
    video: !0,
    audio: !0,
    data: !0
}, 

rtcMultiConnection.sdpConstraints.mandatory = {
    OfferToReceiveAudio: !0,
    OfferToReceiveVideo: !0
}, 

rtcMultiConnection.customStreams = {}, 

rtcMultiConnection.autoCloseEntireSession = !1, 

rtcMultiConnection.autoTranslateText = !1, 

rtcMultiConnection.maxParticipantsAllowed = 3, 

rtcMultiConnection.setDefaultEventsForMediaElement = !1, 

rtcMultiConnection.onopen = function(e) {
    alert( e.extra.username + " Joined the conversation."), 
    startsessionTimer();
    numbersOfUsers.innerHTML = parseInt(numbersOfUsers.innerHTML) + 1 ; 
};

var whoIsTyping = document.querySelector("#who-is-typing");

rtcMultiConnection.onmessage = function(e) {

    if(e.data.typing){
        void(whoIsTyping.innerHTML = e.extra.username + " is typing ...") ;
    }

    else if(e.data.stoppedTyping){
        void(whoIsTyping.innerHTML = "");
    }

    else if(e.data.type == "chat"){
        whoIsTyping.innerHTML = "";
        addNewMessage({
            header: e.extra.username,
            message: linkify(e.data.message),
            userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
            color: e.extra.color
        }); 
        void(document.title = e.data.message);
    }
    else if(e.data.type == "file"){
        addNewMessage({
            header: e.extra.username,
            message: e.data.message,
            userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "chat-message.png"),
            color: e.extra.color
        }); 
    }
    else if(e.data.type=="canvas"){
        CanvasDesigner.syncData( e.data.draw );
    }
    return;
};

var sessions = {};

rtcMultiConnection.onNewSession = function(e) {
    sessions[e.sessionid] || (sessions[e.sessionid] = e, e.join())
}, 

rtcMultiConnection.onRequest = function(e) {
    rtcMultiConnection.accept(e)
}, 

rtcMultiConnection.onCustomMessage = function(e) {
    if (e.hasCamera || e.hasScreen) {
        var t = e.extra.username + " enabled webcam.";
        e.hasScreen && (e.session.oneway = !0, rtcMultiConnection.sendMessage({
            renegotiate: !0,
            streamid: e.streamid,
            session: e.session
        }), t = e.extra.username + " is ready to share screen.")
    }
    if (e.hasMic && (e.session.oneway = !0, rtcMultiConnection.sendMessage({
            renegotiate: !0,
            streamid: e.streamid,
            session: e.session
        })), e.renegotiate) {
        var n = rtcMultiConnection.customStreams[e.streamid];
        n && rtcMultiConnection.peers[e.userid].renegotiate(n, e.session)
    }
}, 

rtcMultiConnection.blobURLs = {};

var islocalStream = 1;

rtcMultiConnection.onstream = function(e) {
    e.stream.getVideoTracks().length && (rtcMultiConnection.blobURLs[e.userid] = e.blobURL);
    var t = e.mediaElement;
    
    if (t.setAttribute("preload", "none"), e.isScreen) {
        1 == islocalStream && (t.setAttribute("class", "local"), islocalStream = 0);
        var n = document.createElement("li");
        n.setAttribute("id", e.userid + "_screen");
        var i = document.createElement("div");
        i.setAttribute("class", "custom_wrapper");
        var o = document.createElement("div");
        o.setAttribute("class", "video"), 

        o.appendChild(t), 
        i.appendChild(o), 
        n.appendChild(i), 

        console.log("mediaElement", n), 
        usersContainer.appendChild(n)
    } 

    else {
        1 == islocalStream && (t.setAttribute("class", "local"), islocalStream = 0);
        var n = document.createElement("li");
        n.setAttribute("id", e.userid);
        var i = document.createElement("div");
        i.setAttribute("class", "custom_wrapper");
        var o = document.createElement("div");
        o.setAttribute("class", "video");

        //add the snaspshot button
        var snapshotButton=document.createElement("div");
        snapshotButton.id="snapshotButton";
        snapshotButton.className="fa fa-camera";
        snapshotButton.setAttribute("style","color: black; float: right;    padding-right: 40px; line-height: 1.4;");
        snapshotButton.onclick = function() {
            var liVideoContainer=event.path[1].id;
            var streamId= document.getElementById(liVideoContainer).childNodes[0].childNodes[0].childNodes[0].id;
            var snaspshot=document.createElement("img");
            rtcMultiConnection.streams[streamId].takeSnapshot(function(snapshot) {
                snaspshot.src = snapshot;
                document.getElementById("widget-filesharing-container").appendChild(snaspshot);
            });         
        };

        o.appendChild(t), 
        i.appendChild(o), 
        n.appendChild(i), 
        n.appendChild(snapshotButton);

        console.log("mediaElement", n), 
        console.log(rtcMultiConnection.streams), 
        usersContainer.appendChild(n)
    }
}, 

rtcMultiConnection.onstreamended = function(e) {
    e.isScreen ? $("#" + e.userid + "_screen").remove() : $("#" + e.userid).remove()
}, 

rtcMultiConnection.sendMessage = function(e) {
    e.userid = rtcMultiConnection.userid, 
    e.extra = rtcMultiConnection.extra, 
    rtcMultiConnection.sendCustomMessage(e)
}, 

rtcMultiConnection.onclose = rtcMultiConnection.onleave = function(e) {
    
    addNewMessage({
        header: e.extra.username,
        message: e.extra.username + " left session.",
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[e.userid], "info.png"),
        color: e.extra.color
    }), 
    
    $("#" + e.userid).remove(), 

    shownotification(e.extra.username + " left the conversation."), 
    rtcMultiConnection.playRoleOfInitiator()
};


/********************************************************************************** 
		Session call 
************************************************************************************/

 function startcall() {
    
    rtcMultiConnection.extra = {
        username: t,
        color: "ffffff",
        useremail: n
    };

    var o = "/";
    //var o = "http://52.8.183.220:8084";

    socket = io.connect(o), 

    // socketio presence check for the channel name 
    socket.on("presence", function(e) {
        e ? 
        (shownotification("Joing an existing session "), 
            document.getElementById("mainWrap").style.display = "block", 
            document.body.style.backgroundColor = "#323232", rtcMultiConnection.connect()) : 
        (shownotification("Making a new session "), 
            document.getElementById("mainWrap").style.display = "block", 
            document.body.style.backgroundColor = "#3D3D3D", rtcMultiConnection.open())}),  

    socket.emit("presence", {
        channel: rtcMultiConnection.channel,
        useremail: n,
        username: t
    }), 


    //Code to open  signalling channel 
    rtcMultiConnection.openSignalingChannel = function(e) {

        console.log("#startjs ---------------opensignalling channel || sender ",rtcMultiConnection.userid, "|| " , e.channel , "||", this.channel);

        var t = e.channel || this.channel;
        io.connect(o).emit("new-channel", {
            channel: t,
            sender: rtcMultiConnection.userid
        });

        var n = io.connect(o + t);    
        n.channel = t, 
        console.log(" open channel " , n.channel);

        n.on("connect", function() {
            console.log("#startjs-------------------n.channel connect ");
            e.callback && e.callback(n)
        }), 

        n.send = function(e) {
            console.log("#startjs------------------n.emit ");
            n.emit("message", {
                sender: rtcMultiConnection.userid,
                data: e
            })
        }, 

        n.on("message", e.onmessage), 
        
        n.on("disconnect", "datalost")
    }
};

/********************************************************************************8
        Chat
**************************************************************************************/

function addNewMessage(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
        var t = document.createElement("div");
        t.style["float"] = "left", 
        t.className = "user-activity user-activity-left", 
        t.setAttribute("style","background-color:rgba(6, 25, 255, 0.67)"),
        t.innerHTML = '<div class="chatusername">' + e.header + "</div>";
        var n = document.createElement("div");
        n.className = "userchatmsg", 
        n.setAttribute("style","color:white"),
        t.appendChild(n), 
        n.innerHTML = e.message, 
        document.getElementById("all-messages").appendChild(t),
        $(".popup-messages").scrollTop($(".popup-messages")[0].scrollHeight) 
    }
}

function addNewMessagelocal(e) {
    if ("" != e.message && " " != e.message) {
        var t = document.createElement("div");
        t.style["float"] = "right", 
        t.className = "user-activity user-activity-right", 
        t.setAttribute("style","background-color:rgba(20, 147, 47, 0.67)"),
        t.innerHTML = '<div class="chatusername">' + e.header + "</div>";
        var n = document.createElement("div");
        n.className = "userchatmsg", 
        t.appendChild(n), 
        n.innerHTML = e.message, 
        n.setAttribute("style","color:white"),
        document.getElementById("all-messages").appendChild(t), 
        $(".popup-messages").scrollTop($(".popup-messages")[0].scrollHeight) 
    }
}

var isShiftKeyPressed = !1;

getElement(".main-input-box input").onkeydown = function(e) {
    16 == e.keyCode && (isShiftKeyPressed = !0)
};

var numberOfKeys = 0;

getElement(".main-input-box input").onkeyup = function(e) {

    if (numberOfKeys++, numberOfKeys > 3 && (numberOfKeys = 0), !numberOfKeys) {
        
        if (8 == e.keyCode) return rtcMultiConnection.send({
            stoppedTyping: !0
        });

        rtcMultiConnection.send({
            typing: !0
        })
    }

    return isShiftKeyPressed ? 
        void(16 == e.keyCode && (isShiftKeyPressed = !1)) : 
        void(13 == e.keyCode && (addNewMessagelocal({
                    header: rtcMultiConnection.extra.username,
                    message: linkify(this.value),
                    userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "chat-message.png"),
                    color: rtcMultiConnection.extra.color
                }), 
                rtcMultiConnection.send({type:"chat",message:this.value}), 
                this.value = ""))
};


document.getElementById('send').onclick = function() {
    var msg=getElement(".main-input-box input").value;
    addNewMessagelocal({
                header: rtcMultiConnection.extra.username,
                message: linkify(msg),
                userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "chat-message.png"),
                color: rtcMultiConnection.extra.color
            });
    rtcMultiConnection.send({type:"chat", message:msg });
    this.value = "";
    return false; 
};


function addNewFileLocal(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
        var t = document.createElement("div");
        t.style["float"] = "left", 
        t.className = "user-activity ", 
        t.setAttribute("style","    background-color: rgba(251, 255, 6, 0.37); line-height: 1.28;     padding: 9px;    margin: 2px;    width: 20%;    min-height: 20px;    height: 41px;")
        t.innerHTML = '<div class="chatusername">' + e.header + "</div>";
        var n = document.createElement("div");
        n.className = "userchatmsg", 
        n.setAttribute("style","color:white"),
        t.appendChild(n), 
        n.innerHTML = e.message, 
        document.getElementById("widget-filesharing1").appendChild(t)
    }
}

function addNewFileRemote(e) {
    console.log("add new message ", e);
    if ("" != e.message && " " != e.message) {
        var t = document.createElement("div");
        t.style["float"] = "left", 
        t.className = "user-activity", 
        t.setAttribute("style","    background-color: rgba(251, 255, 6, 0.37); line-height: 1.28;     padding: 9px;    margin: 2px;    width: 20%;    min-height: 20px;    height: 41px;")
        t.setAttribute("style","background-color:rgba(6, 25, 255, 0.67)"),
        t.innerHTML = '<div class="chatusername">' + e.header + "</div>";
        var n = document.createElement("div");
        n.className = "userchatmsg", 
        n.setAttribute("style","color:white"),
        t.appendChild(n), 
        n.innerHTML = e.message, 
        document.getElementById("widget-filesharing2").appendChild(t)
    }
}

/***************************************************************88
File sharing 
******************************************************************/

function updateLabel(e, r) {
    if (-1 != e.position) {
        var n = +e.position.toFixed(2).split(".")[1] || 100;
        r.innerHTML = n + "%"
    }
}

var progressHelper = {};

rtcMultiConnection.onFileStart = function(e) {
    alert("on file start");
    console.log(e);
/*    addNewMessage({
        header: rtcMultiConnection.extra.username,
        //message: "File shared: " + e.name + " ( " + bytesToSize(e.size) + " )",
        message: " ",
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "images/share-files.png"),
        callback: function(r) {        }
    });*/
    addNewFileLocal({
        header: ' User local ',
        message: ' File shared ',
        userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "images/share-files.png"),
        callback: function(r) {        }
    });

    var n = document.createElement("div");
    n.title = e.name, 
    n.innerHTML = "<label>0%</label><progress></progress>", 
    document.getElementById("widget-filesharing1").appendChild(n),              
    progressHelper[e.uuid] = {
        div: n,
        progress: n.querySelector("progress"),
        label: n.querySelector("label")
    }, 
    progressHelper[e.uuid].progress.max = e.maxChunks
}, 

rtcMultiConnection.onFileProgress = function(e) {
    var r = progressHelper[e.uuid];
    r && (r.progress.value = e.currentPosition || e.maxChunks || r.progress.max, updateLabel(r.progress, r.label))
}, 

rtcMultiConnection.onFileEnd = function(e) {
    if (!progressHelper[e.uuid]) 
        return void console.error("No such progress-helper element exists.", e);
    var r = progressHelper[e.uuid].div;
    r.innerHTML= '<a href="' + e.url + '" download="' + e.name + '">Download ' + e.name + ' </a>';

    document.getElementById("widget-filesharing-container").innerHTML = document.getElementById("widget-filesharing-container").innerHTML + e.type.indexOf("image") ? 
        '<img src="' + e.url + '" title="' + e.name + '">'
        :'<iframe src="' + e.url + '" title="' + e.name + '" style="width: 69%;border: 0;border-left: 1px solid black;height: inherit;"></iframe>', 
            setTimeout(function() {
                r = r.parentNode.parentNode.parentNode, 
                r.querySelector(".user-info").style.height = r.querySelector(".user-activity").clientHeight + "px"
            }, 10);
};

document.getElementById('file').onchange = function() {
    var file = this.files[0];
    rtcMultiConnection.send(file);
};


/********************************************************************
	List of participants in session 
**********************************************************************/

var usersList = document.getElementById("userslist"),
numbersOfUsers = document.getElementById("numbersofusers");
numbersOfUsers.innerHTML = 1;

var usersContainer = getElement(".users-container");


/********************************************************************************8
        Linkify
********************************************************************************/
function getSmileys(e) {
    return e
}
window.linkify = function() {
    var e = "[a-z\\d.-]+://",
        t = "(?:(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])\\.){3}(?:[0-9]|[1-9]\\d|1\\d{2}|2[0-4]\\d|25[0-5])",
        a = "(?:(?:[^\\s!@#$%^&*()_=+[\\]{}\\\\|;:'\",.<>/?]+)\\.)+",
        n = "(?:ac|ad|aero|ae|af|ag|ai|al|am|an|ao|aq|arpa|ar|asia|as|at|au|aw|ax|az|ba|bb|bd|be|bf|bg|bh|biz|bi|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|cat|ca|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|coop|com|co|cr|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gg|gh|gi|gl|gm|gn|gov|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|im|info|int|in|io|iq|ir|is|it|je|jm|jobs|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|me|mg|mh|mil|mk|ml|mm|mn|mobi|mo|mp|mq|mr|ms|mt|museum|mu|mv|mw|mx|my|mz|name|na|nc|net|ne|nf|ng|ni|nl|no|np|nr|nu|nz|om|org|pa|pe|pf|pg|ph|pk|pl|pm|pn|pro|pr|ps|pt|pw|py|qa|re|ro|rs|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|su|sv|sy|sz|tc|td|tel|tf|tg|th|tj|tk|tl|tm|tn|to|tp|travel|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|wf|ws|xn--0zwm56d|xn--11b5bs3a9aj6g|xn--80akhbyknj4f|xn--9t4b11yi5a|xn--deba0ad|xn--g6w251d|xn--hgbk6aj7f53bba|xn--hlcj6aya9esc7a|xn--jxalpdlp|xn--kgbechtv|xn--zckzah|ye|yt|yu|za|zm|zw)",
        g = "(?:" + a + n + "|" + t + ")",
        s = "(?:[;/][^#?<>\\s]*)?",
        r = "(?:\\?[^#<>\\s]*)?(?:#[^<>\\s]*)?",
        c = "\\b" + e + "[^<>\\s]+",
        l = "\\b" + g + s + r + "(?!\\w)",
        i = "mailto:",
        m = "(?:" + i + ")?[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@" + g + r + "(?!\\w)",
        p = new RegExp("(?:" + c + "|" + l + "|" + m + ")", "ig"),
        u = new RegExp("^" + e, "i"),
        b = {
            "'": "`",
            ">": "<",
            ")": "(",
            "]": "[",
            "}": "{",
            "»": "«",
            "›": "‹"
        },
        o = {
            callback: function(e, t) {
                return t ? '<a href="' + t + '" title="' + t + '" target="_blank">' + e + "</a>" : e
            },
            punct_regexp: /(?:[!?.,:;'"]|(?:&|&amp;)(?:lt|gt|quot|apos|raquo|laquo|rsaquo|lsaquo);)$/
        };
    return function(e, t) {
        e = getSmileys(e), e = e.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/ /g, "&nbsp;").replace(/\n/g, "<br />"), t = t || {};
        var a, n, g, s, r, c, l, m, d, h, f, k, x = "",
            w = [];
        for (n in o) void 0 === t[n] && (t[n] = o[n]);
        for (; a = p.exec(e);)
            if (g = a[0], c = p.lastIndex, l = c - g.length, !/[\/:]/.test(e.charAt(l - 1))) {
                do m = g, k = g.substr(-1), f = b[k], f && (d = g.match(new RegExp("\\" + f + "(?!$)", "g")), h = g.match(new RegExp("\\" + k, "g")), (d ? d.length : 0) < (h ? h.length : 0) && (g = g.substr(0, g.length - 1), c--)), t.punct_regexp && (g = g.replace(t.punct_regexp, function(e) {
                    return c -= e.length, ""
                })); while (g.length && g !== m);
                s = g, u.test(s) || (s = (-1 !== s.indexOf("@") ? s.indexOf(i) ? i : "" : s.indexOf("irc.") ? s.indexOf("ftp.") ? "http://" : "ftp://" : "irc://") + s), r != l && (w.push([e.slice(r, l)]), r = c), w.push([g, s])
            }
        for (w.push([e.substr(r)]), n = 0; n < w.length; n++) x += t.callback.apply(window, w[n]);
        return x || e
    }
}();

/**************************************************************************8
draw 
******************************************************************************/
CanvasDesigner.addSyncListener(function(data) {
    rtcMultiConnection.send({type:"canvas", draw:data});
});

CanvasDesigner.setSelected('pencil');

CanvasDesigner.setTools({
    pencil: true,
    /*text: true,*/
    eraser: true
});

CanvasDesigner.appendTo(document.getElementById('widget-container'));


/*********************************8
	kick start 
***************************************/
$('document').ready(function(){
    
    $('#allow-mic').click(function(){
      $(this).toggleClass('slash');
    });

    $('#allow-mic-landscape').click(function(){
      $(this).toggleClass('slash');
    });

    $('#allow-webcam').click(function(){
      $(this).toggleClass('slash');
    });

    $('#allow-webcam-landscape').click(function(){
      $(this).toggleClass('slash');
    });

  startcall();

});

