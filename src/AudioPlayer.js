import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import BitrateChart from './charts/BitrateChart'; // Assuming you've placed BitrateChart in a separate file
import MtpChart from './charts/MtpChart'; // Assuming you've placed MtpChart in a separate file
import TopBandwidthChart from './charts/TopBandwidthChart'; // New component for Top Bandwidth chart
import parseManifestURL from './ManifestParser'; // Assuming you've placed the ManifestParser file in the same directory
import { v4 as uuidv4 } from 'uuid';

const AudioPlayer = ({ src }) => {
    const audioRef = useRef(null);
    const [url, setUrl] = useState("testURl");
    const [bitrates, setBitrates] = useState([]);
    const [mtps, setMtps] = useState([]);
    const [topBandwidths, setTopBandwidths] = useState([]);

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
                    // Handle errors
                });

                hls.on(Hls.Events.FRAG_LOADING, (event, { frag }) => {
                    const bitrate = hls.levels[frag.level].bitrate;
                    setBitrates(prevBitrates => [...prevBitrates, bitrate]);

                    // Set manifest URL
                    setUrl(frag.baseurl);

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
        <div>
            <audio ref={audioRef} controls></audio>
            <h3>Manifest URL: {url}</h3>
            <BitrateChart bitrates={bitrates} />
            <TopBandwidthChart topBandwidths={topBandwidths} />
            <MtpChart mtps={mtps} />
        </div>
    );
};

export default AudioPlayer;
