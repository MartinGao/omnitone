! function(t, i) {
    if ("object" == typeof exports && "object" == typeof module) module.exports = i();
    else if ("function" == typeof define && define.amd) define([], i);
    else {
        var e = i();
        for (var n in e)("object" == typeof exports ? exports : t)[n] = e[n]
    }
}(this, function() {
    return function(t) {
        function i(n) {
            if (e[n]) return e[n].exports;
            var s = e[n] = {
                exports: {},
                id: n,
                loaded: !1
            };
            return t[n].call(s.exports, s, s.exports, i), s.loaded = !0, s.exports
        }
        var e = {};
        return i.m = t, i.c = e, i.p = "", i(0)
    }([function(t, i, e) {
        /**
         * @license
         * Copyright 2016 Google Inc. All Rights Reserved.
         * Licensed under the Apache License, Version 2.0 (the "License");
         * you may not use this file except in compliance with the License.
         * You may obtain a copy of the License at
         *
         *     http://www.apache.org/licenses/LICENSE-2.0
         *
         * Unless required by applicable law or agreed to in writing, software
         * distributed under the License is distributed on an "AS IS" BASIS,
         * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
         * See the License for the specific language governing permissions and
         * limitations under the License.
         */
        "use strict";
        i.Omnitone = e(1)
    }, function(t, i, e) {
        "use strict";
        var n = {},
            s = e(2),
            o = e(4),
            a = e(5),
            h = e(6),
            c = e(7),
            r = e(8);
        n.loadAudioBuffers = function(t, i) {
            return new Promise(function(e, n) {
                new s(t, i, function(t) {
                    e(t)
                }, n)
            })
        }, n.createFOARouter = function(t, i) {
            return new o(t, i)
        }, n.createFOARotator = function(t) {
            return new a(t)
        }, n.createFOAPhaseMatchedFilter = function(t) {
            return new h(t)
        }, n.createFOAVirtualSpeaker = function(t, i) {
            return new c(t, i)
        }, n.createFOADecoder = function(t, i, e) {
            return new r(t, i, e)
        }, t.exports = n
    }, function(t, i, e) {
        "use strict";

        function n(t, i, e, n, o) {
            this._context = t, this._buffers = new Map, this._loadingTasks = {}, this._resolve = e, this._reject = n, this._progress = o;
            for (var a = 0; a < i.length; a++) {
                var h = i[a];
                if (this._loadingTasks.hasOwnProperty(h.name)) return void s.log("Duplicated filename when loading: " + h.name);
                this._loadingTasks[h.name] = 0, this._loadAudioFile(h)
            }
        }
        var s = e(3);
        n.prototype._loadAudioFile = function(t) {
            var i = new XMLHttpRequest;
            i.open("GET", t.url), i.responseType = "arraybuffer";
            var e = this;
            i.onload = function() {
                200 === i.status ? e._context.decodeAudioData(i.response, function(i) {
                    e._done(t.name, i)
                }, function(i) {
                    s.log("Decoding failure: " + t.url + " (" + i + ")"), e._done(t.name, null)
                }) : (s.log("XHR Error: " + t.url + " (" + i.statusText + ")"), e._done(t.name, null))
            }, i.onerror = function(i) {
                s.log("XHR Network failure: " + t.url), e._done(t.name, null)
            }, i.send()
        }, n.prototype._done = function(t, i) {
            this._loadingTasks[t] = null !== i ? "loaded" : "failed", this._buffers.set(t, i), this._updateProgress(t)
        }, n.prototype._updateProgress = function(t) {
            var i = 0,
                e = 0,
                n = 0;
            for (var s in this._loadingTasks) n++, "loaded" === this._loadingTasks[s] ? i++ : "failed" === this._loadingTasks[s] && e++;
            "function" == typeof this._progress && this._progress(t, i, n), i === n && this._resolve(this._buffers), i + e === n && this._reject(this._buffers)
        }, t.exports = n
    }, function(t, i) {
        "use strict";
        i.log = function() {
            window.console.log.apply(window.console, ["%c[Omnitone]%c " + Array.prototype.slice.call(arguments).join(" ") + " %c(@" + performance.now().toFixed(2) + "ms)", "background: #BBDEFB; color: #FF5722; font-weight: 700", "font-weight: 400", "color: #AAA"])
        }, i.invertMatrix4 = function(t, i) {
            var e = i[0],
                n = i[1],
                s = i[2],
                o = i[3],
                a = i[4],
                h = i[5],
                c = i[6],
                r = i[7],
                _ = i[8],
                l = i[9],
                u = i[10],
                p = i[11],
                g = i[12],
                f = i[13],
                m = i[14],
                d = i[15],
                v = e * h - n * a,
                x = e * c - s * a,
                M = e * r - o * a,
                w = n * c - s * h,
                y = n * r - o * h,
                R = s * r - o * c,
                A = _ * f - l * g,
                F = _ * m - u * g,
                G = _ * d - p * g,
                b = l * m - u * f,
                H = l * d - p * f,
                D = u * d - p * m,
                k = v * D - x * H + M * b + w * G - y * F + R * A;
            return k ? (k = 1 / k, t[0] = (h * D - c * H + r * b) * k, t[1] = (s * H - n * D - o * b) * k, t[2] = (f * R - m * y + d * w) * k, t[3] = (u * y - l * R - p * w) * k, t[4] = (c * G - a * D - r * F) * k, t[5] = (e * D - s * G + o * F) * k, t[6] = (m * M - g * R - d * x) * k, t[7] = (_ * R - u * M + p * x) * k, t[8] = (a * H - h * G + r * A) * k, t[9] = (n * G - e * H - o * A) * k, t[10] = (g * y - f * M + d * v) * k, t[11] = (l * M - _ * y - p * v) * k, t[12] = (h * F - a * b - c * A) * k, t[13] = (e * b - n * F + s * A) * k, t[14] = (f * x - g * w - m * v) * k, t[15] = (_ * w - l * x + u * v) * k, t) : null
        }
    }, function(t, i) {
        "use strict";

        function e(t, i) {
            this._context = t, this._splitter = this._context.createChannelSplitter(4), this._merger = this._context.createChannelMerger(4), this._channelMap = i || n, this._splitter.connect(this._merger, 0, this._channelMap[0]), this._splitter.connect(this._merger, 1, this._channelMap[1]), this._splitter.connect(this._merger, 2, this._channelMap[2]), this._splitter.connect(this._merger, 3, this._channelMap[3]), this.input = this._splitter, this.output = this._merger
        }
        var n = [0, 1, 2, 3];
        e.prototype.setChannelMap = function(t) {
            t && (this._channelMap = t, this._splitter.disconnect(), this._splitter.connect(this._merger, 0, this._channelMap[0]), this._splitter.connect(this._merger, 1, this._channelMap[1]), this._splitter.connect(this._merger, 2, this._channelMap[2]), this._splitter.connect(this._merger, 3, this._channelMap[3]))
        }, t.exports = e
    }, function(t, i) {
        "use strict";

        function e(t) {
            this._context = t, this._splitter = this._context.createChannelSplitter(4), this._inY = this._context.createGain(), this._inZ = this._context.createGain(), this._inX = this._context.createGain(), this._m0 = this._context.createGain(), this._m1 = this._context.createGain(), this._m2 = this._context.createGain(), this._m3 = this._context.createGain(), this._m4 = this._context.createGain(), this._m5 = this._context.createGain(), this._m6 = this._context.createGain(), this._m7 = this._context.createGain(), this._m8 = this._context.createGain(), this._outY = this._context.createGain(), this._outZ = this._context.createGain(), this._outX = this._context.createGain(), this._merger = this._context.createChannelMerger(4), this._splitter.connect(this._inY, 1), this._splitter.connect(this._inZ, 2), this._splitter.connect(this._inX, 3), this._inY.gain.value = -1, this._inX.gain.value = -1, this._inY.connect(this._m0), this._inY.connect(this._m1), this._inY.connect(this._m2), this._inZ.connect(this._m3), this._inZ.connect(this._m4), this._inZ.connect(this._m5), this._inX.connect(this._m6), this._inX.connect(this._m7), this._inX.connect(this._m8), this._m0.connect(this._outY), this._m1.connect(this._outZ), this._m2.connect(this._outX), this._m3.connect(this._outY), this._m4.connect(this._outZ), this._m5.connect(this._outX), this._m6.connect(this._outY), this._m7.connect(this._outZ), this._m8.connect(this._outX), this._splitter.connect(this._merger, 0, 0), this._outY.connect(this._merger, 0, 1), this._outZ.connect(this._merger, 0, 2), this._outX.connect(this._merger, 0, 3), this._outY.gain.value = -1, this._outX.gain.value = -1, this.setRotationMatrix(new Float32Array([1, 0, 0, 0, 1, 0, 0, 0, 1])), this.input = this._splitter, this.output = this._merger
        }
        e.prototype.setRotationMatrix = function(t) {
            this._m0.gain.value = t[0], this._m1.gain.value = t[1], this._m2.gain.value = t[2], this._m3.gain.value = t[3], this._m4.gain.value = t[4], this._m5.gain.value = t[5], this._m6.gain.value = t[6], this._m7.gain.value = t[7], this._m8.gain.value = t[8]
        }, e.prototype.setRotationMatrix4 = function(t) {
            this._m0.gain.value = t[0], this._m1.gain.value = t[1], this._m2.gain.value = t[2], this._m3.gain.value = t[4], this._m4.gain.value = t[5], this._m5.gain.value = t[6], this._m6.gain.value = t[8], this._m7.gain.value = t[9], this._m8.gain.value = t[10]
        }, e.prototype.getRotationMatrix = function() {
            return [this._m0.gain.value, this._m1.gain.value, this._m2.gain.value, this._m3.gain.value, this._m4.gain.value, this._m5.gain.value, this._m6.gain.value, this._m7.gain.value, this._m8.gain.value]
        }, t.exports = e
    }, function(t, i, e) {
        "use strict";

        function n(t, i) {
            var e = Math.tan(Math.PI * t / i),
                n = e * e,
                s = n + 2 * e + 1;
            return {
                lowpassA: [1, 2 * (n - 1) / s, (n - 2 * e + 1) / s],
                lowpassB: [n / s, 2 * n / s, n / s],
                hipassA: [1, 2 * (n - 1) / s, (n - 2 * e + 1) / s],
                hipassB: [1 / s, -2 / s, 1 / s]
            }
        }

        function s(t) {
            if (this._context = t, this._input = this._context.createGain(), this._context.createIIRFilter) {
                var i = n(a, this._context.sampleRate);
                this._lpf = this._context.createIIRFilter(i.lowpassB, i.lowpassA), this._hpf = this._context.createIIRFilter(i.hipassB, i.hipassA)
            } else o.log("IIR filter is missing. Using Biquad filter instead."), this._lpf = this._context.createBiquadFilter(), this._hpf = this._context.createBiquadFilter(), this._lpf.frequency.value = a, this._hpf.frequency.value = a, this._hpf.type = "highpass";
            this._splitterLow = this._context.createChannelSplitter(4), this._splitterHigh = this._context.createChannelSplitter(4), this._gainHighW = this._context.createGain(), this._gainHighY = this._context.createGain(), this._gainHighZ = this._context.createGain(), this._gainHighX = this._context.createGain(), this._merger = this._context.createChannelMerger(4), this._input.connect(this._hpf), this._hpf.connect(this._splitterHigh), this._splitterHigh.connect(this._gainHighW, 0), this._splitterHigh.connect(this._gainHighY, 1), this._splitterHigh.connect(this._gainHighZ, 2), this._splitterHigh.connect(this._gainHighX, 3), this._gainHighW.connect(this._merger, 0, 0), this._gainHighY.connect(this._merger, 0, 1), this._gainHighZ.connect(this._merger, 0, 2), this._gainHighX.connect(this._merger, 0, 3), this._input.connect(this._lpf), this._lpf.connect(this._splitterLow), this._splitterLow.connect(this._merger, 0, 0), this._splitterLow.connect(this._merger, 1, 1), this._splitterLow.connect(this._merger, 2, 2), this._splitterLow.connect(this._merger, 3, 3);
            var e = this._context.currentTime;
            this._gainHighW.gain.setValueAtTime(-1 * h[0], e), this._gainHighY.gain.setValueAtTime(-1 * h[1], e), this._gainHighZ.gain.setValueAtTime(-1 * h[2], e), this._gainHighX.gain.setValueAtTime(-1 * h[3], e), this.input = this._input, this.output = this._merger
        }
        var o = e(3),
            a = 690,
            h = [1.4142, .8166, .8166, .8166];
        t.exports = s
    }, function(t, i) {
        "use strict";

        function e(t, i) {
            if (2 !== i.IR.numberOfChannels) throw "IR does not have 2 channels. cannot proceed.";
            this._active = !1, this._context = t, this._input = this._context.createChannelSplitter(4), this._cW = this._context.createGain(), this._cY = this._context.createGain(), this._cZ = this._context.createGain(), this._cX = this._context.createGain(), this._convolver = this._context.createConvolver(), this._gain = this._context.createGain(), this._input.connect(this._cW, 0), this._input.connect(this._cY, 1), this._input.connect(this._cZ, 2), this._input.connect(this._cX, 3), this._cW.connect(this._convolver), this._cY.connect(this._convolver), this._cZ.connect(this._convolver), this._cX.connect(this._convolver), this._convolver.connect(this._gain), this._gain.connect(this._context.destination), this.enable(), this._convolver.normalize = !1, this._convolver.buffer = i.IR, this._gain.gain.value = i.gain, this._cW.gain.value = i.coefficients[0], this._cY.gain.value = i.coefficients[1], this._cZ.gain.value = i.coefficients[2], this._cX.gain.value = i.coefficients[3], this.input = this._input
        }
        e.prototype.enable = function() {
            this._gain.connect(this._context.destination), this._active = !0
        }, e.prototype.disable = function() {
            this._gain.disconnect(), this._active = !1
        }, t.exports = e
    }, function(t, i, e) {
        "use strict";

        function n(t, i, e) {
            this._isDecoderReady = !1, this._context = t, this._videoElement = i, this._decodingMode = "ambisonic", this._postGainDB = p, this._HRTFSetUrl = u, this._channelMap = g, e && (e.postGainDB && (this._postGainDB = e.postGainDB), e.HRTFSetUrl && (this._HRTFSetUrl = e.HRTFSetUrl), e.channelMap && (this._channelMap = e.channelMap)), this._speakerData = [];
            for (var n = 0; n < r.length; ++n) this._speakerData.push({
                name: r[n].name,
                url: this._HRTFSetUrl + "/" + r[n].url,
                coef: r[n].coef
            });
            this._tempMatrix4 = new Float32Array(16)
        }
        var s = e(2),
            o = e(4),
            a = e(5),
            h = e(6),
            c = e(7),
            r = e(9),
            _ = e(3),
            l = e(10),
            u = "https://raw.githubusercontent.com/google/spatial-media/master/support/hrtfs/cube/",
            p = 0,
            g = [0, 1, 2, 3];
        n.prototype.initialize = function() {
            _.log("Version: " + l), _.log("Initializing... (mode: " + this._decodingMode + ")");
            var t = this._channelMap.toString();
            t !== g.toString() && _.log("Remapping channels ([0,1,2,3] -> [" + t + "])"), this._audioElementSource = this._context.createMediaElementSource(this._videoElement), this._foaRouter = new o(this._context, this._channelMap), this._foaRotator = new a(this._context), this._foaPhaseMatchedFilter = new h(this._context), this._audioElementSource.connect(this._foaRouter.input), this._foaRouter.output.connect(this._foaRotator.input), this._foaRotator.output.connect(this._foaPhaseMatchedFilter.input), this._foaVirtualSpeakers = [], this._bypass = this._context.createGain(), this._audioElementSource.connect(this._bypass);
            var i = Math.pow(10, this._postGainDB / 20);
            _.log("Gain compensation: " + i + " (" + this._postGainDB + "dB)");
            var e = this;
            return new Promise(function(t, n) {
                new s(e._context, e._speakerData, function(n) {
                    for (var s = 0; s < e._speakerData.length; ++s) e._foaVirtualSpeakers[s] = new c(e._context, {
                        coefficients: e._speakerData[s].coef,
                        IR: n.get(e._speakerData[s].name),
                        gain: i
                    }), e._foaPhaseMatchedFilter.output.connect(e._foaVirtualSpeakers[s].input);
                    e.setMode(e._decodingMode), e._isDecoderReady = !0, _.log("HRTF IRs are loaded successfully. The decoder is ready."), t()
                }, n)
            })
        }, n.prototype.setRotationMatrix = function(t) {
            this._foaRotator.setRotationMatrix(t)
        }, n.prototype.setRotationMatrixFromCamera = function(t) {
            _.invertMatrix4(this._tempMatrix4, t.elements), this._foaRotator.setRotationMatrix4(this._tempMatrix4)
        }, n.prototype.setMode = function(t) {
            if (t !== this._decodingMode) {
                switch (t) {
                    case "bypass":
                        this._decodingMode = "bypass";
                        for (var i = 0; i < this._foaVirtualSpeakers.length; ++i) this._foaVirtualSpeakers[i].disable();
                        this._bypass.connect(this._context.destination);
                        break;
                    case "ambisonic":
                        this._decodingMode = "ambisonic";
                        for (var i = 0; i < this._foaVirtualSpeakers.length; ++i) this._foaVirtualSpeakers[i].enable();
                        this._bypass.disconnect();
                        break;
                    case "off":
                        this._decodingMode = "off";
                        for (var i = 0; i < this._foaVirtualSpeakers.length; ++i) this._foaVirtualSpeakers[i].disable();
                        this._bypass.disconnect()
                }
                _.log("Decoding mode changed. (" + t + ")")
            }
        }, t.exports = n
    }, function(t, i) {
        var e = [{
            name: "E35.26_A135",
            url: "E35.26_A135_D1.4.wav",
            gainFactor: 1,
            coef: [.125, .216495, .21653, -.216495]
        }, {
            name: "E35.26_A-135",
            url: "E35.26_A-135_D1.4.wav",
            gainFactor: 1,
            coef: [.125, -.216495, .21653, -.216495]
        }, {
            name: "E-35.26_A135",
            url: "E-35.26_A135_D1.4.wav",
            gainFactor: 1,
            coef: [.125, .216495, -.21653, -.216495]
        }, {
            name: "E-35.26_A-135",
            url: "E-35.26_A-135_D1.4.wav",
            gainFactor: 1,
            coef: [.125, -.216495, -.21653, -.216495]
        }, {
            name: "E35.26_A45",
            url: "E35.26_A45_D1.4.wav",
            gainFactor: 1,
            coef: [.125, .216495, .21653, .216495]
        }, {
            name: "E35.26_A-45",
            url: "E35.26_A-45_D1.4.wav",
            gainFactor: 1,
            coef: [.125, -.216495, .21653, .216495]
        }, {
            name: "E-35.26_A45",
            url: "E-35.26_A45_D1.4.wav",
            gainFactor: 1,
            coef: [.125, .216495, -.21653, .216495]
        }, {
            name: "E-35.26_A-45",
            url: "E-35.26_A-45_D1.4.wav",
            gainFactor: 1,
            coef: [.125, -.216495, -.21653, .216495]
        }];
        t.exports = e
    }, function(t, i) {
        "use strict";
        t.exports = "0.1.8"
    }])
});
