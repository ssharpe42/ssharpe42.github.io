---
title: "Injuries in Baseball: How (Self-)Exciting?"
date: 2022-11-06T11:52:19-05:00
author: Sam Sharpe
layout: post
permalink: /mlb-injury-point-process/
 
cover-img: /assets/img/mlb-injury-point-process/adames_injury.jpeg
thumbnail-img: /assets/img/mlb-injury-point-process/adames_injury.jpeg
share-img: /assets/img/mlb-injury-point-process/cover.png
share-description: Modeling MLB player injury risk with temporal point processes. 
categories:
 - baseball
tags:
 - MLB
 - injury
 - point process
 - hawkes process
 - poisson
datatable: true
show-avatar: false
---
 
* TOC
{:toc}
 
### Introduction

<!--more-->
Anyone can admit that baseball is hard to predict[^1], probably one of the reasons it can be so exciting. I've definitely done my share of modeling game and at-bat outcomes, but I wanted to pose a different challenge for this post: predicting injury risk.
 
[^1]: [How often does the best team win? A unified approach to understanding randomness in north american sport.](https://arxiv.org/pdf/1701.05976.pdf)
 
Injury risk is an important element of season long unpredictability. A bunch of injury research focuses mostly on pitcher health, looking at pitch load, movement, even video analysis. I'm sure teams also have their own complex systems for modeling and monitoring player health.

I'm going to keep the inputs (relatively) simple and limit the problem to predicting future injuries using **only** past injuries. Yes, it makes this problem a bit harder by not having any in-game information such as pitch load or changes in pitch/exit velocity. However, a certain statistical concept is well suited to clearly illustrate and quantify how injury history influences future injury risk: the self-exciting point process (SEPP) or Hawkes process (HP).

Using a HP we can answer questions like: Are injuries to specific body parts self-exciting -- for example, do elbow injuries increase the likelihood of elbow injuries much more than other body parts? Does this differ in pitchers vs batters? How do day-to-day injuries influence future injury risk? Do past injuries increase future risk to related parts of the body? How do we put this information together to gauge injury risk at any point in time?


### Temporal Point Processes
 
To understand how HPs can help to answer this I'll first give some background on temporal point processes and how we might be able to use them. If you are familiar or just want to skip the math, go [here](#data).
 
A temporal point process (TPP) is a random process that results in discrete event occurrences over time. We can think about and define TPPs in a couple of ways
1. A counting process - define a probability distribution over the number of events in an interval
2. Intervals or interarrival times - define a probability distribution of the interval of time between successive events
 
####  Poisson Point Process
 
The most commonly known manifestation is the Poisson point process. The counting process is fittingly parameterized by a poisson distribution. Formally, the number of events $N(t)$ in an interval of time $t$ is a poisson distribution with mean $\lambda t$, where $\lambda>0$ is the rate or intensity of events on average in the interval. Remembering the formula for a poisson distribution, we can write the probability of a specific number of events $k$ occurring as:
 
$$P(N(t)=k) = \frac{e^{-\lambda t}(\lambda t )^k}{k!}$$
 
To reframe this process around interarrival times, we can look at the probability of no events occurring in the interval $P(N(t)=0)$ or, in other words, probability of the next event occuring after $t$, $P(X>t)$.
 
$$\begin{align}
P(N(t)=0) = P(X>t) & = \frac{e^{-\lambda t}(\lambda t )^0}{0!} \\
P(X>t) & = e^{-\lambda t} \\
P(X\leq t) & = 1 - e^{-\lambda t}
\end{align}$$
 
The last line is actually the same as the cumulative distribution for the [exponential distribution](https://en.wikipedia.org/wiki/Exponential_distribution) with mean $\frac{1}{\lambda}$ and density $f(t) = \lambda e^{-\lambda t}$. So therefore, a poisson point process with rate $\lambda$ can also be modeled as events with random interarrival times according to an exponential distribution with an average time of $\frac{1}{\lambda}$.
 
The poisson process inherits a useful "memoryless" property from exponentially distributed arrival times which says that the probability of waiting X more minutes for a new event is independent of the past. This property shows up in the real world commonly in customer arrival settings (customers visiting a website, customers arriving at a store, etc), scoring goals in a soccer game, or the time it takes until your next car accident.
 
#### Homogeneous vs Nonhomogeneous
 
Often though, the real world is more complex than these simplifying assumptions. Usually, we don't deal with rates or intensities that are truly constant as in the traditional _homogeneous_ poisson process.
 
{% include image.html
           img="/assets/img/mlb-injury-point-process/homogeneous.png"
           width = "80%"
           height = "80%"
           alt="Graph of three sparse events occuring in a constant pattern with a flat constant intensity."
           caption="Homogeneous poisson process has an intensity $\lambda(t)$ which is always constant (Rodriguez & Valera, 2018)." %}
 
Intensity is often a continuous function and fluctuates with time as modeled by an _inhomogeneous_ poisson process. For example, customers' rate of arriving at a store probably depends on the time of day as well as the day of the week.
 
{% include image.html
           img="/assets/img/mlb-injury-point-process/inhomogeneous.png"
           width = "80%"
           height = "80%"
           alt="Graph of clustered events occuring simultaneously with two humps in intensity."
           caption="Inhomogeneous poisson process has an intensity $\lambda(t)$ which varies over time (Rodriguez & Valera, 2018)." %}
 
#### Self-Exciting Temporal Point Process
 
We can generalize the concept of TPPs even further. While inhomogeneous poisson processes can vary their intensity over time, the number of events that occur in non-overlapping time intervals are still independent of each other. In other words, no matter how many events occur from $t_1$ to $t_2$, it shouldn't change our expectation of the number of events from $t_2$ to $t_3$.
 
A Hawkes Process breaks these properties by using an intensity that is *determined* by previous events, or its history $\mathcal{H}_t$. There are many different ways we can link past events to the likelihood of future events, but the HP is specifically self-exciting which implies that the closer we are to past events the more likely we are to see a new event occur. In math terms it looks like
 
$$\begin{align}
\lambda(t | \mathcal{H}_t) & = \mu + \alpha \sum_{t_i<t} \phi(t-t_i) \\
& =  \mu + \alpha \sum_{t_i<t} e^{-\delta(t-t_i)}
\end{align}$$
 
where $\mu$ is some baseline or average rate of events, $\alpha$ is the degree to which a past event excites a new event, and $\phi$ is a kernel that basically tells us how much past events' influence changes over time. An exponential kernel is commonly used in HP modeling, and assumes that past events' influence decays exponentially over time.
 
{% include image.html
           img="/assets/img/mlb-injury-point-process/self-exciting-example.png"
           width = "80%"
           height = "80%"
           alt="Closely clustered events with decaying intensity in-between each event."
           caption="Self exciting point process where the intensity of events depends on the process history. (Rodriguez & Valera, 2018)." %}
 
This type of process and its assumptions can lead to clustering of events as they feed off of each other's excitement and the intensity at time $t$ rises. We can sometimes see this behavior where injuries compound and cluster together. Buxton and Kershaw's injury timelines, for example, have similar short periods of successive injuries.
 
{% include image.html
           img="/assets/img/mlb-injury-point-process/byron-buxton-injury-events.png"
           width = "80%"
           height = "80%"
           alt = "Clustered events shown with lollipop like graphs. " %}
 
{% include image.html
           img="/assets/img/mlb-injury-point-process/clayton-kershaw-injury-events.png"
           width = "80%"
           height = "80%" 
           alt = "Clustered events shown with lollipop like graphs. "%}
 
#### Modeling Multiple Event Types
 
Now we just need a few things in order to extend these models to injury prediction. First, we need a multidimensional framework for multiple event types. An overall intensity can be split into $K$ different intensities for each event type.
 
$$\begin{align}
\lambda(t | \mathcal{H}_t) & = \sum_k \lambda_k(t | \mathcal{H}_t)
\end{align}$$
 
For any event type $k$, the intensity $\lambda_k(t)$ can be influenced by itself any other event $j$ through $\alpha_{j,k}$ and can decay at a different rate $\delta_{j,k}$.
 
$$\begin{align}
\lambda_k(t | \mathcal{H}_t) = \mu_k + \sum_{j =1}^K\sum_{t_i<t} \alpha_{j,k} e^{-\delta_{j,k}(t-t_i)}
\end{align}$$
 
Finally, we need a way to learn the parameters of our model. After a lengthy derivation[^3], which I will skip, we can utilize the log-likelihood over a time interval $[0, T]$:
 
$$ \mathcal{L} = \sum_{i:t_i < T} \lambda_{k_i}(t_i) - \int_0^T \lambda(t) dt $$
 
In the first term, for each event occurrence $i$, we try to maximize the intensity for that event type $k_i$ at the time it occurred $t_i$. At the same time, in the second term, we minimize $\lambda(t)$ across the whole interval at all other points in time where no events occur. Though we can work out the full likelihood function, I just use gradient descent to optimize this function. To estimate the second term, we can sample points in the interval $[0, T]$ and minimize the sum $\sum_s \lambda(t_s) \; \forall s \in samples$ .
 
For each injury, we only need the type $k$ and time $t$ to get started. This ends the math portion, onto the data!
 
[^3]: Log-likelihood derivation in [Appendix B](https://arxiv.org/pdf/1612.09328.pdf)
 
 
<a name="data"></a>
### Injury Data
 
In order to leverage a TPP to make inferences on injury risk, I needed to source IL, day-to-day (DTD), and player game data. Luckily, MLB stats api provides IL stint data and [Pro Sports Transactions](https://www.prosportstransactions.com/baseball/Search/Search.php) logs MLB DTD data ( I initially got the idea to work with injury data from Derek Rhoads' injury [dashboards](https://jagfantasysports.com/portfolio/injury_dashboards/) and would like to thank him for pointing me to Pro Sports!
). Finally, I compiled the dates of player games from my statcast database scraped from [Baseball Savant](https://baseballsavant.mlb.com/statcast_search).
 
Cleaning all of the injury data was enough for a project in itself. I only concentrated on injuries during players' time in the majors, so while we might not have a complete picture of player injury history, these resources together are sufficient given we make some simplifying assumptions:
 
1. I use only injuries that occur during major league playing time
2. The time between injuries is measured in _active playing time_ - I assume that any time recovering or playing in the minors is not time that could result in "major league injuries". The time span from an IL date to the next MLB game played I call an _injury span_ and are excluded from the time between injuries.
3. I exclude all injuries that are unlikely to be baseball related (e.g, sickness, infections, covid, etc. )
 
Additionally, I created categories for each injury by location, type, and IL/DTD. Each categorization is subjective, but I tried to keep them as specific as possible without having lopsided distributions. On occasion, players will have multiple injuries during an injury span, in which case I take the injury with the longer IL stint [^2].
 
For more details on how the data is scraped or processed, you can check out the code on [github](https://github.com/ssharpe42/mlb-injury).
 
[^2]: If there are any miscellaneous injuries, I take one of the non-misc injuries in the span. If there are ties in IL time, I break ties with a priority order of injuries.
 
### Interpreting the Parameters
 
We can train models with any kind of event encoding. For example, we could use any combination of the location, type, severity, or length of the injury to come up with categories to predict. The more categories we use, the more sparse the data. For simplicity, I trained models using the location of the injury and optionally if it resulted in an IL stint or just day-to-day (DTD) status.
 
First, by inspecting the excitement (alpha) matrices of the location only model, we can see a really clear self-excitement trend. Previous injuries tend to drastically increase the intensity of injuries in the same location.
 
<a name="location-excitement"></a>
<img src="/assets/img/mlb-injury-point-process/all_players-excitement-both.png" width="100%" and height="100%" alt="Heat map with more dark red along the diagonal where body parts match." class="center">
 
If we break down the model into separate events for IL and DTD injuries, we see that DTD injuries tend to drive a lot of the self-excitement.
 
<a name="location-excitement-dtd"></a>
<img src="/assets/img/mlb-injury-point-process/all_players-excitement-dtd.png" width="100%" and height="100%" alt="Heat map with more dark red along the diagonal where body parts match." class="center">
 
IL stint self-excitement is a bit more muted relative to other alphas. Generally, this makes sense since IL stints can range from 10 days to a whole season for a surgery meaning there can be a large variance in the amount of recovery and therefore future injury risk. DTD injuries are probably more correlated with nagging problems that might end in an IL stint where layers might be day to day with that same injury multiple times.
 
We can see some large excitement off the diagonal that adhere to intuition such as hip, head/neck injuries preceding torso issues or elbow and wrist injuries preceding other arm injuries. Though there are a handful of others that may be more confusing and likely coincidental, like wrist injuries preceding other leg injuries.
 
<a name="location-excitement-il"></a>
<img src="/assets/img/mlb-injury-point-process/all_players-excitement-il.png" width="100%" and height="100%" alt="Heat map with red along the diagonal but also some scattered sparse excitement off the diagonal." class="center">
 
We can dig even deeper by building separate models for batters and pitchers. These breakdowns can illustrate differences in batter and pitcher injury excitement. For example, hip and head/neck injuries have a larger effect on future torso and shoulder injuries for pitchers while higher alphas on the diagonal suggest batters tend to aggravate their ankles, backs, legs, and wrists more often.
 
<a name="location-excitement-batter-vs-pitcher"></a>
<img src="/assets/img/mlb-injury-point-process/batter-vs-pitcher.png" width="100%" and height="100%" class="center">
 
We can also leverage information from the decay kernel for more insights on how injuries raise future injury risk. In the plot below we can see how pitchers' injuries lead to varying future elbow injury risk.
 
<a name="kernel"></a>
<img src="/assets/img/mlb-injury-point-process/pitcher-elbow-kernel.png" width="100%" and height="100%" alt="Varied decay and height of lines signifying very different effects of injuries on future elboy injury risk." class="center">
 
The blue line illustrates the high self-excitement of DTD injuries, initially having a very high risk, but decaying quickly. DTD elbow and IL elbow injuries have the longest persistent effect on future elbow related IL risk (red and green line respectively). Other arm injuries have little effect and risk of elbow IL stints immediately revert to the long term average after a foot injury.
 
### Performance
 
TPPs are interpretable and good estimators of risk over time, given the data adhere to our assumptions. We can predict outcomes in many ways using TPPs:
1. Given the time of the next injury, what injury do we expect?
2. Over a time range, what is the most likely injury?
3. What is the expected time of the next injury?
 
To generate predictions, I use a two step process: I first estimate the time of the next injury, and given that time I predict the injury location.
 
The injury distribution is fairly balanced. The model should be able to surpass a 10% accuracy naive baseline predicting hamstring injuries every time.
 
<a name="injury-dist"></a>
<img src="/assets/img/mlb-injury-point-process/injury-dist.png" width="80%" and height="80%" class="center" alt="Slowly decreasing bar graph.">
 
The TPP model predicts the injury correctly 18.5% of the time out of the 15 different categories. The correct injury also falls in the top 2 and top 3 predictions 30% and 37% of the time respectively. The TPP IL/DTD model (broken down into IL/DTD) recalls the actual injury 14% of time with double the possible categories.
 
I am able to reduce the large uncertainty in the timing of injuries as well from 162 day RMSE using a naive _average time between injuries_ to 144 days using a TPP.
 
<div style="text-align: center;">
 <span style="font-size: 18.6667px;"><strong>TPP Model Performance</strong></span>
</div>
 
<div class="center_markdown_table"></div>
 
|Metric| TPP | TPP IL/DTD |
|:-:|:-:|:-:|
|# of Categories|15|30|
|Top Category Prevalence|10%|7%|
|Model Top 1 Acc|18.5%|13.8%|
|Model Top 2 Acc|30.2%|21.1%|
|Model Top 3 Acc|36.8%|27.9%|
|Time RMSE (days)|144.3|144.1|
 
### Mike Trout
 
To get a sense of how we can illustrate individual players with TPPs, I looked at the last few years of Mike Trout's injury history. First, we can view Trout through the lens of overall IL risk during his in-season non-injured days, where each labeled point is one of his injuries. The intensity is modeled in terms of an instantaneous daily rate, so when scaled by 180 days, approximates the season-long IL rate.
 
 
<!-- <a name="trout-total-intensity"></a> -->
<img src="/assets/img/mlb-injury-point-process/trout-total-intensity.png" width="100%" and height="100%" class="center">
 
We can also view DTD and IL risk side by side.
 
 
<!-- <a name="trout-split-intensity"></a> -->
<img src="/assets/img/mlb-injury-point-process/trout-split-intensity.png" width="100%" and height="100%" class="center">
 
Finally, the most interesting way to view injury risk: broken down by location. We can really see how different injuries cause changes in the intensities of other body parts. For example, Trout's calf injury in mid-2019 (approx day 1300) elevated his risk of foot injuries, possibly foreshadowing his foot issues later in the year. 
 
 
<a name="trout-sample-intensity"></a>
<img src="/assets/img/mlb-injury-point-process/trout-sample-intensity.png" width="100%" and height="100%" class="center">
 
TPPs are useful tools for learnable processes that evolve over time. Though I have a tendency to overuse baseball data (sorry not sorry), TPPs are more popular in [social media](https://arxiv.org/pdf/1708.06401.pdf), [e-commerce](https://dl.acm.org/doi/10.1145/3097983.3098104), and [recommendation](https://openreview.net/pdf?id=HyePrhR5KX) applications. TPPs continue to evolve and progress, most recently being parameterized with neural networks ([LSTM](https://arxiv.org/pdf/1612.09328.pdf), [Transformer](https://arxiv.org/pdf/2002.09291.pdf)) making them much more powerful and flexible.
 
For more details, check out the code on [github](https://github.com/ssharpe42/mlb-injury).
 
_Data Sources: [Baseball Savant](https://baseballsavant.com), [Pro Sports](https://www.prosportstransactions.com/), MLB Stats API_

_Photo Credit: Mark Brown / Getty_

### References & Resources
 
1. Rodriguez, Manuel and Valera, Isabel. 2018. Learning with Point Processes (ICML 2018 Tutorial): Part [1](https://learning.mpi-sws.org/tpp-icml18/seminar-icml18-part1.pdf),[2](https://learning.mpi-sws.org/tpp-icml18/seminar-icml18-part2.pdf),[3](https://learning.mpi-sws.org/tpp-icml18/seminar-icml18-part3.pdf)
 
2. Rizoiu et al. 2017. A tutorial on Hawkes Processes for events in social media. [https://arxiv.org/abs/1708.06401](https://arxiv.org/abs/1708.06401). 
 
3. Mei, Hongyuan and Eisner, Jason. 2017. The Neural Hawkes Process: A Neurally Self-Modulating Multivariate Point Process. [https://arxiv.org/abs/1612.09328](https://arxiv.org/abs/1612.09328).
 
### Footnotes

<!-- 
<style>
.big-img {opacity: 0.5;}
</style> -->
 
 
<!--
Batter
       test_acc            0.19221697747707367
       test_aupr           0.13215841352939606
      test_auroc           0.5704880356788635
     test_dt_rmse          125.29363250732422
       test_loss            7.241858959197998
hamstring    0.137572
hand         0.116763
knee         0.104046
other leg    0.084393
back         0.084393
torso        0.069364
head/neck    0.064740
wrist        0.063584
foot         0.056647
hip          0.056647
misc/unk     0.043931
ankle        0.035838
shoulder     0.033526
elbow        0.026590
other arm    0.021965
Pitcher
       test_acc            0.21399177610874176
       test_aupr           0.15861138701438904
      test_auroc           0.5722944140434265
     test_dt_rmse          212.02487182617188
       test_loss            6.994347095489502
shoulder     0.206897
back         0.126437
misc/unk     0.114943
torso        0.091954
elbow        0.088123
other arm    0.084291
hand         0.061303
knee         0.053640
head/neck    0.045977
hip          0.038314
hamstring    0.030651
other leg    0.030651
foot         0.015326
ankle        0.007663
wrist        0.003831
All
       test_acc            0.1847619116306305 , 30, 37 (topn)
       test_aupr           0.13821901381015778 
      test_auroc           0.6171672344207764
     test_dt_rmse           144.2529754638672 vs 162.33876864893244
       test_loss            7.23721170425415
hamstring    0.114679
back         0.097248
hand         0.082569
knee         0.077982
misc/unk     0.076147
torso        0.072477
shoulder     0.070642
head/neck    0.062385
hip          0.057798
other leg    0.056881
other arm    0.053211
elbow        0.051376
wrist        0.050459
ankle        0.041284
foot         0.034862
 
Batter dtd
       test_acc            0.11556603759527206
       test_aupr           0.0781465470790863
      test_auroc           0.5871615409851074
     test_dt_rmse          121.65385437011719
       test_loss            7.799535751342773
 
 
Pitcher dtd
       test_acc            0.16872428357601166
       test_aupr           0.1302168220281601
      test_auroc           0.5433017611503601
     test_dt_rmse          209.01043701171875
       test_loss            7.31665563583374 
 
 
All dtd
        test_acc            0.13809524476528168 ,21, 28
       test_aupr           0.0876760184764862
      test_auroc           0.6281289458274841
     test_dt_rmse          144.14874267578125
       test_loss            7.748696804046631    
 
hamstring          0.073394
misc/unk           0.061468
back (dtd)         0.060550
shoulder           0.059633
torso              0.055963
elbow              0.048624
knee               0.044954
hand               0.043119
hamstring (dtd)    0.041284
other arm          0.040367
hand (dtd)         0.039450
back               0.036697
head/neck (dtd)    0.034862
knee (dtd)         0.033028
hip                0.032110
other leg (dtd)    0.031193
wrist (dtd)        0.028440
head/neck          0.027523
other leg          0.025688
hip (dtd)          0.025688
foot (dtd)         0.024771
wrist              0.022018
ankle (dtd)        0.021101
ankle              0.020183
torso (dtd)        0.016514
misc/unk (dtd)     0.014679
other arm (dtd)    0.012844
shoulder (dtd)     0.011009
foot               0.010092
elbow (dtd)        0.002752 -->
 

