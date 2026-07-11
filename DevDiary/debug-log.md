## Day 4

Temperature :BUG parseFloat("12.3.4") = 12.3 (passes validation), but Number("12.3.4") = NaN, so range check and math both silently produce NaN instead of erroring. Same root cause as case 5.

evenNumber:This exceeds Number.MAX_SAFE_INTEGER (2^53−1), so Number() rounds it to an approximate float. The % 2 evenness check can report the wrong parity because the original last digit is lost in the rounding — a genuine precision-loss edge case.


## Day 6

fetch() rejects with TypeError: Failed to fetch before you even get to response.ok. This is caught by your catch, so you should see "Could not load posts." Confirm it doesn't hang on "Loading..." forever.

response.ok is false, so throw new Error(response.status) fires, caught by catch → "Could not load posts." Check the console still logs something useful for you, even though the UI is a generic message.

No timeout logic exists, so "Loading..." just sits indefinitely until the response arrives. Confirm there's no visual issue with a long-held loading state, and check it doesn't fire a second overlapping request if the user navigates or triggers reload again.


## Day 7
        List weather using city name and API

interpolates city raw into the query string instead of encodeURIComponent(city). A city like "New York" becomes q=New York (space breaks the URL), and names with &, #, ?, or non-ASCII characters (São Paulo, Zürich) can get mangled or silently drop part of the query.

        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(city)}&format=json`


only rejects an empty string after trimming. It doesn't cap input length or reject purely numeric/garbage input (e.g., pasting a huge string or emoji), which still gets sent straight into the URL and to Nominatim.


blindly takes location[0], the first Nominatim match. Common city names ("Paris", "Springfield", "Georgia") will silently resolve to whatever the API ranks first, with no disambiguation shown to the user.

## Day 8 (09.07.2026)

Duplicate temp prop is silently dropped. In every card from Madurai onward you have temp={29.8} immediately followed by temp={28.4}. JSX doesn't error on duplicate attributes — the last one wins, so 29.8 is dead code and every affected card actually renders 28.4. Likely not what was intended (probably meant feelsLike or similar).

No fallback for missing/undefined props. WeatherCard never uses defaultProps or default parameter values. If any caller omits a prop (e.g. temp), it renders as a blank string (°C with nothing before it) instead of a placeholder like "--" or "N/A".

time is a raw ISO string, not parsed/formatted. time="2026-07-09T06:30" is printed verbatim (<p>{props.time}</p>). There's no Date parsing, timezone conversion, or locale formatting — if the upstream data format ever changes (e.g. includes seconds, or uses epoch millis), it silently prints garbage instead of a readable time.

## Day 9 (10.07.2026)

### For the weather APP

        Case-sensitive import mismatches will break the production build. weathercard.jsx:1 imports "./WeatherCard.css" but the file on disk is weathercard.css; erro.jsx:1 imports "./Error.css" but the file is error.css. Windows/macOS are case-insensitive so this works locally, but Vite builds on case-sensitive Linux (most CI/Vercel/Netlify) will fail to resolve these imports.

        Geocoding blindly trusts the first result. location[0] (App.jsx:33) is used with no disambiguation — searching "Paris" or "Springfield" silently returns whichever city Nominatim ranks first, which may not be what the user meant. Nominatim's usage policy also requires an identifying User-Agent/referer (api.jsx:2-4); without one, requests can get rate-limited or blocked (HTTP 403) in production.

        





### for TO DO LIST 
         Duplicate task IDs from Date.now() — App.jsx:17
id: Date.now() only has millisecond resolution. Two tasks added fast enough (e.g. holding Enter, or a double-click on "Add") can get the same id. Since toggleTask/deleteTask match on task.id === id (App.jsx:25,31) and TaskList keys on task.id, colliding tasks will toggle/delete together as a pair, and React will warn about duplicate keys.

        Long, unbreakable text overflows the fixed-width container — App.css:50-58, App.css:7-13
.todo-container is a fixed 500px, and .todo-task has no word-break/overflow-wrap. A task with one long unbroken token (a long URL, a hash, "aaaaaaaaaaaaaaaaaaaaaaaaaaaa...") will overflow the box horizontally instead of wrapping, breaking the layout.

        No persistence — App.jsx:9
useState([]) is the only source of truth. Refreshing the page, closing the tab, or navigating away silently wipes the entire list — there's no localStorage/backend save.
