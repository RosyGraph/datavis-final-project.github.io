# Feedback Recieved
From Chris De Freitas, Tanner Benedict, and Evan Colt

* How can you vizualize the growth when there are few titles or publisher
* Who is the target audience? Executives/salespeople in the videogame industry
* The dashboard is very busy; how can you reduce the clutter?
    + Dropdowns could disappear when selected
    + Possible splash screen
* What is the story your visualization is trying to tell?
* Could your visualization scale with larger datasets?
    + Yes, but bar charts could become cluttered with too many categories
* How are you using color? It could be useful to separate regions using colors.
    + We haven't discussed visual styling so far (color palette for example)
* Are there any embellishments you want to add?
    + Possible bar chart using consoles / game titles as the bars
    + Possible word cloud for titles
* What type of interaction is available in your viz?
    + Mostly dropdowns
    + Animation would help to make it more interesting
    + Suggestion: search box
* What views are available in your viz?
    + Right now, there is just the main bar chart view
    + Possible histogram enabled by search / select

# Feedback Given
From Dominic Malouf, Chris Stevenson, and Karl Buckley

Avalanche data is poorly organized and visualized. They want to make the vizualizations consumable for everyone, and they want to provide better info to government entities. The dataset is split into
* Description of individual avalanches
* Some free-text responses given by observers and officials

The dataset is very large (6,300 rows). There is are a lot of empty entries. They want to categorize by region (SLC, Logan, etc.), by time period, and other categoricals. The data is going to require some unit conversion (ft, inches, for example). There is going to be some mapping from radio button text to Booleans, but nothing major. The difficult part is processing the free-text responses.

The first draft was a map of avalanche regions. The second draft uses a time slider which can be used as a single time period or a time slice. The time slider may also animate visualization progress for the selected range. The other designs use complex markers to show whether someone died or was injured (color) and orientation of the avalanche. It also uses a word cloud for the free-text. Further, it uses a heatmap of Utah showing the most active avalanche regions.

The viz has a large view panel which "blows up" to a bunch of little views. The slider would update each graph on the viz.

* Where will you obtain the map for your viz? Can you incorporate elevation somehow?
    + Google Maps
* How useful is the cyclical representation for non-winter months?
* Will there be any interaction with the heatmap and word cloud?
    + Possible click to bring up reports
    + Possible hover over
* What are the must-have elements of you viz?
    + The main map view of the final draft
* What is the story your visualization is trying to tell?
* Is there anything else the current viz does well?
    + The current viz has danger ratings given by experts
* Could your viz incorporate the danger ratings if you had access to them?
    + It is updated in real time; so, it would be difficult to pull it
* Who is your target audience?
    + Potential hikers looking at the Utah Avalanche Center's current viz
* Could your visualization scale with larger datasets?
* How are you using color? It could be useful to separate regions using colors.
* Are there any embellishments you want to add?
* What type of interaction is available in your viz?
* What views are available in your viz?
