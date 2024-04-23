// manifestParser.js

// Method to parse the manifest URL and extract the mtp value
const parseManifestURL = (manifestURL) => {
    const urlParams = new URLSearchParams(manifestURL.split('?')[1]);
    const cmcdParam = decodeURIComponent(urlParams.get('CMCD'));
    const mtpMatch = cmcdParam.match(/mtp=(\d+)/);
    const mtp = mtpMatch ? parseInt(mtpMatch[1]) : null;
    console.log('Parsed MTP:', mtp);
    return mtp;
};

export default parseManifestURL;
