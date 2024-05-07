<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Test</h1>

    <script>
        // Function to get URL parameters
        function getUrlParams(url) {
            // Create a URLSearchParams object from the URL
            const params = new URLSearchParams(url.search);
            // Convert URLSearchParams object to a regular object
            const paramsObj = Object.fromEntries(params.entries());
            return paramsObj;
        }

        // Get the current URL
        const currentUrl = new URL(window.location.href);

        // Get parameters from the URL
        const urlParams = getUrlParams(currentUrl);

        // Grab the specific parameters you need
        const sid = urlParams['sid'];
        const hsid = urlParams['hsid'];

        let fid = ""

        if (hsid === "h2a64y6qFrnwr6zlHZdfaw==") {
            fid = "74"
        } else {
            fid = "0"
        }

        console.log(sid, hsid, fid)

        // // Redirect to another page with the parameters
        window.location.href = `https://forms.competestudio.com/${sid}/${fid}`;
    </script>
</body>
</html>
