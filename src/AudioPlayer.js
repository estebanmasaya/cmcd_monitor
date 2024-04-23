import React, {useEffect, useRef, useState} from 'react';
import Hls from 'hls.js';
import { v4 as uuidv4 } from 'uuid';

const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const [url, setUrl] = useState("testURl");
    useEffect(() => {
        const audio = audioRef.current;
        let hls;

        if (audio) {
            if (Hls.isSupported()) {
                // Generate a unique session ID for CMCD
                const sessionId = uuidv4();
                hls = new Hls({
                    cmcd: {
                        sessionId: sessionId, // Use the generated session ID
                        contentId: 'your-content-id', // Replace with your actual content ID
                        useHeaders: false,
                    },
                    //debug: true
                });
                hls.loadSource(src);
                hls.attachMedia(audio);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    audio.play();
                });


                hls.on(Hls.Events.ERROR, function (event, data) {
                    var errorType = data.type;
                    var errorDetails = data.details;
                    var errorFatal = data.fatal;

                    switch (data.details) {
                        case Hls.ErrorDetails.BUFFER_STALLED_ERROR:
                            //console.log("BUFFER STALLED!")
                        case Hls.ErrorDetails.BUFFER_NUDGE_ON_STALL:
                            //console.log("BuFFer Nudge on stall")
                            break;
                        default:
                            break;
                    }
                });

                hls.on(Hls.Events.FRAG_LOADING, (event, { frag }) => {
                    //if (frag.type === 'main') {
                        //console.log(`Loading fragment ${frag.sn} at quality level ${frag.level} , ${frag.url}`);

                        setUrl(frag.sn + " " + frag.baseurl);
                        //console.log("TTFB: " + hls.ttfbEstimate.toFixed(3))
                    var lastCurrentTime = hls.streamController.lastCurrentTime
                    var activeFrag = hls.streamController.fragCurrent

                        console.log(`URL E ${frag.baseurl}`)
                        console.log(`br ${hls.levels[frag.level].bitrate}`)



                    //}
                });


            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                audio.src = src;
                audio.addEventListener('loadedmetadata', function () {
                    audio.play();
                });
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <div>
            <audio ref={audioRef} controls></audio>
            <h3> {url} </h3>
        </div>

    );
};

export default AudioPlayer;
