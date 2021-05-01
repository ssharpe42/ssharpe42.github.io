---
title: All Betts Are on Yelich
date: 2018-10-16T21:04:35-05:00
author: Sam Sharpe
layout: post
permalink: /all-betts-are-on-yelich/
cover-img: /assets/img/all-betts-are-on-yelich/betts-800x350.jpg
thumbnail-img: /assets/img/all-betts-are-on-yelich/betts.jpg
share-img: /assets/img/all-betts-are-on-yelich/betts.jpg
categories:
  - baseball
tags:
  - baseball
  - MVP
---

Last year's MLB MVP vote didn't quite test the voting traditions and written rules, but this year might be different. A majority of MVPs in the past have been position players as many people view the Cy Young as the pitcher award and the MVP as more or less a position award. However, there have been a couple of recent cases where pitchers won: Kershaw in 2014 and Verlander in 2011. Both had over 6 fWAR seasons and ERAs of 1.77 and 2.40 respectively. So why is Jacob deGrom (8.8 fWAR , 1.70 ERA) not an obvious pick for some voters? Kershaw and Verlander both had at least **two times** as many wins (21 and 24 ) and win percentages of at least .300 points higher! Pitchers that finished in the top 10 in the last couple of years all had at least 15 wins.

Lets examine some similar cases to deGrom. Craig Edwards wrote a great [deep dive](https://www.fangraphs.com/blogs/jacob-degrom-and-the-mvp-precedent/) into the MVP precedent. Most recently, Kershaw came in 7th place in 2013 after he amassed a 16-9 record, 7.1 fWAR, and 1.83 ERA. Freeman (.319/.396/.501, 23 HR, 5 fWAR) and Votto (.305/.435/.491, 24 HR, 5.7 fWAR) received slightly more votes with good, but not gaudy stat lines. The next year, Kershaw had essentially the same season (with over 20 wins), and won the MVP over similar performances. In 2015, Jake Arrieta (7.3 fWAR, 1.77 ERA) came in 6th in MVP voting even with his 22 wins right behind Andrew McCutchen who definitely got votes for being the offensive standout on his postseason bound team and less for his stat line (.292/.401/.488, 6 WAR). So even-though this year was a bit lack luster on the offensive side of things in the NL, there is certainly precedent for similar (maybe not quite as good) seasons being cast aside by voters for other not so impressive offensive seasons due to some combination of inherent bias against pitchers, a large consideration of pitchers as a function of their win loss record, and a bias towards playoff bound teams.

In my last article, I showed that over the past couple decades, the amount of consideration voters place on certain factors for batters has changed drastically. WAR is being considered more and more for batters, while pitchers continue to be largely critiqued by their win totals and ERA. The trend was perhaps easy to see, but I quantified it by creating a voter bot that mimics the BWAA voters' changing opinions from year to year. If you want more background about how it works you can find the article [here](https://sharpestats.com/thinking-like-an-mlb-mvp-voter/). Essentially, the voter bot encodes voters' opinions by changing weights of different factors (individual stats, team performance, etc) incrementally each year. Change the weights to fast, and we could alter the voter bot's opinion too much based on a possible outlier year. Change the weights to slowly and we might not keep up with the rapidly changing outlook of MLB MVP voters.

Given that the voter bot predictions were pretty close last year, it means that there wasn't much of a shift in the makeup of voters' considerations. Pitcher wins still make up about 80% of voter consideration when weighing their merit against batters. Even though that signal may capture the winning percentage and postseason appearances, it is an extraordinarily high weight to place on a statistic that largely has no descriptive value of true pitcher performance.

To crown deGrom as the MVP would take a **massive** shift in voter opinion. I personally loved the narrative of the race between deGrom's WAR and wins, and maybe that is what pushes him towards the top, but I think the odds are against him. At this point, unlike my voter bot, I think deGrom will probably make it into the top 5. Something I haven't considered in my model, is [Win Probability Added](https://www.fangraphs.com/library/misc/wpa/) (WPA) which helps deGrom since he pitched in many close games. In fact, he had a WPA about 1 win higher than any other player in the MLB!

I compiled the stats from this year and threw it all into my AI bot. After a couple hours of data prep and 10 seconds of &#8220;beep boop beep boop&#8221;,  here are the 2018 MLB MVP predictions:

|Rank|AL MVP|NL MVP|
|:-: |:-: |:-: |
|1|Mookie Betts|Christian Yelich|
|2|Mike Trout|Nolan Arenado|
|3|J.D. Martinez|Javier Baez|
|4|Alex Bregman|Trevor Story|
|5|Jose Ramirez|Freddie Freeman|



*Photo Credit: Billie Weiss/Boston Red Sox/Getty Images*
