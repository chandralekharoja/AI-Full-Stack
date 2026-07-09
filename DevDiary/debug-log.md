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