
var URL = 'https://vision.googleapis.com/v1/images:annotate?key=';


/**
 * Makes a request to the Google Vision API
 * @param APIkey the API key
 * @param imageAs64
 */
function makeRequest(APIkey, imageAs64) {
    //the request to be made to the Google Vision API
    var request = {
        requests: [{
            image: {
                content: imageAs64
            },
            features: [
                {
                    type: "LABEL_DETECTION",
                    maxResults: 10
                },
                {
                    type: "LOGO_DETECTION",
                    maxResults: 10
                },
                {
                    type: "TEXT_DETECTION",
                    maxResults: 10
                }

            ]
        }]
    };

    return $.ajax({
        type: 'POST',
        url: URL + APIkey,
        data: JSON.stringify(request),
        contentType: "application/json",
        dataType: 'json'
    });
}

function displayJSONResults(response) {
    console.log(response);
    console.log(response.responses[0].labelAnnotations[0]);


}
















