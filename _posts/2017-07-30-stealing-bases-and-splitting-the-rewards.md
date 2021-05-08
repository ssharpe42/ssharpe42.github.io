---
title: Stealing Bases and Splitting the Rewards
date: 2017-07-30T15:14:01-05:00
author: Sam Sharpe
layout: post
permalink: /stealing-bases-and-splitting-the-rewards/
cover-img: /assets/img/stealing-bases-and-splitting-the-rewards/cover.jpg
# thumbnail-img: /assets/img/who-are-the-best-romcom-actors/romcom-thumbnail.png
# share-img: /assets/img/who-are-the-best-romcom-actors/romcom2.jpeg
categories:
  - baseball
tags:
  - baseball
  - R
  - sabermetrics
  - stolen base
---

The contextual revolution (don't really know if that's a thing, but it sounds official) emerged in the MLB the past few years, attempting to control for more situational effects than current sabermetric driven baseball stats. These models build upon Bill James's work, Tom Tango's all-important [linear weights](http://www.fangraphs.com/library/offense/woba/), and similar metrics that account for league, [park](http://www.fangraphs.com/library/principles/park-factors/), and positional production.


Baseball Prospectus (BP) writers developed baseball statistics that further quantify performance using [mixed models](https://en.wikipedia.org/wiki/Mixed_model) . You can find a good introduction to mixed models in [this](http://www.baseballprospectus.com/article.php?articleid=25514) article written by [Jonathan Judge](http://www.baseballprospectus.com/author/jonathan_judge/), [Harry Pavlidis](http://www.baseballprospectus.com/author/harry_pavlidis/) and [Dan Brooks](http://www.baseballprospectus.com/author/dan_brooks/) of BP, but if you are familiar with linear or logistic regression, a mixed model attempts to estimate the average performance over the course of the season (fixed linear model) and use the residuals (or error) to simultaneously quantify the contributions of "random" participants in any given play. Now why do I say random? It isn't so much that these participants are random, but that the baseball players are always changing and the number of "random" interactions they have throughout a season is endless, while the effect of an 0-2 count on run production says relatively consistent or fixed throughout a whole season.

Some existing baseball stats based on mixed models include:

  1. Called Strikes Above Average ([CSAA](http://www.baseballprospectus.com/article.php?articleid=25514)) &#8211; defensive statistic that measures catcher framing skills controlling for the batter, pitcher, catcher, and umpire
  2. Swipe Rate Above Average ([SRAA](http://www.baseballprospectus.com/article.php?articleid=28193)) &#8211; base running metric that attempts to quantify base stealing ability for batters, and stolen base prevention for pitchers and catchers
  3. Take Off Rate Above Average ([TRAA](http://www.baseballprospectus.com/article.php?articleid=28193)) &#8211; player specific effects on base stealing attempts
  4. cFIP &#8211; a new version of Fielding Independent Pitching ([FIP](http://www.fangraphs.com/library/pitching/fip/)) taking into account many aspects of a plate appearance. Read more about it [here](http://www.hardballtimes.com/fip-in-context/).

By the title you can probably guess this article is about stolen bases, and you are correct. Specifically, I will be discussing Swipe Rate Above Average or SRAA for short. SRAA is derived from a mixed model that attempts to account for the inning, the stadium, the quality of the pitcher, and the pitcher, catcher, and lead runner involved. SRAA is directly derived from a player's random effect and is a single number generally ranging from -10% to 10% describing the additional probability a player contributes to a successful steal. For example,  Mike Trout had a 4% SRAA in 2016. Given the average stolen base situation, Trout is 4% more likely to successfully steal than the average baserunner in 2016.

While SRAA accounts for pitcher skill using cFIP[^1], the quality of a pitcher can't necessarily control for all variation in a pitcher's pitch sequence or the occasional mistake in the dirt. Pitches in the dirt, pitchouts[^2], off-speed, and fastballs are treated equally in SRAA. Consequently, SRAA values may be lacking for runners that disproportionately get thrown out on pitchouts or for catchers that consistently block balls in the dirt while still throwing out the runner.

[^1]: See above link for more information.
[^2]: A ball intentionally through high and outside to prevent stolen bases.

Lets explore some evidence of these effects before we include them in the pitch adjusted (pSRAA) model. I started by subsetting Retrosheet play-by-play data from the 2016 season to only stolen base attempts by lead runners. For example, events with a steal of second base with a man on third were not included. I only included situations where a pitch preceded a stolen base attempt. I supplemented the play-by-play data with PITCHf/x data which tracks trajectories of every pitch in the MLB.  I aligned the pitch data with each stolen base with minimal missing connections between the two datasets[^3] and ended up with 2,809 total attempts. Excluding some of these stolen bases means for those who are familiar with SRAA, my SRAA numbers will not match up directly with BP's numbers.

[^3]: Only 3 stolen bases did not have PITCHf/x data since there technically wasn't a pitch that occurred (e.g., steal of third then steal home on a passed ball). An additional 8 did not have valid trajectory readings in PITCHf/x.

I first examined pitch speed and its effects on stolen base percentage. It's no surprise that in 2016 runners succeed more often on slower pitches.

<img src="/assets/img/stealing-bases-and-splitting-the-rewards/pitch-speed-1.png" width="90%" and height="90%" class="center">


Notice a slightly higher success rate for pitch speeds that fall above 95 mph.  This phenomenon is not unique to 2016, and Jeff Sullivan[hypothesized](http://www.fangraphs.com/blogs/stealing-success-against-pitch-speeds-and-pitch-heights) that good base stealers are the ones stealing against fireballers. Indeed, while only 8% of stolen bases occur during a pitch that is 95 mph or higher, speedsters Billy Hamilton and Starling Marte attempted over 12% of their stolen bases in these situations.  These situations tend to arise later[^4] in closer games[^5] meaning base stealers ought to be more certain of success before attempting to steal.

[^4]: About 1 inning later on average
[^5]:Stealing team is only .39 runs ahead rather than .46 runs ahead on average

In addition to pitch speed, we also have access to pitch location data through PITCHf/x. As you can see in the figure below, the SB probability varies more drastically by location, and therefore, is the most meaningful of the two pitch metrics. The results below mirror the results I would expect. High SB probability along the right side of the plate for left-handed hitters confirms that most catchers (if not all) are right-handed which makes it hard to throw over left-handed hitters. Similarly, catchers have more success with right-handed hitters and pitches closer to their throwing shoulder. And finally, the most obvious of all: it's hard to throw a runner out when the ball hits the ground.


<img src="/assets/img/stealing-bases-and-splitting-the-rewards/strikezone.png" width="90%" and height="90%" class="center">

I also included the PITCHf/x pitch descriptions since they help improve the model slightly. Some descriptions occurred only a few times, so I combined them into larger categories:

  * Dirt: Ball in Dirt, Swinging Strike (Blocked)
  * Pitchout: Pitchout, Swinging Pitchout
  * Strike/Ball: Ball, Called Strike,
  * Swinging Strike: Foul Tip, Missed Bunt, Swinging Strike

Below is a table detailing the SB success rates in each of the four groups. Dirt and Pitchout are the most extreme categories with "normal" pitches falling in-between. Something that jumped out at me was the lower success rate on swinging strikes, as I would expect this to distract the catcher. Two explanations I can come up with are: 1) catchers tend to hold the no-swing pitches a split second longer to get the call from the ump, or 2) swinging pitches occur during a hit and run[^6] play where runners tend to be less skilled at stealing bases.

[^6]: Attempt to hit the ball to draw middle infielders away from the base to help the runner advance

<table class="dt" style="width:70%">
	<thead>
		<tr>
			<th>Pitch Description</th>
			<th>SB%</th>
			<th>Number of Attempts</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Dirt</td>
			<td>87.8%</td>
			<td>197</td>
		</tr>
		<tr>
			<td>Strike/Ball</td>
			<td>74.2%</td>
			<td>2042</td>
		</tr>
		<tr>
			<td>Swinging Strike</td>
			<td>63.7%</td>
			<td>534</td>
		</tr>
		<tr>
			<td>Pitchout</td>
			<td>33.3%</td>
			<td>36</td>
		</tr>
	</tbody>
</table>


Controlling for the lead runner's base is the last addition I made to the original SRAA model. Adding this effect improved the model ([AIC](https://en.wikipedia.org/wiki/Akaike_information_criterion) to be specific), indicating runners stealing third were more likely on average to be successful than runners attempting to steal second and especially home. A likely explanation is that runners stealing third need to be more confident in their ability to steal in the current situation and have a right-handed hitter obstructing the catchers throw about 65% of the time.

So now that we have this new metric pSRAA, lets take a look at how it deviates from SRAA. As you can see in the figure below, the distribution of both metrics are fairly similar.


<img src="/assets/img/stealing-bases-and-splitting-the-rewards/distribution.png" width="90%" and height="90%" class="center">

pSRAA has a slightly tighter distribution for pitchers and runners, meaning pSRAA has absorbed some of the expected SB probability in these new variables and pushed pitcher and runner SB skills closer to the mean. This phenomenon occurs most likely because the variables we are trying to control for are largely out of control for these players and are not rectifiable or exploitable. By that I mean, pitchers can't control whether the one pitch they throw in the dirt happens to coincide with a runner taking off, but catchers can use this event to prove their skill. While a pitcher "loses control" of the SB situation when the ball is released, a catcher can make a brilliant play, saving a potential wild pitch and converting it into an out. Thus, we see a wider variation in pSRAA for catchers, as pSRAA identifies the increasingly elite talent and the replacement players that struggle to nab runners on pitchouts.

Examining how players' metrics improved or worsened after controlling for these additional effects reveals some drastic changes, but mostly small adjustments. The figure below illustrates the change from the old metric to the new metric. The closer a player is to the dotted line (pSRAA = SRAA), the less that player deviated from the original SRAA measure. If a player ends up above this line, it means that pSRAA is higher than SRAA, so when controlling for pitches, pSRAA attributes more success (for runners — less success for pitchers and catchers) to their ability rather than luck.

<img src="/assets/img/stealing-bases-and-splitting-the-rewards/change.png" width="100%" and height="100%" class="center">

How does this new pSRAA model help us as baseball fans or analysts? pSRAA can identify where SRAA was under or overvaluing players' skills. For example, SRAA undervalues catcher Chris Iannetta at a 0.86% SRAA when pSRAA pegs him at whopping -4.19% (negative is good for catchers)!  In other words, Iannetta jumps from the 43rd percentile of catchers to the 70th percentile!

To give you an idea of the kind of adjustments pSRAA makes, below is a sample stolen base attempt against Iannetta (video has no sound for those of you who are watching at work; for sound go to 1:51:40 [here](https://youtu.be/ZPRSFYWBsng?t=6699)), specifically a SB attempt that the model predicts will happen 85.5% of the time. Actually, it is more like 88.4% if you account for the runner, Lorenzo Cain, the 15th fastest baseball player according to Statcast's [speed measure](https://baseballsavant.mlb.com/sprint_speed_leaderboard?year=2017&position=&team=).


<div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.338%;"><iframe src="https://streamable.com/e/nz2rd" frameborder="0" width="100%" height="100%" allowfullscreen style="width: 100%; height: 100%; position: absolute;"></iframe></div>

Now lets just freeze that frame. The ball is almost on the ground, and not to mention, only thrown at 80 mph, giving Cain almost an extra tenth of a second to get to second base. Regardless, Iannetta guns him out with an impeccable throw.

<img src="/assets/img/stealing-bases-and-splitting-the-rewards/freeze.png" width="90%" and height="90%" class="center">


Not only can we use pSRAA to uncover insights such as above, but we can also abuse pSRAA to easily find awesome plays like this top 5 play below. J.T. Realmuto, known for his unbelievable pop time, throws out Ben Revere on this gem of a play. The pSRAA model gives Realmuto a 10% chance of throwing out Ben Revere, but Realmuto pops up in a staggering 1.78 seconds (via Statcast) and throws a perfect 85 mph toss to second. Be careful, I left the sound on for this one so you can hear the short-hop as he picks the throw in the dirt.

<div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.250%;"><iframe src="https://streamable.com/e/aazye" frameborder="0" width="100%" height="100%" allowfullscreen style="width: 100%; height: 100%; position: absolute;"></iframe></div>


Or this scenario which had a 92% stolen base probability (sound again). A.j. Pierzynski picks a throw off the ground, navigates around Brandon Phillips to beat Suarez by a mile.

<div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.250%;"><iframe src="https://streamable.com/e/fjntg" frameborder="0" width="100%" height="100%" allowfullscreen style="width: 100%; height: 100%; position: absolute;"></iframe></div>

And finally, here is an example of a successful stolen base the model predicts will happen 15% of the time —not a surprise when you see where the pitch is thrown (actually 43% when you account for the speedy Rajai Davis and the way below average Kurt Suzuki)

<div style="width: 100%; height: 0px; position: relative; padding-bottom: 56.250%;"><iframe src="https://streamable.com/e/tnf4c" frameborder="0" width="100%" height="100%" allowfullscreen style="width: 100%; height: 100%; position: absolute;"></iframe></div>

pSRAA does well for these purposes, but may not illustrate the total value a player adds to his team's success. A runner with a high pSRAA value with only a couple stolen base attempts hasn't added much value to his team since he didn't utilize his skill often enough. We can leverage pSRAA and stolen base/caught stealing (CS) run values to come up with a more useful metric, which I have aptly named Pitch Adjusted Swipe Rate Runs Above Average (pSRrAA) —a mouthful, I know. I based pSRrAA upon linear weights metrics like FanGraphs Weighted Stolen Base Runs ([wSB](http://www.fangraphs.com/library/offense/wsb/)). The term linear weights, often used in the world of baseball statistics, translates to the average run value of a certain action and its effect on run scoring over the course of an inning. For example, lets say there is a man on first base with no outs. The average number of runs scored in an inning in 2016 starting with this exact situation is 0.8744 runs. He gets caught stealing, and now the situation is nobody on and 1 out. Starting in this situation, the run expectancy drops to 0.2737. Thus, the value of this specific play was about -0.6 runs. Examining these situations over the course of the whole season leaves us with average run values that we can assign to SB and CS. Combining the run values for SB (runSB = .2 runs) and CS (runCS = -.41 runs) produced by [FanGraphs](http://www.fangraphs.com/guts.aspx?type=cn) for the 2016 season, we can use pSRAA to attribute the run values more accurately:



<div style="text-align: center;">
 <strong>pSRrAA = pSRRA x (runSB-runCS) x Attempts</strong>
</div>

This method for calculating pSRrAA works because of the following:


  1. pSRRA already determines the probability a certain player adds to a SB above average.
  2. If a player adds 10% probability to a SB, they are contributing **runSB** 10% more than the average player and **runCS** 10% less.
  3. **pSRRA x (runSB-runCS)** quantifies the average attempt value, so then we just multiply by attempts to get a full run value over the course of the season.


Of course, as I alluded to in the beginning pSRAA doesn't account for all types of stolen bases, only ones with pitches involved. Consequently, pSRrAA doesn't account for the total value runners and pitchers contribute to their teams because attempts are excluded in which catcher isn't involved. Finally, I will leave you with a table of the top 10 and bottom 10 performers for each position according to pSRrAA. And as always, you can find the code associated with pSRAA/pSRrAA and the analysis on my GitHub page [here](https://github.com/ssharpe42/pSRAA). Checkout my new Facebook [page](https://www.facebook.com/sharpestats/) to stay up to date on new articles.


<div style="text-align: center;">
  <span style="font-size: 18.6667px;"><strong>Top 10 pSRrAA by Position in 2016</strong></span>
</div>

<table class="dt" >
	<thead>
		<tr>
			<th>Catcher</th>
			<th>pSRAA</th>
			<th>pSRrAA</th>
			<th>Pitcher</th>
			<th>pSRAA</th>
			<th>pSRrAA</th>
			<th>Runner</th>
			<th>pSRAA</th>
			<th>pSRrAA</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Jonathan Lucroy</td>
			<td>-9.13%</td>
			<td>-5.52</td>
			<td>Drew Pomeranz</td>
			<td>-13.3%</td>
			<td>-0.97</td>
			<td>Billy Hamilton</td>
			<td>11.31%</td>
			<td>3.93</td>
		</tr>
		<tr>
			<td>Salvador Perez</td>
			<td>-10.57%</td>
			<td>-4.19</td>
			<td>Tom Koehler</td>
			<td>-9.2%</td>
			<td>-0.95</td>
			<td>Starling Marte</td>
			<td>6.72%</td>
			<td>2.01</td>
		</tr>
		<tr>
			<td>Welington Castillo</td>
			<td>-12.80%</td>
			<td>-3.75</td>
			<td>Wily Peralta</td>
			<td>-6.2%</td>
			<td>-0.8</td>
			<td>Rajai Davis</td>
			<td>7.69%</td>
			<td>1.78</td>
		</tr>
		<tr>
			<td>James McCann</td>
			<td>-11.82%</td>
			<td>-3.46</td>
			<td>Tyler Chatwood</td>
			<td>-14.4%</td>
			<td>-0.79</td>
			<td>Jonathan Villar</td>
			<td>3.87%</td>
			<td>1.7</td>
		</tr>
		<tr>
			<td>Jett Bandy</td>
			<td>-8.49%</td>
			<td>-1.97</td>
			<td>Ian Kennedy</td>
			<td>-7.0%</td>
			<td>-0.68</td>
			<td>Trea Turner</td>
			<td>6.70%</td>
			<td>1.39</td>
		</tr>
		<tr>
			<td>Buster Posey</td>
			<td>-4.95%</td>
			<td>-1.84</td>
			<td>Jaime Garcia</td>
			<td>-7.4%</td>
			<td>-0.68</td>
			<td>Eduardo Nunez</td>
			<td>4.15%</td>
			<td>1.11</td>
		</tr>
		<tr>
			<td>Martin Maldonado</td>
			<td>-7.55%</td>
			<td>-1.8</td>
			<td>Mike Fiers</td>
			<td>-12.5%</td>
			<td>-0.61</td>
			<td>Jarrod Dyson</td>
			<td>6.26%</td>
			<td>1.03</td>
		</tr>
		<tr>
			<td>Evan Gattis</td>
			<td>-12.57%</td>
			<td>-1.76</td>
			<td>Zach Davies</td>
			<td>-6.2%</td>
			<td>-0.61</td>
			<td>Odubel Herrera</td>
			<td>5.71%</td>
			<td>0.98</td>
		</tr>
		<tr>
			<td>J. T. Realmuto</td>
			<td>-4.09%</td>
			<td>-1.55</td>
			<td>Jon Lester</td>
			<td>-3.0%</td>
			<td>-0.6</td>
			<td>Mike Trout</td>
			<td>3.93%</td>
			<td>0.79</td>
		</tr>
		<tr>
			<td>Gary Sanchez</td>
			<td>-10.35%</td>
			<td>-1.45</td>
			<td>Justin Grimm</td>
			<td>-11.0%</td>
			<td>-0.53</td>
			<td>Keon Broxton</td>
			<td>6.10%</td>
			<td>0.78</td>
		</tr>
	</tbody>
</table>

<div style="text-align: center;">
  <span style="font-size: 14pt;"><strong>Bottom 10 pSRrAA by Position in 2016</strong> </span>
</div>


  
<table class="dt" style="width:80%">
	<thead>
		<tr>
			<th>Catcher</th>
			<th>pSRAA</th>
			<th>pSRrAA</th>
			<th>Pitcher</th>
			<th>pSRAA</th>
			<th>pSRrAA</th>
			<th>Runner</th>
			<th>pSRAA</th>
			<th>pSRrAA</th>
		</tr>
	</thead>
	<tbody>
		<tr>
			<td>Hank Conger</td>
			<td>7.29%</td>
			<td>1.38</td>
			<td>Anibal Sanchez</td>
			<td>4.6%</td>
			<td>0.76</td>
			<td>Danny Santana</td>
			<td>-3.09%</td>
			<td>-0.3</td>
		</tr>
		<tr>
			<td>Russell Martin</td>
			<td>4.19%</td>
			<td>1.38</td>
			<td>Felix Hernandez</td>
			<td>8.7%</td>
			<td>0.8</td>
			<td>Rougned Odor</td>
			<td>-3.11%</td>
			<td>-0.3</td>
		</tr>
		<tr>
			<td>Francisco Cervelli</td>
			<td>4.31%</td>
			<td>1.82</td>
			<td>Jake Arrieta</td>
			<td>6.2%</td>
			<td>0.83</td>
			<td>Erick Aybar</td>
			<td>-7.12%</td>
			<td>-0.3</td>
		</tr>
		<tr>
			<td>Bobby Wilson</td>
			<td>6.94%</td>
			<td>1.82</td>
			<td>Gerrit Cole</td>
			<td>7.2%</td>
			<td>0.84</td>
			<td>Logan Forsythe</td>
			<td>-5.02%</td>
			<td>-0.34</td>
		</tr>
		<tr>
			<td>Travis d'Arnaud</td>
			<td>6.27%</td>
			<td>2.49</td>
			<td>Matt Andriese</td>
			<td>9.4%</td>
			<td>0.92</td>
			<td>Andrew McCutchen</td>
			<td>-5.08%</td>
			<td>-0.34</td>
		</tr>
		<tr>
			<td>Nick Hundley</td>
			<td>8.38%</td>
			<td>2.61</td>
			<td>Cole Hamels</td>
			<td>7.8%</td>
			<td>0.96</td>
			<td>Alexei Ramirez</td>
			<td>-4.89%</td>
			<td>-0.36</td>
		</tr>
		<tr>
			<td>Miguel Montero</td>
			<td>9.48%</td>
			<td>2.95</td>
			<td>Dellin Betances</td>
			<td>10.8%</td>
			<td>0.99</td>
			<td>Nori Aoki</td>
			<td>-5.18%</td>
			<td>-0.41</td>
		</tr>
		<tr>
			<td>Kurt Suzuki</td>
			<td>9.58%</td>
			<td>2.98</td>
			<td>Ubaldo Jimenez</td>
			<td>9.6%</td>
			<td>1.47</td>
			<td>George Springer</td>
			<td>-4.90%</td>
			<td>-0.48</td>
		</tr>
		<tr>
			<td>Derek Norris</td>
			<td>7.35%</td>
			<td>3.45</td>
			<td>Jimmy Nelson</td>
			<td>14.7%</td>
			<td>2.78</td>
			<td>Kirk Nieuwenhuis</td>
			<td>-6.16%</td>
			<td>-0.49</td>
		</tr>
		<tr>
			<td>Tyler Flowers</td>
			<td>14.00%</td>
			<td>4.27</td>
			<td>Noah Syndergaard</td>
			<td>9.9%</td>
			<td>2.95</td>
			<td>Cesar Hernandez</td>
			<td>-6.20%</td>
			<td>-1.02</td>
		</tr>
	</tbody>
</table>
  

Featured<a href="https://www.flickr.com/photos/keithallison/8629820448/"> image</a> by Keith Allison.


