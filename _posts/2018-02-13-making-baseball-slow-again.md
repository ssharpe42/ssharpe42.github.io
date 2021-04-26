---

title: Making Baseball Slow Again
date: 2018-02-13T22:11:01-05:00
author: Sam Sharpe
layout: post
permalink: /making-baseball-slow-again/
cover-img: /assets/img/making-baseball-slow-again/bulldurham.jpg
thumbnail-img: /assets/img/making-baseball-slow-again/bulldurham-thumb.jpg
share-img: /assets/img/making-baseball-slow-again/bulldurham.jpg
categories:
  - Baseball
  - Sports
tags:
  - baseball
  - mixed models
  - pace of play
  - pitch clock
---

If you're a baseball fan, you may have noticed you've been watching on average 10-15 minutes more baseball then you were 10 years ago.  Or maybe you are always switching between games like me and never stop to notice. If you're not a fan, it's probably why you don't watch baseball in the first place: 3+ hour games, with [only 18 minutes of real action](https://www.wsj.com/articles/SB10001424127887323740804578597932341903720). You are probably more of a football guy/gal right?  Believe it or not NFL games are even longer, and according to a [WSJ study,](https://www.wsj.com/articles/SB10001424052748704281204575002852055561406) deliver even less action.

The way the MLB is going, however, it may not be long before it dethrones the NFL as the slowest "Big Four" sport in America (and takes away one of my rebuttals to "baseball is boring"). Currently, the MLB is proposing pitch clocks and has suggested limiting privileges such as mound visits.

Before I get into the specific proposal and the consequences of these changes, let me give you some long winded insight into pace of play in the MLB.

A [WSJ study](https://www.wsj.com/articles/SB10001424127887323740804578597932341903720) back in 2013 broke down the game into about 4 different time elements:

  1. Action ~ 18 minues (11%)
  2. Between batters ~ 34 minutes  (20%)
  3. Between innings ~ 43 minutes (25%)
  4. Between pitches ~ 74 minutes  (44%)

The time between pitches or "pace" is what everyone is focused on, and rightly so. It makes up almost twice as much time as any other time element and is almost solely responsible for the 11-12 minute increase in game length since 2008. Don't jump to the conclusion that this is all the fault of the batter dilly dallying or the pitcher taking his sweet time. This time also includes mound conferences, waiting for foul balls or balls in the dirt to be collected, shaking off signs and stepping off, etc. Even if we take all of those factors out, there are still two other integral elements that increase the total time between pitches: the total batters faced and the number of pitches per plate appearance (PA).  If either of these increase, the total time between pitches will increase by default. In the graph below, I separated the effects of each by holding the rest constant to 2008 levels to see how each factor would contribute to the total time added.

<img src="/assets/img/making-baseball-slow-again/total_min_added1.png" width="90%" and height="90%" class="center">

Any modest game time reduction since 2008 due to declining total batters faced was more than offset by a surge in pitches per PA. Still, the slowing pace between pitches accounts for most of the game time increase.

As we have heard over and over again in the baseball world, the average game time has increased and is evident in the graph above. It's not just that the number of long outlier games has increased; the median game time has actually crept up by about the same amount.

<img src="/assets/img/making-baseball-slow-again/game_time_distribution.png" width="90%" and height="90%" class="center">

Plenty of players are at fault for the recent rise in game time. You can checkout Travis Sawchik's post about ["Daniel Nava and the Human Rain Delays"](https://www.fangraphs.com/blogs/daniel-nava-and-the-human-rain-delays/) or just checkout the raw player data at [FanGraphs](https://www.fangraphs.com/leaders.aspx?pos=all&stats=bat&lg=all&qual=y&type=22&season=2017&month=0&season1=2017&ind=0&team=0&rost=0&age=0&filter=&players=0). Rather than list the top violators here, I thought it would be amusing to make a useless mixed model statistic about pace of play.

A mixed model based statistic, like the one I created in [this post](https://sharpestats.com/stealing-bases-and-splitting-the-rewards/)[^1], helps control for opposing batter/pitcher pace and for common situations that result in more time between pitches. Essentially, for the time between each pitch, we allocate some of the "blame" to the pitcher, batter, and the situation or "context".

[^1]: Also see this article if you want an explanation of mixed models.

I derive the pace from PITCHF/x data, which contains details about each play and pitch of the regular season. I define pace as the time between any two consecutive pitches to the same batter excluding intervals that include pickoff throws, stolen bases, and other actions documented in PITCHF/x [^2]. For more specifics, as always, the code is on [GitHub](https://github.com/ssharpe42/PaceofPlay).

[^2]: This is very similar to FanGraphs' definition, but they calculate pace by averaging over all pitches in the PA, while I calculate by pitch.

It's a nice idea and all, but does context really matter?

The most obvious example comes from looking at the previous pitch. Foul balls or balls in the dirt trigger the whole routine involved in getting a new ball, which adds even more time. The graph below clearly shows that time lags when pitches aren't caught by the catcher.

<img src="/assets/img/making-baseball-slow-again/pitch_type_pace.png" width="90%" and height="90%" class="center">

The biggest discrepancy comes with men on base. Even though pickoff attempts and stolen bases are removed from the pace calculation, it still doesn't account for the games pitchers play with runners on base. This includes changing up their timing after coming set or stepping off the rubber to reset.

<img src="/assets/img/making-baseball-slow-again/out-base-pace.png" width="90%" and height="90%" class="center">

The remainder of the context I've included illustrates how pace slows with pressure and fatigue as players take that extra moment to compose themselves.

As the game approaches the last inning and the score gets closer[^3], time between pitches rises.

[^3]: With the exception of a score differential of 0, since this often occurs in the early innings.

<img src="/assets/img/making-baseball-slow-again/inning_pace.png" width="90%" and height="90%" class="center">

<img src="/assets/img/making-baseball-slow-again/score_diff_pace.png" width="90%" and height="90%" class="center">

And similarly, as we get closer to the end of a PA from the pitcher's point of view, pace slows.


<img src="/assets/img/making-baseball-slow-again/count_pace.png" width="80%" and height="80%" class="center">

Context plays a large part in pace meaning that some players who find themselves in notably slow situations, are not completely at fault. I created the mixed model statistic pace in context, or cPace, which accounts for all of the factors above. cPace can essentially be interpreted as the _pace added above the average batter/pitcher_, but can't be compared across positions.

When comparing the correlation of Pace and cPace across years, cPace seems like a better representation of batters' true tendencies. My guess is that, pitchers' pace varies more than the average hitter, so many batters' cPace values benefited from controlling for the pitcher and other context.

<img src="/assets/img/making-baseball-slow-again/cpace_corr.png" class="center">

After creating cPace, I came up with a fun measure of overall pace: Expected Hours Added Per Season Above Average or xHSAA for short. It's essentially what it sounds like: how many hours would this player add above average given 600 PA (or Batters Faced) in a season and league average pitches per PA (or BF).


<img src="/assets/img/making-baseball-slow-again/xHSAA_hrs.png" class="center">

The infamous tortoise, Marwin Gonzalez, leads all batters with over 3 extra hours per season more than the average batter.

That was fun. Now back to reality and MLB's new rule changes. Here is the latest proposal via Ken Rosenthal:

<blockquote class="twitter-tweet" data-width="550" data-dnt="true">
  <p lang="en" dir="ltr">
    MLB’s latest pace-of-play proposal, per sources: No pitch clock in ‘18. If games are 2:55 or longer, 18-second clock for ‘19 with no runners on base starting May 1, with ball-strike penalty. If in ‘19 games are 2:50 or longer, additional 20-second clock with runners on in ‘20.
  </p>
  
  <p>
    &mdash; Ken Rosenthal (@Ken_Rosenthal) <a href="https://twitter.com/Ken_Rosenthal/status/959201703634657280?ref_src=twsrc%5Etfw">February 1, 2018</a>
  </p>
</blockquote>



The MLB tried to implement pace of play rules in 2015, one of which required batters to keep one foot inside the box with [some exceptions](http://mlb.mlb.com/mlb/downloads/y2007/06_the_batter.pdf). The rules seemed to be enforced less and less, but a 18 or 20 second pitch clock is not subjective and will potentially have drastic consequences for a league that averages 24 seconds in-between pitches. Some sources say the clock actually starts when the pitcher gets the ball. Since my pace measure includes the time between the last pitch and the pitcher receiving the ball, the _real_ pace relative to clock rules may be 3-5 seconds faster.

Let's assume that it's 5 seconds to be safe. If a pitcher takes 20 seconds between two pitches, we will assume it's 15 seconds. To estimate the percentage of pitches that would be affected by these new rules I took out any pitches not caught by the catcher, assuming all the pitches left were returned to the pitcher within the allotted 5 seconds.


<img src="/assets/img/making-baseball-slow-again/rule_distribution.png" width="100%" and height="80%" class="center">

The 18 second clock results in about 14% of the pitches with no runners on in 2017 resulting in violations of the pitch clock. This doesn't even include potential limits on batters times outside the box or time limits between batters, so we can safely say this is a lower bound. If both of the clocks are implemented in 2020, at least 23% of all pitches[^4] would be in violation of the pitch clock[^5]. Assume it only takes 3 seconds to return the ball to the pitcher instead of 5, and that number jumps to 36%!

[^4]: Excluding first pitch of PA
[^5]: Pitches with no runners on make up 60% of all pitches.

And now we are on the precipice of the 2018 season, which could produce the longest average game time in MLB history for the second year in a row as drastic changes loom ahead. I don't know who decided that 3:05 was too long or that 15 minutes was a good amount of time to give back to the fans. Most likely just enough time for fans to catch the end of a Shark Tank marathon.

Anyways, if game times keep going up, something will eventually have to be done. However, even I, a relatively fast paced pitcher in college, worry that pitch clocks will add yet another element to countless factors pitchers already think about on the mound.

There are certainly some other innovative ideas out there: Ken Rosenthal suggests the possibility of using [headsets](https://www.theathletic.com/231173/2018/02/04/rosenthal-at-some-point-mlb-and-its-players-need-to-understand-the-sport-must-evolve/) for communication between pitchers and catchers, and Victor Mather of the NYT suggests an [air horn](https://www.nytimes.com/2017/03/01/sports/baseball/baseballs-too-slow-heres-how-you-fix-it.html?ref=oembed) to bring in new pitchers instead of the manager. Heck, maybe it'll come down to limiting the number of batting glove adjustments per game. Whatever the league implements will certainly be a jolt to players' habits and hardcore baseball fans' intractable traditionalist attitude. The strategy, technology, and physicality of today's baseball is changing more rapidly than ever. When the rules catch up, I have a feeling we will still like baseball.

&nbsp;
