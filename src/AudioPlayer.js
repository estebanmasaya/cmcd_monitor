import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import BitrateChart from './charts/BitrateChart';
import MtpChart from './charts/MtpChart';
import TopBandwidthChart from './charts/TopBandwidthChart';
import parseManifestURL from './ManifestParser';
import BufferStallChart from './charts/BufferStallChart';
import TTFBChart from './charts/TTFBChart';
import { v4 as uuidv4 } from 'uuid';
import BandwidthChart from './charts/BandwithChart';
import TPandBRChart from './charts/TPandBRChart';


const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const [url, setUrl] = useState("testURl");
    const [bitrates, setBitrates] = useState([]);
    const [mtps, setMtps] = useState([]);
    const [topBandwidths, setTopBandwidths] = useState([]);
    const [bufferStalls, setBufferStalls] = useState([]);
    const [ttfbValues, setTTFBValues] = useState([]);
    const [bandwidthValues, setBandwidthValues] = useState([]);

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
                        const now = new Date();
                        console.log(`Stall Time is: ${now.toLocaleTimeString('en-US', { hour12: false })}.${now.getMilliseconds()}}`)
                        setBufferStalls(prevStalls => [...prevStalls, stallTime]);
                    }
                });

                hls.on(Hls.Events.FRAG_LOADING, (event, { frag }) => {
                    const bitrate = hls.levels[frag.level].bitrate;
                    setBitrates(prevBitrates => [...prevBitrates, bitrate]);

                    // Set manifest URL
                    setUrl(frag.baseurl);
                    //console.log("TTFB: " + hls.ttfbEstimate.toFixed(3))
                    //console.log("BANDWIDTH E: " + hls.bandwidthEstimate)

                    // Bandwith b
                    const bandwidth = hls.bandwidthEstimate/1000;
                    setBandwidthValues(prevValues => [...prevValues, bandwidth]);

                    // TTFB
                    const ttfb = hls.ttfbEstimate.toFixed(3);
                    setTTFBValues(prevValues => [...prevValues, ttfb]);

                    // mtp
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
        <div style={{ maxWidth: '60%', margin: '0 auto' }}>
            <audio ref={audioRef} controls style={{ marginBottom: '20px' }}></audio>
            {/*<h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Manifest URL: {url}</h3>*/}
                <div style={{ display: 'flex', marginLeft: '10px', justifyContent: 'center' }}>
                    <TPandBRChart bitrates={bitrates} topBandwidths={topBandwidths} />
                </div>
                <div style={{ display: 'flex', marginRight: '10px', justifyContent: 'center' }}>
                    <MtpChart mtps={mtps} />
                </div>
                <div style={{ display: 'flex', marginLeft: '10px', justifyContent: 'center' }}>
                    <BandwidthChart bandwidthValues={bandwidthValues} />
                </div>
                <div style={{ display: 'flex', marginLeft: '10px', justifyContent: 'center' }}>
                    <TTFBChart ttfbValues={ttfbValues} />
                </div>
                <div style={{ display: 'flex', marginLeft: '10px', justifyContent: 'center' }}>
                    <BufferStallChart bufferStalls={bufferStalls} />
                </div>
                
        </div>
    );
};

export default AudioPlayer;
