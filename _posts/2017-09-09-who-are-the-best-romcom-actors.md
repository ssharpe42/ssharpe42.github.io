---
title: Who Are the Best Romcom Actors?
date: 2017-09-09T08:11:51-05:00
layout: post
permalink: /who-are-the-best-romcom-actors/
cover-img: /assets/img/who-are-the-best-romcom-actors/romcom2.jpeg
thumbnail-img: /assets/img/who-are-the-best-romcom-actors/romcom-thumbnail.png
share-img: /assets/img/who-are-the-best-romcom-actors/romcom2.jpeg
categories:
  - nothing
tags:
  - basketball
  - movie
  - plus-minus
  - regularization
  - romcom
---
I'm going to admit it up front. I don't hate romantic comedies. Love Actually could be one of the best movies ever made. Whether it's the storyline, the writing, the directing, the music, or the acting, sometimes a good romantic comedy is just the thing we need on cold winter night by the fire. I'm here to talk about one sliver of the formula: the actors and actresses. We all know the group of actors that show up in romcom after romcom. Is that the reason we keep coming back? The adept acting of Meryl Streep? The irresistible good looks of Bradley Cooper? Whatever the reasons are, I haven't figured them out. While I can't tell you _why_ we like a specific actor, I dug deep into the data to prepare myself to tell you which actors we value the most (and the least).

Before I get started, I want to switch gears for a second to basketball to provide my reasoning behind the method I used. Don't worry, it will all make sense soon.

Plus-Minus (PM) is a common NBA metric used to assess player ability through a team oriented lens. Instead of a metric that focuses solely on the points scored by a single player, PM quantifies how much a team outscores their opponents when a specific player is on the court. However, PM has flaws. For example, if a player often plays with elite players like Lebron James, their PM would obviously be higher than average players who didn't have the fortune of playing with elite scorers. Wayne Winston and Jeff Sagarin created Adjusted Plus Minus (APM), a regression technique predicting point differential taking into account home/away bias and the other players on the court  in a specific time segment to attempt to address this issue. Again, issues with collinearity (i.e., players that tend to be on the court at the same time), especially with players that play fewer minutes in a season, produce unstable and often incorrect results. Finally, Joseph Still [proposed a new method](http://www.sloansportsconference.com/wp-content/uploads/2015/09/joeSillSloanSportsPaperWithLogo.pdf): Regularized Adjusted Plus Minus (RAPM).

RAPM is essentially the same as APM except RAPM utilizes a common technique to combat collinearity in data. Regularization poses a practical prior assumption on the coefficients/plus-minus ratings of a player: their APM is average or, in other words, their coefficient is 0.  In math terms, regression minimizes squared residuals (i.e. the error between what the model says and what actually happened), but regularized regression simultaneously minimizes the size of players' coefficients weighted with a certain penalty. _Why does this help us?_ The players with "inflated" APM that only play a couple minutes a game, but always play with Lebron James, Dwane Wade etc, will now have a RAPM closer to 0. Since these "coattail" players don't play much, their effect on the total error in the model is extremely small, but since they often play with skilled players, their coefficient is large. A short amount of playing time provides little evidence to suggest coattail players should be deemed skilled by RAPM, so the prior assumption of average skills forces their RAPM closer to 0. So how does all this apply to romantic comedies?

Hopefully, you have already drawn similarities between basketball and movies.  Much like basketball has many key players that switch in and out of games over a season, romcoms have different actors, some appearing together in multiple movies. The same collinearity concept appears in movies when two or more main actors appear in movies together.

The basketball to romcom comparison is not seamless. Romcoms don't have score differentials for specific scenes like basketball has for possessions. There are two parts to this disparity: 1) Scores for scenes, and 2) Actors' screen time per scene. While specific scenes aren't rated by the public, there are endless movie ratings available online that should be sufficient to derive latent actor ratings. Since we don't have per-scene movie ratings, actors' per-scene screen time wouldn't be all that useful. However, actor screen time is still an import element of quantifying an actor's "value" since actors that only say a line or two don't have lasting impressions that influence viewers' ratings. Estimating screen time would require parsing all the movie scripts and counting the number of words for each actor. That is a project for another day. To combat some of the value lost with the all or nothing approach to movie based ratings, I include only actors from the top 10 of the closing credits. This allows only actors with meaningful screen time to appear in the model. Most importantly, actors aren't everything. While the home team advantage has a small effect in basketball, numerous other factors influence movie ratings. I made sure to include these elements in my data collection and analysis.

I scraped IMDb data from the top 200 romantic comedies according to trusty IMDb user [jw32](http://www.imdb.com/list/ls059288416/?start=1&view=compact&sort=listorian:asc&defaults=1&scb). Movies on the list range between 1983 and 2014, and certainly cover all of my favorites. I gathered all the useful information about each movie: IMDb ratings by gender, number of votes, actors, plots, years, directors, writers, sub genres, content ratings, budgets, production companies, and movie duration. Let's explore some of that data.

Unsurprisingly, females rate movies higher than males.

<img src="/assets/img/who-are-the-best-romcom-actors/malevsfemale1.png" width="90%" and height="90%" class="center">

However, when we look at the movie's content ratings males rate R-rated movies similarly. I don't want to jump to any conclusions, but it's probably because there is less mushy romance and more...well more R-rated scenes.

<img src="/assets/img/who-are-the-best-romcom-actors/contentdistribution.png" width="90%" and height="90%" class="center">

We see a slightly negative but insignificant relationship between IMDb ratings and movie budgets. Budget may matter more in fantasy or action movies with the need for more elaborate visual effects.

<img src="/assets/img/who-are-the-best-romcom-actors/budget.png" width="90%" and height="90%" class="center">

The data illustrates a slightly stronger relationship between movie times and IMDb rating. I usually associate short mainstream movies with poorly rated movies, like this years Emoji Movie (that I did not see) that lasts a whopping 1 hour and 26 minutes (and has an 8% rotten tomatoes rating). Maybe some lackluster movies try add fluff to reach an acceptable time length.

<img src="/assets/img/who-are-the-best-romcom-actors/time1.png" width="90%" and height="90%" class="center">

Finally, something a bit more meaningful surfaces when we look at the number of ratings for a particular movie. In general, more people tend to rate movies on IMDb when they enjoy them.

<img src="/assets/img/who-are-the-best-romcom-actors/votes-1.png" width="90%" and height="90%" class="center">

Besides the writers, directors, and production companies, the sub-genre and themes of the movie are the last elements that should be captured in the model. While the sub-genre is easy to capture — it's listed on IMDb's website — the themes of the movie are harder to extract. This is where we need the movie plot!  Besides watching a trailer, the plot is next best way to decide to watch a movie because we can get a sense of what it's about. Consider the following IMDb plot:


> After a little white lie about losing her virginity gets out, a clean cut high school girl sees her life paralleling Hester Prynne's in "The Scarlet Letter," which she is currently studying in school &#8211; until she decides to use the rumor mill to advance her social and financial standing.

You probably recognized the story — it's Easy A. All we need to see are words like _high school, study, social,_ and _girl_ to suspect that the movie is about high school social life. To incorporate these themes into the model, I utilized Latent Semantic Indexing which essentially maps words to a "topic space." I'll spare you the math lecture, but with this technique we can represent the thousands of different words in the 200 romcom plots in very few dimensions. Shrinking from thousands of dimensions to two, we can already see movies[^1] with the distinct themes of _high school_ (green) and _weddings_(blue) cluster into their respective groups.

[^1]: I only included a small sample of the romcoms to make the plot more readable.



<img src="/assets/img/who-are-the-best-romcom-actors/topics1.png" width="90%" and height="90%" class="center">

While romcom plus-minus (RC-PM) ratings take into account many of the elements mentioned above, these ratings might not exactly mimic viewers' opinions of actors' added value to romcoms. RC-PM might also partially represent the tendency of actors and actresses to constantly star in bad romcoms with unestablished directors and writers. Only directors and writers (and production companies) with consistently bad romcoms will divert a majority of the "blame" away from actors and absorb the effects in the model.

Below are the top 10 and bottom 10 actors by RC-PM. I only consider the RC-PM output for actors that appeared in at least 4 of the 200 romcoms as an additional adjustment to eliminate anomalies due to the lack of a screen time metric. Since IMDb rating distributions were quite different for males and females, RC-PM ratings are gender specific. The overall rating is the average of the male and female RC-PM.

<img src="/assets/img/who-are-the-best-romcom-actors/topbottom10.png" width="100%" and height="100%" class="center">

Examining the top and bottom RC-PMs, the magnitude of individual ratings are extremely different. The worst romcom actor, Fred Willard, is more than three times as bad as the number one actress, Rachel McAdams, is good[^2]. Thus, Romcoms can only marginally improve IMDb ratings with top RC-PM rated actors. Maybe that's why Hollywood tends to stack the credits with a ton of A-list actors.

[^2]: Both appeared in 4 romantic comedies.

I have included the full list of 49 actors and actresses with male, female, and overall RC-PM ratings. I agree with the ranking of Rachel McAdams and Sarah Jessica Parker, but there are certainly many in-between that could move up a couple spots. Let me know what you think. As always, if you are interested in the code behind RC-PM, you can find it [here](https://github.com/ssharpe42/RomComPlusMinus). 

<!-- <script type="text/javascript" class="init">

    $(document).ready(function () {
        $('#example').DataTable();
    });

</script> -->

<table id="datatable" class="display" >
	<thead>
		<tr>
			<th>Actor/Actress</th>
			<th>Female RC-PM</th>
			<th>Male RC-PM</th>
			<th>Overall</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Alec Baldwin</td>
			<td>0.047</td>
			<td>0.066</td>
			<td>0.056</td>
		</tr>
		<tr>
			<td>Amanda Bynes</td>
			<td>-0.03</td>
			<td>-0.017</td>
			<td>-0.023</td>
		</tr>
		<tr>
			<td>Anna Faris</td>
			<td>-0.038</td>
			<td>-0.045</td>
			<td>-0.042</td>
		</tr>
		<tr>
			<td>Ashton Kutcher</td>
			<td>-0.157</td>
			<td>-0.133</td>
			<td>-0.145</td>
		</tr>
		<tr>
			<td>Ben Stiller</td>
			<td>-0.099</td>
			<td>-0.069</td>
			<td>-0.084</td>
		</tr>
		<tr>
			<td>Bradley Cooper</td>
			<td>0.039</td>
			<td>0.06</td>
			<td>0.05</td>
		</tr>
		<tr>
			<td>Brittany Murphy</td>
			<td>-0.081</td>
			<td>-0.086</td>
			<td>-0.084</td>
		</tr>
		<tr>
			<td>Cameron Diaz</td>
			<td>0</td>
			<td>0.065</td>
			<td>0.032</td>
		</tr>
		<tr>
			<td>Candice Bergen</td>
			<td>-0.071</td>
			<td>-0.213</td>
			<td>-0.142</td>
		</tr>
		<tr>
			<td>Catherine Zeta-Jones</td>
			<td>0.025</td>
			<td>0.072</td>
			<td>0.049</td>
		</tr>
		<tr>
			<td>Chris Pratt</td>
			<td>-0.018</td>
			<td>0.027</td>
			<td>0.005</td>
		</tr>
		<tr>
			<td>Colin Firth</td>
			<td>-0.001</td>
			<td>-0.069</td>
			<td>-0.035</td>
		</tr>
		<tr>
			<td>Dennis Quaid</td>
			<td>-0.011</td>
			<td>-0.016</td>
			<td>-0.014</td>
		</tr>
		<tr>
			<td>Drew Barrymore</td>
			<td>0.066</td>
			<td>0.055</td>
			<td>0.061</td>
		</tr>
		<tr>
			<td>Emma Stone</td>
			<td>-0.01</td>
			<td>-0.023</td>
			<td>-0.016</td>
		</tr>
		<tr>
			<td>Fred Willard</td>
			<td>-0.26</td>
			<td>-0.292</td>
			<td>-0.276</td>
		</tr>
		<tr>
			<td>Freddie Prinze Jr.</td>
			<td>-0.071</td>
			<td>-0.08</td>
			<td>-0.075</td>
		</tr>
		<tr>
			<td>Gerard Butler</td>
			<td>-0.008</td>
			<td>-0.026</td>
			<td>-0.017</td>
		</tr>
		<tr>
			<td>Heather Burns</td>
			<td>0</td>
			<td>-0.067</td>
			<td>-0.033</td>
		</tr>
		<tr>
			<td>Hugh Grant</td>
			<td>-0.043</td>
			<td>-0.034</td>
			<td>-0.039</td>
		</tr>
		<tr>
			<td>Isla Fisher</td>
			<td>-0.092</td>
			<td>-0.067</td>
			<td>-0.079</td>
		</tr>
		<tr>
			<td>Jason Bateman</td>
			<td>-0.075</td>
			<td>-0.103</td>
			<td>-0.089</td>
		</tr>
		<tr>
			<td>Jason Biggs</td>
			<td>-0.028</td>
			<td>0.034</td>
			<td>0.003</td>
		</tr>
		<tr>
			<td>Jennifer Aniston</td>
			<td>-0.154</td>
			<td>-0.131</td>
			<td>-0.143</td>
		</tr>
		<tr>
			<td>Jennifer Garner</td>
			<td>-0.043</td>
			<td>-0.026</td>
			<td>-0.035</td>
		</tr>
		<tr>
			<td>Jennifer Lopez</td>
			<td>-0.137</td>
			<td>-0.215</td>
			<td>-0.176</td>
		</tr>
		<tr>
			<td>Jessica Biel</td>
			<td>-0.077</td>
			<td>-0.012</td>
			<td>-0.044</td>
		</tr>
		<tr>
			<td>Judy Greer</td>
			<td>-0.085</td>
			<td>-0.06</td>
			<td>-0.072</td>
		</tr>
		<tr>
			<td>Julia Stiles</td>
			<td>0.033</td>
			<td>0.071</td>
			<td>0.052</td>
		</tr>
		<tr>
			<td>Kate Hudson</td>
			<td>-0.06</td>
			<td>-0.087</td>
			<td>-0.074</td>
		</tr>
		<tr>
			<td>Katherine Heigl</td>
			<td>-0.008</td>
			<td>-0.019</td>
			<td>-0.013</td>
		</tr>
		<tr>
			<td>Kathy Bates</td>
			<td>-0.065</td>
			<td>-0.002</td>
			<td>-0.034</td>
		</tr>
		<tr>
			<td>Kirsten Dunst</td>
			<td>0.004</td>
			<td>0.036</td>
			<td>0.02</td>
		</tr>
		<tr>
			<td>Kristen Bell</td>
			<td>0.059</td>
			<td>0.057</td>
			<td>0.058</td>
		</tr>
		<tr>
			<td>Lake Bell</td>
			<td>-0.044</td>
			<td>-0.08</td>
			<td>-0.062</td>
		</tr>
		<tr>
			<td>Mark Ruffalo</td>
			<td>0.041</td>
			<td>0.056</td>
			<td>0.049</td>
		</tr>
		<tr>
			<td>Matthew McConaughey</td>
			<td>-0.09</td>
			<td>-0.075</td>
			<td>-0.083</td>
		</tr>
		<tr>
			<td>Meg Ryan</td>
			<td>0.008</td>
			<td>-0.011</td>
			<td>-0.001</td>
		</tr>
		<tr>
			<td>Meryl Streep</td>
			<td>0.055</td>
			<td>0.007</td>
			<td>0.031</td>
		</tr>
		<tr>
			<td>Owen Wilson</td>
			<td>0.025</td>
			<td>0.029</td>
			<td>0.027</td>
		</tr>
		<tr>
			<td>Paul Rudd</td>
			<td>-0.056</td>
			<td>-0.004</td>
			<td>-0.03</td>
		</tr>
		<tr>
			<td>Rachel McAdams</td>
			<td>0.059</td>
			<td>0.09</td>
			<td>0.075</td>
		</tr>
		<tr>
			<td>Reese Witherspoon</td>
			<td>0.064</td>
			<td>0.082</td>
			<td>0.073</td>
		</tr>
		<tr>
			<td>Rob Corddry</td>
			<td>-0.02</td>
			<td>-0.021</td>
			<td>-0.02</td>
		</tr>
		<tr>
			<td>Robert De Niro</td>
			<td>0.034</td>
			<td>0.001</td>
			<td>0.017</td>
		</tr>
		<tr>
			<td>Sandra Bullock</td>
			<td>0.03</td>
			<td>-0.038</td>
			<td>-0.004</td>
		</tr>
		<tr>
			<td>Sarah Jessica Parker</td>
			<td>-0.127</td>
			<td>-0.178</td>
			<td>-0.153</td>
		</tr>
		<tr>
			<td>Selma Blair</td>
			<td>-0.025</td>
			<td>-0.026</td>
			<td>-0.025</td>
		</tr>
		<tr>
			<td>Topher Grace</td>
			<td>-0.046</td>
			<td>0.028</td>
			<td>-0.009</td>
		</tr>
	</tbody>
  <tfoot>
  </tfoot>
</table>


