# CPET Lab · Cardiopulmonary Exercise Testing Simulator

**An interactive, browser-based simulator and course for reading cardiopulmonary exercise tests from first principles.**
No installation. Works in any browser, on any device, offline. Also installs as an app.

![License: MIT](https://img.shields.io/badge/License-MIT-a8465c) ![Educational Only](https://img.shields.io/badge/Use-Educational%20only-5f5449) ![Patients](https://img.shields.io/badge/Patients-13-2f7a5c) ![FOAMed](https://img.shields.io/badge/FOAMed-Free%20for%20all-a9761b) ![Works offline](https://img.shields.io/badge/Works-Offline-41608f)

---

### ▶ [Launch CPET Lab](https://torsades-de-pointes.github.io/cpet-lab/)

---

**Install it as an app**

_iPhone (use Safari, not Chrome, for installation to work):_
- Open https://torsades-de-pointes.github.io/cpet-lab/ in Safari
- Tap the Share icon (square with arrow) → Add to Home Screen → Add
- The home-screen icon is an ivory tile with a nine-panel grid, labelled "CPET Lab"
- Open it from the home screen: it runs full screen with no address bar
- To check offline use: turn on Airplane Mode, close the app fully, reopen it

_Android (Chrome):_
- Open https://torsades-de-pointes.github.io/cpet-lab/ in Chrome
- Accept the "Install app" prompt, or tap ⋮ → Install app (or Add to Home screen)
- Open it from the home screen and repeat the Airplane Mode check

---

## Two builds

| File | For | Notes |
|---|---|---|
| `index.html` | Desktop and tablet | Nine panels side by side, Champagne (day) and Monitor (night) themes |
| `mobile.html` | Phones | One large panel at a time with swipe, bottom tab bar, Day and Night themes |

Phones opening the main link are sent to `mobile.html` automatically. Each build links to the other ("Phone version" / "Desktop version"), and the choice is remembered.

## What is inside

| Tab | What it gives you |
|---|---|
| **Simulator** | 13 patients (normal, deconditioning, poor effort, obesity, HFrEF, HFpEF, ischaemia, chronotropic incompetence, Fontan, PAH, COPD, ILD, mitochondrial myopathy). Ten physiology controls. A dotted trace of a healthy person of the same age and size. An unknown-patient mode. A written reading to compare with your own |
| **Learn** | Nine chapters. Each one asks a question before it explains, sends you to the simulator to predict a change, checks you, and ends by asking you to explain the idea in plain words and compare with a model answer |
| **Cases** | Eight cases with step-by-step questions. Each answer stays hidden until you write yours |
| **Review** | 40 cards with spaced repetition (1, 3, 7, 14, 30, 90 and 180 days) |
| **Reference** | Key thresholds with sources, the full reference list with PubMed, publisher and free full-text links, and the model's assumptions and limits |

Everything runs in the browser. There is no build step, no backend, no account and no analytics. Notes and progress are stored only in the browser that made them.

## Files

```
index.html      desktop build
mobile.html     phone build
core.js         shared physiology model, plotting, chapters, cases, cards, references
manifest.json   app name, icons, colours
sw.js           offline cache
          192, 512, maskable 512 and Apple 180 px icons
```

## Updating

Edit the files, then open `sw.js` and bump `CACHE` (for example `cpetlab-v1` to `cpetlab-v2`) before you push. Installed copies pick up the new version the next time they open online.

## The model

Each test is 2 minutes of rest, 2 minutes of unloaded pedalling, a 10 minute individualised ramp and 3 minutes of recovery, sampled every 10 seconds with breath-by-breath noise. VO₂ rises with work at a set ΔVO₂/ΔWR with optional late flattening; VCO₂ steepens at VT1 by bicarbonate buffering; VE follows VCO₂ through the VE/VCO₂ slope with extra ventilation after the respiratory compensation point; PETO₂ comes from the simplified alveolar gas equation. The model reproduces patterns, not the exact values of any patient. It does not model blood pressure, ECG, flow-volume loops, lactate or invasive haemodynamics.

## How to Cite

```
Parcha V. CPET Lab: cardiopulmonary exercise testing simulator and course. Version 1.0. Published 2026.
Accessed [date]. https://torsades-de-pointes.github.io/cpet-lab/
```

BibTeX:

```bibtex
@software{cpetlab2026,
  title   = {CPET Lab: Cardiopulmonary Exercise Testing Simulator and Course},
  author  = {Parcha, Vibhu},
  year    = {2026},
  version = {1.0},
  url     = {https://torsades-de-pointes.github.io/cpet-lab/},
  note    = {Open-source educational simulator of the nine-panel CPET plot. MIT License.}
}
```

The **Reference → How to cite** page in the app gives AMA, APA and BibTeX with today's access date and a copy button. When you quote a threshold, please also cite its primary source below.

---

## References

All entries were checked against PubMed.

1. Balady GJ, Arena R, Sietsema K, et al. Clinician's guide to cardiopulmonary exercise testing in adults: a scientific statement from the American Heart Association. *Circulation*. 2010;122(2):191-225. [PubMed](https://pubmed.ncbi.nlm.nih.gov/20585013/) · [Publisher](https://doi.org/10.1161/CIR.0b013e3181e52e69)
2. Guazzi M, Adams V, Conraads V, et al. EACPR/AHA scientific statement. Clinical recommendations for cardiopulmonary exercise testing data assessment in specific patient populations. *Circulation*. 2012;126(18):2261-74. [PubMed](https://pubmed.ncbi.nlm.nih.gov/22952317/) · [Publisher](https://doi.org/10.1161/CIR.0b013e31826fb946) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC4777325/)
3. Guazzi M, Arena R, Halle M, et al. 2016 focused update: clinical recommendations for cardiopulmonary exercise testing data assessment in specific patient populations. *Circulation*. 2016;133(24):e694-711. [PubMed](https://pubmed.ncbi.nlm.nih.gov/27143685/) · [Publisher](https://doi.org/10.1161/CIR.0000000000000406)
4. American Thoracic Society; American College of Chest Physicians. ATS/ACCP statement on cardiopulmonary exercise testing. *Am J Respir Crit Care Med*. 2003;167(2):211-77. [PubMed](https://pubmed.ncbi.nlm.nih.gov/12524257/) · [Publisher](https://doi.org/10.1164/rccm.167.2.211)
5. Mehra MR, Canter CE, Hannan MM, et al. The 2016 International Society for Heart Lung Transplantation listing criteria for heart transplantation: a 10-year update. *J Heart Lung Transplant*. 2016;35(1):1-23. [PubMed](https://pubmed.ncbi.nlm.nih.gov/26776864/) · [Publisher](https://doi.org/10.1016/j.healun.2015.10.023)
6. Peled Y, Ducharme A, Kittleson M, et al. International Society for Heart and Lung Transplantation guidelines for the evaluation and care of cardiac transplant candidates, 2024. *J Heart Lung Transplant*. 2024;43(10):1529-1628.e54. [PubMed](https://pubmed.ncbi.nlm.nih.gov/39115488/) · [Publisher](https://doi.org/10.1016/j.healun.2024.05.010)
7. Mancini DM, Eisen H, Kussmaul W, et al. Value of peak exercise oxygen consumption for optimal timing of cardiac transplantation in ambulatory patients with heart failure. *Circulation*. 1991;83(3):778-86. [PubMed](https://pubmed.ncbi.nlm.nih.gov/1999029/) · [Publisher](https://doi.org/10.1161/01.cir.83.3.778)
8. Weber KT, Kinasewitz GT, Janicki JS, Fishman AP. Oxygen utilization and ventilation during exercise in patients with chronic cardiac failure. *Circulation*. 1982;65(6):1213-23. [PubMed](https://pubmed.ncbi.nlm.nih.gov/6804111/) · [Publisher](https://doi.org/10.1161/01.cir.65.6.1213)
9. Arena R, Myers J, Abella J, et al. Development of a ventilatory classification system in patients with heart failure. *Circulation*. 2007;115(18):2410-7. [PubMed](https://pubmed.ncbi.nlm.nih.gov/17452607/) · [Publisher](https://doi.org/10.1161/CIRCULATIONAHA.107.686576)
10. Chua TP, Ponikowski P, Harrington D, et al. Clinical correlates and prognostic significance of the ventilatory response to exercise in chronic heart failure. *J Am Coll Cardiol*. 1997;29(7):1585-90. [PubMed](https://pubmed.ncbi.nlm.nih.gov/9180123/) · [Publisher](https://doi.org/10.1016/s0735-1097(97)00078-8)
11. Corrà U, Giordano A, Bosimini E, et al. Oscillatory ventilation during exercise in patients with chronic heart failure: clinical correlates and prognostic implications. *Chest*. 2002;121(5):1572-80. [PubMed](https://pubmed.ncbi.nlm.nih.gov/12006446/) · [Publisher](https://doi.org/10.1378/chest.121.5.1572)
12. Baba R, Nagashima M, Goto M, et al. Oxygen uptake efficiency slope: a new index of cardiorespiratory functional reserve derived from the relation between oxygen uptake and minute ventilation during incremental exercise. *J Am Coll Cardiol*. 1996;28(6):1567-72. [PubMed](https://pubmed.ncbi.nlm.nih.gov/8917273/) · [Publisher](https://doi.org/10.1016/s0735-1097(96)00412-3)
13. Beaver WL, Wasserman K, Whipp BJ. A new method for detecting anaerobic threshold by gas exchange. *J Appl Physiol*. 1986;60(6):2020-7. [PubMed](https://pubmed.ncbi.nlm.nih.gov/3087938/) · [Publisher](https://doi.org/10.1152/jappl.1986.60.6.2020)
14. Chambers DJ, Wisely NA. Cardiopulmonary exercise testing: a beginner's guide to the nine-panel plot. *BJA Educ*. 2019;19(5):158-64. [PubMed](https://pubmed.ncbi.nlm.nih.gov/33456885/) · [Publisher](https://doi.org/10.1016/j.bjae.2019.01.009) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC7807922/)
15. Neder JA, Phillips DB, Marillier M, et al. Clinical interpretation of cardiopulmonary exercise testing: current pitfalls and limitations. *Front Physiol*. 2021;12:552000. [PubMed](https://pubmed.ncbi.nlm.nih.gov/33815128/) · [Publisher](https://doi.org/10.3389/fphys.2021.552000) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC8012894/)
16. Guazzi M, Borlaug B, Metra M, et al. Revisiting and implementing the Weber and ventilatory functional classifications in heart failure by cardiopulmonary imaging phenotyping. *J Am Heart Assoc*. 2021;10(5):e018822. [PubMed](https://pubmed.ncbi.nlm.nih.gov/33615821/) · [Publisher](https://doi.org/10.1161/JAHA.120.018822) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC8174289/)
17. Guazzi M, Wilhelm M, Halle M, et al. Exercise testing in heart failure with preserved ejection fraction: an appraisal through diagnosis, pathophysiology and therapy. A clinical consensus statement of the HFA and EAPC of the ESC. *Eur J Heart Fail*. 2022;24(8):1327-45. [PubMed](https://pubmed.ncbi.nlm.nih.gov/35775383/) · [Publisher](https://doi.org/10.1002/ejhf.2601) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC9542249/)
18. Borlaug BA, Nishimura RA, Sorajja P, Lam CSP, Redfield MM. Exercise hemodynamics enhance diagnosis of early heart failure with preserved ejection fraction. *Circ Heart Fail*. 2010;3(5):588-95. [PubMed](https://pubmed.ncbi.nlm.nih.gov/20543134/) · [Publisher](https://doi.org/10.1161/CIRCHEARTFAILURE.109.930701) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC3048586/)
19. Oldham WM, Lewis GD, Opotowsky AR, et al. Unexplained exertional dyspnea caused by low ventricular filling pressures: results from clinical invasive cardiopulmonary exercise testing. *Pulm Circ*. 2016;6(1):55-62. [PubMed](https://pubmed.ncbi.nlm.nih.gov/27162614/) · [Publisher](https://doi.org/10.1086/685054) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC4860548/)
20. Wattanachayakul P, Kittipibul V, Salah HM, et al. Invasive haemodynamic assessment in heart failure with preserved ejection fraction. *ESC Heart Fail*. 2025;12(3):1558-70. [PubMed](https://pubmed.ncbi.nlm.nih.gov/39520094/) · [Publisher](https://doi.org/10.1002/ehf2.15163) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC12055371/)
21. Humbert M, Kovacs G, Hoeper MM, et al. 2022 ESC/ERS guidelines for the diagnosis and treatment of pulmonary hypertension. *Eur Heart J*. 2022;43(38):3618-731. [PubMed](https://pubmed.ncbi.nlm.nih.gov/36017548/) · [Publisher](https://doi.org/10.1093/eurheartj/ehac237)
22. Older P, Smith R, Courtney P, Hone R. Preoperative evaluation of cardiac failure and ischemia in elderly patients by cardiopulmonary exercise testing. *Chest*. 1993;104(3):701-4. [PubMed](https://pubmed.ncbi.nlm.nih.gov/8365279/) · [Publisher](https://doi.org/10.1378/chest.104.3.701)
23. Garcia Brás P, Gonçalves AV, Reis JF, et al. Cardiopulmonary exercise testing in the age of new heart failure therapies: still a powerful tool? *Biomedicines*. 2023;11(8):2208. [PubMed](https://pubmed.ncbi.nlm.nih.gov/37626705/) · [Publisher](https://doi.org/10.3390/biomedicines11082208) · [Free full text](https://pmc.ncbi.nlm.nih.gov/articles/PMC10452308/)
24. Wasserman K, Hansen JE, Sue DY, et al. *Principles of Exercise Testing and Interpretation*. 5th ed. Philadelphia: Lippincott Williams & Wilkins; 2012.

## Licence

Code: MIT. See [LICENSE](LICENSE). Teaching content: CC BY 4.0. Attribution is appreciated.

> **Not a clinical tool.** CPET Lab is for education only and must never be used for patient care or clinical decision-making.
