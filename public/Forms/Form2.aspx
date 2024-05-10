<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirect</title>
</head>
<body>
    <h1>Redirecting...</h1>

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

        // Construct the new URL
        const newUrl = `https://forms.competestudio.com/Forms/Form2.aspx?sid=${urlParams['sid']}&hsid=${urlParams['hsid']}&fid=${urlParams['fid']}&hfid=${urlParams['hfid']}`;

        // Redirect to the new URL
        window.location.href = newUrl;
    </script>
</body>
</html>
