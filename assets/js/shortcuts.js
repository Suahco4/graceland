(function(){
    let alignContent = function(event) {
        // Check if the Control key is pressed and the 'L' key (key code 76) is pressed
        if (event.ctrlKey && event.shiftKey && event.key === 'L' || event.ctrlKey && event.shiftKey && event.key === 'l') {
            event.preventDefault();
            let selectedValue = "Left"
        
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
            sendSettingsChannel.close();
        }
        if (event.ctrlKey && event.shiftKey && event.key === 'R' || event.ctrlKey && event.shiftKey && event.key === 'r') {
            event.preventDefault(); 

            let selectedValue = "Right";
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
            sendSettingsChannel.close();
        }
        if (event.ctrlKey && event.shiftKey && event.key === 'E' || event.ctrlKey && event.shiftKey && event.key === 'e') {
            event.preventDefault(); 
            let selectedValue = "Center"
        
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
            sendSettingsChannel.close();
        }
        if (event.ctrlKey && event.shiftKey && event.key === 'J' || event.ctrlKey && event.shiftKey && event.key === 'j') {
            event.preventDefault();
            let selectedValue = "Justify"
        
            let sendSettingsChannel = new BroadcastChannel("settings");
            sendSettingsChannel.postMessage({ selectedTextAlignment: selectedValue });
            sendSettingsChannel.close();
        }
    }

    document.addEventListener('keydown', alignContent);
})();
