

/*****************************************************************
    Location
*************************************************************************/
if(location.hash==""){
   // $('#currenturl').val(location.origin+"/#/"+currentTimeTicker+"?s=1");
   $('#currenturl').val(location.origin+"/#/"+currentTimeTicker+"?s=1");
 }else{
    $('#currenturl').val(location.origin+"/"+location.hash.split('&')[0]);
 }

 /*********************************************************************88
 API
 *********************************************************************/
! function() {

    function e(e, t) {
        function s(n) {
            return n.data.checkingPresence && e.channels[n.userid] ? void e.channels[n.userid].send({
                presenceDetected: !0
            }) : n.data.presenceDetected && e.peers[n.userid] ? void(e.peers[n.userid].connected = !0) : void("text" === n.data.type ? se.receive(n.data, n.userid, n.extra) : e.autoTranslateText ? (n.original = n.data, e.Translator.TranslateText(n.data, function(t) {
                n.data = t, e.onmessage(n)
            })) : e.onmessage(n))
        }

        function f(n) {
            return e.skipOnNewSession || (n.session || (n.session = {}), n.extra || (n.extra = {}), e.sessionid && n.sessionid != e.sessionid) ? void 0 : e.onNewSession ? (n.join = function(t) {
                if (!t) return e.join(n);
                for (var i in t) n.session[i] = t[i];
                var s = e.dontCaptureUserMedia;
                e.dontCaptureUserMedia = !1, e.captureUserMedia(function() {
                    e.dontCaptureUserMedia = !0, e.join(n), e.dontCaptureUserMedia = s
                }, t)
            }, n.extra || (n.extra = {}), e.onNewSession(n)) : void e.join(n)
        }

        function O(n) {
            for (var t = 0; t < e.localStreamids.length; t++) {
                var i = e.localStreamids[t];
                e.streams[i] && e.streams[i].sockets.push(n)
            }
        }

        function P(t) {
            function i(n) {
                return K || Q || a(e.waitUntilRemoteStreamStartsFlowing) || !e.waitUntilRemoteStreamStartsFlowing ? m(n) : (n.numberOfTimes || (n.numberOfTimes = 0), n.numberOfTimes++, n.mediaElement.readyState <= HTMLMediaElement.HAVE_CURRENT_DATA || n.mediaElement.paused || n.mediaElement.currentTime <= 0 ? n.numberOfTimes >= 60 ? P.send({
                    failedToReceiveRemoteVideo: !0,
                    streamid: n.stream.streamid
                }) : void setTimeout(function() {
                    p("Waiting for incoming remote stream to be started flowing: " + n.numberOfTimes + " seconds."), i(n)
                }, 900) : m(n))
            }

            function o() {
                if (e.fakeDataChannels && !e.channels[t.userid] && !e.session.data) {
                    var n = {
                        send: function(e) {
                            P.send({
                                fakeData: e
                            })
                        },
                        readyState: "open"
                    };
                    e.channels[t.userid] = {
                        channel: n,
                        send: function(e) {
                            this.channel.send(e)
                        }
                    }, j.onopen(n)
                }
            }

            function m(n) {
                var i = n.mediaElement,
                    s = n.session,
                    o = n.stream;
                o.onended = function() {
                    r.mediaElement && !r.mediaElement.parentNode && document.getElementById(o.streamid) && (r.mediaElement = document.getElementById(o.streamid)), y(r, e)
                };
                var r = {
                    mediaElement: i,
                    stream: o,
                    streamid: o.streamid,
                    session: s || e.session,
                    blobURL: Q ? "" : i.mozSrcObject ? URL.createObjectURL(o) : i.src,
                    type: "remote",
                    extra: t.extra,
                    userid: t.userid,
                    isVideo: Q ? !!s.video : !!o.isVideo,
                    isAudio: Q ? !!s.audio && !s.video : !!o.isAudio,
                    isScreen: !!o.isScreen,
                    isInitiator: !!t.isInitiator,
                    rtcMultiConnection: e,
                    socket: P
                };
                if (e.streams[o.streamid] = e._getStream(r), e.onstream(r), !c(n.preMuted) && (n.preMuted.audio || n.preMuted.video)) {
                    var a = k({}, r);
                    a.session = k(a.session, n.preMuted), a.isAudio = !!a.session.audio && !a.session.video, a.isVideo = !!a.session.video, a.isScreen = !1, e.onmute(a)
                }
                p("on:add:stream", r), 
                x(), 
                e.onspeaking && I({
                    stream: o,
                    streamedObject: r,
                    connection: e
                })
            }

            function f(n) {
                t.channel = n, e.channels[t.userid] = {
                    channel: t.channel,
                    send: function(n) {
                        e.send(n, this.channel)
                    }
                }, e.onopen({
                    extra: t.extra,
                    userid: t.userid,
                    channel: n
                });
                for (var i in e.fileQueue) e.send(e.fileQueue[i], n);
                r(e.session) && x(), e.partOfScreen && e.partOfScreen.sharing && e.peers[t.userid].sharePartOfScreen(e.partOfScreen)
            }

            function h() {
                P.userid != t.userid && (P.userid = t.userid, ee[t.socketIndex] = P, e.numberOfConnectedUsers++, e.peers[t.userid] = {
                    socket: P,
                    peer: F,
                    userid: t.userid,
                    extra: t.extra,
                    userinfo: t.userinfo,
                    addStream: function(n) {
                        e.addStream(n, this.socket)
                    },
                    removeStream: function(n) {
                        return e.streams[n] ? (this.peer.connection.removeStream(e.streams[n].stream), void this.renegotiate()) : v("No such stream exists. Stream-id:", n)
                    },
                    renegotiate: function(n, t) {
                        e.renegotiate(n, t)
                    },
                    changeBandwidth: function(e) {
                        if (!e) throw "You MUST pass bandwidth object.";
                        if (d(e)) throw "Pass object for bandwidth instead of string; e.g. {audio:10, video:20}";
                        this.peer.bandwidth = e, this.socket.send({
                            changeBandwidth: !0,
                            bandwidth: e
                        })
                    },
                    sendCustomMessage: function(e) {
                        this.socket.send({
                            customMessage: !0,
                            message: e
                        })
                    },
                    onCustomMessage: function(e) {
                        p('Received "private" message from', this.userid, d(e) ? e : g(e))
                    },
                    drop: function(n) {
                        for (var t in e.streams) - 1 == e._skip.indexOf(t) && (t = e.streams[t], t.userid == e.userid && "local" == t.type && (this.peer.connection.removeStream(t.stream), y(t, e)), "remote" == t.type && t.userid == this.userid && y(t, e));
                        !n && this.socket.send({
                            drop: !0
                        })
                    },
                    hold: function(n) {
                        return "answer" == F.prevCreateType ? void this.socket.send({
                            unhold: !0,
                            holdMLine: n || "both",
                            takeAction: !0
                        }) : (this.socket.send({
                            hold: !0,
                            holdMLine: n || "both"
                        }), this.peer.hold = !0, void this.fireHoldUnHoldEvents({
                            kind: n,
                            isHold: !0,
                            userid: e.userid,
                            remoteUser: this.userid
                        }))
                    },
                    unhold: function(n) {
                        return "answer" == F.prevCreateType ? void this.socket.send({
                            unhold: !0,
                            holdMLine: n || "both",
                            takeAction: !0
                        }) : (this.socket.send({
                            unhold: !0,
                            holdMLine: n || "both"
                        }), this.peer.hold = !1, void this.fireHoldUnHoldEvents({
                            kind: n,
                            isHold: !1,
                            userid: e.userid,
                            remoteUser: this.userid
                        }))
                    },
                    fireHoldUnHoldEvents: function(n) {
                        var t = n.isHold,
                            i = n.kind,
                            s = n.remoteUser || n.userid;
                        for (var o in e.streams) - 1 == e._skip.indexOf(o) && (o = e.streams[o], o.userid == s && (t && e.onhold(k({
                            kind: i
                        }, o)), t || e.onunhold(k({
                            kind: i
                        }, o))))
                    },
                    redial: function() {
                        for (var t in e.streams) - 1 == e._skip.indexOf(t) && (t = e.streams[t], t.userid == this.userid && "remote" == t.type && y(t, e));
                        p("ReDialing..."), P.send({
                            recreatePeer: !0
                        }), F = new n, F.create("offer", j)
                    },
                    sharePartOfScreen: function(n) {
                        function t() {
                            return i.stopPartOfScreenSharing ? (i.stopPartOfScreenSharing = !1, void(e.onpartofscreenstopped && e.onpartofscreenstopped())) : i.pausePartOfScreenSharing ? (e.onpartofscreenpaused && e.onpartofscreenpaused(), setTimeout(t, n.interval || 200)) : void R({
                                element: n.element,
                                connection: e,
                                callback: function(o) {
                                    if (!e.channels[i.userid]) throw "No such data channel exists.";
                                    o != s && (s = o, e.channels[i.userid].send({
                                        screenshot: o,
                                        isPartOfScreen: !0
                                    })), !n.once && setTimeout(t, n.interval || 200)
                                }
                            })
                        }
                        var i = this,
                            s = "";
                        t()
                    },
                    getConnectionStats: function(n, t) {
                        function i() {
                            N.prototype.getConnectionStats = window.getConnectionStats, F.connection && F.connection.getConnectionStats(n, t)
                        }
                        if (!n) throw "callback is mandatory.";
                        window.getConnectionStats ? i() : M(e.resources.getConnectionStats, i)
                    },
                    takeSnapshot: function(n) {
                        C({
                            userid: this.userid,
                            connection: e,
                            callback: n
                        })
                    }
                })
            }

            function x() {
                if (e.isInitiator && S(ie) && S(ie) <= e.maxParticipantsAllowed && (e.session.oneway || e.session.broadcast || oe.send({
                        sessionid: e.sessionid,
                        newParticipant: t.userid || P.channel,
                        userData: {
                            userid: t.userid || P.channel,
                            extra: t.extra
                        }
                    })), "chrome" == t.userinfo.browser && !t.renegotiatedOnce)
                    for (var n in e.renegotiatedSessions) t.renegotiatedOnce = !0, e.renegotiatedSessions[n] && e.renegotiatedSessions[n].stream && e.peers[t.userid].renegotiate(e.renegotiatedSessions[n].stream, e.renegotiatedSessions[n].session)
            }

            function E(i) {
                if (!re && i.userid != e.userid) {
                    if (i.sdp) {
                        t.userid = i.userid, t.extra = i.extra || {}, t.renegotiate = i.renegotiate, t.streaminfo = i.streaminfo, t.isInitiator = i.isInitiator, t.userinfo = i.userinfo;
                        var s = JSON.parse(i.sdp);
                        "offer" == s.type && (j.preferSCTP = !!i.preferSCTP, e.fakeDataChannels = !!i.fakeDataChannels), o(), D(s, i.labels)
                    }
                    if (i.candidate && F && F.addIceCandidate(JSON.parse(i.candidate)), i.streamid && (te.streamids || (te.streamids = {}), te.streamids[i.streamid] || (te.streamids[i.streamid] = i.streamid, e.onstreamid(i))), i.mute || i.unmute)
                        if (i.promptMuteUnmute) {
                            if (!e.privileges.canMuteRemoteStream) return void e.onstatechange({
                                userid: i.userid,
                                extra: i.extra,
                                name: "mute-request-denied",
                                reason: i.userid + ' tried to mute your stream; however "privileges.canMuteRemoteStream" is "false".'
                            });
                            e.streams[i.streamid] && (i.mute && !e.streams[i.streamid].muted && e.streams[i.streamid].mute(i.session), i.unmute && e.streams[i.streamid].muted && e.streams[i.streamid].unmute(i.session))
                        } else {
                            var r = {};
                            e.streams[i.streamid] && (r = e.streams[i.streamid]);
                            var a = i.session,
                                d = k({}, r);
                            d.session = a, d.isAudio = !!d.session.audio && !d.session.video, d.isVideo = !!d.session.video, d.isScreen = !!d.session.screen, i.mute && e.onmute(d || i), i.unmute && e.onunmute(d || i)
                        }
                    if (i.isVolumeChanged && (p("Volume of stream: " + i.streamid + " has changed to: " + i.volume), e.streams[i.streamid])) {
                        var c = e.streams[i.streamid].mediaElement;
                        c && (c.volume = i.volume)
                    }
                    if (i.stopped && e.streams[i.streamid] && y(e.streams[i.streamid], e), i.promptStreamStop) {
                        if (!e.privileges.canStopRemoteStream) return void e.onstatechange({
                            userid: i.userid,
                            extra: i.extra,
                            name: "stop-request-denied",
                            reason: i.userid + ' tried to stop your stream; however "privileges.canStopRemoteStream" is "false".'
                        });
                        v("Remote stream has been manually stopped!"), e.streams[i.streamid] && e.streams[i.streamid].stop()
                    }
                    if (i.left) {
                        if (z) {
                            var u = i.userid;
                            for (var m in e.streams) m = e.streams[m], m.userid == u && (e.stopMediaStream(m), y(m, e))
                        }
                        if (F && F.connection && ("closed" != F.connection.signalingState && -1 == F.connection.iceConnectionState.search(/disconnected|failed/gi) && F.connection.close(), F.connection = null), ie[i.userid] && delete ie[i.userid], i.closeEntireSession) return e.onSessionClosed(i), void e.leave();
                        e.remove(i.userid), b({
                            userid: i.userid,
                            extra: i.extra || {},
                            entireSessionClosed: !!i.closeEntireSession
                        }, e)
                    }
                    if (i.playRoleOfBroadcaster && (i.extra && (e.extra = k(e.extra, i.extra)), i.participants && (ie = i.participants, ie[e.userid] && delete ie[e.userid], ee[0] && ee[0].userid == i.userid && (delete ee[0], ee = l(ee)), $[i.userid] && delete $[i.userid]), setTimeout(e.playRoleOfInitiator, 2e3)), i.changeBandwidth) {
                        if (!e.peers[i.userid]) throw "No such peer exists.";
                        e.peers[i.userid].peer.bandwidth = i.bandwidth, e.peers[i.userid].renegotiate()
                    }
                    if (i.customMessage) {
                        if (!e.peers[i.userid]) throw "No such peer exists.";
                        if (i.message.ejected) {
                            if (e.sessionDescriptions[e.sessionid].userid != i.userid) throw "only initiator can eject a user.";
                            e.leave(), e.onSessionClosed({
                                userid: i.userid,
                                extra: i.extra || t.extra,
                                isEjected: !0
                            })
                        } else e.peers[i.userid].onCustomMessage(i.message)
                    }
                    if (i.drop) {
                        if (!e.peers[i.userid]) throw "No such peer exists.";
                        e.peers[i.userid].drop(!0), e.peers[i.userid].renegotiate(), e.ondrop(i.userid)
                    }
                    if (i.hold || i.unhold) {
                        if (!e.peers[i.userid]) throw "No such peer exists.";
                        if (i.takeAction) return void e.peers[i.userid][i.hold ? "hold" : "unhold"](i.holdMLine);
                        e.peers[i.userid].peer.hold = !!i.hold, e.peers[i.userid].peer.holdMLine = i.holdMLine, P.send({
                            isRenegotiate: !0
                        }), e.peers[i.userid].fireHoldUnHoldEvents({
                            kind: i.holdMLine,
                            isHold: !!i.hold,
                            userid: i.userid
                        })
                    }
                    i.isRenegotiate && e.peers[i.userid].renegotiate(null, e.peers[i.userid].peer.session), i.fakeData && j.onmessage(i.fakeData), i.recreatePeer && (F = new n), i.failedToReceiveRemoteVideo && (p("Remote peer hasn't received stream: " + i.streamid + ". Renegotiating..."), e.peers[i.userid] && e.peers[i.userid].renegotiate()), i.redial && e.peers[i.userid] && ("disconnected" != e.peers[i.userid].peer.connection.iceConnectionState && (t.redialing = !1), "disconnected" != e.peers[i.userid].peer.connection.iceConnectionState || t.redialing || (t.redialing = !0, v("Peer connection is closed.", g(e.peers[i.userid].peer.connection), "ReDialing.."), e.peers[i.userid].redial()))
                }
            }

            function D(i, s) {
                function o() {
                    return z || "firefox" == t.userinfo.browser ? void(e.peers[t.userid] && e.peers[t.userid].redial()) : void F.recreateAnswer(i, a, function(n, t) {
                        L({
                            sdp: n,
                            socket: P,
                            streaminfo: t
                        }), e.detachStreams = []
                    })
                }
                if ("answer" == i.type) return F.setRemoteDescription(i), void h();
                if (!t.renegotiate && "offer" == i.type) return j.offerDescription = i, j.session = e.session, F || (F = new n), F.create("answer", j), void h();
                var a = t.renegotiate;
                if (U(s, F.connection), a.oneway || r(a)) o(), delete t.renegotiate;
                else {
                    if (t.capturing) return;
                    t.capturing = !0, e.captureUserMedia(function(n) {
                        t.capturing = !1, (G || z && !F.connection.getLocalStreams().length) && F.addStream(n), e.renegotiatedSessions[JSON.stringify(t.renegotiate)] = {
                            session: t.renegotiate,
                            stream: n
                        }, delete t.renegotiate, o()
                    }, t.renegotiate)
                }
            }
            var A = {
                channel: t.channel,
                onmessage: E,
                onopen: function(i) {
                    i && (P = i), _ && !F && (j.session = e.session, F || (F = new n), F.create("offer", j)), t.socketIndex = P.index = ee.length, $[A.channel] = P, ee[t.socketIndex] = P, O(P), P.__push || (P.__push = P.send, P.send = function(n) {
                        n.userid = n.userid || e.userid, n.extra = n.extra || e.extra || {}, P.__push(n)
                    })
                }
            };
            A.callback = function(e) {
                P = e, A.onopen()
            };
            var P = e.openSignalingChannel(A);
            P && A.onopen(P);
            var F, _ = t.isofferer,
                j = {
                    onopen: f,
                    onicecandidate: function(n) {
                        if (!e.candidates) throw "ICE candidates are mandatory.";
                        if (!e.iceProtocols) throw "At least one must be true; UDP or TCP.";
                        var t = e.candidates,
                            i = t.stun,
                            s = t.turn;
                        if (a(t.reflexive) || (i = t.reflexive), a(t.relay) || (s = t.relay), (t.host || !n.candidate.match(/a=candidate.*typ host/g)) && !(!s && n.candidate.match(/a=candidate.*typ relay/g) || !i && n.candidate.match(/a=candidate.*typ srflx/g))) {
                            var o = e.iceProtocols;
                            (o.udp || !n.candidate.match(/a=candidate.* udp/g)) && (o.tcp || !n.candidate.match(/a=candidate.* tcp/g)) && (window.selfNPObject || (window.selfNPObject = n), P && P.send({
                                candidate: JSON.stringify({
                                    candidate: n.candidate,
                                    sdpMid: n.sdpMid,
                                    sdpMLineIndex: n.sdpMLineIndex
                                })
                            }))
                        }
                    },
                    onmessage: function(n) {
                        if (n) {
                            var i = u(n);
                            if (-1 != i.indexOf('"userid":')) i = JSON.parse(i), s(i);
                            else if (n instanceof ArrayBuffer || n instanceof DataView) {
                                if (!e.enableFileSharing) throw 'It seems that receiving data is either "Blob" or "File" but file sharing is disabled.';
                                if (!te.fileBufferReader) {
                                    var o = this;
                                    return void T(e, function(e) {
                                        te.fileBufferReader = e, o.onmessage(n)
                                    })
                                }
                                var r = te.fileBufferReader;
                                return void r.convertToObject(n, function(n) {
                                    return n.maxChunks || n.readyForNextChunk ? n.readyForNextChunk ? void r.getNextChunk(n.uuid, function(e, n, t) {
                                        te.send(e)
                                    }) : void r.addChunk(n, function(e) {
                                        te.send(e)
                                    }) : void e.onmessage({
                                        data: n,
                                        userid: t.userid,
                                        extra: t.extra
                                    })
                                })
                            }
                        }
                    },
                    onaddstream: function(n, s) {
                        function o() {
                            setTimeout(function() {
                                u.muted = !1, m({
                                    mediaElement: u,
                                    session: s,
                                    stream: n,
                                    preMuted: a
                                })
                            }, 3e3), u.removeEventListener("play", o)
                        }
                        if (s = s || t.renegotiate || e.session, !r(s)) {
                            s.screen && (s.audio || s.video) && (t.gotAudioOrVideo ? (s.audio = !1, s.video = !1) : (t.gotAudioOrVideo = !0, s.screen = !1));
                            var a = {};
                            if (t.streaminfo) {
                                var d = t.streaminfo.split("----"),
                                    c = JSON.parse(d[d.length - 1]);
                                Y || (n.streamid = c.streamid, n.isScreen = !!c.isScreen, n.isVideo = !!c.isVideo, n.isAudio = !!c.isAudio, a = c.preMuted), d.pop(), t.streaminfo = d.join("----")
                            }
                            var u = w(n, k({
                                remote: !0
                            }, s));
                            return e.setDefaultEventsForMediaElement && e.setDefaultEventsForMediaElement(u, n.streamid), Q || n.getVideoTracks().length ? void i({
                                mediaElement: u,
                                session: s,
                                stream: n,
                                preMuted: a
                            }) : u.addEventListener("play", o, !1)
                        }
                    },
                    onremovestream: function(n) {
                        n && n.streamid ? (n = e.streams[n.streamid], n && (p("on:stream:ended via on:remove:stream", n), y(n, e))) : p("on:remove:stream", n)
                    },
                    onclose: function(n) {
                        n.extra = t.extra, n.userid = t.userid, e.onclose(n), e.channels[n.userid] && delete e.channels[n.userid]
                    },
                    onerror: function(n) {
                        n.extra = t.extra, n.userid = t.userid, e.onerror(n)
                    },
                    oniceconnectionstatechange: function(n) {
                        p("oniceconnectionstatechange", g(n)), F.connection && "connected" == F.connection.iceConnectionState && "complete" == F.connection.iceGatheringState && "stable" == F.connection.signalingState && 1 == e.numberOfConnectedUsers && e.onconnected({
                            userid: t.userid,
                            extra: t.extra,
                            peer: e.peers[t.userid],
                            targetuser: t.userinfo
                        }), !e.isInitiator && F.connection && "connected" == F.connection.iceConnectionState && "complete" == F.connection.iceGatheringState && "stable" == F.connection.signalingState && 1 == e.numberOfConnectedUsers && e.onstatechange({
                            userid: t.userid,
                            extra: t.extra,
                            name: "connected-with-initiator",
                            reason: "ICE connection state seems connected; gathering state is completed; and signaling state is stable."
                        }), e.peers[t.userid] && e.peers[t.userid].oniceconnectionstatechange && e.peers[t.userid].oniceconnectionstatechange(n), e.peers[t.userid] && "failed" == e.peers[t.userid].peer.connection.iceConnectionState && e.onfailed({
                            userid: t.userid,
                            extra: t.extra,
                            peer: e.peers[t.userid],
                            targetuser: t.userinfo
                        }), e.peers[t.userid] && "disconnected" == e.peers[t.userid].peer.connection.iceConnectionState && (!F.connection.renegotiate && e.ondisconnected({
                            userid: t.userid,
                            extra: t.extra,
                            peer: e.peers[t.userid],
                            targetuser: t.userinfo
                        }), F.connection.renegotiate = !1), e.autoReDialOnFailure && e.peers[t.userid] && ("disconnected" != e.peers[t.userid].peer.connection.iceConnectionState && (t.redialing = !1), "disconnected" != e.peers[t.userid].peer.connection.iceConnectionState || t.redialing || (t.redialing = !0, v("Peer connection is closed.", g(e.peers[t.userid].peer.connection), "ReDialing.."), e.peers[t.userid].socket.send({
                            redial: !0
                        }), e.streams.remove({
                            remote: !0,
                            userid: t.userid
                        })))
                    },
                    onsignalingstatechange: function(e) {
                        p("onsignalingstatechange", g(e))
                    },
                    attachStreams: e.dontAttachStream ? [] : e.attachStreams,
                    iceServers: e.iceServers,
                    rtcConfiguration: e.rtcConfiguration,
                    bandwidth: e.bandwidth,
                    sdpConstraints: e.sdpConstraints,
                    optionalArgument: e.optionalArgument,
                    disableDtlsSrtp: e.disableDtlsSrtp,
                    dataChannelDict: e.dataChannelDict,
                    preferSCTP: e.preferSCTP,
                    onSessionDescription: function(e, n) {
                        L({
                            sdp: e,
                            socket: P,
                            streaminfo: n
                        })
                    },
                    trickleIce: e.trickleIce,
                    processSdp: e.processSdp,
                    sendStreamId: function(e) {
                        P && P.send({
                            streamid: e.streamid,
                            isScreen: !!e.isScreen,
                            isAudio: !!e.isAudio,
                            isVideo: !!e.isVideo
                        })
                    },
                    rtcMultiConnection: e
                };
            
            e.playRoleOfInitiator = function() {
                e.dontCaptureUserMedia = !0, e.open(), ee = l(ee), e.dontCaptureUserMedia = !1
            }, 

            e.askToShareParticipants = function() {
                oe && oe.send({
                    askToShareParticipants: !0
                })
            }, 

            e.shareParticipants = function(n) {
                var t = {
                    joinUsers: ie,
                    userid: e.userid,
                    extra: e.extra
                };
                n && (n.dontShareWith && (t.dontShareWith = n.dontShareWith), n.shareWith && (t.shareWith = n.shareWith)), oe.send(t)
            }
        }

        function U(n, t) {
            if (n)
                for (var i = 0; i < n.length; i++) {
                    var s = n[i];
                    e.streams[s] && t.removeStream(e.streams[s].stream)
                }
        }

        function L(n) {
            n.socket.send({
                sdp: JSON.stringify({
                    sdp: n.sdp.sdp,
                    type: n.sdp.type
                }),
                renegotiate: n.renegotiate ? n.renegotiate : !1,
                streaminfo: n.streaminfo || "",
                labels: n.labels || [],
                preferSCTP: !!e.preferSCTP,
                fakeDataChannels: !!e.fakeDataChannels,
                isInitiator: !!e.isInitiator,
                userinfo: {
                    browser: z ? "firefox" : "chrome"
                }
            })
        }

        function F(n) {
            var t = n.newParticipant;
            if (t && !ie[t] && t != e.userid) {
                var i = e.token();
                P({
                    channel: i,
                    extra: n.userData ? n.userData.extra : n.extra,
                    userid: n.userData ? n.userData.userid : n.userid
                }), oe.send({
                    participant: !0,
                    targetUser: t,
                    channel: i
                })
            }
        }

        function _() {
            e.numberOfConnectedUsers--;
            var n = {
                left: !0,
                extra: e.extra || {},
                userid: e.userid,
                sessionid: e.sessionid
            };
            e.isInitiator && (e.autoCloseEntireSession ? n.closeEntireSession = !0 : ee[0] && ee[0].send({
                playRoleOfBroadcaster: !0,
                userid: e.userid,
                extra: e.extra,
                participants: ie
            })), ee.forEach(function(e, t) {
                e.send(n), $[e.channel] && delete $[e.channel], delete ee[t]
            }), ee = l(ee), e.refresh(), W.forEach(function(e) {
                e.disconnect()
            }), W = []
        }

        function j() {
            te.signalingReady || (te.signalingReady = !0, setTimeout(t, 5e3), e.isInitiator || oe && oe.send({
                searchingForRooms: !0
            }))
        }

        function B(n) {
            for (var t in n) ie[n[t]] || F({
                sessionid: e.sessionid,
                newParticipant: n[t],
                userid: e.userid,
                extra: e.extra
            })
        }

        function H() {
            return e.openSignalingChannel({
                onmessage: function(n) {
                    if (!re && n.userid != e.userid) {
                        if (n.sessionid && n.userid && (e.sessionDescriptions[n.sessionid] || (e.numberOfSessions++, e.sessionDescriptions[n.sessionid] = n, e.isAcceptNewSession && (e.dontOverrideSession || (e.session = n.session), f(n)))), n.newParticipant && !e.isAcceptNewSession && te.broadcasterid === n.userid && n.newParticipant != e.userid && F(n), S(ie) < e.maxParticipantsAllowed && n.targetUser == e.userid && n.participant) {
                            if (e.peers[n.userid] && !e.peers[n.userid].peer) return delete ie[n.userid], delete e.peers[n.userid], e.isAcceptNewSession = !0, X(n);
                            ie[n.userid] || X(n)
                        }
                        if (n.acceptedRequestOf == e.userid && e.onstatechange({
                                userid: n.userid,
                                extra: n.extra,
                                name: "request-accepted",
                                reason: n.userid + " accepted your participation request."
                            }), n.rejectedRequestOf == e.userid && e.onstatechange({
                                userid: n.userid,
                                extra: n.extra,
                                name: "request-rejected",
                                reason: n.userid + " rejected your participation request."
                            }), n.customMessage)
                            if (n.message.drop) {
                                e.ondrop(n.userid), e.attachStreams = [];
                                for (var t in e.streams) - 1 == e._skip.indexOf(t) && (t = e.streams[t], "local" == t.type ? (e.detachStreams.push(t.streamid), y(t, e)) : y(t, e));
                                n.message.renegotiate && e.renegotiate()
                            } else e.onCustomMessage && e.onCustomMessage(n.message);
                        if (e.isInitiator && n.searchingForRooms && oe && oe.send({
                                sessionDescription: e.sessionDescription,
                                responseFor: n.userid
                            }), n.sessionDescription && n.responseFor == e.userid) {
                            var i = n.sessionDescription;
                            e.sessionDescriptions[i.sessionid] || (e.numberOfSessions++, e.sessionDescriptions[i.sessionid] = i)
                        }
                        e.isInitiator && n.askToShareParticipants && oe && e.shareParticipants({
                            shareWith: n.userid
                        }), n.shareWith == e.userid && n.dontShareWith != e.userid && n.joinUsers && B(n.joinUsers), !n.shareWith && n.joinUsers && (n.dontShareWith ? e.userid != n.dontShareWith && B(n.joinUsers) : B(n.joinUsers)), n.messageFor == e.userid && n.presenceState && ("checking" == n.presenceState && (oe.send({
                            messageFor: n.userid,
                            presenceState: "available",
                            _config: n._config
                        }), p("participant asked for availability")), "available" == n.presenceState && (te.presenceState = "available", e.onstatechange({
                            userid: "browser",
                            extra: {},
                            name: "room-available",
                            reason: "Initiator is available and room is active."
                        }), J(n._config))), n.donotJoin && n.messageFor == e.userid && p(n.userid, "is not joining your room."), n.isDisconnectSockets && (p("Disconnecting your sockets because initiator also disconnected his sockets."), e.disconnect())
                    }
                },
                callback: function(e) {
                    e && this.onopen(e)
                },
                onopen: function(n) {
                    n && (oe = n), ne.log(n), j && j(), te.defaultSocket = oe, oe.__push || (oe.__push = oe.send, oe.send = function(n) {
                        n.userid = n.userid || e.userid, n.extra = n.extra || e.extra || {}, oe.__push(n)
                    })
                }
            })
        }

        function q() {
            var n = 3;
            3 != e.maxParticipantsAllowed && (n = e.maxParticipantsAllowed), "one-way" == e.direction && (e.session.oneway = !0), "one-to-one" == e.direction && (e.maxParticipantsAllowed = 1), "one-to-many" == e.direction && (e.session.broadcast = !0), "many-to-many" == e.direction && (e.maxParticipantsAllowed && 1 != e.maxParticipantsAllowed || (e.maxParticipantsAllowed = 3)), n && 1 != e.maxParticipantsAllowed && (e.maxParticipantsAllowed = n)
        }

        function J(n, t) {
            if (!te.donotJoin || te.donotJoin != n.sessionid) {
                e.dontOverrideSession || (e.session = n.session || {}), te.broadcasterid = n.userid, n.sessionid && (e.sessionid = n.sessionid), e.isAcceptNewSession = !1;
                var i = o();
                P({
                    channel: i,
                    extra: n.extra || {},
                    userid: n.userid
                });
                var s = {};
                if (e.attachStreams.length) {
                    var r = e.attachStreams[e.attachStreams.length - 1];
                    r.getAudioTracks && r.getAudioTracks().length && (s.audio = !0), r.getVideoTracks().length && (s.video = !0)
                }
                p(c(s) ? "Seems data-only connection." : g(s)), e.onstatechange({
                    userid: n.userid,
                    extra: {},
                    name: "connecting-with-initiator",
                    reason: "Checking presence of the initiator; and the room."
                }), oe.send({
                    participant: !0,
                    channel: i,
                    targetUser: n.userid,
                    session: e.session,
                    offers: {
                        audio: !!s.audio,
                        video: !!s.video
                    }
                }), e.skipOnNewSession = !1, x(e)
            }
        }

        function X(n) {
            if (te.requestsFrom || (te.requestsFrom = {}), !te.requestsFrom[n.userid]) {
                var t = {
                    userid: n.userid,
                    extra: n.extra,
                    channel: n.channel || n.userid,
                    session: n.session || e.session
                };
                if (n.offers) {
                    p(n.offers.audio && n.offers.video ? "target user has both audio/video streams." : n.offers.audio && !n.offers.video ? "target user has only audio stream." : !n.offers.audio && n.offers.video ? "target user has only video stream." : "target user has no stream; it seems one-way streaming or data-only connection.");
                    var i = e.sdpConstraints.mandatory;
                    a(i.OfferToReceiveAudio) && (e.sdpConstraints.mandatory.OfferToReceiveAudio = !!n.offers.audio), a(i.OfferToReceiveVideo) && (e.sdpConstraints.mandatory.OfferToReceiveVideo = !!n.offers.video), p("target user's SDP has?", g(e.sdpConstraints.mandatory))
                }
                te.requestsFrom[n.userid] = t, e.onRequest && e.isInitiator ? e.onRequest(t) : Z(t)
            }
        }

        function Z(n) {
            return te.captureUserMediaOnDemand ? (te.captureUserMediaOnDemand = !1, void e.captureUserMedia(function() {
                Z(n), x(e)
            })) : (p("accepting request from", n.userid), ie[n.userid] = n.userid, void P({
                isofferer: !0,
                userid: n.userid,
                channel: n.channel,
                extra: n.extra || {},
                session: n.session || e.session
            }))
        }
        var $ = {},
            ee = [],
            te = this,
            ie = {};
        !te.fileBufferReader && e.session.data && e.enableFileSharing && T(e, function(e) {
            te.fileBufferReader = e
        });
        
        var se = new i(e);
        e.remove = function(n) {
            te.requestsFrom && te.requestsFrom[n] && delete te.requestsFrom[n], e.peers[n] && (e.peers[n].peer && e.peers[n].peer.connection && ("closed" != e.peers[n].peer.connection.signalingState && e.peers[n].peer.connection.close(), e.peers[n].peer.connection = null), delete e.peers[n]), ie[n] && delete ie[n];
            for (var t in e.streams) t = e.streams[t], t.userid == n && (y(t, e), delete e.streams[t]);
            $[n] && delete $[n]
        }, 

        e.refresh = function() {
            e.isInitiator && e.socket && e.socket.remove && e.socket.remove(), ie = {};
            for (var n = 0; n < e.attachStreams.length; n++) e.stopMediaStream(e.attachStreams[n]);
            V = {
                streams: [],
                mutex: !1,
                queueRequests: []
            }, te.isOwnerLeaving = !0, e.isInitiator = !1, e.isAcceptNewSession = !0, e.attachMediaStreams = [], e.sessionDescription = null, e.sessionDescriptions = {}, e.localStreamids = [], e.preRecordedMedias = {}, e.snapshots = {}, e.numberOfConnectedUsers = 0, e.numberOfSessions = 0, e.attachStreams = [], e.detachStreams = [], e.fileQueue = {}, e.channels = {}, e.renegotiatedSessions = {};
            for (var t in e.peers) t != e.userid && delete e.peers[t];
            for (var i in e.streams) - 1 == e._skip.indexOf(i) && (y(e.streams[i], e), delete e.streams[i]);
            $ = {}, ee = [], ie = {}
        }, 

        e.reject = function(n) {
            d(n) || (n = n.userid), oe.send({
                rejectedRequestOf: n
            }), e.remove(n)
        }, 

        te.leaveHandler = function(n) {
            return e.leaveOnPageUnload ? a(n.keyCode) ? _() : void(116 == n.keyCode && _()) : void 0
        }, 

        A("beforeunload", te.leaveHandler), A("keyup", te.leaveHandler), te.onLineOffLineHandler = function() {
            navigator.onLine ? te.isOffLine && (te.isOffLine = !navigator.onLine) : te.isOffLine = !0
        }, 

        A("load", te.onLineOffLineHandler), A("online", te.onLineOffLineHandler), A("offline", te.onLineOffLineHandler);
        var oe = H();
        te.defaultSocket = oe, oe && j && setTimeout(j, 2e3), e.session.screen && E(), e.getExternalIceServers && D(function(n) {
            e.iceServers = e.iceServers.concat(n)
        }), 0 == e.log && e.skipLogs(), e.onlog && (p = v = h = function() {
            var n = {},
                t = 0;
            Array.prototype.slice.call(arguments).forEach(function(e) {
                n[t++] = g(e)
            }), g = function(e) {
                return e
            }, e.onlog(n)
        }), this.initSession = function(n) {
            function t() {
                oe && S(ie) < e.maxParticipantsAllowed && !te.isOwnerLeaving && oe.send(e.sessionDescription), e.transmitRoomOnce || te.isOwnerLeaving || setTimeout(t, e.interval || 3e3)
            }
            te.isOwnerLeaving = !1, q(), ie = {}, te.isOwnerLeaving = !1, a(n.transmitRoomOnce) || (e.transmitRoomOnce = n.transmitRoomOnce), n.dontTransmit || t()
        }, this.joinSession = function(n) {
            function t() {
                oe.send({
                    messageFor: n.userid,
                    presenceState: te.presenceState,
                    _config: {
                        userid: n.userid,
                        extra: n.extra || {},
                        sessionid: n.sessionid,
                        session: n.session || !1
                    }
                })
            }

            function i() {
                "checking" == te.presenceState && (v("Unable to reach initiator. Trying again..."), t(), setTimeout(function() {
                    "checking" == te.presenceState && (e.onstatechange({
                        userid: n.userid,
                        extra: n.extra || {},
                        name: "room-not-available",
                        reason: "Initiator seems absent. Waiting for someone to open the room."
                    }), e.isAcceptNewSession = !0, setTimeout(i, 2e3))
                }, 2e3))
            }
            return oe ? (n = n || {}, ie = {}, te.presenceState = "checking", e.onstatechange({
                userid: n.userid,
                extra: n.extra || {},
                name: "detecting-room-presence",
                reason: "Checking presence of the room."
            }), t(), void setTimeout(i, 3e3)) : setTimeout(function() {
                v("Default-Socket is not yet initialized."), te.joinSession(n)
            }, 1e3)
        }, e.donotJoin = function(n) {
            te.donotJoin = n;
            var t = e.sessionDescriptions[n];
            t && (oe.send({
                donotJoin: !0,
                messageFor: t.userid,
                sessionid: n
            }), ie = {}, e.isAcceptNewSession = !0, e.sessionid = null)
        }, this.send = function(n, t) {
            if (n instanceof ArrayBuffer || n instanceof DataView || (n = m({
                    extra: e.extra,
                    userid: e.userid,
                    data: n
                })), t) return void("open" == t.readyState && t.send(n));
            for (var i in e.channels) {
                var s = e.channels[i].channel;
                "open" == s.readyState && s.send(n)
            }
        }, this.leave = function() {
            _()
        }, this.addStream = function(n) {
            function t(t) {
                var s = t.socket;
                if (!s) return void v(t, "doesn't has socket.");
                if (O(s), !t || !t.peer) throw "No peer to renegotiate.";
                var o = t.peer;
                return n.stream && (o.attachStreams = [n.stream]), U(e.detachStreams, o.connection), n.stream && (i.audio || i.video || i.screen) && (G || z && !o.connection.getLocalStreams().length) && o.addStream(n.stream), z || "firefox" == t.userinfo.browser ? t.redial() : void o.recreateOffer(i, function(n, t) {
                    L({
                        sdp: n,
                        socket: s,
                        renegotiate: i,
                        labels: e.detachStreams,
                        streaminfo: t
                    }), e.detachStreams = []
                })
            }
            var i = n.renegotiate;
            if (e.renegotiatedSessions[JSON.stringify(n.renegotiate)] || (e.renegotiatedSessions[JSON.stringify(n.renegotiate)] = {
                    session: n.renegotiate,
                    stream: n.stream
                }), n.socket) n.socket.userid != e.userid && t(e.peers[n.socket.userid]);
            else
                for (var s in e.peers) s != e.userid && t(e.peers[s])
        }, e.request = function(n, t) {
            e.captureUserMedia(function() {
                P({
                    channel: e.userid,
                    extra: t || {},
                    userid: n
                }), oe.send({
                    participant: !0,
                    targetUser: n
                })
            })
        }, e.accept = function(n) {
            arguments.length > 1 && d(arguments[0]) && (n = {}, arguments[0] && (n.userid = arguments[0]), arguments[1] && (n.extra = arguments[1]), arguments[2] && (n.channel = arguments[2])), e.captureUserMedia(function() {
                Z(n)
            })
        };
        var re = !1;
        this.disconnect = function() {
            if (this.isOwnerLeaving = !0, !e.keepStreamsOpened) {
                for (var n in e.localStreams) e.localStreams[n].stop();
                e.localStreams = {}, V = {
                    streams: [],
                    mutex: !1,
                    queueRequests: []
                }
            }
            e.isInitiator && oe.send({
                isDisconnectSockets: !0
            }), e.refresh(), te.defaultSocket = oe = null, re = !0, e.ondisconnected({
                userid: e.userid,
                extra: e.extra,
                peer: e.peers[e.userid],
                isSocketsDisconnected: !0
            }), e.close(), window.removeEventListener("beforeunload", te.leaveHandler), window.removeEventListener("keyup", te.leaveHandler), delete this, p("Disconnected your sockets, peers, streams and everything except RTCMultiConnection object.")
        }
    }

    function n() {
        return {
            create: function(e, n) {
                k(this, n);
                var t = this;
                return this.type = e, this.init(), this.attachMediaStreams(), z && this.session.data ? (this.session.data && "offer" == e && this.createDataChannel(), this.getLocalDescription(e), this.session.data && "answer" == e && this.createDataChannel()) : t.getLocalDescription(e), this
            },
            getLocalDescription: function(e) {
                function n() {
                    t.connection["offer" == e ? "createOffer" : "createAnswer"](function(n) {
                        n.sdp = t.serializeSdp(n.sdp, e), t.connection.setLocalDescription(n), t.trickleIce && t.onSessionDescription(n, t.streaminfo), "offer" == n.type && p("offer sdp", n.sdp), t.prevCreateType = e
                    }, t.onSdpError, t.constraints)
                }
                p("(getLocalDescription) peer createType is", e), this.session.inactive && a(this.rtcMultiConnection.waitUntilRemoteStreamStartsFlowing) && (this.rtcMultiConnection.waitUntilRemoteStreamStartsFlowing = !1);
                var t = this;
                "answer" == e ? this.setRemoteDescription(this.offerDescription, n) : n()
            },
            serializeSdp: function(e, n) {
                if (e = this.processSdp(e), z) return e;
                if (this.renegotiate, this.session.inactive && !this.holdMLine && (this.hold = !0, (this.session.screen || this.session.video) && this.session.audio ? this.holdMLine = "both" : this.session.screen || this.session.video ? this.holdMLine = "video" : this.session.audio && (this.holdMLine = "audio")), e = this.setBandwidth(e), "both" == this.holdMLine) {
                    if (this.hold) this.prevSDP = e, e = e.replace(/a=sendonly|a=recvonly|a=sendrecv/g, "a=inactive");
                    else if (this.prevSDP && !this.session.inactive && (e = this.prevSDP, 35 >= Z)) return e
                } else if ("audio" == this.holdMLine || "video" == this.holdMLine) {
                    e = e.split("m=");
                    var t = "",
                        i = "";
                    e[1] && 0 == e[1].indexOf("audio") && (t = "m=" + e[1]), e[2] && 0 == e[2].indexOf("audio") && (t = "m=" + e[2]), e[1] && 0 == e[1].indexOf("video") && (i = "m=" + e[1]), e[2] && 0 == e[2].indexOf("video") && (i = "m=" + e[2]), "audio" == this.holdMLine && (this.hold ? (this.prevSDP = e[0] + t + i, e = e[0] + t.replace(/a=sendonly|a=recvonly|a=sendrecv/g, "a=inactive") + i) : this.prevSDP && (e = this.prevSDP)), "video" == this.holdMLine && (this.hold ? (this.prevSDP = e[0] + t + i, e = e[0] + t + i.replace(/a=sendonly|a=recvonly|a=sendrecv/g, "a=inactive")) : this.prevSDP && (e = this.prevSDP))
                }
                return !this.hold && this.session.inactive && (e = "offer" == n ? e.replace(/a=setup:passive|a=setup:active|a=setup:holdconn/g, "a=setup:actpass") : e.replace(/a=setup:actpass|a=setup:passive|a=setup:holdconn/g, "a=setup:active"), e = e.replace(/a=inactive/g, "a=sendrecv")), e
            },
            init: function() {
                function e() {
                    return n.returnedSDP ? void(n.returnedSDP = !1) : (n.returnedSDP = !0, void n.onSessionDescription(n.connection.localDescription, n.streaminfo))
                }
                this.setConstraints(), this.connection = new N(this.iceServers, this.optionalArgument), this.session.data && (p("invoked: createDataChannel"), this.createDataChannel()), this.connection.onicecandidate = function(t) {
                    return t.candidate ? void(n.trickleIce && n.onicecandidate(t.candidate)) : void(n.trickleIce || e())
                }, this.connection.onaddstream = function(e) {
                    p("onaddstream", Q ? e.stream : g(e.stream)), n.onaddstream(e.stream, n.session)
                }, this.connection.onremovestream = function(e) {
                    n.onremovestream(e.stream)
                }, this.connection.onsignalingstatechange = function() {
                    n.connection && n.oniceconnectionstatechange({
                        iceConnectionState: n.connection.iceConnectionState,
                        iceGatheringState: n.connection.iceGatheringState,
                        signalingState: n.connection.signalingState
                    })
                }, this.connection.oniceconnectionstatechange = function() {
                    n.connection && (n.oniceconnectionstatechange({
                        iceConnectionState: n.connection.iceConnectionState,
                        iceGatheringState: n.connection.iceGatheringState,
                        signalingState: n.connection.signalingState
                    }), n.trickleIce || "complete" == n.connection.iceGatheringState && (p("iceGatheringState", n.connection.iceGatheringState),
                        e()))
                };
                var n = this
            },
            setBandwidth: function(e) {
                if (K || z || !this.bandwidth) return e;
                var n = this.bandwidth;
                return this.session.screen && (n.screen ? n.screen < 300 && v("It seems that you are using wrong bandwidth value for screen. Screen sharing is expected to fail.") : v("It seems that you are not using bandwidth for screen. Screen sharing is expected to fail.")), n.screen && this.session.screen && (e = e.replace(/b=AS([^\r\n]+\r\n)/g, ""), e = e.replace(/a=mid:video\r\n/g, "a=mid:video\r\nb=AS:" + n.screen + "\r\n")), (n.audio || n.video || n.data) && (e = e.replace(/b=AS([^\r\n]+\r\n)/g, "")), n.audio && (e = e.replace(/a=mid:audio\r\n/g, "a=mid:audio\r\nb=AS:" + n.audio + "\r\n")), n.video && (e = e.replace(/a=mid:video\r\n/g, "a=mid:video\r\nb=AS:" + (this.session.screen ? n.screen : n.video) + "\r\n")), n.data && !this.preferSCTP && (e = e.replace(/a=mid:data\r\n/g, "a=mid:data\r\nb=AS:" + n.data + "\r\n")), e
            },
            setConstraints: function() {
                if (this.constraints = {
                        optional: this.sdpConstraints.optional || G ? [{
                            VoiceActivityDetection: !1
                        }] : [],
                        mandatory: this.sdpConstraints.mandatory || {
                            OfferToReceiveAudio: !!this.session.audio,
                            OfferToReceiveVideo: !!this.session.video || !!this.session.screen
                        }
                    }, this.constraints.mandatory && p("sdp-mandatory-constraints", g(this.constraints.mandatory)), this.constraints.optional && p("sdp-optional-constraints", g(this.constraints.optional)), this.optionalArgument = {
                        optional: this.optionalArgument.optional || [],
                        mandatory: this.optionalArgument.mandatory || {}
                    }, this.preferSCTP || this.optionalArgument.optional.push({
                        RtpDataChannels: !0
                    }), p("optional-argument", g(this.optionalArgument)), a(this.iceServers)) this.iceServers = null;
                else {
                    var e = this.rtcMultiConnection.candidates,
                        n = e.stun,
                        t = e.turn,
                        i = e.host;
                    a(e.reflexive) || (n = e.reflexive), a(e.relay) || (t = e.relay), i || n || !t ? i || n || t || (this.rtcConfiguration.iceTransports = "none") : this.rtcConfiguration.iceTransports = "relay", this.iceServers = {
                        iceServers: this.iceServers,
                        iceTransports: this.rtcConfiguration.iceTransports
                    }
                }
                p("rtc-configuration", g(this.iceServers))
            },
            onSdpError: function(e) {
                var n = g(e);
                n && -1 != n.indexOf("RTP/SAVPF Expects at least 4 fields") && (n = "It seems that you are trying to interop RTP-datachannels with SCTP. It is not supported!"), h("onSdpError:", n)
            },
            onSdpSuccess: function() {
                p("sdp success")
            },
            onMediaError: function(e) {
                h(g(e))
            },
            setRemoteDescription: function(e, n) {
                if (!e) throw "Remote session description should NOT be NULL.";
                if (this.connection) {
                    p("setting remote description", e.type, e.sdp);
                    var t = this;
                    this.connection.setRemoteDescription(new F(e), n || this.onSdpSuccess, function(e) {
                        -1 == e.search(/STATE_SENTINITIATE|STATE_INPROGRESS/gi) && t.onSdpError(e)
                    })
                }
            },
            addIceCandidate: function(e) {
                function n(n) {
                    t.connection.addIceCandidate(n, function() {
                        p("added:", e.sdpMid, e.candidate)
                    }, function() {
                        h("onIceFailure", arguments, e.candidate)
                    })
                }
                var t = this;
                Q ? _(e, function(e) {
                    n(e)
                }) : n(new _(e))
            },

            createDataChannel: function(e) {
                if (!this.channels || !this.channels.length) {
                    var n = this;
                    this.channels || (this.channels = []);
                    var t = {};
                    this.dataChannelDict && (t = this.dataChannelDict), G && !this.preferSCTP && (t.reliable = !1), p("dataChannelDict", g(t)), ("answer" == this.type || z) && (this.connection.ondatachannel = function(e) {
                        n.setChannelEvents(e.channel)
                    }), (G && "offer" == this.type || z) && this.setChannelEvents(this.connection.createDataChannel(e || "channel", t))
                }
            },

            setChannelEvents: function(e) {
                var n = this;
                e.binaryType = "arraybuffer", this.dataChannelDict.binaryType && (e.binaryType = this.dataChannelDict.binaryType), e.onmessage = function(e) {
                    n.onmessage(e.data)
                };
                var t = 0;
                e.onopen = function() {
                    e.push = e.send, e.send = function(i) {
                        if ("disconnected" != n.connection.iceConnectionState && -1 == e.readyState.search(/closing|closed/g) && -1 != e.readyState.search(/connecting|open/g)) {
                            if ("connecting" == e.readyState) return t++, setTimeout(function() {
                                if (!(20 > t)) throw "Number of times exceeded to wait for WebRTC data connection to be opened.";
                                e.send(i)
                            }, 1e3);
                            try {
                                e.push(i)
                            } catch (s) {
                                if (t++, v("Data transmission failed. Re-transmitting..", t, g(s)), t >= 20) throw "Number of times exceeded to resend data packets over WebRTC data channels.";
                                setTimeout(function() {
                                    e.send(i)
                                }, 100)
                            }
                        }
                    }, n.onopen(e)
                }, 

                e.onerror = function(e) {
                    n.onerror(e)
                }, 

                e.onclose = function(e) {
                    n.onclose(e)
                }, this.channels.push(e)
            },
            addStream: function(e) {
                e.streamid || Y || (e.streamid = o()), p("attaching stream:", e.streamid, Q ? e : g(e)), this.connection.addStream(e), this.sendStreamId(e), this.getStreamInfo()
            },
            attachMediaStreams: function() {
                for (var e = this.attachStreams, n = 0; n < e.length; n++) this.addStream(e[n])
            },
            getStreamInfo: function() {
                this.streaminfo = "";
                for (var e = this.connection.getLocalStreams(), n = 0; n < e.length; n++) 0 == n ? this.streaminfo = JSON.stringify({
                    streamid: e[n].streamid || "",
                    isScreen: !!e[n].isScreen,
                    isAudio: !!e[n].isAudio,
                    isVideo: !!e[n].isVideo,
                    preMuted: e[n].preMuted || {}
                }) : this.streaminfo += "----" + JSON.stringify({
                    streamid: e[n].streamid || "",
                    isScreen: !!e[n].isScreen,
                    isAudio: !!e[n].isAudio,
                    isVideo: !!e[n].isVideo,
                    preMuted: e[n].preMuted || {}
                })
            },
            recreateOffer: function(e, n) {
                p("recreating offer"), this.type = "offer", this.renegotiate = !0, this.session = e, this.onSessionDescription = n, this.getStreamInfo(), this.session.data && this.createDataChannel(), this.getLocalDescription("offer")
            },
            recreateAnswer: function(e, n, t) {
                p("recreating answer"), this.type = "answer", this.renegotiate = !0, this.session = n, this.onSessionDescription = t, this.offerDescription = e, this.getStreamInfo(), this.session.data && this.createDataChannel(), this.getLocalDescription("answer")
            }
        }
    }

    function t(e) {
        function n(n, s, r) {
            r || (r = o()), i.localStreams[r] = n;
            var a = e.video;
            a && (a[z ? "mozSrcObject" : "src"] = z ? n : window.URL.createObjectURL(n), a.play()), e.onsuccess(n, s, y, r), V.streams[y] = {
                stream: n,
                streamid: r
            }, V.mutex = !1, V.queueRequests.length && t(V.queueRequests.shift())
        }
        if (Q) return fe.getUserMedia ? fe.getUserMedia(e.constraints || {
            audio: !0,
            video: !0
        }, e.onsuccess, e.onerror) : void setTimeout(function() {
            t(e)
        }, 1e3);
        if (V.mutex === !0) return void V.queueRequests.push(e);
        V.mutex = !0;
        var i = e.connection,
            s = e.mediaConstraints || {},
            r = "boolean" == typeof s.video ? s.video : s.video || s,
            a = "boolean" == typeof s.audio ? s.audio : s.audio || j,
            d = navigator,
            u = e.constraints || {
                audio: j,
                video: j
            };
        u.video && u.video.mozMediaSource && (r = {}), 1 == u.video && (u.video = j), 1 == u.audio && (u.audio = j), "boolean" == typeof a && u.audio && (u.audio = a), "boolean" == typeof r && u.video && (u.video = r);
        var m = a.mandatory;
        c(m) || (u.audio.mandatory = k(u.audio.mandatory, m));
        var f = r.mandatory;
        if (f) {
            var S = {};
            if (f.minWidth && (S.minWidth = f.minWidth), f.minHeight && (S.minHeight = f.minHeight), f.maxWidth && (S.maxWidth = f.maxWidth), f.maxHeight && (S.maxHeight = f.maxHeight), f.minAspectRatio && (S.minAspectRatio = f.minAspectRatio), f.maxFrameRate && (S.maxFrameRate = f.maxFrameRate), f.minFrameRate && (S.minFrameRate = f.minFrameRate), S.minWidth && S.minHeight) {
                var w = ["1920:1080", "1280:720", "960:720", "640:360", "640:480", "320:240", "320:180"];
                (-1 == w.indexOf(S.minWidth + ":" + S.minHeight) || -1 == w.indexOf(S.maxWidth + ":" + S.maxHeight)) && h('The min/max width/height constraints you passed "seems" NOT supported.', g(S)), (S.minWidth > S.maxWidth || S.minHeight > S.maxHeight) && h("Minimum value must not exceed maximum value.", g(S)), S.minWidth >= 1280 && S.minHeight >= 720 && v("Enjoy HD video! min/" + S.minWidth + ":" + S.minHeight + ", max/" + S.maxWidth + ":" + S.maxHeight)
            }
            u.video.mandatory = k(u.video.mandatory, S)
        }
        f && (u.video.mandatory = k(u.video.mandatory, f)), r.optional && r.optional instanceof Array && r.optional.length && (u.video.optional = u.video.optional ? u.video.optional.concat(r.optional) : r.optional), a.optional && a.optional instanceof Array && a.optional.length && (u.audio.optional = u.audio.optional ? u.audio.optional.concat(a.optional) : a.optional), u.video.mandatory && !c(u.video.mandatory) && i._mediaSources.video && (u.video.optional.forEach(function(e, n) {
            e.sourceId == i._mediaSources.video && delete u.video.optional[n]
        }), u.video.optional = l(u.video.optional), u.video.optional.push({
            sourceId: i._mediaSources.video
        })), u.audio.mandatory && !c(u.audio.mandatory) && i._mediaSources.audio && (u.audio.optional.forEach(function(e, n) {
            e.sourceId == i._mediaSources.audio && delete u.audio.optional[n]
        }), u.audio.optional = l(u.audio.optional), u.audio.optional.push({
            sourceId: i._mediaSources.audio
        })), u.video && !u.video.mozMediaSource && u.video.optional && u.video.mandatory && !u.video.optional.length && c(u.video.mandatory) && (u.video = !0), K && (u = {
            audio: !!u.audio,
            video: !!u.video
        }), p("invoked getUserMedia with constraints:", g(u));
        var y = JSON.stringify(u);
        V.streams[y] ? n(V.streams[y].stream, !0, V.streams[y].streamid) : (d.getMedia = d.webkitGetUserMedia || d.mozGetUserMedia, d.getMedia(u, n, function(n) {
            e.onerror(n, u)
        }))
    }

    function i(e) {
        function n(n, i, s) {
            var o = n.uuid;
            if (t[o] || (t[o] = []), t[o].push(n.message), n.last) {
                var r = t[o].join("");
                n.isobject && (r = JSON.parse(r));
                var a = (new Date).getTime(),
                    d = a - n.sendingTime,
                    c = {
                        data: r,
                        userid: i,
                        extra: s,
                        latency: d
                    };
                r.preRecordedMediaChunk ? (e.preRecordedMedias[r.streamerid] || e.shareMediaFile(null, null, r.streamerid), e.preRecordedMedias[r.streamerid].onData(r.chunk)) : e.autoTranslateText ? (c.original = c.data, e.Translator.TranslateText(c.data, function(n) {
                    c.data = n, e.onmessage(c)
                })) : r.isPartOfScreen ? e.onpartofscreen(r) : e.onmessage(c), delete t[o]
            }
        }
        var t = {};
        return {
            receive: n
        }
    }

    function s(e) {
        if (!e) throw "MediaStream is mandatory.";
        if (e.getVideoTracks && !e.getVideoTracks().length) return e;
        var n = new AudioContext,
            t = n.createMediaStreamSource(e),
            i = n.createMediaStreamDestination();
        return t.connect(i), W.push(t), i.stream
    }

    function o() {
        if (window.crypto && crypto.getRandomValues && -1 == navigator.userAgent.indexOf("Safari")) {
            for (var e = window.crypto.getRandomValues(new Uint32Array(3)), n = "", t = 0, i = e.length; i > t; t++) n += e[t].toString(36);
            return n
        }
        return (Math.random() * (new Date).getTime()).toString(36).replace(/\./g, "")
    }

    function r(e) {
        return !e.audio && !e.video && !e.screen && e.data
    }

    function a(e) {
        return "undefined" == typeof e
    }

    function d(e) {
        return "string" == typeof e
    }

    function c(e) {
        var n = 0;
        for (var t in e) n++;
        return 0 == n
    }

    function u(e) {
        var n = "";
        try {
            n = String.fromCharCode.apply(null, new Uint16Array(e))
        } catch (t) {}
        return n
    }

    function m(e) {
        d(e) || (e = JSON.stringify(e));
        for (var n = new ArrayBuffer(2 * e.length), t = new Uint16Array(n), i = 0, s = e.length; s > i; i++) t[i] = e.charCodeAt(i);
        return n
    }

    function l(e) {
        for (var n = [], t = e.length, i = 0; t > i; i++) e[i] && e[i] !== !0 && n.push(e[i]);
        return n
    }

    function f(e, n) {
        for (var t in e) n(e[t], t)
    }

    function p() {
        ne.log(arguments)
    }

    function h() {
        ne.error(arguments)
    }

    function v() {
        ne.warn(arguments)
    }

    function g(e) {
        return JSON.stringify(e, function(e, n) {
            return n && n.sdp ? (p(n.sdp.type, "	", n.sdp.sdp), "") : n
        }, "	")
    }

    function S(e) {
        var n = 0;
        for (var t in e) t && n++;
        return n
    }

    function w(e, n) {
        var t = document.createElement(e.isAudio ? "audio" : "video");
        if (t.id = e.streamid, Q) {
            var i = document.body || document.documentElement;
            return i.insertBefore(t, i.firstChild), setTimeout(function() {
                fe.attachMediaStream(t, e)
            }, 1e3), fe.attachMediaStream(t, e)
        }
        return t[z ? "mozSrcObject" : "src"] = z ? e : window.URL.createObjectURL(e), t.controls = !0, t.autoplay = !!n.remote, t.muted = n.remote ? !1 : !0, z && t.addEventListener("ended", function() {
            e.onended()
        }, !1), t.play(), t
    }

    function y(e, n) {
        (!e.mediaElement || e.mediaElement.parentNode) && (oe[e.streamid] || (oe[e.streamid] = e, n.onstreamended(e)))
    }

    function b(e, n) {
        re[e.userid] || (re[e.userid] = e, n.onleave(e))
    }

    function C(e) {
        function n(n) {
            var s = document.createElement("canvas");
            s.width = n.videoWidth || n.clientWidth, s.height = n.videoHeight || n.clientHeight;
            var o = s.getContext("2d");
            o.drawImage(n, 0, 0, s.width, s.height), i.snapshots[t] = s.toDataURL("image/png"), e.callback && e.callback(i.snapshots[t])
        }
        var t = e.userid,
            i = e.connection;
        if (e.mediaElement) return n(e.mediaElement);
        for (var s in i.streams) s = i.streams[s], s.userid == t && s.stream && s.stream.getVideoTracks && s.stream.getVideoTracks().length && n(s.mediaElement)
    }

    function x(e) {
        e.onMediaCaptured && (e.onMediaCaptured(), delete e.onMediaCaptured)
    }

    function k(e, n) {
        if (e || (e = {}), !n) return e;
        for (var t in n) e[t] = n[t];
        return e
    }

    function M(e, n) {
        var t = document.createElement("script");
        t.src = e, t.onload = function() {
            p("loaded resource:", e), n && n()
        }, document.documentElement.appendChild(t)
    }

    function R(e) {
        var n = e.connection,
            t = e.element;
        if (!window.html2canvas) return M(n.resources.html2canvas, function() {
            R(e)
        });
        if (d(t) && (t = document.querySelector(t), t || (t = document.getElementById(t))), !t) throw "HTML DOM Element is not accessible!";
        html2canvas(t, {
            onrendered: function(n) {
                e.callback(n.toDataURL())
            }
        })
    }

    function T(e, n) {

        function t(e) {
            return e.userid = e.extra.userid, e
        }
        if (!window.FileBufferReader) return void M(e.resources.FileBufferReader, 
            function() {
                T(e, n)
        });

        var i = new FileBufferReader;
        i.onProgress = function(n) {
            e.onFileProgress(t(n), n.uuid)
        }, 

        i.onBegin = function(n) {
            e.onFileStart(t(n))
        }, 

        i.onEnd = function(n) {
            e.onFileEnd(t(n))
        }, n(i)
    }

    function E(e) {
        if (le.screen.extensionid == ce && !ie) {
            if (!e) return E(!0);
            ie = !0;
            var n = document.createElement("iframe");
            n.onload = function() {
                n.isLoaded = !0, p("Screen Capturing frame is loaded.")
            }, n.src = "getSourceId.html", n.style.display = "none", (document.body || document.documentElement).appendChild(n), te = {
                postMessage: function() {
                    return n.isLoaded ? void n.contentWindow.postMessage({
                        captureSourceId: !0
                    }, "*") : void setTimeout(te.postMessage, 100)
                }
            }
        }
    }

    function D(e, n) {
        if (!se) {
            if (!n) return D(e, !0);
            se = !0;
            var t = document.createElement("iframe");
            t.onload = function() {
                function n(t) {
                    t.data && t.data.iceServers && (e(t.data.iceServers), window.removeEventListener("message", n))
                }
                t.isLoaded = !0, A("message", n), t.contentWindow.postMessage("get-ice-servers", "*")
            }, t.src = "getIceServers.html", t.style.display = "none", (document.body || document.documentElement).appendChild(t)
        }
    }

    function O(e) {
        var n = e.stream,
            t = e.root,
            i = e.session || {},
            s = e.enabled;
        if (i.audio || i.video || (i = d(i) ? {
                audio: !0,
                video: !0
            } : k(i, {
                audio: !0,
                video: !0
            })), i.type) {
            if ("remote" == i.type && "remote" != t.type) return;
            if ("local" == i.type && "local" != t.type) return
        }
        if (p(s ? "Muting" : "UnMuting", "session", g(i)), "local" == t.type && i.audio && n.getAudioTracks) {
            var o = n.getAudioTracks()[0];
            o && (o.enabled = !s)
        }
        if ("local" == t.type && (i.video || i.screen) && n.getVideoTracks) {
            var r = n.getVideoTracks()[0];
            r && (r.enabled = !s)
        }
        if (t.sockets.forEach(function(e) {
                "local" == t.type && e.send({
                    streamid: t.streamid,
                    mute: !!s,
                    unmute: !s,
                    session: i
                }), 
                "remote" == t.type && e.send({
                    promptMuteUnmute: !0,
                    streamid: t.streamid,
                    mute: !!s,
                    unmute: !s,
                    session: i
                })
            }), "remote" != t.type) {
            var a = k({}, t);
            a.session = i, a.isAudio = !!a.session.audio && !a.session.video, a.isVideo = !!a.session.video, a.isScreen = !!a.session.screen, s && (n.preMuted = {
                audio: n.getAudioTracks().length && !n.getAudioTracks()[0].enabled,
                video: n.getVideoTracks().length && !n.getVideoTracks()[0].enabled
            }, t.rtcMultiConnection.onmute(a)), s || (n.preMuted = {}, t.rtcMultiConnection.onunmute(a))
        }
    }

    function A(e, n) {
        window.removeEventListener(e, n), window.addEventListener(e, n, !1)
    }

    function I(e) {
        if (!window.hark) return void M(e.connection.resources.hark, function() {
            I(e)
        });
        var n = e.connection,
            t = e.streamedObject,
            i = e.stream,
            s = {},
            o = hark(i, s);
        o.on("speaking", function() {
            n.onspeaking && n.onspeaking(t)
        }), o.on("stopped_speaking", function() {
            n.onsilence && n.onsilence(t)
        }), o.on("volume_change", function(e, i) {
            n.onvolumechange && n.onvolumechange(k({
                volume: e,
                threshold: i
            }, t))
        })
    }

    function P(e) {

        function n(e, n) {
            if (-1 != e.position) {
                var t = +e.position.toFixed(2).split(".")[1] || 100;
                n.innerHTML = t + "%"
            }
        }
        
        e.userid = o(), 

        e.session = {
            audio: !0,
            video: !0
        }, 

        e.maxParticipantsAllowed = 3, 

        e.direction = "many-to-many", 

        e.mediaConstraints = {
            mandatory: {},
            optional: [],
            audio: {
                mandatory: {},
                optional: []
            },
            video: {
                mandatory: {},
                optional: []
            }
        }, 

        e.candidates = {
            host: !0,
            stun: !0,
            turn: !0
        }, 

        e.sdpConstraints = {}, e.sdpConstraints.mandatory = {
            OfferToReceiveAudio: !0,
            OfferToReceiveVideo: !0
        }, 

        e.privileges = {
            canStopRemoteStream: !1,
            canMuteRemoteStream: !1
        }, 

        e.iceProtocols = {
            tcp: !0,
            udp: !0
        }, 

        e.preferSCTP = z || Z >= 32 ? !0 : !1, 

        e.chunkInterval = z || Z >= 32 ? 100 : 500, 

        e.chunkSize = z || Z >= 32 ? 13e3 : 1e3, 

        e.fakeDataChannels = !1, 

        e.waitUntilRemoteStreamStartsFlowing = null,

        e.leaveOnPageUnload = !0,

        e.getExternalIceServers = G, 

        e.UA = {
            isFirefox: z,
            isChrome: G,
            isMobileDevice: K,
            version: G ? Z : ee,
            isNodeWebkit: X,
            isSafari: J,
            isIE: Y,
            isOpera: q
        }, 

        e.fileQueue = {}, e.renegotiatedSessions = {}, e.channels = {}, e.extra = {}, e.bandwidth = {
            screen: 300
        }, 

        e.caniuse = {
            RTCPeerConnection: le.isWebRTCSupported,
            getUserMedia: !!navigator.webkitGetUserMedia || !!navigator.mozGetUserMedia,
            AudioContext: le.isAudioContextSupported,
            ScreenSharing: le.isScreenCapturingSupported,
            RtpDataChannels: le.isRtpDataChannelsSupported,
            SctpDataChannels: le.isSctpDataChannelsSupported
        }, 

        e.snapshots = {}, e._mediaSources = {}, e.devices = {}, e.language = "en", e.autoTranslateText = !1, e.googKey = "AIzaSyCgB5hmFY74WYB-EoWkhr9cAGr6TiTHrEE", e.localStreamids = [], e.localStreams = {}, e.preRecordedMedias = {}, e.attachStreams = [], e.detachStreams = [], e.optionalArgument = {
            optional: [{
                DtlsSrtpKeyAgreement: !0
            }, {
                googImprovedWifiBwe: !0
            }, {
                googScreencastMinBitrate: 300
            }],
            mandatory: {}
        }, 

        e.dataChannelDict = {}, 
        e.dontAttachStream = !1, 
        e.dontCaptureUserMedia = !1, 
        e.preventSSLAutoAllowed = !1, 
        e.autoReDialOnFailure = !0, 
        e.isInitiator = !1, 
        e.DetectRTC = le, 
        e.trickleIce = !0, 
        e.sessionDescriptions = {}, 
        e.sessionDescription = null, 
        e.resources = {
            RecordRTC: "RecordRTC.js",
            PreRecordedMediaStreamer: "PreRecordedMediaStreamer.js",
            customGetUserMediaBar: "navigator.customGetUserMediaBar.js",
            html2canvas: "screenshot.js",
            hark: "hark.js",
            firebase: "firebase.js",
            firebaseio: "https://dazzling-fire-764.firebaseio.com/",
            muted: "images/muted.png?" + Math.random(),
            getConnectionStats: "getConnectionStats.js",
            FileBufferReader: "FileBufferReader.js"
        }, 

        e.body = document.body || document.documentElement, 
        e.peers = {}, 
        e.firebase = "chat", 
        e.numberOfSessions = 0, 
        e.numberOfConnectedUsers = 0, 
        e.enableFileSharing = !0, 
        e.autoSaveToDisk = !1, 
        e.processSdp = function(e) {
            return e
        }, 

        e.onmessage = function(e) {
            p("onmessage", g(e))
        }, 

        e.onopen = function(e) {
            p("Data connection is opened between you and", e.userid)
        }, 

        e.onerror = function(e) {
            h(onerror, g(e))
        }, 

        e.onclose = function(n) {
            v("onclose", g(n)), e.streams.remove({
                userid: n.userid
            })
        };


        var t = {};
        e.onFileStart = function(n) {
            addNewMessage({
                header: rtcMultiConnection.extra.username,
                message: "File Shared -> " + n.name + " ( " + bytesToSize(n.size) + " )",
                userinfo: getUserinfo(rtcMultiConnection.blobURLs[rtcMultiConnection.userid], "images/share-files.png"),
                callback: function(r) {
                 }
            });
        }, 

        e.onFileProgress = function(e) {
            var i = t[e.uuid];
            i && (i.progress.value = e.currentPosition || e.maxChunks || i.progress.max, 
                n(i.progress, i.label))
        }, 

        e.onFileEnd = function(n) {
            t[n.uuid] && (t[n.uuid].div.innerHTML = '<a href="' + n.url + '" target="_blank" download="' + n.name + '">' + n.name + "</a>"), 
            (e.onFileSent || e.onFileReceived) && (e.onFileSent && e.onFileSent(n, n.uuid), 
            e.onFileReceived && e.onFileReceived(n.name, n))
        }, 

        e.onstream = function(n) {
            e.body.insertBefore(n.mediaElement, e.body.firstChild);

        }, 

        e.onstreamended = function(e) {
            if (p("onStreamEndedHandler:", e), !e.mediaElement) return v("Event.mediaElement is undefined", e);
            if (!e.mediaElement.parentNode) {
                if (e.mediaElement = document.getElementById(e.streamid), !e.mediaElement) return v("Event.mediaElement is undefined", e);
                if (!e.mediaElement.parentNode) return v("Event.mediElement.parentNode is null.", e)
            }
            e.mediaElement.parentNode.removeChild(e.mediaElement)
        }, 

        e.onSessionClosed = function(e) {
            e.isEjected ? v(e.userid, "ejected you.") : v("Session has been closed.", e)
        }, 

        e.onmute = function(n) {
            n.isVideo && n.mediaElement && (n.mediaElement.pause(), n.mediaElement.setAttribute("poster", e.resources.muted), n.mediaElement.style.display = "none"), n.isAudio && n.mediaElement && (n.mediaElement.muted = !0)
        }, 

        e.onunmute = function(e) {
            e.isVideo && e.mediaElement && (e.mediaElement.play(), e.mediaElement.removeAttribute("poster"), e.mediaElement.style.display = "initial", e.mediaElement.volume = .5), e.isAudio && e.mediaElement && (e.mediaElement.muted = !1, e.mediaElement.volume = .5)
        }, 

        e.onleave = function(e) {
            p("onleave", g(e))
        }, 

        e.token = o, e.peers[e.userid] = {
            drop: function() {
                e.drop()
            },
            renegotiate: function() {},
            addStream: function() {},
            hold: function() {},
            unhold: function() {},
            changeBandwidth: function() {},
            sharePartOfScreen: function() {}
        }, 

        e._skip = ["stop", "mute", "unmute", "_private", "_selectStreams", "selectFirst", "selectAll", "remove"], e.streams = {
            mute: function(e) {
                this._private(e, !0)
            },
            unmute: function(e) {
                this._private(e, !1)
            },
            _private: function(n, t) {
                function i(e, n, t) {
                    n.local && "local" != e.type || n.remote && "remote" != e.type || !(n.isScreen && !e.isScreen || n.isAudio && !e.isAudio || n.isVideo && !e.isVideo || (t ? !e.mute(n) : !e.unmute(n)))
                }
                if (!n || d(n))
                    for (var s in this) - 1 == e._skip.indexOf(s) && this[s]._private(n, t);
                else
                    for (var s in this) - 1 == e._skip.indexOf(s) && i(this[s], n, t)
            },
            stop: function(n) {
                function t(e, n) {
                    n.userid && e.userid != n.userid || n.local && "local" != e.type || n.remote && "remote" != e.type || (n.screen && e.isScreen && e.stop(), n.audio && e.isAudio && e.stop(), n.video && e.isVideo && e.stop(), n.audio || n.video || n.screen || e.stop())
                }
                var i;
                for (var s in this)
                    if (-1 == e._skip.indexOf(s))
                        if (i = this[s], n)
                            if (d(n)) {
                                var o = {};
                                o[n] = !0, t(i, o)
                            } else t(i, n);
                else i.stop()
            },
            remove: function(n) {
                function t(e, n) {
                    n.userid && e.userid != n.userid || n.local && "local" != e.type || n.remote && "remote" != e.type || (n.screen && e.isScreen && i(e), n.audio && e.isAudio && i(e), n.video && e.isVideo && i(e), n.audio || n.video || n.screen || i(e))
                }

                function i(n) {
                    y(n, e), delete e.streams[n.streamid]
                }
                var s;
                for (var o in this)
                    if (-1 == e._skip.indexOf(o))
                        if (s = this[o], n)
                            if (d(n)) {
                                var r = {};
                                r[n] = !0, t(s, r)
                            } else t(s, n);
                else t(s, {
                    local: !0,
                    remote: !0
                })
            },
            selectFirst: function(e) {
                return this._selectStreams(e, !1)
            },
            selectAll: function(e) {
                return this._selectStreams(e, !0)
            },
            _selectStreams: function(n, t) {
                if (!n || d(n) || c(n)) throw "Invalid arguments.";
                a(n.local) && a(n.remote) && a(n.userid) && (n.local = n.remote = !0), n.isAudio || n.isVideo || n.isScreen || (n.isAudio = n.isVideo = n.isScreen = !0);
                var i = [];
                for (var s in this) - 1 == e._skip.indexOf(s) && (s = this[s]) && (n.local && "local" == s.type || n.remote && "remote" == s.type || n.userid && s.userid == n.userid) && (n.isVideo && s.isVideo && i.push(s), n.isAudio && s.isAudio && i.push(s), n.isScreen && s.isScreen && i.push(s));
                return t ? i : i[0]
            }
        };
        
        var i = [];
        
        i.push({
            url: "stun:stun.l.google.com:19302"
        }), i.push({
            url: "stun:stun.anyfirewall.com:3478"
        }), i.push({
            url: "turn:turn.bistri.com:80",
            credential: "homeo",
            username: "homeo"
        }), i.push({
            url: "turn:turn.anyfirewall.com:443?transport=tcp",
            credential: "webrtc",
            username: "webrtc"
        }),

        // i.push({"url": "stun:turn02.uswest.xirsys.com"}),

        // i.push({
        // credential: "11002432-c389-11e5-ac99-60f36f38401f",
        // url: "turn:turn02.uswest.xirsys.com:443?transport=udp",
        // username: "1100239c-c389-11e5-bc7b-15aff7a41b0b"}),

        // i.push({
        // credential: "11002432-c389-11e5-ac99-60f36f38401f",
        // url: "turn:turn02.uswest.xirsys.com:443?transport=tcp",
        // username: "1100239c-c389-11e5-bc7b-15aff7a41b0b"
        // }),

        // i.push({
        // credential: "11002432-c389-11e5-ac99-60f36f38401f",
        // url: "turn:turn02.uswest.xirsys.com:5349?transport=udp",
        // username: "1100239c-c389-11e5-bc7b-15aff7a41b0b"
        // }),

        // i.push({
        // credential: "11002432-c389-11e5-ac99-60f36f38401f",
        // url: "turn:turn02.uswest.xirsys.com:5349?transport=tcp",
        // username: "1100239c-c389-11e5-bc7b-15aff7a41b0b"
        // }),

        e.iceServers = i, 
        e.rtcConfiguration = {
            iceServers: null,
            iceTransports: "all",
            peerIdentity: !1
        }, 

        e.media = {
            min: function(n, t) {
                e.mediaConstraints.video && (e.mediaConstraints.video.mandatory || (e.mediaConstraints.video.mandatory = {}), e.mediaConstraints.video.mandatory.minWidth = n, e.mediaConstraints.video.mandatory.minHeight = t)
            },
            max: function(n, t) {
                e.mediaConstraints.video && (e.mediaConstraints.video.mandatory || (e.mediaConstraints.video.mandatory = {}), e.mediaConstraints.video.mandatory.maxWidth = n, e.mediaConstraints.video.mandatory.maxHeight = t)
            }
        }, 

        e._getStream = function(n) {
            function t(e, n, t) {
                if (t) {
                    var i = t.onpause,
                        s = t.onplay;
                    t.onpause = t.onplay = function() {},
                     n ? t.pause() : t.play(), t.onpause = i, t.onplay = s
                }
            }
            var i = k({
                sockets: n.socket ? [n.socket] : []
            }, n);
            
            return i.stop = function() {
                var e = this;
                if (e.sockets.forEach(function(n) {
                        "local" == e.type && n.send({
                            streamid: e.streamid,
                            stopped: !0
                        }), "remote" == e.type && n.send({
                            promptStreamStop: !0,
                            streamid: e.streamid
                        })
                    }), "remote" != e.type) {
                    var n = e.stream;
                    n && e.rtcMultiConnection.stopMediaStream(n)
                }
            }, 

            i.mute = function(e) {
                this.muted = !0, this._private(e, !0)
            }, 

            i.unmute = function(e) {
                this.muted = !1, this._private(e, !1)
            }, 

            i._private = function(e, n) {
                return e && !a(e.sync) && 0 == e.sync ? void t(e, n, this.mediaElement) : void O({
                    root: this,
                    session: e,
                    enabled: n,
                    stream: this.stream
                })
            }, 

            i.startRecording = function(e) {
                var n = this;
                return e || (e = {
                    audio: !0,
                    video: !0
                }), d(e) && (e = {
                    audio: "audio" == e,
                    video: "video" == e
                }), window.RecordRTC ? (p("started recording session", e), n.videoRecorder = n.audioRecorder = null, z ? e.video ? n.videoRecorder = RecordRTC(n.stream, {
                    type: "video"
                }) : e.audio && (n.audioRecorder = RecordRTC(n.stream, {
                    type: "audio"
                })) : G && (e.video && (n.videoRecorder = RecordRTC(n.stream, {
                    type: "video"
                })), e.audio && (n.audioRecorder = RecordRTC(n.stream, {
                    type: "audio"
                }))), n.audioRecorder && n.audioRecorder.startRecording(), void(n.videoRecorder && n.videoRecorder.startRecording())) : M(n.rtcMultiConnection.resources.RecordRTC, function() {
                    n.startRecording(e)
                })
            }, 

            i.stopRecording = function(e, n) {
                n || (n = {
                    audio: !0,
                    video: !0
                }), d(n) && (n = {
                    audio: "audio" == n,
                    video: "video" == n
                }), p("stopped recording session", n);
                var t = this;
                n.audio && t.audioRecorder ? t.audioRecorder.stopRecording(function() {
                    n.video && t.videoRecorder ? t.videoRecorder.stopRecording(function() {
                        e({
                            audio: t.audioRecorder.getBlob(),
                            video: t.videoRecorder.getBlob()
                        })
                    }) : e({
                        audio: t.audioRecorder.getBlob()
                    })
                }) : n.video && t.videoRecorder && t.videoRecorder.stopRecording(function() {
                    e({
                        video: t.videoRecorder.getBlob()
                    })
                })
            }, 

            i.takeSnapshot = function(n) {
                C({
                    mediaElement: this.mediaElement,
                    userid: this.userid,
                    connection: e,
                    callback: n
                })
            }, i.streamObject = i, i
        }, 

        e.set = function(e) {
            for (var n in e) this[n] = e[n];
            return this
        }, 

        e.onMediaError = function(e) {
            h("name", e.name), h("constraintName", g(e.constraintName)), h("message", e.message), h("original session", e.session)
        }, 

        e.takeSnapshot = function(n, t) {
            C({
                userid: n,
                connection: e,
                callback: t
            })
        }, 

        e.saveToDisk = function(e, n) {
            e.size && e.type ? B.SaveToDisk(URL.createObjectURL(e), n || e.name || e.type.replace("/", "-") + e.type.split("/")[1]) : B.SaveToDisk(e, n)
        }, 

        e.selectDevices = function(n, t) {
            function i(n) {
                n && (e._mediaSources[n.kind] = n.id)
            }
            n && i(this.devices[n]), t && i(this.devices[t])
        }, 

        e.getDevices = function(n) {
            return le.MediaDevices.length ? (le.MediaDevices.forEach(function(n) {
                e.devices[n.deviceId] = n
            }), void(n && n(e.devices))) : setTimeout(function() {
                e.getDevices(n)
            }, 1e3)
        }, 

        e.getMediaDevices = e.enumerateDevices = function(n) {
            if (!n) throw "callback is mandatory.";
            e.getDevices(function() {
                n(e.DetectRTC.MediaDevices)
            })
        }, 

        e.onCustomMessage = function(e) {
            p("Custom message", e)
        }, 

        e.ondrop = function(e) {
            p("Media connection is dropped by " + e)
        }, 

        e.drop = function(n) {
            n = n || {}, e.attachStreams = [];
            for (var t in e.streams) - 1 == e._skip.indexOf(t) && (t = e.streams[t], "local" == t.type ? (e.detachStreams.push(t.streamid), y(t, e)) : y(t, e));
            e.sendCustomMessage({
                drop: !0,
                dontRenegotiate: a(n.renegotiate) ? !0 : n.renegotiate
            })
        }, 

        e.Translator = {
            TranslateText: function(n, t) {
                var i = document.createElement("script");
                i.type = "text/javascript";
                var s = encodeURIComponent(n),
                    o = "method" + e.token();
                window[o] = function(e) {
                    e.data && e.data.translations[0] && t && t(e.data.translations[0].translatedText), e.error && "Daily Limit Exceeded" == e.error.message && (v('Text translation failed. Error message: "Daily Limit Exceeded."'), t(n))
                };
                var r = "https://www.googleapis.com/language/translate/v2?key=" + e.googKey + "&target=" + (e.language || "en-US") + "&callback=window." + o + "&q=" + s;
                i.src = r, document.getElementsByTagName("head")[0].appendChild(i)
            }
        }, 

        e.setDefaultEventsForMediaElement = function(n, t) {
            n.onpause = function() {
                e.streams[t] && !e.streams[t].muted && e.streams[t].mute()
            }, n.onplay = function() {
                e.streams[t] && e.streams[t].muted && e.streams[t].unmute()
            };
            var i = !1;
            n.onvolumechange = function() {
                i || (i = !0, e.streams[t] && setTimeout(function() {
                    var s = e.streams[t];
                    e.streams[t].sockets.forEach(function(e) {
                        e.send({
                            streamid: s.streamid,
                            isVolumeChanged: !0,
                            volume: n.volume
                        })
                    }), i = !1
                }, 2e3))
            }
        }, 

        e.onMediaFile = function(n) {
            p("onMediaFile", n), e.body.appendChild(n.mediaElement)
        }, 

        e.shareMediaFile = function(n, t, i) {
            return i = i || e.token(), PreRecordedMediaStreamer ? PreRecordedMediaStreamer.shareMediaFile({
                file: n,
                video: t,
                streamerid: i,
                connection: e
            }) : (M(e.resources.PreRecordedMediaStreamer, function() {
                e.shareMediaFile(n, t, i)
            }), i)
        }, 

        e.onpartofscreen = function(n) {
            var t = document.createElement("img");
            t.src = n.screenshot, e.body.appendChild(t)
        }, 

        e.skipLogs = function() {
            p = h = v = function() {}
        }, 

        e.hold = function(n) {
            for (var t in e.peers) e.peers[t].hold(n)
        }, 

        e.onhold = function(n) {
            p("onhold", n), "audio" != n.kind && (n.mediaElement.pause(), n.mediaElement.setAttribute("poster", e.resources.muted)), "audio" == n.kind && (n.mediaElement.muted = !0)
        }, 

        e.unhold = function(n) {
            for (var t in e.peers) e.peers[t].unhold(n)
        }, 

        e.onunhold = function(e) {
            p("onunhold", e), "audio" != e.kind && (e.mediaElement.play(), e.mediaElement.removeAttribute("poster")), "audio" != e.kind && (e.mediaElement.muted = !1)
        }, 

        e.sharePartOfScreen = function(n) {
            function t() {
                (!e.partOfScreen || e.partOfScreen.sharing) && R({
                    element: n.element,
                    connection: e,
                    callback: function(s) {
                        if (s != i) {
                            i = s;
                            for (var o in e.channels) e.channels[o].send({
                                screenshot: s,
                                isPartOfScreen: !0
                            })
                        }!n.once && setTimeout(t, n.interval || 200)
                    }
                })
            }
            var i = "";
            t(), e.partOfScreen = k({
                sharing: !0
            }, n)
        }, 

        e.pausePartOfScreenSharing = function() {
            for (var n in e.peers) e.peers[n].pausePartOfScreenSharing = !0;
            e.partOfScreen && (e.partOfScreen.sharing = !1)
        }, 

        e.resumePartOfScreenSharing = function() {
            for (var n in e.peers) e.peers[n].pausePartOfScreenSharing = !1;
            e.partOfScreen && (e.partOfScreen.sharing = !0)
        }, 

        e.stopPartOfScreenSharing = function() {
            for (var n in e.peers) e.peers[n].stopPartOfScreenSharing = !0;
            e.partOfScreen && (e.partOfScreen.sharing = !1)
        }, 

        e.takeScreenshot = function(n, t) {
            if (!n || !t) throw "Invalid number of arguments.";
            if (!window.html2canvas) return M(e.resources.html2canvas, function() {
                e.takeScreenshot(n)
            });
            if (d(n) && (n = document.querySelector(n), n || (n = document.getElementById(n))), !n) throw "HTML Element is inaccessible!";
            html2canvas(n, {
                onrendered: function(e) {
                    t(e.toDataURL())
                }
            })
        }, 

        e.onScreenCapturingExtensionAvailable = function() {
            p("It seems that screen capturing extension is installed and available on your system!")
        }, !Q && le.screen.onScreenCapturingExtensionAvailable && (le.screen.onScreenCapturingExtensionAvailable = function() {
            e.onScreenCapturingExtensionAvailable()
        }), 

        e.changeBandwidth = function(n) {
            for (var t in e.peers) e.peers[t].changeBandwidth(n)
        }, 

        e.convertToAudioStream = function(e) {
            s(e)
        }, 

        e.onstatechange = function(e) {
            p("on:state:change (" + e.userid + "):", e.name + ":", e.reason || "")
        }, 

        e.onfailed = function(e) {
            e.peer.numOfRetries || (e.peer.numOfRetries = 0), e.peer.numOfRetries++, z || "firefox" == e.targetuser.browser ? (h("ICE connectivity check is failed. Re-establishing peer connection."), e.peer.numOfRetries < 2 && e.peer.redial()) : (h("ICE connectivity check is failed. Renegotiating peer connection."), e.peer.numOfRetries < 2 && e.peer.renegotiate()), e.peer.numOfRetries >= 2 && (e.peer.numOfRetries = 0)
        }, 

        e.onconnected = function(e) {
            p("Peer connection has been established between you and", e.userid)
        }, 

        e.ondisconnected = function(n) {
            h("Peer connection seems has been disconnected between you and", n.userid), c(e.channels) || e.channels[n.userid] && (e.channels[n.userid].send({
                checkingPresence: !0
            }), setTimeout(function() {
                return e.peers[n.userid].connected ? void delete e.peers[n.userid].connected : (e.streams.remove({
                    remote: !0,
                    userid: n.userid
                }), void e.remove(n.userid))
            }, 3e3))
        }, 

        e.onstreamid = function(e) {
            p("got remote streamid", e.streamid, "from", e.userid)
        }, 

        e.stopMediaStream = function(n) {
            if (!n) throw "MediaStream argument is mandatory.";
            if (e.keepStreamsOpened) return void(n.onended && n.onended());
            e.localStreams[n.streamid] && delete e.localStreams[n.streamid], z && n.onended && n.onended();
            var t = Boolean((n.getAudioTracks || n.getVideoTracks) && (n.getAudioTracks()[0] && !n.getAudioTracks()[0].stop || n.getVideoTracks()[0] && !n.getVideoTracks()[0].stop));
            return !n.getAudioTracks || t ? void(n.stop && n.stop()) : (n.getAudioTracks().length && n.getAudioTracks()[0].stop && n.getAudioTracks().forEach(function(e) {
                e.stop()
            }), void(n.getVideoTracks().length && n.getVideoTracks()[0].stop && n.getVideoTracks().forEach(function(e) {
                e.stop()
            })))
        }, 

        e.changeBandwidth = function(n) {
            if (!n || d(n) || c(n)) throw 'Invalid "bandwidth" arguments.';
            f(e.peers, function(e) {
                e.peer.bandwidth = n
            }), e.renegotiate()
        }, 

        e.openSignalingChannel = function(n) {
            if (!window.Firebase) return M(e.resources.firebase, function() {
                e.openSignalingChannel(n)
            });
            var t = n.channel || e.channel;
            e.firebase && (e.resources.firebaseio = e.resources.firebaseio.replace("//chat.", "//" + e.firebase + "."));
            
            var i = new Firebase(e.resources.firebaseio + t);
            i.channel = t, i.on("child_added", function(e) {
                n.onmessage(e.val())
            }), 
            i.send = function(e) {
                for (var n in e)(a(e[n]) || "function" == typeof e[n]) && (e[n] = !1);
                this.push(e)
            }, 
            e.socket || (e.socket = i), i.onDisconnect().remove(), setTimeout(function() {
                n.callback(i)
            }, 1)
        }, 

        e.Plugin = fe
    }


    var U = location.href,
        L = U.split("?");
    window.RMCDefaultChannel = L[0].replace(/\/|:|#|%|\.|\[|\]/g, "") + currentTimeTicker, window.RTCMultiConnection = function(n) {
        function i(n) {
            return te && E(), S ? n() : void(S = new e(b, n))
        }

        function u(e, n) {
            if (d(e) && (b.skipOnNewSession = !0), !S) return p("Signaling channel is not ready. Connecting..."), void i(function() {
                p("Signaling channel is connected. Joining the session again..."), setTimeout(function() {
                    u(e, n)
                }, 1e3)
            });
            if (d(e)) {
                if (!b.sessionDescriptions[e]) return setTimeout(function() {
                    p("Session-Descriptions not found. Rechecking.."), u(e, n)
                }, 1e3);
                e = b.sessionDescriptions[e]
            }
            if (n) return m(function() {
                e.oneway = !0, u(e)
            }, n);
            if (!e || !e.userid || !e.sessionid) {
                t("missing arguments", arguments);
                var t = 'Invalid data passed over "connection.join" method.';
                throw b.onstatechange({
                    userid: "browser",
                    extra: {},
                    name: "Unexpected data detected.",
                    reason: t
                }), t
            }
            b.dontOverrideSession || (b.session = e.session);
            var s = b.extra || e.extra || {};
            e.oneway || r(e) ? S.joinSession(e, s) : m(function() {
                S.joinSession(e, s)
            })
        }

        function m(e, n, i) {
            function s(t) {
                if (t.data && t.data.chromeMediaSourceId) {
                    window.removeEventListener("message", s);
                    var i = t.data.chromeMediaSourceId;
                    if (le.screen.sourceId = i, le.screen.chromeMediaSource = "desktop", "PermissionDeniedError" == i) {
                        var o = {
                            message: "https:" == location.protocol ? "User denied to share content of his screen." : de,
                            name: "PermissionDeniedError",
                            constraintName: l,
                            session: a
                        };
                        return V.mutex = !1, le.screen.sourceId = null, b.onMediaError(o)
                    }
                    m(e, n)
                }
                t.data && t.data.chromeExtensionStatus && (v("Screen capturing extension status is:", t.data.chromeExtensionStatus), le.screen.chromeMediaSource = "screen", m(e, n, !0))
            }

            function o(n, i, s, r) {
                if (b.onstatechange({
                        userid: "browser",
                        extra: {},
                        name: "fetching-usermedia",
                        reason: "About to capture user-media with constraints: " + g(n)
                    }), b.preventSSLAutoAllowed && !r && G) return navigator.customGetUserMediaBar ? void navigator.customGetUserMediaBar(n, function() {
                    o(n, i, s, !0)
                }, function() {
                    b.onMediaError({
                        name: "PermissionDeniedError",
                        message: "User denied permission.",
                        constraintName: n,
                        session: a
                    })
                }) : void M(b.resources.customGetUserMediaBar, function() {
                    o(n, i, s, r)
                });
                var c = {
                    onsuccess: function(e, t, o, r) {
                        f(e, t, o, r, n, i, s, l, u, a)
                    },
                    onerror: function(n, t) {
                        if (z && "PERMISSION_DENIED" == n && (n = {
                                message: "",
                                name: "PermissionDeniedError",
                                constraintName: t,
                                session: a
                            }), z && t.video && t.video.mozMediaSource) return i = {
                            message: ae,
                            name: n.name || "PermissionDeniedError",
                            constraintName: t,
                            session: a
                        }, void b.onMediaError(i);
                        if (d(n)) return b.onMediaError({
                            message: "Unknown Error",
                            name: n,
                            constraintName: t,
                            session: a
                        });
                        if (n.name && ("PermissionDeniedError" == n.name || "DevicesNotFoundError" == n.name)) {
                            var i = "Either: ";
                            i += "\n Media resolutions are not permitted.", i += "\n Another application is using same media device.", i += "\n Media device is not attached or drivers not installed.", i += "\n You denied access once and it is still denied.", n.message && n.message.length && (i += "\n " + n.message), i = {
                                message: i,
                                name: n.name,
                                constraintName: t,
                                session: a
                            }, b.onMediaError(i), G && (a.audio || a.video) && le.load(function() {
                                a.audio && !le.hasMicrophone && (v("It seems that you have no microphone attached to your device/system."), a.audio = a.audio = !1, a.video || (alert("It seems that you are capturing microphone and there is no device available or access is denied. Reloading..."), location.reload())), a.video && !le.hasWebcam && (v("It seems that you have no webcam attached to your device/system."), a.video = a.video = !1, a.audio || (alert("It seems that you are capturing webcam and there is no device available or access is denied. Reloading..."), location.reload())), le.hasMicrophone || le.hasWebcam ? b.getUserMediaPromptedOnce || (b.getUserMediaPromptedOnce = !0, m(e, a)) : (alert("It seems that either both microphone/webcam are not available or access is denied. Reloading..."), location.reload())
                            })
                        }
                        if (n.name && "ConstraintNotSatisfiedError" == n.name) {
                            var i = "Either: ";
                            i += "\n You are prompting unknown media resolutions.", i += "\n You are using invalid media constraints.", n.message && n.message.length && (i += "\n " + n.message), i = {
                                message: i,
                                name: n.name,
                                constraintName: t,
                                session: a
                            }, b.onMediaError(i)
                        }
                        a.screen && (z ? h(ae) : "https:" !== location.protocol ? X || "file:" != location.protocol && "http:" != location.protocol || h("You cannot use HTTP or file protocol for screen capturing. You must either use HTTPs or chrome extension page or Node-Webkit page.") : h('Unable to detect actual issue. Maybe "deprecated" screen capturing flag was not set using command line or maybe you clicked "No" button or maybe chrome extension returned invalid "sourceId". Please install chrome-extension: http://bit.ly/webrtc-screen-extension')), V.mutex = !1;
                        var s = JSON.stringify(t);
                        V.streams[s] && delete V.streams[s]
                    },
                    mediaConstraints: b.mediaConstraints || {}
                };
                c.constraints = n || u, c.connection = b, t(c)
            }
            var a = n || b.session;
            if (c(a)) return void(e && e());
            if (b.dontCaptureUserMedia) return e();
            if (r(a) || !b.isInitiator && a.oneway) return b.attachStreams = [], e();
            var u = {
                audio: a.audio ? {
                    mandatory: {},
                    optional: [{
                        chromeRenderToAssociatedSink: !0
                    }]
                } : !1,
                video: !!a.video
            };
            if (b._mediaSources.audio && u.audio.optional.push({
                    sourceId: b._mediaSources.audio
                }), b._mediaSources.video && (u.video = {
                    optional: [{
                        sourceId: b._mediaSources.video
                    }]
                }), !a.screen && !u.audio && !u.video) return e();
            var l = {
                audio: !1,
                video: {
                    mandatory: {
                        chromeMediaSource: le.screen.chromeMediaSource,
                        maxWidth: screen.width > 1920 ? screen.width : 1920,
                        maxHeight: screen.height > 1080 ? screen.height : 1080
                    },
                    optional: []
                }
            };
            if (z && a.screen) {
                if ("https:" !== location.protocol) return h(de);
                v(ae), l.video = k(l.video.mandatory, {
                    mozMediaSource: "window",
                    mediaSource: "window"
                }), u.audio && (l.audio = !0, u = {}), delete l.video.chromeMediaSource
            }
            if (a.screen) {
                if (G && le.screen.extensionid != ce && (ue = !0), G && !ue && !i && !le.screen.sourceId) return A("message", s), te || E(), void te.postMessage();
                if (G && ue && !i && "screen" == le.screen.chromeMediaSource && le.screen.extensionid) return le.screen.extensionid == ce ? m(e, n, !0) : (p("checking if chrome extension is installed."), void le.screen.getChromeExtensionStatus(function(t) {
                    "installed-enabled" == t && (le.screen.chromeMediaSource = "desktop"), m(e, n, !0), p("chrome extension is installed?", "desktop" == le.screen.chromeMediaSource)
                }));
                if (G && ue && "desktop" == le.screen.chromeMediaSource && !le.screen.sourceId) return void le.screen.getSourceId(function(t) {
                    if ("PermissionDeniedError" == t) {
                        var i = {
                            message: "User denied to share content of his screen.",
                            name: "PermissionDeniedError",
                            constraintName: l,
                            session: a
                        };
                        return V.mutex = !1, le.screen.chromeMediaSource = "desktop", b.onMediaError(i)
                    }
                    return "No-Response" == t ? (h("Chrome extension seems not available. Make sure that manifest.json#L16 has valid content-script matches pointing to your URL."), le.screen.chromeMediaSource = "screen", m(e, n, !0)) : void m(e, n, !0)
                });
                G && "desktop" == le.screen.chromeMediaSource && (l.video.mandatory.chromeMediaSourceId = le.screen.sourceId);
                var S = C;
                o(l, u.audio || u.video ? function() {
                    S && (C = !0), o(u, e)
                } : e)
            } else o(u, e, a.audio && !a.video)
        }

        function f(e, n, t, i, r, a, d, c, u, m) {
            i || (i = o()), b.onstatechange({
                userid: "browser",
                extra: {},
                name: "usermedia-fetched",
                reason: "Captured user media using constraints: " + g(r)
            }), d && (e = s(e)), b.localStreamids.push(i), e.onended = function() {
                p.mediaElement && !p.mediaElement.parentNode && document.getElementById(e.streamid) && (p.mediaElement = document.getElementById(e.streamid)), b.attachStreams.forEach(function(n, t) {
                    n == e && (delete b.attachStreams[t], b.attachStreams = l(b.attachStreams))
                }), y(p, b), b.streams[i] && b.removeStream(i);
                var n = b.streams[i];
                n && n.sockets.length && n.sockets.forEach(function(e) {
                    e.send({
                        streamid: n.streamid,
                        stopped: !0
                    })
                }), V.mutex = !1, V.streams[t] && delete V.streams[t], le.screen.sourceId = null
            }, Y || (e.streamid = i, e.isScreen = r == c, e.isVideo = r == u && !!u.video, e.isAudio = r == u && !!u.audio && !u.video, e.preMuted = {
                audio: e.getAudioTracks().length && !e.getAudioTracks()[0].enabled,
                video: e.getVideoTracks().length && !e.getVideoTracks()[0].enabled
            });
            var f = w(e, m);
            f.muted = !0;
            var p = {
                stream: e,
                streamid: i,
                mediaElement: f,
                blobURL: f.mozSrcObject ? URL.createObjectURL(e) : f.src,
                type: "local",
                userid: b.userid,
                extra: b.extra,
                session: m,
                isVideo: !!e.isVideo,
                isAudio: !!e.isAudio,
                isScreen: !!e.isScreen,
                isInitiator: !!b.isInitiator,
                rtcMultiConnection: b
            };
            console.log()
            C && b.attachStreams.push(e), 
            C = !1, 
            b.streams[i] = b._getStream(p), 
            n || b.onstream(p), 
            b.setDefaultEventsForMediaElement && b.setDefaultEventsForMediaElement(f, i), 
            a && a(e, p), 
            b.onspeaking && I({
                stream: e,
                streamedObject: p,
                connection: b
            });
        }

        var S, b = this;
        
        b.channel = n || RMCDefaultChannel, b.isAcceptNewSession = !0, b.open = function(e) {
            b.isAcceptNewSession = !1, 
            b.isInitiator = !0;
            var n = !1;
            return e && (d(e) ? b.sessionid = e : (a(e.transmitRoomOnce) || (b.transmitRoomOnce = e.transmitRoomOnce), a(e.dontTransmit) || (n = e.dontTransmit), a(e.sessionid) || (b.sessionid = e.sessionid))), b.socket && b.socket.remove && b.socket.remove(), b.sessionid || (b.sessionid = b.channel), b.sessionDescription = {
                sessionid: b.sessionid,
                userid: b.userid,
                session: b.session,
                extra: b.extra
            }, 
            b.sessionDescriptions[b.sessionDescription.sessionid] || (b.numberOfSessions++, b.sessionDescriptions[b.sessionDescription.sessionid] = b.sessionDescription), i(function() {
                S.captureUserMediaOnDemand = e ? !!e.captureUserMediaOnDemand : !1, e && e.onMediaCaptured && (b.onMediaCaptured = e.onMediaCaptured), S.captureUserMediaOnDemand || m(function() {
                    S.initSession({
                        sessionDescription: b.sessionDescription,
                        dontTransmit: n
                    }), x(b)
                }), S.captureUserMediaOnDemand && S.initSession({
                    sessionDescription: b.sessionDescription,
                    dontTransmit: n
                })
            }), 
            b.sessionDescription
        }, 

        b.connect = function(e) {
            return e && (b.sessionid = e), i(function() {
                p("Signaling channel is ready.")
            }), this
        }, 

        b.join = u, 

        b.send = function(e, n) {
            if( b.numberOfConnectedUsers<=0){
               alert(" Add atleast one connection to share files ");
               return; 
            } 

            /*
            if (b.numberOfConnectedUsers <= 0) 
                return void setTimeout(function() {
                    b.send(e, n)
                }, 1e3);*/

            if (!e) throw "No file, data or text message to share.";
            
            if (e instanceof Array && !a(e[0].size) && !a(e[0].type))
                for (var t = 0; t < e.length; t++) e[t].size && e[t].type && b.send(e[t], n);
            else 
                if (a(e.size) || a(e.type)) 
                    H.send({
                text: e,
                channel: S,
                _channel: n,
                connection: b
                });
                else {
                if (!b.enableFileSharing) throw '"enableFileSharing" boolean MUST be "true" to support file sharing.';
                if (!S.fileBufferReader) return void T(b, function(t) {
                    S.fileBufferReader = t, b.send(e, n)
                });
                var i = k({
                    userid: b.userid
                }, e.extra || b.extra);
                S.fileBufferReader.readAsArrayBuffer(e, function(e) {
                    S.fileBufferReader.getNextChunk(e, function(e, t, i) {
                        n ? n.send(e) : S.send(e)
                    })
                }, i)
                }
        }, 

        b.disconnect = function() {
            S && S.disconnect(), S = null
        };


        var C = !0;
        b.captureUserMedia = m, 
        
        b.leave = function(e) {
            return S ? (C = !0, e ? void b.eject(e) : void S.leave()) : void 0
        }, 
        
        b.eject = function(e) {
            if (!b.isInitiator) throw "Only session-initiator can eject a user.";
            if (!b.peers[e]) throw "You ejected invalid user.";
            b.peers[e].sendCustomMessage({
                ejected: !0
            })
        }, 

        b.close = function() {
            b.autoCloseEntireSession = !0, b.leave()
        }, 

        b.renegotiate = function(e, n) {
            return b.numberOfConnectedUsers <= 0 ? void setTimeout(function() {
                b.renegotiate(e, n)
            }, 1e3) : void S.addStream({
                renegotiate: n || k({
                    oneway: !0
                }, b.session),
                stream: e
            })
        }, 

        b.attachExternalStream = function(e, n) {
            var t = {};
            e.getAudioTracks && e.getAudioTracks().length && (t.audio = !0), e.getVideoTracks && e.getVideoTracks().length && (t.video = !0);
            var i = {
                    video: {
                        chromeMediaSource: "fake"
                    }
                },
                s = n ? i : t;
            f(e, !1, "", null, s, !1, !1, i, t, t)
        }, 

        b.addStream = function(e, n) {
            function t(t) {
                S.addStream({
                    stream: t,
                    renegotiate: e || b.session,
                    socket: n
                })
            }
            if (b.numberOfConnectedUsers <= 0) return void setTimeout(function() {
                b.addStream(e, n)
            }, 1e3);
            if (e) {
                var i;
                !b.isInitiator && e.oneway && (e.oneway = !1, i = !0), m(function(n) {
                    i && (e.oneway = !0), t(n)
                }, e)
            } else t()
        }, 

        b.removeStream = function(e, n) {
            function t(e, n) {
                n.local && "local" != e.type || n.remote && "remote" != e.type || (n.screen && e.isScreen && b.detachStreams.push(e.streamid), n.audio && e.isAudio && b.detachStreams.push(e.streamid), n.video && e.isVideo && b.detachStreams.push(e.streamid), n.audio || n.video || n.screen || b.detachStreams.push(e.streamid), -1 != b.detachStreams.indexOf(e.streamid) && (p("removing stream", e.streamid), y(e, b), n.stop && b.stopMediaStream(e.stream)))
            }
            if (b.numberOfConnectedUsers <= 0) return void setTimeout(function() {
                b.removeStream(e, n)
            }, 1e3);
            if (e || (e = "all"), !d(e) || -1 != e.search(/all|audio|video|screen/gi)) {
                for (var i in b.streams)
                    if (-1 == b._skip.indexOf(i))
                        if (_stream = b.streams[i], "all" == e) t(_stream, {
                            audio: !0,
                            video: !0,
                            screen: !0
                        });
                        else if (d(e)) {
                    var s = {};
                    s[e] = !0, t(_stream, s)
                } else t(_stream, e);
                return void(!n && b.detachStreams.length && b.renegotiate())
            }
            var i = b.streams[e];
            return i ? (b.detachStreams.push(i.streamid), p("removing stream", i.streamid), y(i, b), void(n || b.renegotiate())) : v("No such stream exists. Stream-id:", e)
        }, 

        b.switchStream = function(e) {
            return b.numberOfConnectedUsers <= 0 ? void setTimeout(function() {
                b.switchStream(e)
            }, 1e3) : (b.removeStream("all", !0), void b.addStream(e))
        }, 

        b.sendCustomMessage = function(e) {
            return S && S.defaultSocket ? void S.defaultSocket.send({
                customMessage: !0,
                message: e
            }) : setTimeout(function() {
                b.sendCustomMessage(e)
            }, 1e3)
        }, P(b)
    };


    var N = window.mozRTCPeerConnection || window.webkitRTCPeerConnection,
        F = window.mozRTCSessionDescription || window.RTCSessionDescription,
        _ = window.mozRTCIceCandidate || window.RTCIceCandidate,
        j = {
            mandatory: {},
            optional: []
        },
        V = {
            streams: [],
            mutex: !1,
            queueRequests: []
        },
        B = {
            SaveToDisk: function(e, n) {
                var t = document.createElement("a");
                t.href = e, t.target = "_blank", t.download = n || e;
                var i = new MouseEvent("click", {
                    view: window,
                    bubbles: !0,
                    cancelable: !0
                });
                t.dispatchEvent(i)
            }
        },
        H = {
            send: function(e) {
                function n(e, o) {
                    var r = {
                        type: "text",
                        uuid: m,
                        sendingTime: l
                    };
                    e && (o = e, r.packets = parseInt(o.length / a)), o.length > a ? r.message = o.slice(0, a) : (r.message = o, r.last = !0, r.isobject = u), i.send(r, s), c = o.slice(r.message.length), c.length && setTimeout(function() {
                        n(null, c)
                    }, t.chunkInterval || 100)
                }
                var t = e.connection;
                if (e.text instanceof ArrayBuffer || e.text instanceof DataView) return e.channel.send(e.text, e._channel);
                var i = e.channel,
                    s = e._channel,
                    r = e.text,
                    a = t.chunkSize || 1e3,
                    c = "",
                    u = !1;
                d(r) || (u = !0, r = JSON.stringify(r));
                var m = o(),
                    l = (new Date).getTime();
                n(r)
            }
        },
        W = [],
        q = !!window.opera || navigator.userAgent.indexOf(" OPR/") >= 0,
        z = "undefined" != typeof window.InstallTrigger,
        J = Object.prototype.toString.call(window.HTMLElement).indexOf("Constructor") > 0,
        G = !!window.chrome && !q,
        Y = !!document.documentMode,
        Q = J || Y,
        K = !!navigator.userAgent.match(/Android|iPhone|iPad|iPod|BlackBerry|IEMobile/i),
        X = !!(window.process && "object" == typeof window.process && window.process.versions && window.process.versions["node-webkit"]);
    window.MediaStream = window.MediaStream || window.webkitMediaStream, window.AudioContext = window.AudioContext || window.webkitAudioContext;
    var Z = 50,
        $ = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
    G && $ && $[2] && (Z = parseInt($[2], 10));
    var ee = 50;
    $ = navigator.userAgent.match(/Firefox\/(.*)/), z && $ && $[1] && (ee = parseInt($[1], 10));
    var ne = window.console || {
        log: function() {},
        error: function() {},
        warn: function() {}
    };
    if (G || z || J) var p = ne.log.bind(ne),
        h = ne.error.bind(ne),
        v = ne.warn.bind(ne);
    var te, ie, se, oe = {},
        re = {},
        ae = 'Make sure that you are using Firefox Nightly and you enabled: media.getusermedia.screensharing.enabled flag from about:config page. You also need to add your domain in "media.getusermedia.screensharing.allowed_domains" flag. If you are using WinXP then also enable "media.getusermedia.screensharing.allow_on_old_platforms" flag. NEVER forget to use "only" HTTPs for screen capturing!',
        de = "HTTPs i.e. SSL-based URI is mandatory to use screen capturing.",
        ce = "ldklenbdhlfgplklobfkkmlaedeojdle",
        ue = -1 != document.domain.indexOf("webrtc-experiment.com"),
        me = window.MediaStreamTrack,
        le = {};
    ! function() {
        function e(e) {
            return Q || z ? void(e && e()) : (me && me.getSources && (navigator.getMediaDevices = me.getSources.bind(me)), navigator.getMediaDevices ? void navigator.getMediaDevices(function(n) {
                le.MediaDevices = [], n.forEach(function(e) {
                    "audio" == e.kind && (e.kind = "audioinput"), "video" == e.kind && (e.kind = "videoinput"), e.deviceId || (e.deviceId = e.id), e.id || (e.id = e.deviceId), le.MediaDevices.push(e), ("audioinput" == e.kind || "audio" == e.kind) && (le.hasMicrophone = !0), "audiooutput" == e.kind && (le.hasSpeakers = !0), ("videoinput" == e.kind || "video" == e.kind) && (le.hasWebcam = !0)
                }), e && e()
            }) : (p("navigator.getMediaDevices is undefined."), G && (le.hasMicrophone = !0, le.hasSpeakers = !0, le.hasWebcam = !0), void(e && e())))
        }
        le.hasMicrophone = !1, le.hasSpeakers = !1, le.hasWebcam = !1, le.MediaDevices = [], le.isWebRTCSupported = !!window.webkitRTCPeerConnection || !!window.mozRTCPeerConnection, le.isAudioContextSupported = !(!window.AudioContext && !window.webkitAudioContext || !AudioContext.prototype.createMediaStreamSource), le.isScreenCapturingSupported = G && Z >= 26 && (X ? !0 : "https:" == location.protocol), le.isSctpDataChannelsSupported = !!navigator.mozGetUserMedia || G && Z >= 25, le.isRtpDataChannelsSupported = G && Z >= 31, e(), le.load = e;
        var n;
        le.screen = {
            chromeMediaSource: "screen",
            extensionid: ce,
            getSourceId: function(e) {
                function t(t) {
                    return "installed-enabled" == t ? (n = e, void window.postMessage("get-sourceId", "*")) : (le.screen.chromeMediaSource = "screen", void e("No-Response"))
                }
                if (!e) throw '"callback" parameter is mandatory.';
                le.screen.status ? t(le.screen.status) : le.screen.getChromeExtensionStatus(t)
            },
            onMessageCallback: function(e) {
                if (d(e) || e.sourceId) {
                    if (p("chrome message", e), "PermissionDeniedError" == e) {
                        if (le.screen.chromeMediaSource = "PermissionDeniedError", n) return n("PermissionDeniedError");
                        throw new Error("PermissionDeniedError")
                    }
                    "extension-loaded" == e && (le.screen.chromeMediaSource = "desktop", le.screen.onScreenCapturingExtensionAvailable && (le.screen.onScreenCapturingExtensionAvailable(), le.screen.onScreenCapturingExtensionAvailable = null)), e.sourceId && (le.screen.sourceId = e.sourceId, n && n(le.screen.sourceId))
                }
            },
            getChromeExtensionStatus: function(e, n) {
                function t(e) {
                    le.screen.status = e, n(e)
                }
                if (z) return t("not-chrome");
                2 != arguments.length && (n = e, e = this.extensionid);
                var i = document.createElement("img");
                i.src = "chrome-extension://" + e + "/icon.png", i.onload = function() {
                    le.screen.chromeMediaSource = "screen", window.postMessage("are-you-there", "*"), setTimeout(function() {
                        t("screen" == le.screen.chromeMediaSource ? "desktop" == le.screen.chromeMediaSource ? "installed-enabled" : "installed-disabled" : "installed-enabled")
                    }, 2e3)
                }, i.onerror = function() {
                    t("not-installed")
                }
            }
        }
    }(), 

    window.addEventListener || (window.addEventListener = function(e, n, t) {
        e.attachEvent && e.attachEvent("on" + n, t)
    }), 

    window.addEventListener("message", function(e) {
        e.origin == window.location.origin && le.screen.onMessageCallback(e.data)
    }), 

    attachEventListener = function(e, n, t, i) {
        e.addEventListener(n, t, i)
    };
    
    var fe = window.PluginRTC || {};
    
    window.onPluginRTCInitialized = function(e) {
        fe = e, me = fe.MediaStreamTrack, N = fe.RTCPeerConnection, _ = fe.RTCIceCandidate, F = fe.RTCSessionDescription, p(Q ? "Java-Applet" : "ActiveX", "plugin has been loaded.")
    }, 

    c(fe) || window.onPluginRTCInitialized(fe), 

    Q && M("Plugin.EveryWhere.js")
}();
