if (window.WebSocket) {
    var serviceUrl = "ws://127.0.0.1:3337/streamlabs";
    socket = null;

    if (typeof API_Key === "undefined") {
        $("body").html("Error: No API Key was found in the directory!<br>Rightclick on the Script in Chatbot and select 'Insert API Key'");
    }

    function Connect() {
        socket = new WebSocket(serviceUrl);

        socket.onopen = function() {
            var auth = {
                author: "Brain",
                website: "http://www.brains-world.eu",
                api_key: API_Key,
                events: [
                    "EVENT_INIT_THEME"
                ]
            };
            socket.send(JSON.stringify(auth));
            console.log("Theme Loader connected");
        };

        socket.onmessage = function(message) {
            var jsonObject = JSON.parse(message.data);
            if (jsonObject.event == "EVENT_INIT_THEME") {
                SetThemeForOverlay(JSON.parse(jsonObject.data).themeName);
            } else if (settings.overlayThemeName !== "") {
                SetThemeForOverlay(settings.overlayThemeName);
            } else {
                SetThemeForOverlay("Streamlabs");
                console.log("No theme selected. Load default 'Streamlabs'.");
            }
        };

        socket.onerror = function(error) {
            console.log("Error: " + error);
        };

        socket.onclose = function() {
            console.log("Connection closed");
            socket = null;
            setTimeout(function() { connectWebSocket() }, 5000);
        };
    }

    Connect();

    function SetThemeForOverlay(name) {
        console.log("Selected Theme: " + name);
        console.log("Selected Language: " + settings.overlayLanguage);
        document.getElementById('themeBody').innerHTML = "<iframe src='" + name + "/index.html' width='100%' height='100%' frameborder='0' scrolling='no'></iframe>";
    }
}