import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import BitrateChart from './charts/BitrateChart';
import MtpChart from './charts/MtpChart';
import TopBandwidthChart from './charts/TopBandwidthChart';
import parseManifestURL from './ManifestParser';
import BufferStallChart from './charts/BufferStallChart';
import { v4 as uuidv4 } from 'uuid';

const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const [url, setUrl] = useState("testURl");
    const [bitrates, setBitrates] = useState([]);
    const [mtps, setMtps] = useState([]);
    const [topBandwidths, setTopBandwidths] = useState([]);
    const [bufferStalls, setBufferStalls] = useState([]);

    useEffect(() => {
        const audio = audioRef.current;
        let hls;

        if (audio) {
            if (Hls.isSupported()) {
                const sessionId = uuidv4();
                hls = new Hls({
                    cmcd: {
                        sessionId: sessionId,
                        contentId: 'your-content-id',
                        useHeaders: false,
                    },
                });
                hls.loadSource(src);
                hls.attachMedia(audio);
                hls.on(Hls.Events.MANIFEST_PARSED, function () {
                    audio.play();
                });

                hls.on(Hls.Events.ERROR, function (event, data) {
                    if (data.details === Hls.ErrorDetails.BUFFER_STALLED_ERROR) {
                        const stallTime = new Date().getTime();
                        setBufferStalls(prevStalls => [...prevStalls, stallTime]);
                    }
                });

                hls.on(Hls.Events.FRAG_LOADING, (event, { frag }) => {
                    const bitrate = hls.levels[frag.level].bitrate;
                    setBitrates(prevBitrates => [...prevBitrates, bitrate]);

                    // Set manifest URL
                    setUrl(frag.baseurl);
                    console.log("TTFB: " + hls.ttfbEstimate.toFixed(3))
                    // Parse manifest URL to extract MTP
                    const mtpValue = parseManifestURL(frag.baseurl);
                    setMtps(prevMtps => [...prevMtps, mtpValue]);

                    // Get top bandwidth
                    const activeFrag = hls.streamController.fragCurrent;
                    const topBandwidth = hls.cmcdController.getTopBandwidth(activeFrag);
                    setTopBandwidths(prevTopBandwidths => [...prevTopBandwidths, topBandwidth]);
                });
            } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
                audio.src = src;
                audio.addEventListener('loadedmetadata', function () {
                    audio.play();
                });
            }
        }

        // Cleanup
        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [src]);

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <audio ref={audioRef} controls style={{ marginBottom: '20px' }}></audio>
            <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Manifest URL: {url}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: '40px' }}>
                <div style={{ flex: '1', marginRight: '10px' }}>
                    <BitrateChart bitrates={bitrates} />
                </div>
                <div style={{ flex: '1', marginLeft: '10px' }}>
                    <TopBandwidthChart topBandwidths={topBandwidths} />
                </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                <div style={{ flex: '1', marginRight: '10px' }}>
                    <MtpChart mtps={mtps} />
                </div>
                <div style={{ flex: '1', marginLeft: '10px' }}>
                    <BufferStallChart bufferStalls={bufferStalls} />
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;
