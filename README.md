# RtGs (Route to Gas station)

This web app helps finding the nearest gas stations at any location.
It uses:
- geolocation, or search by provided data for the location search
- places (gas stations) search by the location
- service workers and online first approach
It creates:
- route to the chosen gas station (and show it at the map)
- step by step direction for getting there
- street view for guessing how the final destination looks like
Also, it provides:
- text (step by step directions) to speach
- notifications (with window.notification service) for the desktop users - just for getting the directions spoken one by one after the notification click

The project is created with Angular framework, using yoman and grunt for task automation.

Have a nice time using the project and let me know if you have any ideas how to make it better.

## Build & development

Run `grunt build`, and `grunt serve dist` for project preview (with minified assets).
